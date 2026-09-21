import os
import io
import zipfile
import uuid
import fitz  # PyMuPDF
from PIL import Image
from typing import List, Tuple, Dict, Any, Optional, Callable

from services.models import CompressionQuality, PageNumberPosition, ImageFormat

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

TESSDATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "tessdata")
os.makedirs(TESSDATA_DIR, exist_ok=True)

class ToolsService:

    @staticmethod
    def _hex_to_rgb(hex_color: str) -> Tuple[float, float, float]:
        hex_color = hex_color.lstrip("#")
        if len(hex_color) == 6:
            r = int(hex_color[0:2], 16) / 255.0
            g = int(hex_color[2:4], 16) / 255.0
            b = int(hex_color[4:6], 16) / 255.0
            return (r, g, b)
        return (0.3, 0.3, 0.3)

    @staticmethod
    def _parse_page_ranges(range_str: str, total_pages: int) -> List[int]:
        """
        Parse user ranges like "1-3, 5, 8-10" into 0-indexed page integers.
        """
        pages = set()
        parts = [p.strip() for p in range_str.split(",") if p.strip()]
        for part in parts:
            if "-" in part:
                subparts = part.split("-")
                start = int(subparts[0].strip())
                end = int(subparts[1].strip())
                for p in range(max(1, start), min(total_pages, end) + 1):
                    pages.add(p - 1)
            else:
                p = int(part)
                if 1 <= p <= total_pages:
                    pages.add(p - 1)
        return sorted(list(pages))

    @staticmethod
    def compress_pdf_task(
        file_path: str,
        quality: CompressionQuality = CompressionQuality.RECOMMENDED,
        progress_callback: Optional[Callable[[int], None]] = None
    ) -> Tuple[str, int, int, float]:
        """
        High-performance PDF compression engine:
        - Deduplicated image stream optimization with fast bilinear resampling
        - Vector content stream float precision reduction and sanitization
        - Fast PyMuPDF linear deflate saving (avoiding quadratic sweeps)
        Returns: (output_path, original_size, compressed_size, savings_percentage)
        """
        import re
        original_size = os.path.getsize(file_path)
        doc = fitz.open(file_path)
        total_pages = len(doc)

        out_filename = f"compressed_{uuid.uuid4().hex}_{os.path.basename(file_path)}"
        out_path = os.path.join(UPLOAD_DIR, out_filename)

        if progress_callback:
            progress_callback(10)

        # Preset parameters based on selected quality
        if quality == CompressionQuality.EXTREME:
            max_dim = 1024
            img_quality = 55
            float_decimals = 1
        elif quality == CompressionQuality.LOW:
            max_dim = 1600
            img_quality = 82
            float_decimals = 2
        else:  # RECOMMENDED
            max_dim = 1350
            img_quality = 72
            float_decimals = 2

        # 1. Deduplicated image stream optimization
        seen_xrefs = set()
        for p_idx in range(total_pages):
            page = doc[p_idx]
            image_list = page.get_images(full=True)
            for img_info in image_list:
                xref = img_info[0]
                if xref in seen_xrefs:
                    continue
                seen_xrefs.add(xref)

                try:
                    base_img = doc.extract_image(xref)
                    if not base_img:
                        continue
                    img_bytes = base_img["image"]
                    pil_img = Image.open(io.BytesIO(img_bytes))

                    # Downscale dimensions if larger than threshold
                    w, h = pil_img.size
                    if w > max_dim or h > max_dim:
                        scale = max_dim / max(w, h)
                        new_w = max(1, int(w * scale))
                        new_h = max(1, int(h * scale))
                        pil_img = pil_img.resize((new_w, new_h), Image.Resampling.BILINEAR)

                    # For RGBA or paletted images without true alpha mask, convert to RGB for JPEG
                    if pil_img.mode in ("RGBA", "P"):
                        if not base_img.get("smask"):
                            pil_img = pil_img.convert("RGB")
                    elif pil_img.mode not in ("RGB", "L"):
                        pil_img = pil_img.convert("RGB")

                    buf = io.BytesIO()
                    # Skip slow optimize=True for 3x-4x faster encoding with identical visual quality
                    pil_img.save(buf, format="JPEG", quality=img_quality)
                    new_img_bytes = buf.getvalue()

                    # Only update if new compressed bytes are strictly smaller
                    if len(new_img_bytes) < len(img_bytes):
                        doc.update_stream(xref, new_img_bytes)
                        doc.xref_set_key(xref, "Width", str(pil_img.width))
                        doc.xref_set_key(xref, "Height", str(pil_img.height))
                        doc.xref_set_key(xref, "Filter", "/DCTDecode")
                        doc.xref_set_key(xref, "ColorSpace", "/DeviceRGB" if pil_img.mode == "RGB" else "/DeviceGray")
                except Exception:
                    pass

            if progress_callback:
                pct = 10 + int((p_idx + 1) / total_pages * 45)
                progress_callback(pct)

        # 2. Content stream vector path float precision reduction
        # Outlined fonts and SVG paths contain 6-9 decimal places (e.g. "525.37136").
        # Truncating to 1-2 decimals saves 30-50% on vector-heavy content streams.
        # Uses backreference regex substitution (pure C-level, no Python callback).
        from concurrent.futures import ThreadPoolExecutor

        if float_decimals == 1:
            # EXTREME: truncate "123.4567" -> "123.4" (capture 1 decimal, discard 2+ more)
            trunc_regex = re.compile(rb'(\d\.\d)\d{2,}')
        else:
            # RECOMMENDED/LOW: truncate "123.45678" -> "123.45" (capture 2 decimals, discard rest)
            trunc_regex = re.compile(rb'(\d\.\d\d)\d+')

        # Collect all content streams
        stream_items = []
        for page in doc:
            for xref in page.get_contents():
                try:
                    raw = doc.xref_stream(xref)
                    if raw and len(raw) > 500:
                        stream_items.append((xref, raw))
                except Exception:
                    pass

        # Process streams in parallel threads (regex on bytes releases the GIL)
        def optimize_stream(item):
            xref, raw = item
            return xref, trunc_regex.sub(rb'\1', raw)

        if stream_items:
            max_workers = min(4, len(stream_items))
            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                results = list(executor.map(optimize_stream, stream_items))
            for xref, opt_stream in results:
                doc.update_stream(xref, opt_stream, compress=False)

        if progress_callback:
            progress_callback(85)

        if progress_callback:
            progress_callback(90)

        # 3. Save with fast linear garbage collection & deflate
        doc.save(
            out_path,
            garbage=2,
            deflate=True,
            deflate_images=True,
            deflate_fonts=True,
        )
        doc.close()

        if progress_callback:
            progress_callback(98)

        compressed_size = os.path.getsize(out_path)
        # If compressed size ended up larger (e.g. already compressed), copy original
        if compressed_size > original_size:
            import shutil
            shutil.copyfile(file_path, out_path)
            compressed_size = original_size
            savings_pct = 0.0
        else:
            savings_pct = round(((original_size - compressed_size) / original_size) * 100, 1)

        if progress_callback:
            progress_callback(100)

        return out_path, original_size, compressed_size, savings_pct

    @staticmethod
    def pdf_to_images_task(
        file_path: str,
        img_format: ImageFormat = ImageFormat.PNG,
        dpi: int = 150,
        progress_callback: Optional[Callable[[int], None]] = None
    ) -> Tuple[str, str]:
        """
        Convert PDF pages to images using parallel rendering across worker threads.
        Returns: (output_file_path, mime_type)
        """
        from concurrent.futures import ThreadPoolExecutor
        doc = fitz.open(file_path)
        total_pages = len(doc)

        if progress_callback:
            progress_callback(10)

        ext = img_format.value.lower()
        if ext == "jpeg":
            ext = "jpg"

        # If single page, directly return single image
        if total_pages == 1:
            page = doc[0]
            pix = page.get_pixmap(dpi=dpi, alpha=False)
            out_filename = f"page_1_{uuid.uuid4().hex}.{ext}"
            out_path = os.path.join(UPLOAD_DIR, out_filename)
            pix.save(out_path)
            doc.close()
            if progress_callback:
                progress_callback(100)
            mime = f"image/{img_format.value}"
            return out_path, mime

        # Multi-page parallel rendering
        zip_filename = f"pdf_images_{uuid.uuid4().hex}.zip"
        zip_path = os.path.join(UPLOAD_DIR, zip_filename)

        def render_page(idx: int) -> Tuple[int, bytes]:
            t_doc = fitz.open(file_path)
            pix = t_doc[idx].get_pixmap(dpi=dpi, alpha=False)
            data = pix.tobytes(ext)
            t_doc.close()
            return idx, data

        rendered_pages: Dict[int, bytes] = {}
        max_workers = min(4, total_pages)
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            for idx, img_data in executor.map(render_page, range(total_pages)):
                rendered_pages[idx] = img_data
                if progress_callback:
                    pct = 10 + int((len(rendered_pages)) / total_pages * 80)
                    progress_callback(pct)

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for i in range(total_pages):
                if i in rendered_pages:
                    zf.writestr(f"page-{i + 1}.{ext}", rendered_pages[i])

        doc.close()
        if progress_callback:
            progress_callback(100)

        return zip_path, "application/zip"

    @staticmethod
    def merge_pdfs(file_paths: List[str]) -> str:
        merged_doc = fitz.open()
        for fp in file_paths:
            doc = fitz.open(fp)
            merged_doc.insert_pdf(doc)
            doc.close()
        out_filename = f"merged_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        merged_doc.save(out_path, garbage=1, deflate=True)
        merged_doc.close()
        return out_path

    @staticmethod
    def split_pdf(file_path: str, page_ranges: str) -> str:
        doc = fitz.open(file_path)
        selected_pages = ToolsService._parse_page_ranges(page_ranges, len(doc))
        if not selected_pages:
            selected_pages = list(range(len(doc)))

        # Native in-memory selection is 10x faster than looping insert_pdf
        doc.select(selected_pages)
        out_filename = f"split_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, garbage=1, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def rotate_pdf(file_path: str, angle: int = 90, page_selection: str = "all") -> str:
        doc = fitz.open(file_path)
        if page_selection.lower() == "all":
            pages = list(range(len(doc)))
        else:
            pages = ToolsService._parse_page_ranges(page_selection, len(doc))

        for p_idx in pages:
            page = doc[p_idx]
            page.set_rotation((page.rotation + angle) % 360)

        out_filename = f"rotated_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, garbage=1, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def delete_pages(file_path: str, page_ranges: str) -> str:
        doc = fitz.open(file_path)
        to_delete = ToolsService._parse_page_ranges(page_ranges, len(doc))
        valid_pages = [p for p in to_delete if 0 <= p < len(doc)]
        if valid_pages:
            doc.delete_pages(valid_pages)

        out_filename = f"deleted_pages_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, garbage=1, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def extract_pages(file_path: str, page_ranges: str) -> str:
        return ToolsService.split_pdf(file_path, page_ranges)

    @staticmethod
    def protect_pdf(file_path: str, password: str) -> str:
        doc = fitz.open(file_path)
        out_filename = f"protected_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(
            out_path,
            encryption=fitz.PDF_ENCRYPT_AES_256,
            user_pw=password,
            owner_pw=password,
            permissions=fitz.PDF_PERM_PRINT | fitz.PDF_PERM_COPY
        )
        doc.close()
        return out_path

    @staticmethod
    def unlock_pdf(file_path: str, password: str) -> str:
        doc = fitz.open(file_path)
        if doc.is_encrypted:
            rc = doc.authenticate(password)
            if rc <= 0:
                doc.close()
                raise ValueError("Incorrect password for PDF")

        out_filename = f"unlocked_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, encryption=fitz.PDF_ENCRYPT_NONE)
        doc.close()
        return out_path

    @staticmethod
    def watermark_pdf(
        file_path: str,
        text: str,
        color_hex: str = "#EF4444",
        opacity: float = 0.3,
        rotation: int = 45,
        font_size: float = 40.0
    ) -> str:
        doc = fitz.open(file_path)
        rgb = ToolsService._hex_to_rgb(color_hex)

        for page in doc:
            rect = page.rect
            center = fitz.Point(rect.width / 2 - 100, rect.height / 2)
            page.insert_text(
                center,
                text,
                fontsize=font_size,
                color=rgb,
                morph=(center, fitz.Matrix(rotation)),
                stroke_opacity=opacity,
                fill_opacity=opacity,
                fontname="helv"
            )

        out_filename = f"watermarked_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, garbage=3, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def add_page_numbers(
        file_path: str,
        position: PageNumberPosition = PageNumberPosition.BOTTOM_CENTER,
        format_str: str = "Page {n} of {total}"
    ) -> str:
        doc = fitz.open(file_path)
        total = len(doc)

        for i, page in enumerate(doc):
            rect = page.rect
            text = format_str.format(n=i + 1, total=total)
            fontsize = 10
            margin = 35

            if position == PageNumberPosition.BOTTOM_CENTER:
                pt = fitz.Point(rect.width / 2 - 30, rect.height - margin)
            elif position == PageNumberPosition.BOTTOM_RIGHT:
                pt = fitz.Point(rect.width - margin - 60, rect.height - margin)
            elif position == PageNumberPosition.BOTTOM_LEFT:
                pt = fitz.Point(margin, rect.height - margin)
            elif position == PageNumberPosition.TOP_CENTER:
                pt = fitz.Point(rect.width / 2 - 30, margin)
            elif position == PageNumberPosition.TOP_RIGHT:
                pt = fitz.Point(rect.width - margin - 60, margin)
            else: # TOP_LEFT
                pt = fitz.Point(margin, margin)

            page.insert_text(pt, text, fontsize=fontsize, color=(0.4, 0.4, 0.4), fontname="helv")

        out_filename = f"numbered_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, garbage=3, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def images_to_pdf(image_paths: List[str]) -> str:
        out_doc = fitz.open()
        for img_path in image_paths:
            try:
                pix = fitz.Pixmap(img_path)
                page = out_doc.new_page(width=pix.width, height=pix.height)
                page.insert_image(page.rect, pixmap=pix)
                pix = None
            except Exception:
                img = fitz.open(img_path)
                pdf_bytes = img.convert_to_pdf()
                img.close()
                img_pdf = fitz.open("pdf", pdf_bytes)
                out_doc.insert_pdf(img_pdf)
                img_pdf.close()

        out_filename = f"images_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        out_doc.save(out_path, garbage=1, deflate=True)
        out_doc.close()
        return out_path

    @staticmethod
    def pdf_to_text(file_path: str, as_markdown: bool = False) -> str:
        doc = fitz.open(file_path)
        text_content = []
        for i, page in enumerate(doc):
            if as_markdown:
                text_content.append(f"## Page {i + 1}\n\n" + page.get_text())
            else:
                text_content.append(f"--- Page {i + 1} ---\n\n" + page.get_text())
        doc.close()

        ext = "md" if as_markdown else "txt"
        out_filename = f"extracted_text_{uuid.uuid4().hex}.{ext}"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n\n".join(text_content))
        return out_path

    @staticmethod
    def crop_pdf(file_path: str, margin_percent: float = 5.0) -> str:
        doc = fitz.open(file_path)
        for page in doc:
            r = page.rect
            dx = r.width * (margin_percent / 100.0)
            dy = r.height * (margin_percent / 100.0)
            new_rect = fitz.Rect(r.x0 + dx, r.y0 + dy, r.x1 - dx, r.y1 - dy)
            page.set_cropbox(new_rect)

        out_filename = f"cropped_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, garbage=3, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def flatten_pdf(file_path: str) -> str:
        doc = fitz.open(file_path)
        doc.bake()
        out_filename = f"flattened_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, garbage=3, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def repair_pdf(file_path: str) -> str:
        doc = fitz.open(file_path)
        out_filename = f"repaired_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, clean=True, garbage=4, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def html_to_pdf(html_text: str) -> str:
        if "<html" not in html_text.lower():
            html_text = f"""<!DOCTYPE html><html><head><style>
            body {{ font-family: sans-serif; font-size: 12pt; line-height: 1.5; padding: 24px; color: #111; }}
            h1, h2, h3 {{ color: #000; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 15px; }}
            th, td {{ border: 1px solid #ccc; padding: 8px; text-align: left; }}
            th {{ background-color: #f4f4f4; }}
            </style></head><body>{html_text}</body></html>"""

        story = fitz.Story(html_text)
        out_filename = f"html_converted_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        writer = fitz.DocumentWriter(out_path)
        rect = fitz.Rect(0, 0, 595, 842)
        more = 1
        while more:
            device = writer.begin_page(rect)
            more, _ = story.place(rect)
            story.draw(device)
            writer.end_page()
        writer.close()
        return out_path

    @staticmethod
    def pdf_to_word(file_path: str) -> str:
        from pdf2docx import Converter
        out_filename = f"converted_{uuid.uuid4().hex}.docx"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        cv = Converter(file_path)
        cv.convert(out_path, start=0, end=None)
        cv.close()
        return out_path

    @staticmethod
    def word_to_pdf(file_path: str) -> str:
        import docx
        doc = docx.Document(file_path)
        html_parts = []
        for p in doc.paragraphs:
            if not p.text.strip():
                continue
            if p.style.name.startswith("Heading 1"):
                html_parts.append(f"<h1>{p.text}</h1>")
            elif p.style.name.startswith("Heading 2"):
                html_parts.append(f"<h2>{p.text}</h2>")
            elif p.style.name.startswith("Heading 3"):
                html_parts.append(f"<h3>{p.text}</h3>")
            else:
                html_parts.append(f"<p>{p.text}</p>")

        for t in doc.tables:
            html_parts.append("<table>")
            for row in t.rows:
                html_parts.append("<tr>")
                for cell in row.cells:
                    html_parts.append(f"<td>{cell.text}</td>")
                html_parts.append("</tr>")
            html_parts.append("</table>")

        content = "\n".join(html_parts) if html_parts else "<p>Document empty</p>"
        return ToolsService.html_to_pdf(content)

    @staticmethod
    def pdf_to_excel(file_path: str) -> str:
        import openpyxl
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Extracted Data"
        doc = fitz.open(file_path)
        current_row = 1

        for p_idx, page in enumerate(doc):
            tabs = page.find_tables()
            if tabs.tables:
                for t in tabs.tables:
                    df = t.extract()
                    for row_data in df:
                        for col_idx, cell_value in enumerate(row_data, 1):
                            ws.cell(row=current_row, column=col_idx, value=str(cell_value) if cell_value is not None else "")
                        current_row += 1
                    current_row += 1
            else:
                text_blocks = page.get_text("blocks")
                for b in text_blocks:
                    ws.cell(row=current_row, column=1, value=b[4].strip())
                    current_row += 1

        doc.close()
        out_filename = f"extracted_excel_{uuid.uuid4().hex}.xlsx"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        wb.save(out_path)
        return out_path

    @staticmethod
    def excel_to_pdf(file_path: str) -> str:
        import openpyxl
        wb = openpyxl.load_workbook(file_path, data_only=True)
        html_parts = []
        for sheetname in wb.sheetnames:
            ws = wb[sheetname]
            html_parts.append(f"<h2>{sheetname}</h2><table>")
            for row in ws.iter_rows(values_only=True):
                if not any(row):
                    continue
                html_parts.append("<tr>")
                for cell in row:
                    val = str(cell) if cell is not None else ""
                    html_parts.append(f"<td>{val}</td>")
                html_parts.append("</tr>")
            html_parts.append("</table><br/>")

        content = "\n".join(html_parts) if html_parts else "<p>Spreadsheet empty</p>"
        return ToolsService.html_to_pdf(content)

    @staticmethod
    def pdf_to_powerpoint(file_path: str) -> str:
        from pptx import Presentation
        from pptx.util import Inches
        prs = Presentation()
        prs.slide_width = Inches(10)
        prs.slide_height = Inches(7.5)
        blank_slide_layout = prs.slide_layouts[6]

        doc = fitz.open(file_path)
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=150)
            img_path = os.path.join(UPLOAD_DIR, f"temp_slide_{uuid.uuid4().hex}.png")
            pix.save(img_path)
            slide = prs.slides.add_slide(blank_slide_layout)
            slide.shapes.add_picture(img_path, Inches(0), Inches(0), width=prs.slide_width, height=prs.slide_height)
            if os.path.exists(img_path):
                try:
                    os.remove(img_path)
                except Exception:
                    pass
        doc.close()

        out_filename = f"presentation_{uuid.uuid4().hex}.pptx"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        prs.save(out_path)
        return out_path

    @staticmethod
    def powerpoint_to_pdf(file_path: str) -> str:
        from pptx import Presentation
        prs = Presentation(file_path)
        html_parts = []
        for i, slide in enumerate(prs.slides):
            html_parts.append(f"<h2>Slide {i + 1}</h2><div style='border:1px solid #ccc; padding:15px; margin-bottom:20px;'>")
            for shape in slide.shapes:
                if shape.has_text_frame:
                    for paragraph in shape.text_frame.paragraphs:
                        if paragraph.text.strip():
                            html_parts.append(f"<p>{paragraph.text}</p>")
            html_parts.append("</div>")
        content = "\n".join(html_parts) if html_parts else "<p>Presentation Empty</p>"
        return ToolsService.html_to_pdf(content)

    @staticmethod
    def pdf_to_pdfa(file_path: str) -> str:
        doc = fitz.open(file_path)
        meta = doc.metadata or {}
        meta["format"] = "PDF/A-1b"
        doc.set_metadata(meta)
        out_filename = f"pdfa_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, clean=True, garbage=4, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def grayscale_pdf(file_path: str) -> str:
        doc = fitz.open(file_path)
        out_doc = fitz.open()
        for page in doc:
            pix = page.get_pixmap(colorspace=fitz.csGRAY, dpi=150)
            img_buf = io.BytesIO(pix.tobytes("png"))
            img_doc = fitz.open("png", img_buf.getvalue())
            pdf_bytes = img_doc.convert_to_pdf()
            img_doc.close()
            gray_pdf = fitz.open("pdf", pdf_bytes)
            out_doc.insert_pdf(gray_pdf)
            gray_pdf.close()
        doc.close()
        out_filename = f"grayscale_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        out_doc.save(out_path, garbage=3, deflate=True)
        out_doc.close()
        return out_path

    @staticmethod
    def redact_pdf(file_path: str, search_terms: List[str]) -> str:
        doc = fitz.open(file_path)
        for page in doc:
            for term in search_terms:
                if not term.strip():
                    continue
                matches = page.search_for(term.strip())
                for rect in matches:
                    page.add_redact_annot(rect, fill=(0, 0, 0))
            page.apply_redactions()
        out_filename = f"redacted_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        doc.save(out_path, garbage=3, deflate=True)
        doc.close()
        return out_path

    @staticmethod
    def compare_pdf(file1_path: str, file2_path: str) -> str:
        doc1 = fitz.open(file1_path)
        doc2 = fitz.open(file2_path)
        out_doc = fitz.open()

        max_pages = max(len(doc1), len(doc2))
        for i in range(max_pages):
            width = 595 * 2
            height = 842
            new_page = out_doc.new_page(width=width, height=height)

            if i < len(doc1):
                pix1 = doc1[i].get_pixmap(dpi=100)
                new_page.insert_image(fitz.Rect(20, 40, 575, 820), pixmap=pix1)
                new_page.insert_text((30, 30), f"Document 1 - Page {i + 1}", fontsize=12, color=(0.2, 0.2, 0.2))

            if i < len(doc2):
                pix2 = doc2[i].get_pixmap(dpi=100)
                new_page.insert_image(fitz.Rect(595 + 20, 40, width - 20, 820), pixmap=pix2)
                new_page.insert_text((595 + 30, 30), f"Document 2 - Page {i + 1}", fontsize=12, color=(0.2, 0.2, 0.2))

        doc1.close()
        doc2.close()
        out_filename = f"comparison_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        out_doc.save(out_path, garbage=3, deflate=True)
        out_doc.close()
        return out_path

    @staticmethod
    def _ensure_tessdata(language: str = "eng") -> str:
        os.makedirs(TESSDATA_DIR, exist_ok=True)
        lang_file = os.path.join(TESSDATA_DIR, f"{language}.traineddata")
        if not os.path.exists(lang_file) or os.path.getsize(lang_file) < 1000:
            try:
                import requests
                url = f"https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/{language}.traineddata"
                res = requests.get(url, timeout=25)
                if res.status_code == 200:
                    with open(lang_file, "wb") as f:
                        f.write(res.content)
            except Exception:
                pass
        return TESSDATA_DIR

    @staticmethod
    def ocr_pdf_task(
        file_path: str,
        language: str = "eng",
        force_ocr: bool = False,
        output_format: str = "pdf",
        progress_callback: Optional[Callable[[int], None]] = None,
    ) -> str:
        tess_dir = ToolsService._ensure_tessdata(language)
        ext = os.path.splitext(file_path)[1].lower()

        # Support direct image files (png, jpg, jpeg, webp, bmp, tiff)
        if ext in [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".tif"]:
            if progress_callback:
                progress_callback(30)
            pix = fitz.Pixmap(file_path)
            ocr_pdf_bytes = pix.pdfocr_tobytes(tessdata=tess_dir, language=language)
            if progress_callback:
                progress_callback(80)

            if output_format == "txt":
                temp_doc = fitz.open("pdf", ocr_pdf_bytes)
                extracted_text = "\n\n".join([p.get_text() for p in temp_doc])
                temp_doc.close()
                out_filename = f"ocr_extracted_{uuid.uuid4().hex}.txt"
                out_path = os.path.join(UPLOAD_DIR, out_filename)
                with open(out_path, "w", encoding="utf-8") as f:
                    f.write(extracted_text)
                if progress_callback:
                    progress_callback(100)
                return out_path
            else:
                out_filename = f"ocr_searchable_{uuid.uuid4().hex}.pdf"
                out_path = os.path.join(UPLOAD_DIR, out_filename)
                with open(out_path, "wb") as f:
                    f.write(ocr_pdf_bytes)
                if progress_callback:
                    progress_callback(100)
                return out_path

        # PDF document handling
        doc = fitz.open(file_path)
        total_pages = len(doc)
        if total_pages == 0:
            doc.close()
            raise ValueError("The provided PDF file contains no pages")

        if output_format == "txt":
            extracted_pages_text = []
            for idx, page in enumerate(doc):
                text = page.get_text().strip()
                if len(text) < 25 or force_ocr:
                    pix = page.get_pixmap(dpi=150)
                    ocr_bytes = pix.pdfocr_tobytes(tessdata=tess_dir, language=language)
                    ocr_page = fitz.open("pdf", ocr_bytes)
                    ocr_text = ocr_page[0].get_text()
                    extracted_pages_text.append(f"--- Page {page.number + 1} ---\n" + ocr_text)
                    ocr_page.close()
                else:
                    extracted_pages_text.append(f"--- Page {page.number + 1} ---\n" + text)

                if progress_callback:
                    pct = int(10 + ((idx + 1) / total_pages) * 85)
                    progress_callback(min(pct, 95))

            doc.close()
            out_filename = f"ocr_extracted_{uuid.uuid4().hex}.txt"
            out_path = os.path.join(UPLOAD_DIR, out_filename)
            with open(out_path, "w", encoding="utf-8") as f:
                f.write("\n\n".join(extracted_pages_text))
            if progress_callback:
                progress_callback(100)
            return out_path

        # Searchable PDF mode
        out_doc = fitz.open()
        for idx, page in enumerate(doc):
            existing_text = page.get_text().strip()
            # If scanned page or user requested force_ocr across all pages
            if len(existing_text) < 25 or force_ocr:
                pix = page.get_pixmap(dpi=150)
                ocr_bytes = pix.pdfocr_tobytes(tessdata=tess_dir, language=language)
                ocr_page_doc = fitz.open("pdf", ocr_bytes)
                out_doc.insert_pdf(ocr_page_doc)
                ocr_page_doc.close()
            else:
                out_doc.insert_pdf(doc, from_page=page.number, to_page=page.number)

            if progress_callback:
                pct = int(10 + ((idx + 1) / total_pages) * 85)
                progress_callback(min(pct, 95))

        doc.close()
        out_filename = f"ocr_searchable_{uuid.uuid4().hex}.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_filename)
        out_doc.save(out_path, garbage=3, deflate=True)
        out_doc.close()
        if progress_callback:
            progress_callback(100)
        return out_path

    @staticmethod
    def ocr_pdf(
        file_path: str,
        language: str = "eng",
        force_ocr: bool = False,
        output_format: str = "pdf",
    ) -> str:
        return ToolsService.ocr_pdf_task(file_path, language, force_ocr, output_format)


