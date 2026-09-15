from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter()

OLLAMA_URL = "http://localhost:11434/api/generate"

SYSTEM_PROMPT = """You are an expert AI conservation assistant specializing in biodiversity, 
wildlife, and environmental conservation. You have deep knowledge of:
- Animal and plant species identification and biology
- IUCN Red List conservation status and endangered species
- Habitat loss, climate change impacts on biodiversity
- Wildlife conservation strategies and protected areas
- Ecosystem ecology and food chains
- Citizen science and biodiversity monitoring

Answer questions clearly, factually, and concisely. Focus on conservation and biodiversity topics.
If asked about a specific species, mention its conservation status if known.
Keep answers under 150 words unless the question requires more detail.
Always be encouraging about conservation efforts."""

class ChatRequest(BaseModel):
    message: str
    species_context: str = ""  # Optional: currently identified species

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Build prompt with optional species context
        context = ""
        if request.species_context:
            context = f"\n[Current species being discussed: {request.species_context}]"

        prompt = f"{SYSTEM_PROMPT}{context}\n\nUser: {request.message}\nAssistant:"

        response = requests.post(
            OLLAMA_URL,
            json={
                "model":  "llama3.2",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 200,
                }
            },
            timeout=60
        )

        if response.status_code == 200:
            data = response.json()
            answer = data.get("response", "").strip()
            return {
                "success": True,
                "response": answer,
                "model": "llama3.2"
            }
        else:
            return {
                "success": False,
                "response": "AI model is not available right now. Please ensure Ollama is running.",
            }

    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "response": "⚠️ Ollama is not running. Please start it by running 'ollama serve' in a terminal.",
        }
    except Exception as e:
        return {
            "success": False,
            "response": f"Error: {str(e)}",
        }