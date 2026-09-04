import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "biodiversity.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sightings (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            species     TEXT NOT NULL,
            confidence  REAL,
            latitude    REAL,
            longitude   REAL,
            location    TEXT,
            reported_by TEXT,
            image_path  TEXT,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
    print("✅ Database initialized")