import React from 'react';

const MOODS = [
  { emoji: '😔', label: 'Low',   value: 1 },
  { emoji: '😐', label: 'Meh',   value: 2 },
  { emoji: '🙂', label: 'Okay',  value: 3 },
  { emoji: '😊', label: 'Good',  value: 4 },
  { emoji: '🌟', label: 'Great', value: 5 },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Today = which index in Mon–Sun (0=Mon ... 6=Sun)
function getTodayIndex() {
  const d = new Date().getDay(); // 0=Sun
  return d === 0 ? 6 : d - 1;
}

function MoodLog({ selectedMood, setSelectedMood, moodHistory, setMoodHistory }) {
  const todayIdx = getTodayIndex();

  const logMood = (moodIdx) => {
    setSelectedMood(moodIdx);
    // Save to this week's history
    const updated = { ...moodHistory, [todayIdx]: moodIdx };
    setMoodHistory(updated);
  };

  const maxVal = 5;

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Log today */}
      <div style={{ background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.5rem' }}>Log your mood</div>
        <p style={{ fontSize: '0.82rem', color: '#8a8a82', marginBottom: '1rem' }}>How are you feeling right now?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {MOODS.map((m, i) => (
            <button key={i} onClick={() => logMood(i)} style={{
              flex: 1, border: `1px solid ${selectedMood === i ? '#7baa7a' : 'rgba(120,130,110,0.22)'}`,
              background: selectedMood === i ? 'rgba(123,170,122,0.18)' : 'transparent',
              borderRadius: 8, padding: '10px 4px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '1.8rem' }}>{m.emoji}</span>
              <span style={{ fontSize: '0.7rem', color: selectedMood === i ? '#a8c5a0' : '#8a8a82' }}>{m.label}</span>
            </button>
          ))}
        </div>
        {selectedMood !== null && (
          <div style={{ marginTop: '0.875rem', padding: '8px 12px', background: 'rgba(123,170,122,0.07)', border: '1px solid rgba(123,170,122,0.2)', borderRadius: 8, fontSize: '0.82rem', color: '#a8c5a0' }}>
            ✦ Logged: feeling <strong>{MOODS[selectedMood].label}</strong> — {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {/* Weekly chart */}
      <div style={{ background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '1rem' }}>This week</div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 90 }}>
          {DAYS.map((day, i) => {
            const moodIdx = moodHistory[i]; // undefined if not logged
            const hasData = moodIdx !== undefined && moodIdx !== null;
            const barHeight = hasData ? (MOODS[moodIdx].value / maxVal) * 70 : 0;
            const isToday = i === todayIdx;
            const isFuture = i > todayIdx;

            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {/* Emoji — only if logged */}
                <div style={{ height: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {hasData && <span style={{ fontSize: '0.9rem' }}>{MOODS[moodIdx].emoji}</span>}
                </div>

                {/* Bar */}
                <div style={{
                  width: '100%',
                  height: hasData ? `${barHeight}px` : '4px',
                  borderRadius: hasData ? '4px 4px 0 0' : 3,
                  background: hasData
                    ? `rgba(123,170,122,${0.2 + MOODS[moodIdx].value * 0.1})`
                    : isFuture
                      ? 'rgba(255,255,255,0.03)'   // future: nearly invisible
                      : 'rgba(255,255,255,0.07)',   // past no data: faint line
                  border: isToday && !hasData ? '1px dashed rgba(123,170,122,0.35)' : 'none',
                  transition: 'height 0.4s ease',
                  alignSelf: 'flex-end',
                }} />

                {/* Day label */}
                <div style={{
                  fontSize: '0.65rem',
                  color: isToday ? '#a8c5a0' : '#555',
                  fontWeight: isToday ? 600 : 400,
                }}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: '#555', display: 'flex', gap: 16 }}>
          <span><span style={{ color: '#a8c5a0' }}>■</span> Logged</span>
          <span><span style={{ color: 'rgba(255,255,255,0.2)' }}>─</span> No entry</span>
          <span style={{ color: '#a8c5a0', fontWeight: 500 }}>{DAYS[todayIdx]} = today</span>
        </div>
      </div>
    </div>
  );
}

export default MoodLog;
