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
    def update_text(file_path: str, edits: List[Dict[str, Any]]) -> str:
        """Apply edits and return path to the new file."""
        doc = fitz.open(file_path)
        
        # ── Step 1: Extract all embedded fonts from the PDF for reuse ──
        # We do this BEFORE redacting so font data is still available.
        # font_files maps cleaned_font_name -> temp_file_path
        font_files = {}
        temp_file_paths = []
        seen_xrefs = set()
        
        for page_idx in range(len(doc)):
            for font_info in doc[page_idx].get_fonts(full=True):
                xref = font_info[0]
                if xref <= 0 or xref in seen_xrefs:
                    continue
                seen_xrefs.add(xref)
                
                basefont = font_info[3]  # e.g. "ABCDEF+Calibri-Bold"
                # Strip subset prefix (e.g. "ABCDEF+" → "Calibri-Bold")
                clean_name = basefont.split("+")[-1] if "+" in basefont else basefont
                
                if clean_name in font_files:
                    continue
                
                try:
                    _, ext, _, content = doc.extract_font(xref)
                    if content and ext in ("ttf", "otf", "ttc"):
                        temp_path = os.path.join(
                            UPLOAD_DIR, f"_tmpfont_{uuid.uuid4().hex}.{ext}"
                        )
                        with open(temp_path, "wb") as f:
                            f.write(content)
                        font_files[clean_name] = temp_path
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
            
            # ── Step 4: Insert new text with original font ──
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
                font_file = font_files.get(clean_edit_font)
                
                inserted = False
                if font_file and os.path.exists(font_file):
                    try:
                        # Create a safe PDF reference name from the font name
                        safe_ref = "".join(
                            c for c in clean_edit_font if c.isalnum() or c in "-_"
                        ) or "EmbeddedFont"
                        
                        page.insert_text(
                            point,
                            new_text,
                            fontfile=font_file,
                            fontname=safe_ref,
                            fontsize=size,
                            color=color_rgb,
                        )
                        inserted = True
                    except Exception:
                        pass  # Fall through to built-in font fallback
                
                if not inserted:
                    # ── Fallback: built-in font with bold/italic detection ──
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
