from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events."""
    # ── Startup ───────────────────────────────────────────────
    # Create uploads directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    print("🚀 Career Portal API starting up...")
    print(f"📁 Upload directory: {settings.UPLOAD_DIR}")
    
    yield  # App runs here — handles requests
    
    # ── Shutdown ──────────────────────────────────────────────
    print("👋 Career Portal API shutting down...")



app = FastAPI(
    title="Career Portal API",
    description="Web-Based Student Career Development and Job Portal",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",         # Swagger UI
    redoc_url="/redoc",       # ReDoc (alternative docs)
    openapi_url="/openapi.json",
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files as static files
# e.g., GET /uploads/resumes/file.pdf
# NOTE: StaticFiles validates the directory at import time, so we must
# create it here (before mount) rather than relying on the lifespan event.
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# ── Health Check Endpoint ─────────────────────────────────────
@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint — confirms the API is running."""
    return {
        "status": "healthy",
        "message": "🎓 Career Portal API is running!",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/api/health", tags=["Health"])
async def api_health():
    """API-prefixed health check for frontend connectivity tests."""
    return {"status": "ok"}

# ── API Routers ───────────────────────────────────────────────
from app.routers import auth, jobs, applications, uploads, users
from app.routers.auth import router as auth_router
from app.routers.jobs import router as jobs_router, company_router, me_router
from app.routers.applications import router as applications_router
from app.routers.uploads import router as uploads_router

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")
app.include_router(company_router, prefix="/api")
app.include_router(me_router, prefix="/api")
app.include_router(applications_router, prefix="/api")
app.include_router(uploads_router, prefix="/api")
