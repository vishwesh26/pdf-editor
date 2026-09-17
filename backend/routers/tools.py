import os
import shutil
import uuid
import fitz
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request, Depends, status
from fastapi.responses import FileResponse, JSONResponse

from services.models import (
    CompressionQuality,
    WatermarkColor,
    PageNumberPosition,
    ImageFormat,
    JobStatus,
    JobResponse,
    ToolJobStatusResponse,
    ToolJobResult,
)
from services.rate_limiter import check_rate_limit, rate_limiter
from services.job_store import job_store
from services.tools_service import ToolsService, UPLOAD_DIR

router = APIRouter()

def validate_file_size(file: UploadFile, request: Request, tier: str = "guest") -> int:
    max_size = rate_limiter.get_max_file_size(tier)
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    if size > max_size:
        max_mb = max_size // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large ({size // (1024 * 1024)}MB). Maximum allowed for your tier is {max_mb}MB."
        )
    return size

def save_temp_file(file: UploadFile) -> str:
    file_id = uuid.uuid4().hex
    safe_name = f"upload_{file_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return file_path

# ─── JOB POLLING & DOWNLOAD ───────────────────────────────────────────────────

@router.get("/jobs/{job_id}", response_model=ToolJobStatusResponse)
async def get_job_status(job_id: str):
    job = job_store.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or expired")
    return ToolJobStatusResponse(
        job_id=job["job_id"],
        tool=job["tool"],
        status=job["status"],
        progress=job["progress"],
        result=job["result"],
        error=job["error"],
        created_at=job["created_at"],
    )

@router.get("/download/{file_id}")
async def download_processed_file(file_id: str):
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found or expired")

    ext = os.path.splitext(file_id)[1].lower()
    media_types = {
        ".pdf": "application/pdf",
        ".zip": "application/zip",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".txt": "text/plain",
        ".md": "text/markdown",
    }
    media_type = media_types.get(ext, "application/octet-stream")

    # Strip the random uuid prefix for a cleaner download name
    download_name = file_id
    if "_" in file_id:
        parts = file_id.split("_", 2)
        download_name = parts[-1] if len(parts) > 1 else file_id

    return FileResponse(
        path=file_path,
        filename=download_name,
        media_type=media_type
    )

# ─── COMPRESS PDF (THRESHOLD-BASED ASYNC / SYNC) ──────────────────────────────

