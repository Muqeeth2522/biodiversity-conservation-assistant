import requests
import os
from PIL import Image
import io

# On Render server — uses HF API (not blocked there)
# On local machine — set HF_TOKEN env variable
HF_API_URL = "https://api-inference.huggingface.co/models/imageomics/bioclip"
HF_TOKEN   = os.getenv("HF_TOKEN", "")
HEADERS    = {"Authorization": f"Bearer {HF_TOKEN}"}

def validate_image(image_bytes: bytes) -> bool:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        return True
    except Exception:
        return False

def classify_species(image_bytes: bytes) -> dict:
    try:
        response = requests.post(
            HF_API_URL,
            headers=HEADERS,
            data=image_bytes,
            timeout=30
        )

        if response.status_code == 200:
            results = response.json()
            predictions = []
            for item in results[:5]:
                predictions.append({
                    "species":    item.get("label", "Unknown"),
                    "confidence": round(item.get("score", 0) * 100, 2),
                })
            return {
                "success":        True,
                "predictions":    predictions,
                "top_species":    predictions[0]["species"] if predictions else "Unknown",
                "top_confidence": predictions[0]["confidence"] if predictions else 0,
            }
        elif response.status_code == 503:
            return {
                "success": False,
                "error":   "Model loading, please retry in 20 seconds",
                "predictions": []
            }
        else:
            return {
                "success": False,
                "error":   f"API error: {response.status_code}",
                "predictions": []
            }
    except Exception as e:
        return {"success": False, "error": str(e), "predictions": []}