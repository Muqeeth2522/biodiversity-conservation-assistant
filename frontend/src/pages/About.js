import React from 'react';

const styles = {
  page:  { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' },
  sub:   { color: '#81c784', marginBottom: '2rem' },
  card:  {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(46,125,50,0.3)',
    borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
  },
  cardTitle: { color: '#66bb6a', fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.75rem' },
  text:      { color: '#a5d6a7', lineHeight: 1.7 },
  teamCard:  {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  avatar:    {
    width: '45px', height: '45px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem', flexShrink: 0,
  },
  memberName:  { color: '#fff', fontWeight: '600' },
  memberRole:  { color: '#81c784', fontSize: '0.85rem' },
};

const team = [
  { name: 'Mohammed Abdul Muqeeth', role: 'AI/ML & Backend', emoji: '🤖' },
  { name: 'Mohammed Moid Sufiyan',  role: 'Frontend & UI/UX', emoji: '🎨' },
  { name: 'Mohammed Shakeeb',       role: 'Data & Testing', emoji: '📊' },
];

const stack = [
  ['BioCLIP (CVPR 2024)', 'Vision Transformer for species identification'],
  ['BirdNET', 'Audio-based bird species detection by Cornell Lab'],
  ['FastAPI', 'High-performance Python backend framework'],
  ['React 18', 'Modern JavaScript frontend library'],
  ['IUCN Red List API', 'Real-time conservation status data'],
  ['Leaflet.js', 'Interactive biodiversity mapping'],
];

export default function About() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>ℹ️ About This Project</h1>
      <p style={styles.sub}>
        Final Year B.Tech Project — CSE (AI & ML) | JNTUH | 2026–27
      </p>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🎯 Project Mission</div>
        <p style={styles.text}>
          The AI Powered Biodiversity Conservation Assistant addresses the urgent challenge
          of global biodiversity loss by providing an intelligent, accessible platform for
          real-time species identification, conservation status monitoring, and geospatial
          biodiversity tracking — empowering researchers, conservationists, and citizen
          scientists worldwide.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>👨‍💻 Our Team </div>
        {team.map((m, i) => (
          <div key={i} style={styles.teamCard}>
            <div style={styles.avatar}>{m.emoji}</div>
            <div>
              <div style={styles.memberName}>{m.name}</div>
              <div style={styles.memberRole}>{m.role}</div>
            </div>
          </div>
        ))}
        <div style={{...styles.teamCard, borderBottom:'none'}}>
          <div style={styles.avatar}>👨‍🏫</div>
          <div>
            <div style={styles.memberName}>Mr. Allamaprabhu Swamy</div>
            <div style={styles.memberRole}>Project Guide — Assistant Professor</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🛠️ Technology Stack</div>
        {stack.map(([tech, desc], i) => (
          <div key={i} style={{padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
            <span style={{color:'#66bb6a', fontWeight:'600'}}>{tech}</span>
            <span style={{color:'#a5d6a7'}}> — {desc}</span>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🔗 Links</div>
        <p style={styles.text}>
          GitHub: <a href="https://github.com/Muqeeth2522/biodiversity-conservation-assistant"
            style={{color:'#66bb6a'}} target="_blank" rel="noreferrer">
            github.com/Muqeeth2522/biodiversity-conservation-assistant
          </a>
        </p>
      </div>
    </div>
  );
}