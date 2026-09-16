from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

@router.post("/audio/identify")
async def identify_bird_audio():
    """
    BirdNET audio identification is available in the local version only.
    Requires TensorFlow which exceeds free hosting memory limits.
    """
    raise HTTPException(
        status_code=503,
        detail="Audio identification is available in the local development version. "
               "The deployed version supports image identification only due to memory constraints."
    )