import React, { useState, useEffect } from 'react';

const DEFAULT_AFFIRMATIONS = [
  "I am doing my best, and that is enough.",
  "I am worthy of love, rest, and good things.",
  "Growth takes time. I am patient with myself.",
  "I choose progress over perfection.",
  "My feelings are valid.",
];

function loadData(email) {
  try { return JSON.parse(localStorage.getItem(`mb_affirmations_${email}`) || 'null'); } catch { return null; }
}

export default function CustomAffirmations({ user }) {
  const email = user?.email || 'guest';
  const [affirmations, setAffirmations] = useState([]);
  const [newText, setNewText] = useState('');
  const [displayIdx, setDisplayIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const saved = loadData(email);
    setAffirmations(saved || DEFAULT_AFFIRMATIONS);
  }, [email]);

  const save = (updated) => {
    setAffirmations(updated);
    localStorage.setItem(`mb_affirmations_${email}`, JSON.stringify(updated));
  };

  const addAffirmation = () => {
    const t = newText.trim();
    if (!t) return;
    save([...affirmations, t]);
    setNewText('');
  };

  const deleteAff = (i) => {
    const updated = affirmations.filter((_, idx) => idx !== i);
    save(updated);
    if (displayIdx >= updated.length) setDisplayIdx(Math.max(0, updated.length - 1));
  };

  const startEdit = (i) => { setEditIdx(i); setEditText(affirmations[i]); };
  const saveEdit = () => {
    if (!editText.trim()) return;
    const updated = affirmations.map((a, i) => i === editIdx ? editText.trim() : a);
    save(updated);
    setEditIdx(null);
  };

  const cycle = (dir) => {
    setFade(false);
    setTimeout(() => {
      setDisplayIdx(i => (i + dir + affirmations.length) % affirmations.length);
      setFade(true);
    }, 220);
  };

  const current = affirmations[displayIdx] || '';

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Featured affirmation display */}
      <div style={{ background: 'rgba(123,170,122,0.07)', border: '1px solid rgba(123,170,122,0.15)', borderRadius: 16, padding: '28px 24px', marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: 12 }}>✨</div>
        <div style={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.22s', fontSize: '1.05rem', color: '#c8c4bc', fontStyle: 'italic', lineHeight: 1.6, maxWidth: 320 }}>
            "{current}"
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          {affirmations.map((_, i) => (
            <div key={i} onClick={() => { setFade(false); setTimeout(() => { setDisplayIdx(i); setFade(true); }, 220); }} style={{ width: 7, height: 7, borderRadius: '50%', background: i === displayIdx ? '#7baa7a' : 'rgba(120,120,120,0.25)', cursor: 'pointer', transition: 'background 0.2s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onClick={() => cycle(-1)} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(123,170,122,0.2)', background: 'rgba(123,170,122,0.07)', color: '#7baa7a', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>←</button>
          <button onClick={() => cycle(1)} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(123,170,122,0.2)', background: 'rgba(123,170,122,0.07)', color: '#7baa7a', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>→</button>
        </div>
      </div>

      {/* Add new */}
      <div style={{ background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.12)', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
        <div style={{ fontSize: '0.82rem', color: '#8a8a82', marginBottom: 10 }}>+ Write your own affirmation</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addAffirmation()}
            placeholder="I am..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(120,130,110,0.2)', background: 'rgba(123,170,122,0.04)', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none' }}
          />
          <button onClick={addAffirmation} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(123,170,122,0.15)', border: '1px solid rgba(123,170,122,0.3)', color: '#a8c5a0', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ fontSize: '0.75rem', color: '#8a8a82', marginBottom: 8 }}>All affirmations ({affirmations.length})</div>
      {affirmations.map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: i === displayIdx ? 'rgba(123,170,122,0.08)' : 'rgba(123,170,122,0.03)', border: `1px solid ${i === displayIdx ? 'rgba(123,170,122,0.2)' : 'rgba(123,170,122,0.08)'}`, marginBottom: 6, transition: 'all 0.2s' }}>
          {editIdx === i ? (
            <>
              <input
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                autoFocus
                style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(123,170,122,0.3)', background: 'rgba(123,170,122,0.08)', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none' }}
              />
              <button onClick={saveEdit} style={{ background: 'none', border: 'none', color: '#7baa7a', cursor: 'pointer', fontSize: '0.8rem' }}>✓</button>
              <button onClick={() => setEditIdx(null)} style={{ background: 'none', border: 'none', color: '#8a8a82', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
            </>
          ) : (
            <>
              <div style={{ flex: 1, fontSize: '0.85rem', color: '#c8c4bc', lineHeight: 1.5, fontStyle: i === displayIdx ? 'italic' : 'normal' }}>{a}</div>
              <button onClick={() => startEdit(i)} style={{ background: 'none', border: 'none', color: '#8a8a82', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px', flexShrink: 0 }}>✏️</button>
              <button onClick={() => deleteAff(i)} style={{ background: 'none', border: 'none', color: '#e07070', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px', flexShrink: 0, opacity: 0.6 }}>✕</button>
            </>
          )}
        </div>
      ))}

      <div style={{ marginTop: 12, fontSize: '0.7rem', color: '#8a8a82', textAlign: 'center' }}>
        Tip: Say your affirmations out loud for the most impact 💚
      </div>
    </div>
  );
}
