from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.database.db import get_connection

router = APIRouter()

class SightingCreate(BaseModel):
    species:     str
    confidence:  Optional[float] = None
    latitude:    Optional[float] = None
    longitude:   Optional[float] = None
    location:    Optional[str]   = None
    reported_by: Optional[str]   = "Anonymous"
    image_path:  Optional[str]   = None

@router.post("/sightings")
async def create_sighting(sighting: SightingCreate):
    """Save a new species sighting to the database."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO sightings
                (species, confidence, latitude, longitude, location, reported_by, image_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            sighting.species, sighting.confidence,
            sighting.latitude, sighting.longitude,
            sighting.location, sighting.reported_by,
            sighting.image_path
        ))
        conn.commit()
        sighting_id = cursor.lastrowid
        conn.close()
        return {"success": True, "id": sighting_id, "message": "Sighting saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sightings")
async def get_all_sightings():
    """Get all sightings for the map."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM sightings ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()
        return {
            "success":  True,
            "count":    len(rows),
            "sightings": [dict(row) for row in rows]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sightings/map")
async def get_map_sightings():
    """Get sightings with coordinates only — for map display."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, species, confidence, latitude, longitude,
                   location, reported_by, created_at
            FROM sightings
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
            ORDER BY created_at DESC
        """)
        rows = cursor.fetchall()
        conn.close()
        return {"success": True, "sightings": [dict(row) for row in rows]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))