from pathlib import Path

from dotenv import load_dotenv

# Load root .env before other imports read HF_TOKEN
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.db import init_db
from backend.routes import predict, conservation, sightings

# ── App setup ──────────────────────────────────────────
app = FastAPI(
    title       = "AI Biodiversity Conservation Assistant",
    description = "Real-time species identification and conservation status API",
    version     = "1.0.0",
    docs_url    = "/docs",    # Swagger UI — visit this in browser to test
)

# ── CORS — allows React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins  = ["http://localhost:3000", "http://localhost:5173"],
    allow_methods  = ["*"],
    allow_headers  = ["*"],
)

# ── Include all routes ──────────────────────────────────
app.include_router(predict.router,      prefix="/api", tags=["Species Prediction"])
app.include_router(conservation.router, prefix="/api", tags=["Conservation Status"])
app.include_router(sightings.router,    prefix="/api", tags=["Sightings"])

# ── Initialize database on startup ─────────────────────
@app.on_event("startup")
async def startup_event():
    init_db()
    print("🌿 Biodiversity Conservation Assistant API is running!")
    print("📖 API Docs: http://localhost:8000/docs")

# ── Health check ────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "message": "🌿 AI Biodiversity Conservation Assistant",
        "status":  "running",
        "version": "1.0.0",
        "author":  "Mohammed Abdul Muqeeth | Muqeeth2522",
        "docs":    "http://localhost:8000/docs",
        "endpoints": {
            "predict":      "POST /api/predict",
            "conservation": "GET  /api/conservation/{species_name}",
            "sightings":    "GET  /api/sightings",
            "map":          "GET  /api/sightings/map",
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "api": "Biodiversity Conservation Assistant v1.0"}