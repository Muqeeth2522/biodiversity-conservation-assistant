import React from 'react';

const styles = {
  hero: {
    minHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem',
    background: 'radial-gradient(ellipse at center, #1a3a1a 0%, #0f1a0f 70%)',
  },
  badge: {
    background: 'rgba(46,125,50,0.3)',
    border: '1px solid #2e7d32',
    color: '#81c784',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
    display: 'inline-block',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '700',
    color: '#fff',
    lineHeight: 1.2,
    marginBottom: '1rem',
    maxWidth: '800px',
  },
  highlight: {
    color: '#66bb6a',
  },
  subtitle: {
    fontSize: '1.15rem',
    color: '#a5d6a7',
    maxWidth: '600px',
    lineHeight: 1.7,
    marginBottom: '2.5rem',
  },
  btnRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '4rem',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(46,125,50,0.5)',
    transition: 'transform 0.2s',
  },
  secondaryBtn: {
    background: 'transparent',
    color: '#81c784',
    border: '1px solid #2e7d32',
    padding: '14px 32px',
    borderRadius: '30px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cardsRow: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '1000px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(46,125,50,0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    width: '200px',
    textAlign: 'center',
  },
  cardIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  cardTitle: { color: '#fff', fontWeight: '600', marginBottom: '0.4rem' },
  cardDesc: { color: '#81c784', fontSize: '0.85rem', lineHeight: 1.5 },
};

const features = [
  { icon: '📸', title: 'Image ID',    desc: 'Upload any photo to identify species instantly' },
  { icon: '🎵', title: 'Audio ID',    desc: 'Identify birds and wildlife from sound recordings' },
  { icon: '🔴', title: 'IUCN Status', desc: 'Real-time conservation status from IUCN Red List' },
  { icon: '🗺️', title: 'Live Map',    desc: 'Track and map biodiversity sightings globally' },
];

export default function Home({ setPage }) {
  return (
    <div style={styles.hero}>
      <div style={styles.badge}>🌿 Powered by BioCLIP · CVPR 2024 Best Paper</div>
      <h1 style={styles.title}>
        AI-Powered <span style={styles.highlight}>Biodiversity</span><br/>
        Conservation Assistant
      </h1>
      <p style={styles.subtitle}>
        Identify 450,000+ species from images and audio in real-time.
        Check conservation status, map sightings, and contribute to
        global biodiversity data — all in one platform.
      </p>
      <div style={styles.btnRow}>
        <button style={styles.primaryBtn} onClick={() => setPage('identify')}>
          🔍 Identify a Species
        </button>
        <button style={styles.secondaryBtn} onClick={() => setPage('map')}>
          🗺️ View Biodiversity Map
        </button>
      </div>
      <div style={styles.cardsRow}>
        {features.map((f, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardIcon}>{f.icon}</div>
            <div style={styles.cardTitle}>{f.title}</div>
            <div style={styles.cardDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}