@router.post("/compress")
async def compress_pdf(
    request: Request,
    file: UploadFile = File(...),
    quality: CompressionQuality = Form(CompressionQuality.RECOMMENDED),
    async_mode: Optional[bool] = Form(None),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    size = validate_file_size(file, request)
    file_path = save_temp_file(file)

    # Threshold: Files >= 10MB or pages > 10 trigger async background execution
    try:
        doc = fitz.open(file_path)
        page_count = len(doc)
        doc.close()
    except Exception:
        page_count = 1

    is_heavy = size >= 10 * 1024 * 1024 or page_count > 10
    should_run_async = async_mode is True or (async_mode is None and is_heavy)

    if should_run_async:
        job_id = f"job_compress_{uuid.uuid4().hex}"
        job_store.create_job(job_id, "compress", file.filename)

        def run_async():
            try:
                job_store.update_progress(job_id, 10, "processing")
                out_path, orig_sz, comp_sz, savings = ToolsService.compress_pdf_task(
                    file_path,
                    quality,
                    progress_callback=lambda p: job_store.update_progress(job_id, p, "processing")
                )
                file_id = os.path.basename(out_path)
                result = {
                    "download_url": f"/api/tools/download/{file_id}",
                    "file_name": file_id,
                    "original_size": orig_sz,
                    "processed_size": comp_sz,
                    "savings_percent": savings,
                    "page_count": page_count,
                }
                job_store.set_completed(job_id, result)
            except Exception as e:
                job_store.set_failed(job_id, str(e))

        job_store.submit_task(run_async)
        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={
                "job_id": job_id,
                "status": "processing",
                "poll_url": f"/api/tools/jobs/{job_id}",
                "estimated_seconds": max(3, page_count // 2),
            }
        )
    else:
        # Synchronous execution
        out_path, orig_sz, comp_sz, savings = ToolsService.compress_pdf_task(file_path, quality)
        file_id = os.path.basename(out_path)
        return {
            "status": "completed",
            "result": {
                "download_url": f"/api/tools/download/{file_id}",
                "file_name": file_id,
                "original_size": orig_sz,
                "processed_size": comp_sz,
                "savings_percent": savings,
                "page_count": page_count,
            }
        }

# ─── PDF TO IMAGES (THRESHOLD-BASED ASYNC / SYNC) ─────────────────────────────

@router.post("/pdf-to-images")
async def pdf_to_images(
    request: Request,
    file: UploadFile = File(...),
    img_format: ImageFormat = Form(ImageFormat.PNG),
    dpi: int = Form(150),
    async_mode: Optional[bool] = Form(None),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    size = validate_file_size(file, request)
    file_path = save_temp_file(file)

    try:
        doc = fitz.open(file_path)
        page_count = len(doc)
        doc.close()
    except Exception:
        page_count = 1

    is_heavy = page_count > 5 or size >= 10 * 1024 * 1024
    should_run_async = async_mode is True or (async_mode is None and is_heavy)

    if should_run_async:
        job_id = f"job_pdf2img_{uuid.uuid4().hex}"
        job_store.create_job(job_id, "pdf-to-images", file.filename)

        def run_async():
            try:
                job_store.update_progress(job_id, 10, "processing")
                out_path, _ = ToolsService.pdf_to_images_task(
                    file_path,
                    img_format,
                    dpi,
                    progress_callback=lambda p: job_store.update_progress(job_id, p, "processing")
                )
                file_id = os.path.basename(out_path)
                result = {
                    "download_url": f"/api/tools/download/{file_id}",
                    "file_name": file_id,
                    "page_count": page_count,
                }
                job_store.set_completed(job_id, result)
            except Exception as e:
                job_store.set_failed(job_id, str(e))

        job_store.submit_task(run_async)
        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={
                "job_id": job_id,
                "status": "processing",
                "poll_url": f"/api/tools/jobs/{job_id}",
                "estimated_seconds": max(2, page_count),
            }
        )
    else:
        out_path, _ = ToolsService.pdf_to_images_task(file_path, img_format, dpi)
        file_id = os.path.basename(out_path)
        return {
            "status": "completed",
            "result": {
                "download_url": f"/api/tools/download/{file_id}",
                "file_name": file_id,
                "page_count": page_count,
            }
        }

# ─── MERGE PDFS ───────────────────────────────────────────────────────────────

@router.post("/merge")
async def merge_pdfs(
    request: Request,
    files: List[UploadFile] = File(...),
    _rl=Depends(check_rate_limit),
):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required for merging")

    saved_paths = []
    for f in files:
        if not f.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"File '{f.filename}' is not a PDF")
        validate_file_size(f, request)
        saved_paths.append(save_temp_file(f))

    out_path = ToolsService.merge_pdfs(saved_paths)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── SPLIT PDF ────────────────────────────────────────────────────────────────

