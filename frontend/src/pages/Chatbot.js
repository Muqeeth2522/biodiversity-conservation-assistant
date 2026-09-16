import React, { useState, useRef, useEffect } from 'react';

const API = process.env.NODE_ENV === 'production'
  ? 'https://biodiversity-api.onrender.com/api'
  : 'http://localhost:8000/api';
const styles = {
  page: {
    minHeight: '90vh', padding: '2rem',
    maxWidth: '800px', margin: '0 auto',
    display: 'flex', flexDirection: 'column',
  },
  title:    { fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' },
  subtitle: { color: '#81c784', marginBottom: '1.5rem' },

  chatBox: {
    flex: 1, minHeight: '450px', maxHeight: '500px',
    overflowY: 'auto', padding: '1.5rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(46,125,50,0.3)',
    borderRadius: '16px', marginBottom: '1rem',
    display: 'flex', flexDirection: 'column', gap: '1rem',
  },

  // Message bubbles
  msgRow: (role) => ({
    display: 'flex',
    justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
  }),
  bubble: (role) => ({
    maxWidth: '75%', padding: '12px 16px',
    borderRadius: role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    background: role === 'user'
      ? 'linear-gradient(135deg, #2e7d32, #43a047)'
      : 'rgba(255,255,255,0.07)',
    border: role === 'user' ? 'none' : '1px solid rgba(46,125,50,0.3)',
    color: '#fff', fontSize: '0.95rem', lineHeight: 1.6,
  }),
  roleLabel: (role) => ({
    fontSize: '0.75rem', marginBottom: '4px',
    color: role === 'user' ? '#a5d6a7' : '#66bb6a',
    fontWeight: '600',
    textAlign: role === 'user' ? 'right' : 'left',
  }),

  // Typing indicator
  typingDot: {
    display: 'inline-block', width: '8px', height: '8px',
    borderRadius: '50%', background: '#66bb6a',
    margin: '0 2px', animation: 'bounce 1.2s infinite',
  },

  // Input area
  inputRow: {
    display: 'flex', gap: '0.75rem', alignItems: 'flex-end',
  },
  input: {
    flex: 1, padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(46,125,50,0.4)',
    borderRadius: '12px', color: '#fff',
    fontSize: '0.95rem', outline: 'none',
    resize: 'none', minHeight: '48px', maxHeight: '120px',
    fontFamily: 'Inter, sans-serif',
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff', border: 'none',
    padding: '12px 20px', borderRadius: '12px',
    fontSize: '1.1rem', cursor: 'pointer',
    height: '48px', minWidth: '52px',
    transition: 'transform 0.1s',
  },

  // Quick questions
  quickRow: {
    display: 'flex', gap: '0.5rem',
    flexWrap: 'wrap', marginBottom: '1rem',
  },
  quickBtn: {
    background: 'rgba(46,125,50,0.15)',
    border: '1px solid rgba(46,125,50,0.4)',
    color: '#81c784', padding: '6px 14px',
    borderRadius: '20px', fontSize: '0.82rem',
    cursor: 'pointer', transition: 'all 0.2s',
  },

  // Status bar
  statusBar: {
    display: 'flex', alignItems: 'center', gap: '8px',
    marginBottom: '0.75rem', fontSize: '0.82rem', color: '#81c784',
  },
  dot: (online) => ({
    width: '8px', height: '8px', borderRadius: '50%',
    background: online ? '#66bb6a' : '#ef5350',
    flexShrink: 0,
  }),
};

const QUICK_QUESTIONS = [
  "What is the most endangered animal?",
  "How does climate change affect biodiversity?",
  "What is the IUCN Red List?",
  "How can I help protect wildlife?",
  "What is habitat fragmentation?",
  "Which species went extinct recently?",
];

const WELCOME_MSG = {
  role: 'assistant',
  text: "🌿 Hello! I'm your AI Conservation Assistant. I can answer questions about wildlife, endangered species, habitats, and biodiversity conservation. What would you like to know?",
};

export default function Chatbot() {
  const [messages, setMessages]   = useState([WELCOME_MSG]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [ollamaOnline, setOllamaOnline] = useState(true);
  const bottomRef = useRef();

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const res  = await fetch(`${API}/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      setOllamaOnline(data.success);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.response,
      }]);
    } catch(e) {
      setOllamaOnline(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '⚠️ Could not connect to AI. Make sure Ollama is running.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🤖 Conservation Assistant</h1>
      <p style={styles.subtitle}>Ask anything about wildlife, species, and biodiversity conservation</p>

      {/* Status bar */}
      <div style={styles.statusBar}>
        <div style={styles.dot(ollamaOnline)} />
        <span>{ollamaOnline ? 'AI Online — Llama 3.2 running locally' : 'AI Offline — Start Ollama to chat'}</span>
      </div>

      {/* Quick questions */}
      <div style={styles.quickRow}>
        {QUICK_QUESTIONS.map((q, i) => (
          <button key={i} style={styles.quickBtn} onClick={() => sendMessage(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat box */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i}>
            <div style={styles.roleLabel(msg.role)}>
              {msg.role === 'user' ? 'You' : '🌿 Conservation AI'}
            </div>
            <div style={styles.msgRow(msg.role)}>
              <div style={styles.bubble(msg.role)}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div>
            <div style={styles.roleLabel('assistant')}>🌿 Conservation AI</div>
            <div style={styles.msgRow('assistant')}>
              <div style={styles.bubble('assistant')}>
                <span style={styles.typingDot} />
                <span style={styles.typingDot} />
                <span style={styles.typingDot} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputRow}>
        <textarea
          style={styles.input}
          placeholder="Ask about any species, habitat, or conservation topic... (Enter to send)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button
          style={styles.sendBtn}
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </div>

      {/* CSS for typing animation */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}