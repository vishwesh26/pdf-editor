import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routers import pdf, webhook

app = FastAPI(title="PDFTextEdit Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://pdfeditor-one.vercel.app", "https://pustakedit.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(webhook.router, prefix="/api/webhook", tags=["Webhooks"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "PDFTextEdit Pro API is running"}
