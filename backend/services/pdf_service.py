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
        
        # Group edits by page
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
            
            for edit in page_edits:
                # 1. Redact old text area
                # Convert bbox back to fitz.Rect
                bbox = edit["original_bbox"]
                rect = fitz.Rect(bbox[0], bbox[1], bbox[2], bbox[3])
                # Add slight padding to ensure it covers
                rect = rect + (-1, -1, 1, 1)
                
                # Add redaction annotation without a white background fill
                page.add_redact_annot(rect)
            
            # Apply all redactions on this page
            # Set images=0 and graphics=0 to prevent PyMuPDF from erasing background colors and images underneath the text.
            page.apply_redactions(images=0, graphics=0)
            
            for edit in page_edits:
                # 2. Insert new text
                bbox = edit["original_bbox"]
                new_text = edit["text"]
                font_name = edit.get("font", "helv")
                size = edit.get("size", 12)
                
                # Try to map font to built-in if possible, otherwise use helv
                font_map = {
                    "Times-Roman": "tiro",
                    "Times-Bold": "tibo",
                    "Times-Italic": "tiit",
                    "Times-BoldItalic": "tibi",
                    "Helvetica": "helv",
                    "Helvetica-Bold": "hebo",
                    "Helvetica-Oblique": "heob",
                    "Helvetica-BoldOblique": "hebo",
                    "Courier": "cour",
                    "Courier-Bold": "cobo",
                    "Courier-Oblique": "coob",
                    "Courier-BoldOblique": "cobo"
                }
                
                mapped_font = "helv" # Default
                for k, v in font_map.items():
                    if k.lower() in font_name.lower():
                        mapped_font = v
                        break
                
                # Parse hex color to rgb tuple (0-1)
                color_hex = edit.get("color", "#000000").lstrip("#")
                if len(color_hex) == 6:
                    r = int(color_hex[0:2], 16) / 255.0
                    g = int(color_hex[2:4], 16) / 255.0
                    b = int(color_hex[4:6], 16) / 255.0
                    color_rgb = (r, g, b)
                else:
                    color_rgb = (0, 0, 0)
                
                # Calculate insertion point (bottom left of original text)
                # Note: y1 is bottom, y0 is top in PyMuPDF depending on coordinate system
                # insert_text usually expects bottom-left
                point = fitz.Point(bbox[0], bbox[3] - (size * 0.2)) # Slight baseline adjustment
                
                page.insert_text(
                    point,
                    new_text,
                    fontname=mapped_font,
                    fontsize=size,
                    color=color_rgb
                )
                
        # Save to new file
        new_filename = f"edited_{uuid.uuid4().hex}.pdf"
        output_path = os.path.join(UPLOAD_DIR, new_filename)
        doc.save(output_path, garbage=3, deflate=True)
        doc.close()
        
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
