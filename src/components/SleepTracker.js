import React, { useState, useEffect } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const GOAL = 8;

function weekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  return `${d.getFullYear()}-W${Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)}`;
}
function todayDayIdx() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}
function loadData(email) {
  try { return JSON.parse(localStorage.getItem(`mb_sleep_${email}`) || '{}'); } catch { return {}; }
}

export default function SleepTracker({ user }) {
  const email = user?.email || 'guest';
  const [data, setData] = useState({});
  const week = weekKey();
  const todayIdx = todayDayIdx();

  useEffect(() => { setData(loadData(email)); }, [email]);

  const weekData = data[week] || {};
  const todayHours = weekData[todayIdx] !== undefined ? weekData[todayIdx] : '';
  const [input, setInput] = useState('');

  const save = (val) => {
    const hours = parseFloat(val);
    if (isNaN(hours) || hours < 0 || hours > 24) return;
    const updated = { ...data, [week]: { ...weekData, [todayIdx]: hours } };
    setData(updated);
    localStorage.setItem(`mb_sleep_${email}`, JSON.stringify(updated));
    setInput('');
  };

  const avg = (() => {
    const vals = Object.values(weekData).filter(v => typeof v === 'number');
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  })();

  const maxBar = 10;

  const qual = (h) => {
    if (h >= 7 && h <= 9) return '#7baa7a';
    if (h >= 6 || h <= 10) return '#c8a97a';
    return '#e07070';
  };

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: "Tonight's goal", val: `${GOAL}h`, sub: 'recommended' },
          { label: 'This week avg', val: avg ? `${avg}h` : '—', sub: avg ? (avg >= 7 ? 'great!' : 'needs work') : 'no data yet' },
          { label: "Today logged", val: todayHours !== '' ? `${todayHours}h` : '—', sub: 'tap below to log' },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 120px', background: 'rgba(123,170,122,0.07)', border: '1px solid rgba(123,170,122,0.15)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: '0.68rem', color: '#8a8a82', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a8c5a0' }}>{s.val}</div>
            <div style={{ fontSize: '0.68rem', color: '#8a8a82', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.12)', borderRadius: 14, padding: '20px 20px 14px', marginBottom: 20 }}>
        <div style={{ fontSize: '0.78rem', color: '#8a8a82', marginBottom: 16 }}>This week — hours of sleep per night</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
          {DAYS.map((day, i) => {
            const h = weekData[i];
            const hasData = typeof h === 'number';
            const pct = hasData ? Math.min(h / maxBar, 1) : 0;
            const isToday = i === todayIdx;
            return (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: '0.65rem', color: hasData ? qual(h) : 'transparent' }}>{hasData ? `${h}h` : '·'}</div>
                <div style={{ width: '100%', height: 90, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                  {/* Goal line */}
                  <div style={{ position: 'absolute', bottom: `${(GOAL / maxBar) * 90}px`, left: 0, right: 0, borderTop: '1px dashed rgba(200,169,122,0.4)', zIndex: 1 }} />
                  <div style={{
                    width: '100%', height: hasData ? `${pct * 90}px` : 6,
                    background: hasData ? qual(h) : 'rgba(120,120,120,0.15)',
                    borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease',
                    opacity: isToday ? 1 : 0.7,
                    border: isToday ? '1px solid rgba(123,170,122,0.4)' : 'none',
                  }} />
                </div>
                <div style={{ fontSize: '0.65rem', color: isToday ? '#a8c5a0' : '#8a8a82', fontWeight: isToday ? 600 : 400 }}>{day}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: '0.65rem', color: '#8a8a82', marginTop: 10, textAlign: 'center' }}>dashed line = 8h goal</div>
      </div>

      {/* Log today */}
      <div style={{ background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.12)', borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: '0.85rem', color: '#c8c4bc', marginBottom: 12, fontWeight: 500 }}>
          🌙 Log tonight's sleep
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(h => (
            <button key={h} onClick={() => save(h)} style={{
              padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8rem',
              border: todayHours === h ? '1px solid #7baa7a' : '1px solid rgba(120,130,110,0.2)',
              background: todayHours === h ? 'rgba(123,170,122,0.2)' : 'rgba(123,170,122,0.05)',
              color: todayHours === h ? '#a8c5a0' : '#8a8a82', transition: 'all 0.15s',
            }}>
              {h}h
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            type="number" min={0} max={24} step={0.5}
            value={input} onChange={e => setInput(e.target.value)}
            placeholder="Custom (e.g. 7.5)"
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(120,130,110,0.2)', background: 'rgba(123,170,122,0.05)', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none' }}
          />
          <button onClick={() => save(input)} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(123,170,122,0.15)', border: '1px solid rgba(123,170,122,0.3)', color: '#a8c5a0', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
