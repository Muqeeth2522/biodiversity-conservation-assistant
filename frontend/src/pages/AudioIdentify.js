import React, { useState, useRef } from 'react';

const API = process.env.NODE_ENV === 'production'
  ? 'https://biodiversity-api.onrender.com/api'
  : 'http://localhost:8000/api';
const styles = {
  page: { minHeight: '90vh', padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' },
  subtitle: { color: '#81c784', marginBottom: '2rem' },
  uploadBox: {
    border: '2px dashed #1565c0', borderRadius: '16px', padding: '3rem',
    textAlign: 'center', cursor: 'pointer',
    background: 'rgba(21,101,192,0.05)', marginBottom: '1.5rem',
  },
  uploadIcon: { fontSize: '3.5rem', marginBottom: '1rem' },
  uploadText: { color: '#90caf9', fontSize: '1rem' },
  fileName: {
    background: 'rgba(21,101,192,0.15)',
    border: '1px solid #1565c0', borderRadius: '10px',
    padding: '10px 16px', color: '#90caf9',
    marginBottom: '1rem', fontSize: '0.9rem',
  },
  analyzeBtn: {
    background: 'linear-gradient(135deg, #1565c0, #1976d2)',
    color: '#fff', border: 'none', padding: '12px 32px',
    borderRadius: '30px', fontSize: '1rem', fontWeight: '600',
    cursor: 'pointer', width: '100%', marginBottom: '1.5rem',
  },
  resultsBox: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(21,101,192,0.4)',
    borderRadius: '16px', padding: '1.5rem',
  },
  topResult: { fontSize: '1.4rem', fontWeight: '700', color: '#64b5f6', marginBottom: '0.3rem' },
  sciName:   { color: '#90caf9', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1rem' },
  detRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  detInfo:  { flex: 1 },
  detName:  { color: '#e3f2fd', fontSize: '0.95rem', fontWeight: '500' },
  detSci:   { color: '#90caf9', fontSize: '0.8rem', fontStyle: 'italic' },
  detTime:  { color: '#64b5f6', fontSize: '0.78rem', marginTop: '2px' },
  bar: (pct) => ({
    height: '5px', borderRadius: '3px', marginTop: '4px',
    background: `linear-gradient(90deg, #1976d2 ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
  }),
  confBadge: {
    color: '#64b5f6', fontWeight: '700',
    fontSize: '0.9rem', marginLeft: '1rem',
  },
  tipBox: {
    background: 'rgba(21,101,192,0.1)',
    border: '1px solid rgba(21,101,192,0.3)',
    borderRadius: '12px', padding: '1rem',
    marginBottom: '1.5rem',
  },
  tipTitle: { color: '#64b5f6', fontWeight: '600', marginBottom: '0.5rem' },
  tipText:  { color: '#90caf9', fontSize: '0.88rem', lineHeight: 1.6 },
  errorBox: {
    background: 'rgba(183,28,28,0.15)', border: '1px solid #c62828',
    borderRadius: '12px', padding: '1rem', color: '#ef9a9a',
  },
  noDetect: { textAlign: 'center', color: '#90caf9', padding: '2rem' },
  sampleBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(46,125,50,0.3)',
    borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem',
  },
  sampleTitle: { color: '#66bb6a', fontWeight: '600', marginBottom: '0.5rem' },
  sampleLink:  { color: '#81c784', fontSize: '0.88rem', lineHeight: 1.8 },
};

export default function AudioIdentify() {
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res  = await fetch(`${API}/audio/identify`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Analysis failed');
      setResult(data);
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🎵 Bird Audio Identification</h1>
      <p style={styles.subtitle}>Upload a bird sound recording to identify the species using BirdNET AI</p>

      {/* Sample recordings tip */}
      <div style={styles.sampleBox}>
        <div style={styles.sampleTitle}>🔗 Get Free Bird Recordings for Testing</div>
        <div style={styles.sampleLink}>
          👉 Visit <strong>xeno-canto.org</strong> → search any bird → download .mp3<br/>
          👉 Or use the Cornell Lab's <strong>Macaulay Library</strong> at macaulaylibrary.org<br/>
          👉 Search "bird sound free download" on Google for quick test files
        </div>
      </div>

      {/* Tips */}
      <div style={styles.tipBox}>
        <div style={styles.tipTitle}>💡 Tips for Best Results</div>
        <div style={styles.tipText}>
          • Use recordings with clear bird calls and minimal background noise<br/>
          • .mp3 and .wav formats supported — max 20MB<br/>
          • Recordings of 3–30 seconds work best<br/>
          • BirdNET is trained on 6,000+ bird species worldwide
        </div>
      </div>

      {/* Upload box */}
      <div
        style={styles.uploadBox}
        onClick={() => fileRef.current.click()}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        onDragOver={(e) => e.preventDefault()}
      >
        <div style={styles.uploadIcon}>🎵</div>
        <div style={styles.uploadText}>
          Click to upload or drag & drop a bird sound recording<br/>
          <small style={{ color: '#64b5f6' }}>.mp3 or .wav — max 20MB</small>
        </div>
        <input
          ref={fileRef} type="file"
          accept=".mp3,.wav,audio/mpeg,audio/wav"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* File name display */}
      {file && (
        <div style={styles.fileName}>
          🎵 Selected: <strong>{file.name}</strong> ({(file.size/1024/1024).toFixed(2)} MB)
        </div>
      )}

      {/* Analyze button */}
      {file && (
        <button style={styles.analyzeBtn} onClick={analyze} disabled={loading}>
          {loading ? '⏳ Analyzing with BirdNET AI...' : '🔍 Identify Bird Species'}
        </button>
      )}

      {/* Error */}
      {error && <div style={styles.errorBox}>⚠️ {error}</div>}

      {/* Results */}
      {result && (
        <div style={styles.resultsBox}>
          {result.detections.length === 0 ? (
            <div style={styles.noDetect}>
              🔇 No bird species detected in this recording.<br/>
              <small>Try a clearer recording with less background noise.</small>
            </div>
          ) : (
            <>
              <div style={styles.topResult}>🐦 {result.top_species}</div>
              <div style={styles.sciName}>
                {result.detections[0]?.scientific_name} — {result.top_confidence}% confidence
              </div>
              <div style={{ color: '#90caf9', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {result.total_detections} detection(s) found in recording
              </div>

              {result.detections.map((d, i) => (
                <div key={i} style={styles.detRow}>
                  <div style={styles.detInfo}>
                    <div style={styles.detName}>🐦 {d.species}</div>
                    <div style={styles.detSci}>{d.scientific_name}</div>
                    <div style={styles.detTime}>
                      ⏱ {d.start_time}s – {d.end_time}s
                    </div>
                    <div style={styles.bar(d.confidence)} />
                  </div>
                  <div style={styles.confBadge}>{d.confidence}%</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}