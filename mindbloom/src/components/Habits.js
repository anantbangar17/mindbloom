import React, { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_HABITS = [
  { id: 1, label: 'Sleep 7h+' },
  { id: 2, label: 'Exercise' },
  { id: 3, label: 'Drink water' },
];

const SUGGESTIONS = [
  'No screens 9pm', 'Meditate', 'Read 20 pages', 'Journaling',
  'Walk 30 min', 'Healthy breakfast', 'No junk food', 'Stretching',
];

// Get current day index (0=Mon ... 6=Sun)
function getTodayIndex() {
  const d = new Date().getDay(); // 0=Sun
  return d === 0 ? 6 : d - 1;   // convert to Mon=0
}

function Habits() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  // completions[habitId][dayIndex] = true/false
  const [completions, setCompletions] = useState({});
  const [newHabit, setNewHabit] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const todayIdx = getTodayIndex();

  const toggle = (habitId, dayIdx) => {
    setCompletions(prev => {
      const habitData = prev[habitId] || {};
      return {
        ...prev,
        [habitId]: { ...habitData, [dayIdx]: !habitData[dayIdx] }
      };
    });
  };

  const addHabit = (label) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const id = Date.now();
    setHabits(h => [...h, { id, label: trimmed }]);
    setNewHabit('');
    setShowAdd(false);
  };

  const removeHabit = (id) => {
    setHabits(h => h.filter(x => x.id !== id));
    setCompletions(prev => { const c = { ...prev }; delete c[id]; return c; });
  };

  const getRate = (habitId) => {
    const data = completions[habitId] || {};
    const done = Object.values(data).filter(Boolean).length;
    return Math.round((done / 7) * 100);
  };

  const card = { background: 'var(--color-background-primary, #161b22)', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif' };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Habit grid */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82' }}>Habit tracker</div>
            <div style={{ fontSize: '0.78rem', color: '#8a8a82', marginTop: 2 }}>Click a cell to mark complete. Today = <span style={{ color: '#a8c5a0' }}>{DAYS[todayIdx]}</span></div>
          </div>
          <button onClick={() => setShowAdd(s => !s)} style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(123,170,122,0.4)',
            background: showAdd ? 'rgba(123,170,122,0.15)' : 'transparent',
            color: '#a8c5a0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer',
          }}>
            {showAdd ? '✕ Cancel' : '+ Add habit'}
          </button>
        </div>

        {/* Add habit panel */}
        {showAdd && (
          <div style={{ background: 'rgba(123,170,122,0.06)', border: '1px solid rgba(123,170,122,0.2)', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#8a8a82', marginBottom: 8 }}>Type a habit name or pick a suggestion:</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: '0.875rem' }}>
              <input
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addHabit(newHabit)}
                placeholder="e.g. No caffeine after 3pm"
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(120,130,110,0.22)',
                  color: '#f0ebe0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none',
                }}
              />
              <button onClick={() => addHabit(newHabit)} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: '#7baa7a', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', cursor: 'pointer',
              }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SUGGESTIONS.filter(s => !habits.find(h => h.label === s)).map(s => (
                <button key={s} onClick={() => addHabit(s)} style={{
                  padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(120,130,110,0.22)',
                  background: 'transparent', color: '#8a8a82', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', cursor: 'pointer',
                }}>+ {s}</button>
              ))}
            </div>
          </div>
        )}

        {habits.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#8a8a82', fontSize: '0.85rem' }}>
            No habits yet. Click "+ Add habit" to get started.
          </div>
        )}

        {habits.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', fontSize: '0.7rem', color: '#8a8a82', fontWeight: 400, paddingBottom: 10, minWidth: 130 }}>Habit</th>
                {DAYS.map((d, i) => (
                  <th key={d} style={{
                    fontSize: '0.7rem', color: i === todayIdx ? '#a8c5a0' : '#8a8a82',
                    fontWeight: i === todayIdx ? 600 : 400, paddingBottom: 10, textAlign: 'center', width: 36,
                  }}>{d}</th>
                ))}
                <th style={{ fontSize: '0.7rem', color: '#8a8a82', fontWeight: 400, paddingBottom: 10, textAlign: 'right', paddingRight: 4 }}>Rate</th>
                <th style={{ width: 24 }}></th>
              </tr>
            </thead>
            <tbody>
              {habits.map(h => {
                const rate = getRate(h.id);
                return (
                  <tr key={h.id}>
                    <td style={{ fontSize: '0.85rem', color: '#f0ebe0', paddingBottom: 12, paddingRight: 8 }}>{h.label}</td>
                    {DAYS.map((_, i) => {
                      const done = !!(completions[h.id] || {})[i];
                      const isToday = i === todayIdx;
                      return (
                        <td key={i} style={{ textAlign: 'center', paddingBottom: 12 }}>
                          <div onClick={() => toggle(h.id, i)} style={{
                            width: 22, height: 22, borderRadius: 5, margin: '0 auto', cursor: 'pointer',
                            background: done ? 'rgba(123,170,122,0.6)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isToday ? 'rgba(123,170,122,0.5)' : done ? 'rgba(123,170,122,0.4)' : 'rgba(255,255,255,0.08)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', color: 'white', transition: 'all 0.15s',
                            boxShadow: isToday && !done ? '0 0 0 2px rgba(123,170,122,0.2)' : 'none',
                          }}>
                            {done ? '✓' : ''}
                          </div>
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'right', fontSize: '0.78rem', color: rate >= 70 ? '#a8c5a0' : rate > 0 ? '#c8a97a' : '#555', paddingBottom: 12, paddingRight: 6 }}>{rate}%</td>
                    <td style={{ paddingBottom: 12 }}>
                      <button onClick={() => removeHabit(h.id)} style={{
                        background: 'transparent', border: 'none', color: '#555', cursor: 'pointer',
                        fontSize: '0.75rem', padding: '2px 4px', borderRadius: 4,
                      }} title="Remove habit">✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Today's summary */}
      {habits.length > 0 && (
        <div style={{ ...card, marginBottom: 0 }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.875rem' }}>Today — {DAYS[todayIdx]}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {habits.map(h => {
              const done = !!(completions[h.id] || {})[todayIdx];
              return (
                <div key={h.id} onClick={() => toggle(h.id, todayIdx)} style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px',
                  borderRadius: 99, cursor: 'pointer', transition: 'all 0.2s',
                  border: `1px solid ${done ? 'rgba(123,170,122,0.5)' : 'rgba(120,130,110,0.22)'}`,
                  background: done ? 'rgba(123,170,122,0.15)' : 'transparent',
                }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: done ? '#7baa7a' : 'transparent', border: `1px solid ${done ? '#7baa7a' : 'rgba(120,130,110,0.4)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'white' }}>
                    {done ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: done ? '#a8c5a0' : '#8a8a82' }}>{h.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '0.875rem', fontSize: '0.78rem', color: '#8a8a82' }}>
            {habits.filter(h => !!(completions[h.id] || {})[todayIdx]).length} of {habits.length} done today
          </div>
        </div>
      )}
    </div>
  );
}

export default Habits;