@router.post("/split")
async def split_pdf(
    request: Request,
    file: UploadFile = File(...),
    page_ranges: str = Form("1-2"),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.split_pdf(file_path, page_ranges)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── ROTATE PDF ───────────────────────────────────────────────────────────────

@router.post("/rotate")
async def rotate_pdf(
    request: Request,
    file: UploadFile = File(...),
    angle: int = Form(90),
    pages: str = Form("all"),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    if angle not in (90, 180, 270):
        raise HTTPException(status_code=400, detail="Rotation angle must be 90, 180, or 270 degrees")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.rotate_pdf(file_path, angle, pages)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── DELETE / REMOVE PAGES ────────────────────────────────────────────────────

@router.post("/delete-pages")
async def delete_pages(
    request: Request,
    file: UploadFile = File(...),
    pages: str = Form(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.delete_pages(file_path, pages)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── EXTRACT PAGES ────────────────────────────────────────────────────────────

@router.post("/extract-pages")
async def extract_pages(
    request: Request,
    file: UploadFile = File(...),
    pages: str = Form(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.extract_pages(file_path, pages)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── PROTECT PDF ──────────────────────────────────────────────────────────────

@router.post("/protect")
async def protect_pdf(
    request: Request,
    file: UploadFile = File(...),
    password: str = Form(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    if not password:
        raise HTTPException(status_code=400, detail="Password cannot be empty")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.protect_pdf(file_path, password)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── UNLOCK PDF ───────────────────────────────────────────────────────────────

@router.post("/unlock")
async def unlock_pdf(
    request: Request,
    file: UploadFile = File(...),
    password: str = Form(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    try:
        out_path = ToolsService.unlock_pdf(file_path, password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── WATERMARK PDF ────────────────────────────────────────────────────────────

@router.post("/watermark")
async def watermark_pdf(
    request: Request,
    file: UploadFile = File(...),
    text: str = Form(...),
    color: WatermarkColor = Form(WatermarkColor.RED),
    opacity: float = Form(0.3),
    rotation: int = Form(45),
    font_size: float = Form(36.0),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.watermark_pdf(
        file_path,
        text=text,
        color_hex=color.value,
        opacity=max(0.05, min(1.0, opacity)),
        rotation=rotation,
        font_size=font_size
    )
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── ADD PAGE NUMBERS ─────────────────────────────────────────────────────────

@router.post("/page-numbers")
async def add_page_numbers(
    request: Request,
    file: UploadFile = File(...),
    position: PageNumberPosition = Form(PageNumberPosition.BOTTOM_CENTER),
    format_str: str = Form("Page {n} of {total}"),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.add_page_numbers(file_path, position, format_str)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── IMAGES TO PDF ────────────────────────────────────────────────────────────

@router.post("/images-to-pdf")
async def images_to_pdf(
    request: Request,
    files: List[UploadFile] = File(...),
    _rl=Depends(check_rate_limit),
):
    if not files:
        raise HTTPException(status_code=400, detail="No images provided")

    saved_paths = []
    for f in files:
        validate_file_size(f, request)
        saved_paths.append(save_temp_file(f))

    out_path = ToolsService.images_to_pdf(saved_paths)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── PDF TO TEXT / MARKDOWN ───────────────────────────────────────────────────

@router.post("/pdf-to-text")
async def pdf_to_text(
    request: Request,
    file: UploadFile = File(...),
    as_markdown: bool = Form(False),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.pdf_to_text(file_path, as_markdown)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── CROP PDF ─────────────────────────────────────────────────────────────────

@router.post("/crop")
async def crop_pdf(
    request: Request,
    file: UploadFile = File(...),
    margin_percent: float = Form(5.0),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.crop_pdf(file_path, margin_percent)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── FLATTEN PDF ──────────────────────────────────────────────────────────────

@router.post("/flatten")
async def flatten_pdf(
    request: Request,
    file: UploadFile = File(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.flatten_pdf(file_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── REPAIR PDF ───────────────────────────────────────────────────────────────

@router.post("/repair")
async def repair_pdf(
    request: Request,
    file: UploadFile = File(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.repair_pdf(file_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── PDF TO WORD (DOCX) ───────────────────────────────────────────────────────

@router.post("/pdf-to-word")
async def pdf_to_word(
    request: Request,
    file: UploadFile = File(...),
    async_mode: Optional[bool] = Form(None),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    size = validate_file_size(file, request)
    file_path = save_temp_file(file)

    try:
        doc = fitz.open(file_path)
        page_count = len(doc)
        doc.close()
    except Exception:
        page_count = 1

    is_heavy = page_count > 5 or size >= 10 * 1024 * 1024
    should_run_async = async_mode is True or (async_mode is None and is_heavy)

    if should_run_async:
        job_id = f"job_pdf2word_{uuid.uuid4().hex}"
        job_store.create_job(job_id, "pdf-to-word", file.filename)

        def run_async():
            try:
                job_store.update_progress(job_id, 20, "processing")
                out_path = ToolsService.pdf_to_word(file_path)
                file_id = os.path.basename(out_path)
                job_store.set_completed(job_id, {
                    "download_url": f"/api/tools/download/{file_id}",
                    "file_name": file_id,
                    "processed_size": os.path.getsize(out_path),
                })
            except Exception as e:
                job_store.set_failed(job_id, str(e))

        job_store.submit_task(run_async)
        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={
                "job_id": job_id,
                "status": "processing",
                "poll_url": f"/api/tools/jobs/{job_id}",
                "estimated_seconds": max(3, page_count * 2),
            }
        )
    else:
        out_path = ToolsService.pdf_to_word(file_path)
        file_id = os.path.basename(out_path)
        return {
            "status": "completed",
            "result": {
                "download_url": f"/api/tools/download/{file_id}",
                "file_name": file_id,
                "processed_size": os.path.getsize(out_path),
            }
        }

# ─── WORD TO PDF ──────────────────────────────────────────────────────────────

@router.post("/word-to-pdf")
async def word_to_pdf(
    request: Request,
    file: UploadFile = File(...),
    _rl=Depends(check_rate_limit),
):
    if not (file.filename.lower().endswith(".docx") or file.filename.lower().endswith(".doc")):
        raise HTTPException(status_code=400, detail="Only DOCX/DOC files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.word_to_pdf(file_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── PDF TO EXCEL ─────────────────────────────────────────────────────────────

@router.post("/pdf-to-excel")
async def pdf_to_excel(
    request: Request,
    file: UploadFile = File(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.pdf_to_excel(file_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── EXCEL TO PDF ─────────────────────────────────────────────────────────────

@router.post("/excel-to-pdf")
async def excel_to_pdf(
    request: Request,
    file: UploadFile = File(...),
    _rl=Depends(check_rate_limit),
):
    if not (file.filename.lower().endswith(".xlsx") or file.filename.lower().endswith(".xls")):
        raise HTTPException(status_code=400, detail="Only Excel spreadsheets (.xlsx, .xls) are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.excel_to_pdf(file_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── PDF TO POWERPOINT ────────────────────────────────────────────────────────

@router.post("/pdf-to-powerpoint")
async def pdf_to_powerpoint(
    request: Request,
    file: UploadFile = File(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.pdf_to_powerpoint(file_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── POWERPOINT TO PDF ────────────────────────────────────────────────────────

@router.post("/powerpoint-to-pdf")
async def powerpoint_to_pdf(
    request: Request,
    file: UploadFile = File(...),
    _rl=Depends(check_rate_limit),
):
    if not (file.filename.lower().endswith(".pptx") or file.filename.lower().endswith(".ppt")):
        raise HTTPException(status_code=400, detail="Only PowerPoint presentations (.pptx, .ppt) are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.powerpoint_to_pdf(file_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── HTML TO PDF ──────────────────────────────────────────────────────────────

@router.post("/html-to-pdf")
async def html_to_pdf(
    request: Request,
    file: Optional[UploadFile] = File(None),
    html_text: Optional[str] = Form(None),
    _rl=Depends(check_rate_limit),
):
    if file:
        validate_file_size(file, request)
        content = (await file.read()).decode("utf-8", errors="ignore")
    elif html_text:
        content = html_text
    else:
        raise HTTPException(status_code=400, detail="Please upload an HTML file or provide HTML content")

    out_path = ToolsService.html_to_pdf(content)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── PDF TO PDF/A ─────────────────────────────────────────────────────────────

@router.post("/pdf-to-pdfa")
async def pdf_to_pdfa(
    request: Request,
    file: UploadFile = File(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.pdf_to_pdfa(file_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── GRAYSCALE PDF ────────────────────────────────────────────────────────────

@router.post("/grayscale")
async def grayscale_pdf(
    request: Request,
    file: UploadFile = File(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    out_path = ToolsService.grayscale_pdf(file_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── REDACT PDF ───────────────────────────────────────────────────────────────

@router.post("/redact")
async def redact_pdf(
    request: Request,
    file: UploadFile = File(...),
    search_terms: str = Form(...),
    _rl=Depends(check_rate_limit),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    validate_file_size(file, request)
    file_path = save_temp_file(file)

    terms = [t.strip() for t in search_terms.split(",") if t.strip()]
    if not terms:
        raise HTTPException(status_code=400, detail="Please provide at least one search term or text to redact")

    out_path = ToolsService.redact_pdf(file_path, terms)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── COMPARE PDF ──────────────────────────────────────────────────────────────

@router.post("/compare")
async def compare_pdf(
    request: Request,
    files: List[UploadFile] = File(...),
    _rl=Depends(check_rate_limit),
):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Please provide 2 PDF documents to compare")
    for f in files[:2]:
        if not f.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Both files must be PDF documents")
        validate_file_size(f, request)

    f1_path = save_temp_file(files[0])
    f2_path = save_temp_file(files[1])

    out_path = ToolsService.compare_pdf(f1_path, f2_path)
    file_id = os.path.basename(out_path)
    return {
        "status": "completed",
        "result": {
            "download_url": f"/api/tools/download/{file_id}",
            "file_name": file_id,
            "processed_size": os.path.getsize(out_path),
        }
    }

# ─── OCR PDF ──────────────────────────────────────────────────────────────────

@router.post("/ocr")
async def ocr_pdf(
    request: Request,
    file: UploadFile = File(...),
    language: Optional[str] = Form("eng"),
    force_ocr: Optional[bool] = Form(False),
    output_format: Optional[str] = Form("pdf"),
    async_mode: Optional[bool] = Form(None),
    _rl=Depends(check_rate_limit),
):
    fname = file.filename.lower()
    allowed_exts = (".pdf", ".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".tif")
    if not any(fname.endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and Image files (.png, .jpg, .jpeg, .webp, .tiff) are allowed for OCR"
        )

    size = validate_file_size(file, request)
    file_path = save_temp_file(file)

    page_count = 1
    if fname.endswith(".pdf"):
        try:
            doc = fitz.open(file_path)
            page_count = len(doc)
            doc.close()
        except Exception:
            page_count = 1

    is_heavy = size >= 8 * 1024 * 1024 or page_count > 4
    should_run_async = async_mode is True or (async_mode is None and is_heavy)

    if should_run_async:
        job_id = f"job_ocr_{uuid.uuid4().hex}"
        job_store.create_job(job_id, "ocr", file.filename)

        def run_async():
            try:
                job_store.update_progress(job_id, 10, "Extracting text layers and running OCR...")
                out_path = ToolsService.ocr_pdf_task(
                    file_path,
                    language=language or "eng",
                    force_ocr=force_ocr or False,
                    output_format=output_format or "pdf",
                    progress_callback=lambda p: job_store.update_progress(job_id, p, "Recognizing text and building searchable document...")
                )
                file_id = os.path.basename(out_path)
                result = {
                    "download_url": f"/api/tools/download/{file_id}",
                    "file_name": file_id,
                    "processed_size": os.path.getsize(out_path),
                    "page_count": page_count,
                    "output_format": output_format,
                }
                job_store.set_completed(job_id, result)
            except Exception as e:
                job_store.set_failed(job_id, str(e))

        job_store.submit_task(run_async)
        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={
                "job_id": job_id,
                "status": "processing",
                "poll_url": f"/api/tools/jobs/{job_id}",
                "estimated_seconds": max(4, page_count * 2),
            }
        )
    else:
        out_path = ToolsService.ocr_pdf_task(
            file_path,
            language=language or "eng",
            force_ocr=force_ocr or False,
            output_format=output_format or "pdf"
        )
        file_id = os.path.basename(out_path)
        return {
            "status": "completed",
            "result": {
                "download_url": f"/api/tools/download/{file_id}",
                "file_name": file_id,
                "processed_size": os.path.getsize(out_path),
                "output_format": output_format,
            }
        }

