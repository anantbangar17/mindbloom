import React, { useState } from 'react';

const affirmations = [
  "Progress, not perfection, is the goal.",
  "Your mind deserves rest as much as your body.",
  "Small steps still move you forward.",
  "You are more resilient than you realize.",
  "Today's effort is tomorrow's strength.",
];

function Journal({ affIdx, setAffIdx }) {
  const [entry, setEntry] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (entry.trim()) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem' }}>
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.5rem' }}>Daily journal</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
        Reflect on your day — writing is one of the most powerful tools for clarity.
      </p>
      <textarea
        value={entry}
        onChange={e => setEntry(e.target.value)}
        placeholder="What's on your mind today? What went well? What would you change?..."
        style={{
          width: '100%', minHeight: 160,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)', borderRadius: 10,
          padding: '0.75rem', color: 'var(--cream)',
          fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem',
          resize: 'vertical', outline: 'none', lineHeight: 1.7,
        }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem', alignItems: 'center' }}>
        <button onClick={handleSave} style={{
          borderRadius: 8, padding: '8px 18px', fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', border: 'none',
          background: saved ? 'var(--sage-dark)' : 'var(--sage)', color: 'white', transition: 'all 0.2s',
        }}>
          {saved ? '✓ Saved' : 'Save entry'}
        </button>
        <button onClick={() => setAffIdx(i => (i + 1) % affirmations.length)} style={{
          borderRadius: 8, padding: '8px 18px', fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
          background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)',
        }}>
          New affirmation →
        </button>
      </div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: '1rem', color: 'var(--warm-light)', lineHeight: 1.5, borderLeft: '2px solid var(--warm-dark)', paddingLeft: '1rem', marginTop: '1.25rem' }}>
        "{affirmations[affIdx]}"
      </div>
    </div>
  );
}

export default Journal;
