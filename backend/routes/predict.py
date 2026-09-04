from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.models.species_classifier import classify_species, validate_image

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024   # 10 MB

@router.post("/predict")
async def predict_species(file: UploadFile = File(...)):
    """
    Upload an image → get species prediction from BioCLIP.
    """
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/jpg"]:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP images are supported"
        )

    # Read image bytes
    image_bytes = await file.read()

    # Validate file size
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Image too large. Max 10MB.")

    # Validate it's a real image
    if not validate_image(image_bytes):
        raise HTTPException(status_code=400, detail="Invalid or corrupted image file.")

    # Run BioCLIP classification
    result = classify_species(image_bytes)

    if not result["success"]:
        raise HTTPException(status_code=503, detail=result.get("error", "Classification failed"))

    return {
        "success":        True,
        "filename":       file.filename,
        "top_species":    result["top_species"],
        "top_confidence": result["top_confidence"],
        "predictions":    result["predictions"],
    }