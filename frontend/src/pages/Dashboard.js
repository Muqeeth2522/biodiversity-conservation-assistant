import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';

const API = 'http://localhost:8000/api';

const COLORS = [
  '#66bb6a','#43a047','#2e7d32','#81c784',
  '#a5d6a7','#1b5e20','#388e3c','#4caf50'
];

const styles = {
  page:  { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' },
  sub:   { color: '#81c784', marginBottom: '2rem' },
  grid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: {
    background: 'rgba(46,125,50,0.1)',
    border: '1px solid rgba(46,125,50,0.3)',
    borderRadius: '16px', padding: '1.5rem',
  },
  statNum:   { fontSize: '2.2rem', fontWeight: '700', color: '#66bb6a' },
  statLabel: { color: '#a5d6a7', fontSize: '0.9rem', marginTop: '4px' },
  statIcon:  { fontSize: '1.8rem', marginBottom: '0.5rem' },
  chartBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(46,125,50,0.3)',
    borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
  },
  chartTitle: { color: '#66bb6a', fontWeight: '600', fontSize: '1.1rem', marginBottom: '1.2rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '10px 14px',
    background: 'rgba(46,125,50,0.2)',
    color: '#81c784', fontSize: '0.85rem',
    borderBottom: '1px solid rgba(46,125,50,0.3)',
  },
  td: {
    padding: '10px 14px', color: '#e8f5e9',
    fontSize: '0.9rem',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  badge: (conf) => ({
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
    background: conf >= 80 ? 'rgba(46,125,50,0.3)' : conf >= 50 ? 'rgba(255,152,0,0.2)' : 'rgba(183,28,28,0.2)',
    color:      conf >= 80 ? '#66bb6a'             : conf >= 50 ? '#ffa726'              : '#ef5350',
  }),
  empty: { textAlign: 'center', color: '#81c784', padding: '3rem', fontSize: '1rem' },
};

export default function Dashboard() {
  const [sightings, setSightings]   = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetch(`${API}/sightings`)
      .then(r => r.json())
      .then(d => { setSightings(d.sightings || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ── Derived stats ──────────────────────────────
  const totalSightings  = sightings.length;
  const uniqueSpecies   = [...new Set(sightings.map(s => s.species))].length;
  const avgConfidence   = totalSightings
    ? (sightings.reduce((a, b) => a + (b.confidence || 0), 0) / totalSightings).toFixed(1)
    : 0;
  const withLocation    = sightings.filter(s => s.latitude).length;

  // ── Species frequency for bar chart ──────────
  const speciesCount = sightings.reduce((acc, s) => {
    acc[s.species] = (acc[s.species] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(speciesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  // ── Pie chart data ────────────────────────────
  const pieData = barData.map((d, i) => ({
    name: d.name, value: d.count, fill: COLORS[i % COLORS.length]
  }));

  // ── Recent 10 sightings ───────────────────────
  const recent = [...sightings].slice(0, 10);

  if (loading) return (
    <div style={styles.page}>
      <div style={styles.empty}>⏳ Loading dashboard...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📊 Biodiversity Dashboard</h1>
      <p style={styles.sub}>Real-time statistics from all reported sightings</p>

      {/* ── Stats Grid ── */}
      <div style={styles.grid}>
        {[
          { icon:'🦎', num: totalSightings,       label: 'Total Sightings' },
          { icon:'🌿', num: uniqueSpecies,         label: 'Unique Species' },
          { icon:'🎯', num: `${avgConfidence}%`,  label: 'Avg AI Confidence' },
          { icon:'📍', num: withLocation,          label: 'Mapped Sightings' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statNum}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {totalSightings === 0 ? (
        <div style={styles.chartBox}>
          <div style={styles.empty}>
            🌿 No sightings yet.<br/>
            <small>Go to Identify → upload a photo → report it to the map!</small>
          </div>
        </div>
      ) : (
        <>
          {/* ── Bar Chart ── */}
          <div style={styles.chartBox}>
            <div style={styles.chartTitle}>🏆 Most Reported Species</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#a5d6a7', fontSize: 12 }}
                  angle={-35} textAnchor="end" interval={0}
                />
                <YAxis tick={{ fill: '#a5d6a7', fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#1a2e1a', border: '1px solid #2e7d32', borderRadius: '8px' }}
                  labelStyle={{ color: '#66bb6a' }}
                  itemStyle={{ color: '#a5d6a7' }}
                />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Pie Chart ── */}
          {pieData.length > 1 && (
            <div style={styles.chartBox}>
              <div style={styles.chartTitle}>🥧 Species Distribution</div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={100} label
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a2e1a', border: '1px solid #2e7d32', borderRadius: '8px' }}
                    itemStyle={{ color: '#a5d6a7' }}
                  />
                  <Legend wrapperStyle={{ color: '#a5d6a7' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── Recent Sightings Table ── */}
          <div style={styles.chartBox}>
            <div style={styles.chartTitle}>🕐 Recent Sightings</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['#','Species','Confidence','Location','Reported By','Date'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((s, i) => (
                    <tr key={s.id}>
                      <td style={styles.td}>{i + 1}</td>
                      <td style={{ ...styles.td, color: '#66bb6a', fontWeight: '600' }}>
                        🌿 {s.species}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badge(s.confidence)}>
                          {s.confidence ? `${s.confidence}%` : 'N/A'}
                        </span>
                      </td>
                      <td style={styles.td}>{s.location || '—'}</td>
                      <td style={styles.td}>{s.reported_by || 'Anonymous'}</td>
                      <td style={styles.td}>
                        {new Date(s.created_at).toLocaleDateString('en-IN', {
                          day:'2-digit', month:'short', year:'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}