import React from 'react';

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#fff',
    cursor: 'pointer',
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
  },
  navBtn: (active) => ({
    background: active ? 'rgba(255,255,255,0.25)' : 'transparent',
    border: active ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: active ? '600' : '400',
    transition: 'all 0.2s',
  }),
};

const pages = [
  { key: 'home',     label: '🏠 Home' },
  { key: 'identify', label: '🔍 Identify' },
  { key: 'map',      label: '🗺️ Map' },
  { key: 'about',    label: 'ℹ️ About' },
];

export default function Navbar({ currentPage, setPage }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => setPage('home')}>
        🌿 BioDiversity AI
      </div>
      <div style={styles.navLinks}>
        {pages.map(p => (
          <button
            key={p.key}
            style={styles.navBtn(currentPage === p.key)}
            onClick={() => setPage(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </nav>
  );
}