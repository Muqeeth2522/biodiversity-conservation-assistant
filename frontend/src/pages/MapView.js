import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:       require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:     require('leaflet/dist/images/marker-shadow.png'),
});

const API = process.env.NODE_ENV === 'production'
  ? 'https://biodiversity-api.onrender.com/api'
  : 'http://localhost:8000/api';
const styles = {
  page:  { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' },
  sub:   { color: '#81c784', marginBottom: '1.5rem' },
  mapWrap: { borderRadius: '16px', overflow: 'hidden', border: '1px solid #2e7d32', height: '500px' },
  statsRow: {
    display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap',
  },
  statCard: {
    background: 'rgba(46,125,50,0.1)',
    border: '1px solid rgba(46,125,50,0.3)',
    borderRadius: '12px', padding: '1rem 1.5rem', flex: 1, minWidth: '150px',
  },
  statNum:   { fontSize: '1.8rem', fontWeight: '700', color: '#66bb6a' },
  statLabel: { color: '#a5d6a7', fontSize: '0.85rem' },
};

export default function MapView() {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch(`${API}/sightings/map`)
      .then(r => r.json())
      .then(d => { setSightings(d.sightings || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const uniqueSpecies = [...new Set(sightings.map(s => s.species))].length;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🗺️ Biodiversity Map</h1>
      <p style={styles.sub}>Live sightings reported by users around the world</p>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{sightings.length}</div>
          <div style={styles.statLabel}>Total Sightings</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{uniqueSpecies}</div>
          <div style={styles.statLabel}>Unique Species</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum}>🌍</div>
          <div style={styles.statLabel}>Global Coverage</div>
        </div>
      </div>

      {loading ? (
        <div style={{color:'#81c784', textAlign:'center', padding:'3rem'}}>
          Loading map data...
        </div>
      ) : (
        <div style={styles.mapWrap}>
          <MapContainer
            center={[20, 0]} zoom={2}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sightings.map(s => (
              s.latitude && s.longitude &&
              <Marker key={s.id} position={[s.latitude, s.longitude]}>
                <Popup>
                  <strong>{s.species}</strong><br/>
                  Confidence: {s.confidence}%<br/>
                  Location: {s.location || 'Unknown'}<br/>
                  Reported by: {s.reported_by}<br/>
                  <small>{new Date(s.created_at).toLocaleDateString()}</small>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}