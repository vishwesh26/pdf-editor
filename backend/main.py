import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import pdf, webhook, tools, contact

app = FastAPI(title="PustakEdits API")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Server error: {str(exc)}"},
    )

@app.middleware("http")
async def add_rate_limit_headers(request: Request, call_next):
    try:
        response: Response = await call_next(request)
        if hasattr(request.state, "rate_limit"):
            response.headers["X-RateLimit-Limit"] = str(request.state.rate_limit)
            response.headers["X-RateLimit-Remaining"] = str(request.state.rate_remaining)
            response.headers["X-RateLimit-Reset"] = str(request.state.rate_reset)
        return response
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(exc)}"}
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://pdfeditor-one.vercel.app",
        "https://pustakedit.vercel.app",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset", "Content-Disposition"],
)

app.include_router(pdf.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(webhook.router, prefix="/api/webhook", tags=["Webhooks"])
app.include_router(tools.router, prefix="/api/tools", tags=["Tools"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])

@app.api_route("/", methods=["GET", "HEAD"])
async def read_root():
    return {"status": "ok", "message": "PustakEdits API is running"}

