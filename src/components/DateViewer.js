import React, { useState } from 'react';

const MOODS = [
  { emoji: '😔', label: 'Low' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😊', label: 'Good' },
  { emoji: '🌟', label: 'Great' },
];

function DateViewer({ onClose, moodHistory, tasks, theme }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const cardBg = isDark ? '#161b22' : '#ffffff';
  const bg = isDark ? '#0d1117' : '#f5f5f0';
  const border = isDark ? 'rgba(120,130,110,0.18)' : 'rgba(0,0,0,0.1)';
  const text = isDark ? '#f0ebe0' : '#1a1a1a';
  const muted = isDark ? '#8a8a82' : '#6a6a62';

  // Get week start (Monday)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const prevWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); };
  const nextWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(getWeekStart(new Date(d.getTime() + 7 * 86400000))); };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isFuture = (d) => d > today;

  // For mood history, we use day-of-week index (Mon=0) for current week only
  // For a real app this would be date-keyed; for now show current week data
  const getDayMood = (date) => {
    const d = date.getDay();
    const idx = d === 0 ? 6 : d - 1;
    // Only show if it's in current real week
    const realWeekStart = getWeekStart(new Date());
    if (date >= realWeekStart && date <= today) return moodHistory[idx];
    return undefined;
  };

  const selectedMoodIdx = getDayMood(selectedDate);
  const selectedIsToday = selectedDate.getTime() === today.getTime();

  const fmt = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtFull = (d) => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: '1.5rem', width: '100%', maxWidth: 460, fontFamily: 'DM Sans, sans-serif' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 500, color: text }}>Daily view</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: muted, cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>

        {/* Week navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <button onClick={prevWeek} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 7, color: muted, padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>← Prev</button>
          <div style={{ fontSize: '0.75rem', color: muted }}>
            {weekDays[0].toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} — {weekDays[6].toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <button onClick={nextWeek} disabled={weekStart >= getWeekStart(today)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 7, color: weekStart >= getWeekStart(today) ? '#333' : muted, padding: '4px 10px', cursor: weekStart >= getWeekStart(today) ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}>Next →</button>
        </div>

        {/* Day pills */}
        <div style={{ display: 'flex', gap: 5, marginBottom: '1.25rem' }}>
          {weekDays.map((d, i) => {
            const isSelected = d.getTime() === selectedDate.getTime();
            const isT = d.getTime() === today.getTime();
            const mood = getDayMood(d);
            const future = isFuture(d);
            return (
              <button key={i} onClick={() => !future && setSelectedDate(d)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '8px 4px', borderRadius: 10, cursor: future ? 'not-allowed' : 'pointer',
                border: `1px solid ${isSelected ? 'rgba(123,170,122,0.6)' : border}`,
                background: isSelected ? 'rgba(123,170,122,0.15)' : future ? 'rgba(255,255,255,0.02)' : 'transparent',
                opacity: future ? 0.35 : 1, transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: '0.85rem' }}>{mood !== undefined ? MOODS[mood].emoji : '·'}</span>
                <span style={{ fontSize: '0.6rem', color: isT ? '#a8c5a0' : muted, fontWeight: isT ? 600 : 400 }}>
                  {['M','T','W','T','F','S','S'][i]}
                </span>
                <span style={{ fontSize: '0.62rem', color: muted }}>{d.getDate()}</span>
              </button>
            );
          })}
        </div>

        {/* Selected day detail */}
        <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderRadius: 12, padding: '1rem', border: `1px solid ${border}` }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 500, color: text, marginBottom: '0.75rem' }}>
            {fmtFull(selectedDate)} {selectedIsToday && <span style={{ fontSize: '0.65rem', color: '#7baa7a', marginLeft: 4 }}>today</span>}
          </div>

          {isFuture(selectedDate) ? (
            <div style={{ fontSize: '0.82rem', color: muted }}>Future date — no data yet.</div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.72rem', color: muted, width: 60 }}>Mood</span>
                {selectedMoodIdx !== undefined
                  ? <span style={{ fontSize: '0.875rem' }}>{MOODS[selectedMoodIdx].emoji} {MOODS[selectedMoodIdx].label}</span>
                  : <span style={{ fontSize: '0.82rem', color: '#555' }}>Not logged</span>
                }
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: '0.72rem', color: muted, width: 60, marginTop: 2 }}>Tasks</span>
                {selectedIsToday
                  ? tasks.length > 0
                    ? <div style={{ flex: 1 }}>
                        {tasks.slice(0, 3).map(t => (
                          <div key={t.id} style={{ fontSize: '0.78rem', color: t.done ? '#555' : text, textDecoration: t.done ? 'line-through' : 'none', marginBottom: 2 }}>
                            {t.done ? '✓' : '·'} {t.text}
                          </div>
                        ))}
                        {tasks.length > 3 && <div style={{ fontSize: '0.72rem', color: muted }}>+{tasks.length - 3} more</div>}
                      </div>
                    : <span style={{ fontSize: '0.82rem', color: '#555' }}>No tasks</span>
                  : <span style={{ fontSize: '0.82rem', color: '#555' }}>Task history coming soon</span>
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DateViewer;
