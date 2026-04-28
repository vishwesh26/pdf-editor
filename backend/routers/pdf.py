from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
import shutil
import os
import uuid
from typing import Dict, Any

from services.pdf_service import PDFService, UPLOAD_DIR
from services.models import UpdateTextRequest

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_id = uuid.uuid4().hex
    filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    is_scanned = PDFService.is_scanned(file_path)
    
    return {
        "file_id": filename,
        "is_scanned": is_scanned,
        "message": "File uploaded successfully"
    }

@router.get("/{file_id}/text-blocks")
async def get_text_blocks(file_id: str):
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        blocks = PDFService.extract_text_blocks(file_path)
        return {"pages": blocks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")

@router.post("/{file_id}/update-text")
async def update_pdf_text(file_id: str, request: UpdateTextRequest):
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        edits_dict = [edit.dict() for edit in request.edits]
        new_file_path = PDFService.update_text(file_path, edits_dict)
        new_file_id = os.path.basename(new_file_path)
        return {"new_file_id": new_file_id, "message": "PDF updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating text: {str(e)}")

def remove_file(path: str):
    if os.path.exists(path):
        os.remove(path)

@router.get("/{file_id}/download")
async def download_pdf(file_id: str, background_tasks: BackgroundTasks):
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    # Depending on requirements, we might want to schedule file deletion after download
    # background_tasks.add_task(remove_file, file_path)
    
    return FileResponse(
        path=file_path,
        filename=file_id.split("_", 1)[-1] if "_" in file_id else file_id,
        media_type="application/pdf"
    )
