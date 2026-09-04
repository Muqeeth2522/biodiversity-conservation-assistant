import React, { useState, useRef } from 'react';

const API = 'http://localhost:8000/api';

const styles = {
  page: { minHeight: '90vh', padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' },
  subtitle: { color: '#81c784', marginBottom: '2rem' },
  uploadBox: {
    border: '2px dashed #2e7d32',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center',
    cursor: 'pointer',
    background: 'rgba(46,125,50,0.05)',
    transition: 'all 0.2s',
    marginBottom: '1.5rem',
  },
  uploadIcon: { fontSize: '3rem', marginBottom: '1rem' },
  uploadText: { color: '#a5d6a7', fontSize: '1rem' },
  previewImg: {
    maxWidth: '100%', maxHeight: '300px',
    borderRadius: '12px', marginBottom: '1rem',
    border: '1px solid #2e7d32',
  },
  predictBtn: {
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff', border: 'none',
    padding: '12px 32px', borderRadius: '30px',
    fontSize: '1rem', fontWeight: '600',
    cursor: 'pointer', width: '100%',
    marginBottom: '1.5rem',
  },
  resultsBox: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(46,125,50,0.3)',
    borderRadius: '16px', padding: '1.5rem',
  },
  topResult: {
    fontSize: '1.4rem', fontWeight: '700',
    color: '#66bb6a', marginBottom: '0.5rem',
  },
  confidence: { color: '#a5d6a7', marginBottom: '1rem' },
  predRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  bar: (pct) => ({
    height: '6px', borderRadius: '3px',
    background: `linear-gradient(90deg, #2e7d32 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
    marginTop: '4px',
  }),
  statusBox: (code) => ({
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    marginTop: '1rem',
    background: code === 'LC' ? 'rgba(46,125,50,0.2)' :
                code === 'EN' || code === 'CR' ? 'rgba(183,28,28,0.2)' :
                'rgba(255,255,255,0.05)',
    border: `1px solid ${code === 'LC' ? '#2e7d32' : code === 'EN' || code === 'CR' ? '#c62828' : '#555'}`,
  }),
  errorBox: {
    background: 'rgba(183,28,28,0.15)',
    border: '1px solid #c62828',
    borderRadius: '12px', padding: '1rem',
    color: '#ef9a9a',
  },
};

export default function Identify() {
  const [image, setImage]         = useState(null);
  const [preview, setPreview]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [conservation, setConservation] = useState(null);
  const [error, setError]         = useState(null);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setConservation(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const predict = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', image);
      const res = await fetch(`${API}/predict`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Prediction failed');
      setResult(data);
      // Auto-fetch conservation status for top species
      const speciesName = data.top_species.split(' ').slice(0,2).join(' ');
      fetchConservation(speciesName);
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchConservation = async (species) => {
    try {
      const res  = await fetch(`${API}/conservation/${encodeURIComponent(species)}`);
      const data = await res.json();
      setConservation(data);
    } catch(e) { /* silent */ }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🔍 Species Identification</h1>
      <p style={styles.subtitle}>Upload an image to identify the species using BioCLIP AI</p>

      {/* Upload Box */}
      <div
        style={styles.uploadBox}
        onClick={() => fileRef.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview
          ? <img src={preview} alt="preview" style={styles.previewImg} />
          : <>
              <div style={styles.uploadIcon}>📸</div>
              <div style={styles.uploadText}>
                Click to upload or drag & drop an image<br/>
                <small style={{color:'#66bb6a'}}>JPEG, PNG, WebP — max 10MB</small>
              </div>
            </>
        }
        <input
          ref={fileRef} type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" style={{display:'none'}}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Predict Button */}
      {image && (
        <button style={styles.predictBtn} onClick={predict} disabled={loading}>
          {loading ? '⏳ Analyzing with BioCLIP...' : '🔍 Identify Species'}
        </button>
      )}

      {/* Error */}
      {error && <div style={styles.errorBox}>⚠️ {error}</div>}

      {/* Results */}
      {result && (
        <div style={styles.resultsBox}>
          <div style={styles.topResult}>🌿 {result.top_species}</div>
          <div style={styles.confidence}>Confidence: {result.top_confidence}%</div>

          <div style={{marginBottom:'1rem'}}>
            {result.predictions.map((p, i) => (
              <div key={i} style={styles.predRow}>
                <div>
                  <div style={{color:'#e8f5e9', fontSize:'0.9rem'}}>{p.species}</div>
                  <div style={styles.bar(p.confidence)} />
                </div>
                <div style={{color:'#66bb6a', fontWeight:'600', marginLeft:'1rem'}}>
                  {p.confidence}%
                </div>
              </div>
            ))}
          </div>

          {/* Conservation Status */}
          {conservation && (
            <div style={styles.statusBox(conservation.status_code)}>
              <strong style={{color:'#fff'}}>
                {conservation.emoji} Conservation Status: {conservation.status}
              </strong>
              <p style={{color:'#a5d6a7', marginTop:'4px', fontSize:'0.9rem'}}>
                {conservation.description}
              </p>
              {conservation.family && (
                <p style={{color:'#81c784', fontSize:'0.85rem', marginTop:'4px'}}>
                  Family: {conservation.family} | Order: {conservation.order}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}