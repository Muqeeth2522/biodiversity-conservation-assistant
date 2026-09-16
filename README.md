# 🌿 AI Powered Biodiversity Conservation Assistant

![Live](https://img.shields.io/badge/Live-Online-brightgreen)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![React](https://img.shields.io/badge/React-18-61dafb)

> Final Year B.Tech Project | CSE (AI & ML) | JNTUH | 2026–27

## 🔴 Live Demo
| Service | URL |
|---|---|
| 🌐 **Frontend** | https://biodiversityconservationassistant.netlify.app |
| ⚡ **Backend API** | https://biodiversity-api.onrender.com |
| 📖 **API Docs** | https://biodiversity-api.onrender.com/docs |

## 📌 About
An AI-powered full-stack web application for real-time species
identification, conservation status lookup, and geospatial
biodiversity tracking — powered by BioCLIP (CVPR 2024 Best Paper)
and BirdNET by Cornell Lab.

## ✨ Features
- 📸 **Image Species ID** — BioCLIP ViT, 96.6% accuracy, 450K+ species
- 🎵 **Audio Bird ID** — BirdNET, 92.32% accuracy, 6000+ bird species
- 🔴 **IUCN Status** — Real-time Red List conservation lookup
- 🗺️ **Live Map** — Leaflet.js global sighting tracker
- 📊 **Dashboard** — Real-time biodiversity statistics
- 🤖 **AI Chatbot** — Llama 3.2 conservation assistant

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| AI Vision | BioCLIP (ViT-B/16, CVPR 2024) |
| AI Audio | BirdNET (Cornell Lab) |
| AI Chat | Llama 3.2 (Ollama, local) |
| Backend | Python 3.13 + FastAPI |
| Frontend | React 18 + Recharts + Leaflet.js |
| Database | SQLite |
| Deployment | Netlify + Render.com |

## 🚀 Run Locally
### Backend
```bash
cd bio-conserv-assist
venv\Scripts\activate
uvicorn backend.main:app --reload --port 8000
```
### Frontend
```bash
cd frontend
npm start
```
### Chatbot (Ollama)
```bash
ollama serve
```

## 👨‍💻 Team
| Name | Role |
|---|---|
| Mohammed Abdul Muqeeth | AI/ML & Backend |
| Mohammed Moid Sufiyan | Frontend & UI/UX |
| Mohammed Shakeeb | Data & Testing |

**Guide:** Mr. Allamaprabhu Swamy, Assistant Professor

## 📚 References
1. Stevens et al., "BioCLIP", IEEE/CVF CVPR 2024
2. Velasco-Montero et al., Ecological Informatics, Elsevier 2024
3. Müller et al., Nature Communications, Springer 2023