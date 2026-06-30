import React, { useState, useEffect } from 'react';

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function loadAll(email) {
  try {
    return JSON.parse(localStorage.getItem(`mb_gratitude_${email}`) || '{}');
  } catch {
    return {};
  }
}

function Gratitude({ user }) {
  const email = user?.email || 'guest';
  const [all, setAll] = useState({});
  const [items, setItems] = useState(['', '', '']);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = loadAll(email);
    setAll(data);
    if (data[todayKey()]) setItems([...data[todayKey()], '', '', ''].slice(0, 3));
  }, [email]);

  const setItem = (i, val) => setItems(arr => arr.map((x, idx) => idx === i ? val : x));

  const handleSave = () => {
    const cleaned = items.map(s => s.trim()).filter(Boolean);
    if (cleaned.length === 0) return;
    const updated = { ...all, [todayKey()]: cleaned };
    setAll(updated);
    localStorage.setItem(`mb_gratitude_${email}`, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const history = Object.entries(all)
    .filter(([date]) => date !== todayKey())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7);

  const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  const card = { background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem', fontFamily: 'DM Sans, sans-serif' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Today's entry */}
      <div style={card}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.5rem' }}>
          Today's gratitude
        </div>
        <p style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: '1rem' }}>
          List up to three things — big or small — that you're grateful for today.
        </p>

        {items.map((val, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.625rem' }}>
            <span style={{ color: '#c8a97a', fontFamily: "'DM Serif Display', serif", fontSize: '1rem', width: 16 }}>{i + 1}</span>
            <input
              value={val}
              onChange={e => setItem(i, e.target.value)}
              placeholder={['Something that made you smile…', 'A person you appreciate…', 'A small win today…'][i]}
              style={{
                flex: 1, padding: '9px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(120,130,110,0.22)',
                color: '#f0ebe0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none',
              }}
            />
          </div>
        ))}

        <button onClick={handleSave} style={{
          marginTop: '0.5rem', borderRadius: 8, padding: '8px 18px', fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', border: 'none',
          background: saved ? '#4a7a4a' : '#7baa7a', color: 'white', transition: 'all 0.2s',
        }}>
          {saved ? '✓ Saved' : 'Save today\'s gratitude'}
        </button>
      </div>

      {/* History */}
      <div style={card}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.875rem' }}>
          Past entries
        </div>

        {history.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#8a8a82', fontSize: '0.82rem' }}>
            No past entries yet — come back tomorrow to build your gratitude streak.
          </div>
        )}

        {history.map(([date, list]) => (
          <div key={date} style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(120,130,110,0.12)' }}>
            <div style={{ fontSize: '0.72rem', color: '#a8c5a0', marginBottom: 6, fontWeight: 500 }}>{fmtDate(date)}</div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
              {list.map((it, idx) => (
                <li key={idx} style={{ fontSize: '0.82rem', color: '#d0ccc4', marginBottom: 2, lineHeight: 1.5 }}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gratitude;
