# 🌿 AI Powered Biodiversity Conservation Assistant

> Final Year B.Tech Project | CSE (AI & ML) | JNTUH | 2026–27  
> Guide: Mr. Allamaprabhu Swamy, Assistant Professor

## 🔴 Live Demo
Coming soon on Hugging Face Spaces

## 📌 About
An AI-powered full-stack web application for real-time species identification,
conservation status lookup, and geospatial biodiversity tracking.

## ✨ Features
- 🔍 **Species Identification** — BioCLIP (CVPR 2024 Best Paper) with 96%+ accuracy
- 🔴 **IUCN Conservation Status** — Real-time Red List lookup
- 🗺️ **Biodiversity Map** — Live sighting map with Leaflet.js
- 📸 **Image Upload** — Drag & drop interface

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| AI Model | BioCLIP (ViT, imageomics/bioclip) |
| Backend | Python 3.13 + FastAPI |
| Frontend | React 18 + Tailwind CSS |
| Database | SQLite |
| Maps | Leaflet.js |
| Conservation Data | IUCN Red List API |

## 🚀 Run Locally

### Backend
```bash
cd bio-conserv-assist
python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 👨‍💻 Team
- Mohammed Abdul Muqeeth
- Mohammed Moid Sufiyan  
- Mohammed Shakeeb

## 📚 Key References
1. Stevens et al., "BioCLIP", CVPR 2024
2. Velasco-Montero et al., Ecological Informatics, 2024
3. Müller et al., Nature Communications, 2023