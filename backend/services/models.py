from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

# --- Existing Editor Models ---
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

# --- Shared Strict Typed Enums ---
class CompressionQuality(str, Enum):
    EXTREME = "extreme"         # ~72 DPI, high downsampling, 70-85% size reduction
    RECOMMENDED = "recommended" # ~150 DPI, balanced quality/size, 50-70% reduction
    LOW = "low"                 # ~200 DPI, lossless compression, 20-40% reduction

class WatermarkColor(str, Enum):
    GRAY = "#6B7280"
    RED = "#EF4444"
    BLUE = "#3B82F6"
    AMBER = "#F59E0B"
    BLACK = "#000000"
    WHITE = "#FFFFFF"

class PageNumberPosition(str, Enum):
    BOTTOM_CENTER = "bottom-center"
    BOTTOM_RIGHT = "bottom-right"
    BOTTOM_LEFT = "bottom-left"
    TOP_CENTER = "top-center"
    TOP_RIGHT = "top-right"
    TOP_LEFT = "top-left"

class ImageFormat(str, Enum):
    PNG = "png"
    JPEG = "jpeg"
    WEBP = "webp"

class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

# --- Tool Job Responses ---
class ToolJobResult(BaseModel):
    download_url: str
    file_name: str
    original_size: Optional[int] = None
    processed_size: Optional[int] = None
    savings_percent: Optional[float] = None
    page_count: Optional[int] = None

class JobResponse(BaseModel):
    job_id: str
    status: JobStatus
    poll_url: str
    estimated_seconds: Optional[int] = 3

class ToolJobStatusResponse(BaseModel):
    job_id: str
    tool: str
    status: JobStatus
    progress: int
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: float
