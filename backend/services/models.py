from pydantic import BaseModel
from typing import List, Optional

class TextEdit(BaseModel):
    id: str
    page: int
    text: str
    original_bbox: List[float]
    font: Optional[str] = "Helvetica"
    size: Optional[float] = 12.0
    color: Optional[str] = "#000000"
    flags: Optional[int] = 0

class UpdateTextRequest(BaseModel):
    edits: List[TextEdit]
