import os
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.config import settings
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(tags=["Uploads"])

@router.post("/upload", response_model=dict, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a file (e.g., resume or company logo) to the server.
    Returns the URL to access the file.
    """
    # Simple validation: ensure it's a PDF or an image
    allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and images (JPG, PNG, WEBP) are allowed.",
        )

    # Validate file size by reading chunks, but FastAPI doesn't provide a direct size easily without reading.
    # Alternatively, just save it and rely on web server limits, but here we just do a simple save.
    
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )

    # Return the URL path
    file_url = f"/uploads/{unique_filename}"
    return {"url": file_url}
