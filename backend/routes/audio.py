from fastapi import APIRouter, UploadFile, File, HTTPException
from birdnetlib import Recording
from birdnetlib.analyzer import Analyzer
import tempfile
import os

router = APIRouter()

# Load BirdNET analyzer once at startup
print("🔄 Loading BirdNET analyzer...")
analyzer = Analyzer()
print("✅ BirdNET loaded successfully")

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB

@router.post("/audio/identify")
async def identify_bird_audio(file: UploadFile = File(...)):
    """
    Upload a bird audio file (.mp3 or .wav) and get species predictions.
    """
    # Validate file type
    allowed = ["audio/mpeg", "audio/wav", "audio/mp3",
               "audio/x-wav", "audio/wave", "application/octet-stream"]
    filename = file.filename.lower()
    if not (filename.endswith('.mp3') or filename.endswith('.wav')):
        raise HTTPException(
            status_code=400,
            detail="Only .mp3 and .wav audio files are supported"
        )

    # Read file
    audio_bytes = await file.read()
    if len(audio_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 20MB.")

    # Save to temp file (BirdNET needs a file path)
    suffix = '.mp3' if filename.endswith('.mp3') else '.wav'
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        # Run BirdNET analysis
        recording = Recording(
            analyzer,
            tmp_path,
            lat=17.385044,    # Default: Hyderabad coordinates
            lon=78.486671,
            date=None,
            min_conf=0.15,    # Minimum confidence threshold
        )
        recording.analyze()

        detections = recording.detections

        if not detections:
            return {
                "success":    True,
                "filename":   file.filename,
                "detections": [],
                "message":    "No bird species detected. Try a clearer recording with less background noise.",
                "top_species": None,
            }

        # Format results
        results = []
        for d in detections[:8]:   # Top 8 detections
            results.append({
                "species":        d["common_name"],
                "scientific_name": d["scientific_name"],
                "confidence":     round(d["confidence"] * 100, 2),
                "start_time":     round(d.get("start_time", 0), 1),
                "end_time":       round(d.get("end_time", 3), 1),
            })

        # Sort by confidence
        results.sort(key=lambda x: x["confidence"], reverse=True)

        return {
            "success":     True,
            "filename":    file.filename,
            "detections":  results,
            "top_species": results[0]["species"] if results else None,
            "top_confidence": results[0]["confidence"] if results else 0,
            "total_detections": len(results),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {str(e)}")

    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)