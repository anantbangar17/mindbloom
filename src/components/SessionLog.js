import React, { useState, useEffect, useRef } from 'react';

const CATEGORIES = [
  { id: 'study', label: 'Study', color: '#7aaac8' },
  { id: 'work', label: 'Work', color: '#7baa7a' },
  { id: 'reading', label: 'Reading', color: '#c8a97a' },
  { id: 'other', label: 'Other', color: '#aa8ac8' },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadSessions(email) {
  try {
    return JSON.parse(localStorage.getItem(`mb_sessions_${email}`) || '[]');
  } catch {
    return [];
  }
}

function weekStartKey() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function SessionLog({ user }) {
  const email = user?.email || 'guest';
  const [sessions, setSessions] = useState([]);
  const [category, setCategory] = useState('study');
  const [title, setTitle] = useState('');
  const [manualMin, setManualMin] = useState('');
  const [showManual, setShowManual] = useState(false);

  // live stopwatch
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const tickRef = useRef(null);

  useEffect(() => { setSessions(loadSessions(email)); }, [email]);

  useEffect(() => {
    if (running) {
      tickRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else clearInterval(tickRef.current);
    return () => clearInterval(tickRef.current);
  }, [running]);

  const persist = (updated) => {
    setSessions(updated);
    localStorage.setItem(`mb_sessions_${email}`, JSON.stringify(updated));
  };

  const addSession = (minutes) => {
    if (minutes <= 0) return;
    const entry = {
      id: Date.now(),
      title: title.trim() || CATEGORIES.find(c => c.id === category).label,
      category, minutes, date: todayKey(),
    };
    persist([entry, ...sessions]);
    setTitle('');
  };

  const stopStopwatch = () => {
    setRunning(false);
    const mins = Math.max(1, Math.round(elapsed / 60));
    addSession(mins);
    setElapsed(0);
  };

  const handleManualAdd = () => {
    const mins = parseInt(manualMin, 10);
    if (!mins || mins <= 0) return;
    addSession(mins);
    setManualMin('');
    setShowManual(false);
  };

  const removeSession = (id) => persist(sessions.filter(s => s.id !== id));

  const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const todaySessions = sessions.filter(s => s.date === todayKey());
  const todayMins = todaySessions.reduce((a, s) => a + s.minutes, 0);

  const wkStart = weekStartKey();
  const weekSessions = sessions.filter(s => new Date(s.date) >= wkStart);
  const weekMins = weekSessions.reduce((a, s) => a + s.minutes, 0);

  const byCategory = CATEGORIES.map(c => ({
    ...c,
    minutes: weekSessions.filter(s => s.category === c.id).reduce((a, s) => a + s.minutes, 0),
  }));

  const fmtHM = (mins) => mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;

  const card = { background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem', fontFamily: 'DM Sans, sans-serif' };
  const catPill = (c, active) => ({
    padding: '6px 12px', borderRadius: 99, fontSize: '0.75rem', cursor: 'pointer',
    border: `1px solid ${active ? c.color : 'rgba(120,130,110,0.22)'}`,
    background: active ? `${c.color}26` : 'transparent',
    color: active ? c.color : '#8a8a82', transition: 'all 0.2s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>

        {/* Stopwatch + quick log */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '1rem', alignSelf: 'flex-start' }}>
            Track a session
          </div>

          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.2rem', color: '#f0ebe0', marginBottom: '1rem' }}>
            {fmtClock(elapsed)}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={catPill(c, category === c.id)}>{c.label}</button>
            ))}
          </div>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What are you working on? (optional)"
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 8, marginBottom: '1rem',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(120,130,110,0.22)',
              color: '#f0ebe0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => running ? stopStopwatch() : setRunning(true)} style={{
              borderRadius: 8, padding: '9px 20px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem',
              fontWeight: 500, cursor: 'pointer', border: 'none',
              background: running ? '#e07070' : '#7baa7a', color: 'white', transition: 'all 0.2s',
            }}>{running ? 'Stop & log' : 'Start'}</button>
            <button onClick={() => setShowManual(s => !s)} style={{
              borderRadius: 8, padding: '9px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem',
              cursor: 'pointer', border: '1px solid rgba(120,130,110,0.22)', background: 'transparent', color: '#8a8a82',
            }}>+ Manual</button>
          </div>

          {showManual && (
            <div style={{ display: 'flex', gap: 6, marginTop: '0.875rem', width: '100%' }}>
              <input
                value={manualMin}
                onChange={e => setManualMin(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && handleManualAdd()}
                placeholder="Minutes"
                style={{
                  flex: 1, padding: '7px 10px', borderRadius: 7,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(120,130,110,0.22)',
                  color: '#f0ebe0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none',
                }}
              />
              <button onClick={handleManualAdd} style={{ background: '#7baa7a', border: 'none', borderRadius: 7, color: 'white', padding: '7px 14px', cursor: 'pointer', fontSize: '0.78rem' }}>Log</button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={card}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.875rem' }}>
            This week
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: '#f0ebe0' }}>{fmtHM(todayMins)}</div>
              <div style={{ fontSize: '0.7rem', color: '#8a8a82' }}>Today</div>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: '#f0ebe0' }}>{fmtHM(weekMins)}</div>
              <div style={{ fontSize: '0.7rem', color: '#8a8a82' }}>This week</div>
            </div>
          </div>

          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a8a82', marginBottom: '0.625rem' }}>
            By category
          </div>
          {byCategory.map(c => {
            const pct = weekMins > 0 ? Math.round((c.minutes / weekMins) * 100) : 0;
            return (
              <div key={c.id} style={{ marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#d0ccc4', marginBottom: 3 }}>
                  <span>{c.label}</span>
                  <span style={{ color: '#8a8a82' }}>{fmtHM(c.minutes)}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: c.color, borderRadius: 99, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session list */}
      <div style={card}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.875rem' }}>
          Recent sessions
        </div>

        {sessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#8a8a82', fontSize: '0.82rem' }}>
            No sessions logged yet — start the timer or log one manually.
          </div>
        )}

        {sessions.slice(0, 10).map(s => {
          const cat = CATEGORIES.find(c => c.id === s.category);
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(120,130,110,0.1)' }}>
              <span style={{
                fontSize: '0.65rem', color: cat.color, background: `${cat.color}1f`, border: `1px solid ${cat.color}40`,
                borderRadius: 99, padding: '2px 8px', flexShrink: 0,
              }}>{cat.label}</span>
              <span style={{ flex: 1, fontSize: '0.83rem', color: '#d0ccc4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
              <span style={{ fontSize: '0.78rem', color: '#8a8a82', flexShrink: 0 }}>{fmtHM(s.minutes)}</span>
              <button onClick={() => removeSession(s.id)} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px' }} title="Remove">✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SessionLog;
