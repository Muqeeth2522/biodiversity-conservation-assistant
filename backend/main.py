from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.db import init_db
from backend.routes import predict, conservation, sightings, chatbot, audio

app = FastAPI(
    title       = "AI Biodiversity Conservation Assistant",
    description = "Real-time species identification and conservation status API",
    version     = "1.0.0",
    docs_url    = "/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins  = ["http://localhost:3000", "http://localhost:5173"],
    allow_methods  = ["*"],
    allow_headers  = ["*"],
)

app.include_router(predict.router,      prefix="/api", tags=["Species Prediction"])
app.include_router(conservation.router, prefix="/api", tags=["Conservation Status"])
app.include_router(sightings.router,    prefix="/api", tags=["Sightings"])
app.include_router(chatbot.router,      prefix="/api", tags=["Conservation Chatbot"])
app.include_router(audio.router,        prefix="/api", tags=["Bird Audio ID"])

@app.on_event("startup")
async def startup_event():
    init_db()
    print("🌿 Biodiversity Conservation Assistant API is running!")
    print("📖 API Docs: http://localhost:8000/docs")

@app.get("/")
async def root():
    return {
        "message":  "🌿 AI Biodiversity Conservation Assistant",
        "status":   "running",
        "version":  "1.0.0",
        "author":   "Mohammed Abdul Muqeeth | Muqeeth2522",
        "docs":     "http://localhost:8000/docs",
        "endpoints": {
            "predict":      "POST /api/predict",
            "conservation": "GET  /api/conservation/{species_name}",
            "sightings":    "GET  /api/sightings",
            "map":          "GET  /api/sightings/map",
            "chat":         "POST /api/chat",
            "audio":        "POST /api/audio/identify",
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "api": "Biodiversity Conservation Assistant v1.0"}