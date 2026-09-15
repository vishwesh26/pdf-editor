import fitz # PyMuPDF
import os
import uuid
import math
from typing import List, Dict, Any

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class PDFService:
    @staticmethod
    def extract_text_blocks(file_path: str) -> List[Dict[str, Any]]:
        """Extract text blocks with bounding boxes and font info."""
        doc = fitz.open(file_path)
        pages_data = []

        for page_num, page in enumerate(doc):
            blocks = page.get_text("dict")["blocks"]
            page_blocks = []
            
            for block in blocks:
                if block.get("type") == 0:  # Text block
                    for line in block.get("lines", []):
                        for span in line.get("spans", []):
                            text = span.get("text", "").strip()
                            if text:
                                # bbox is (x0, y0, x1, y1)
                                bbox = span.get("bbox")
                                color = span.get("color")
                                # Convert int color to hex
                                hex_color = f"#{color:06x}" if isinstance(color, int) else "#000000"
                                
                                page_blocks.append({
                                    "id": str(uuid.uuid4()),
                                    "page": page_num + 1,
                                    "text": text,
                                    "bbox": bbox,
                                    "font": span.get("font", "Helvetica"),
                                    "size": span.get("size", 12),
                                    "color": hex_color,
                                    "flags": span.get("flags", 0)
                                })
            
            pages_data.append({
                "page": page_num + 1,
                "width": page.rect.width,
                "height": page.rect.height,
                "blocks": page_blocks
            })

        doc.close()
        return pages_data

    @staticmethod
    def _is_subsetted(basefont: str) -> bool:
        """Check if a font name indicates subsetting (e.g. 'ABCDEF+Calibri')."""
        if "+" not in basefont:
            return False
        prefix = basefont.split("+")[0]
        # Subset prefixes are exactly 6 uppercase ASCII letters
        return len(prefix) == 6 and prefix.isalpha() and prefix.isupper()

    @staticmethod
    def _font_has_glyphs(font_path: str, text: str) -> bool:
        """Check if a font file contains glyphs for every character in text."""
        try:
            font = fitz.Font(fontfile=font_path)
            for ch in text:
                if ch.isspace():
                    continue
                # fitz.Font.glyph_count / has_glyph check
                glyph_id = font.glyph_advance(ord(ch))
                if glyph_id == 0:
                    return False
            return True
        except Exception:
            return False

    @staticmethod
    def update_text(file_path: str, edits: List[Dict[str, Any]]) -> str:
        """Apply edits and return path to the new file."""
        doc = fitz.open(file_path)
        
        # ── Step 1: Extract all embedded fonts from the PDF for reuse ──
        # We do this BEFORE redacting so font data is still available.
        # font_info_map: cleaned_font_name -> { path, is_subsetted }
        font_info_map = {}
        temp_file_paths = []
        seen_xrefs = set()
        
        for page_idx in range(len(doc)):
            for font_info in doc[page_idx].get_fonts(full=True):
                xref = font_info[0]
                if xref <= 0 or xref in seen_xrefs:
                    continue
                seen_xrefs.add(xref)
                
                basefont = font_info[3]  # e.g. "ABCDEF+Calibri-Bold"
                subsetted = PDFService._is_subsetted(basefont)
                # Strip subset prefix (e.g. "ABCDEF+" → "Calibri-Bold")
                clean_name = basefont.split("+")[-1] if "+" in basefont else basefont
                
                if clean_name in font_info_map:
                    continue
                
                try:
                    _, ext, _, content = doc.extract_font(xref)
                    if content and ext in ("ttf", "otf", "ttc"):
                        temp_path = os.path.join(
                            UPLOAD_DIR, f"_tmpfont_{uuid.uuid4().hex}.{ext}"
                        )
                        with open(temp_path, "wb") as f:
                            f.write(content)
                        font_info_map[clean_name] = {
                            "path": temp_path,
                            "is_subsetted": subsetted,
                        }
                        temp_file_paths.append(temp_path)
                except Exception:
                    pass
        
        # ── Step 2: Group edits by page ──
        edits_by_page = {}
        for edit in edits:
            page_num = edit["page"] - 1
            if page_num not in edits_by_page:
                edits_by_page[page_num] = []
            edits_by_page[page_num].append(edit)
            
        for page_num, page_edits in edits_by_page.items():
            if page_num >= len(doc):
                continue
            page = doc[page_num]
            
            # ── Step 3: Redact old text ──
            for edit in page_edits:
                bbox = edit["original_bbox"]
                rect = fitz.Rect(bbox[0], bbox[1], bbox[2], bbox[3])
                rect = rect + (-1, -1, 1, 1)
                page.add_redact_annot(rect)
            
            # Apply all redactions on this page
            # images=0 and graphics=0 prevents erasing background colors/images
            page.apply_redactions(images=0, graphics=0)
            
            # ── Step 4: Insert new text with best available font ──
            for edit in page_edits:
                bbox = edit["original_bbox"]
                new_text = edit["text"]
                font_name = edit.get("font", "Helvetica")
                size = edit.get("size", 12)
                flags = edit.get("flags", 0)
                
                # Parse hex color to rgb tuple (0-1)
                color_hex = edit.get("color", "#000000").lstrip("#")
                if len(color_hex) == 6:
                    r = int(color_hex[0:2], 16) / 255.0
                    g = int(color_hex[2:4], 16) / 255.0
                    b = int(color_hex[4:6], 16) / 255.0
                    color_rgb = (r, g, b)
                else:
                    color_rgb = (0, 0, 0)
                
                # Baseline insertion point
                point = fitz.Point(bbox[0], bbox[3] - (size * 0.2))
                
                # Try to find the original font in our extracted cache
                clean_edit_font = font_name.split("+")[-1] if "+" in font_name else font_name
                font_entry = font_info_map.get(clean_edit_font)
                
                inserted = False
                
                # Strategy A: Use the extracted font file ONLY if it is NOT
                # subsetted, or if it IS subsetted but contains all the glyphs
                # we need for the new text.  Subsetted fonts only have glyphs
                # for the original text — new characters render as □ boxes.
                if font_entry and os.path.exists(font_entry["path"]):
                    use_extracted = True
                    
                    if font_entry["is_subsetted"]:
                        # Check if every character in new_text has a glyph
                        use_extracted = PDFService._font_has_glyphs(
                            font_entry["path"], new_text
                        )
                    
                    if use_extracted:
                        try:
                            safe_ref = "".join(
                                c for c in clean_edit_font if c.isalnum() or c in "-_"
                            ) or "EmbeddedFont"
                            
                            page.insert_text(
                                point,
                                new_text,
                                fontfile=font_entry["path"],
                                fontname=safe_ref,
                                fontsize=size,
                                color=color_rgb,
                            )
                            inserted = True
                        except Exception:
                            pass
                
                # Strategy B: Try to load the font by name from the system.
                # This works when the user has the font installed (e.g. Calibri,
                # Arial, Times New Roman).
                if not inserted:
                    # Strip style suffixes to get a base family name
                    base_family = clean_edit_font
                    for suffix in ["-Bold", "-Italic", "-BoldItalic", "-Light",
                                   "-Regular", "-Medium", "-Semibold", "-Black",
                                   "Bold", "Italic", "Regular"]:
                        base_family = base_family.replace(suffix, "")
                    base_family = base_family.strip("-").strip()
                    
                    is_bold = bool(flags & (1 << 4))
                    is_italic = bool(flags & (1 << 1))
                    font_lower = font_name.lower()
                    if "bold" in font_lower or "heavy" in font_lower or "black" in font_lower:
                        is_bold = True
                    if "italic" in font_lower or "oblique" in font_lower:
                        is_italic = True
                    
                    try:
                        sys_font = fitz.Font(base_family, is_bold=is_bold, is_italic=is_italic)
                        if sys_font.valid:
                            # Write system font to a temp file for insert_text
                            sys_font_path = os.path.join(
                                UPLOAD_DIR, f"_sysfont_{uuid.uuid4().hex}.ttf"
                            )
                            sys_font_buffer = sys_font.buffer
                            if sys_font_buffer:
                                with open(sys_font_path, "wb") as f:
                                    f.write(sys_font_buffer)
                                temp_file_paths.append(sys_font_path)
                                
                                safe_ref = "".join(
                                    c for c in base_family if c.isalnum() or c in "-_"
                                ) or "SystemFont"
                                
                                page.insert_text(
                                    point,
                                    new_text,
                                    fontfile=sys_font_path,
                                    fontname=safe_ref,
                                    fontsize=size,
                                    color=color_rgb,
                                )
                                inserted = True
                    except Exception:
                        pass
                
                # Strategy C: Built-in PDF base fonts (always have all Latin glyphs)
                if not inserted:
                    is_bold = bool(flags & (1 << 4))
                    is_italic = bool(flags & (1 << 1))
                    font_lower = font_name.lower()
                    
                    if any(k in font_lower for k in ["courier", "mono", "consola"]):
                        family = "courier"
                    elif any(k in font_lower for k in ["times", "serif", "roman", "georgia"]):
                        family = "times"
                    else:
                        family = "helvetica"
                    
                    if "bold" in font_lower or "heavy" in font_lower or "black" in font_lower:
                        is_bold = True
                    if "italic" in font_lower or "oblique" in font_lower:
                        is_italic = True
                    
                    font_family_map = {
                        "helvetica": {
                            (False, False): "helv",
                            (True,  False): "hebo",
                            (False, True):  "heob",
                            (True,  True):  "hebo",
                        },
                        "times": {
                            (False, False): "tiro",
                            (True,  False): "tibo",
                            (False, True):  "tiit",
                            (True,  True):  "tibi",
                        },
                        "courier": {
                            (False, False): "cour",
                            (True,  False): "cobo",
                            (False, True):  "coob",
                            (True,  True):  "cobo",
                        },
                    }
                    
                    mapped_font = font_family_map[family][(is_bold, is_italic)]
                    
                    page.insert_text(
                        point,
                        new_text,
                        fontname=mapped_font,
                        fontsize=size,
                        color=color_rgb,
                    )
                
        # Save to new file
        new_filename = f"edited_{uuid.uuid4().hex}.pdf"
        output_path = os.path.join(UPLOAD_DIR, new_filename)
        doc.save(output_path, garbage=3, deflate=True)
        doc.close()
        
        # Cleanup temp font files
        for temp_path in temp_file_paths:
            try:
                os.remove(temp_path)
            except Exception:
                pass
        
        return output_path

    @staticmethod
    def is_scanned(file_path: str) -> bool:
        """Heuristic check if PDF is a scanned image (no text, but has images)."""
        doc = fitz.open(file_path)
        has_text = False
        has_images = False
        
        for page in doc:
            if page.get_text("text").strip():
                has_text = True
            if page.get_images():
                has_images = True
                
            if has_text:
                break
                
        doc.close()
        
        # If it has images but absolutely no text, it's likely scanned
        return has_images and not has_text
