import React, { useState, useEffect } from 'react';

const WATER_GOAL = 8;
const MEALS = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch', label: 'Lunch', icon: '🥗' },
  { id: 'dinner', label: 'Dinner', icon: '🍲' },
  { id: 'snack', label: 'Snack', icon: '🍎' },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadAll(email) {
  try {
    return JSON.parse(localStorage.getItem(`mb_wellness_${email}`) || '{}');
  } catch {
    return {};
  }
}

function emptyDay() {
  return { water: 0, meals: { breakfast: false, lunch: false, dinner: false, snack: false } };
}

function WellnessTracker({ user }) {
  const email = user?.email || 'guest';
  const [all, setAll] = useState({});
  const today = todayKey();
  const day = all[today] || emptyDay();

  useEffect(() => { setAll(loadAll(email)); }, [email]);

  const persist = (updatedDay) => {
    const updated = { ...all, [today]: updatedDay };
    setAll(updated);
    localStorage.setItem(`mb_wellness_${email}`, JSON.stringify(updated));
  };

  const setWater = (n) => persist({ ...day, water: Math.max(0, Math.min(12, n)) });
  const toggleMeal = (id) => persist({ ...day, meals: { ...day.meals, [id]: !day.meals[id] } });

  const waterPct = Math.min(100, Math.round((day.water / WATER_GOAL) * 100));
  const mealsDone = Object.values(day.meals).filter(Boolean).length;

  // last 7 days water mini chart
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const card = { background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem', fontFamily: 'DM Sans, sans-serif' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>

        {/* Water tracker */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '1.25rem', alignSelf: 'flex-start' }}>
            Water intake
          </div>

          <div style={{ position: 'relative', width: 110, height: 110, marginBottom: '1rem' }}>
            <svg width={110} height={110} viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={55} cy={55} r={48} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
              <circle cx={55} cy={55} r={48} fill="none" stroke="#7aaac8" strokeWidth={8}
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 - (waterPct / 100) * 2 * Math.PI * 48}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: '#f0ebe0' }}>{day.water}</div>
              <div style={{ fontSize: '0.65rem', color: '#8a8a82' }}>of {WATER_GOAL} glasses</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setWater(day.water - 1)} style={{
              width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(120,130,110,0.22)',
              background: 'transparent', color: '#8a8a82', fontSize: '1rem', cursor: 'pointer',
            }}>−</button>
            <button onClick={() => setWater(day.water + 1)} style={{
              width: 34, height: 34, borderRadius: 8, border: 'none',
              background: '#7aaac8', color: 'white', fontSize: '1rem', cursor: 'pointer',
            }}>+</button>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#8a8a82', marginTop: '0.875rem' }}>
            🥤 1 tap ≈ 1 glass (~250ml)
          </div>
        </div>

        {/* Meal tracker */}
        <div style={card}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.875rem' }}>
            Meals today
          </div>

          {MEALS.map(m => (
            <div key={m.id} onClick={() => toggleMeal(m.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0',
              borderBottom: '1px solid rgba(120,130,110,0.1)', cursor: 'pointer',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${day.meals[m.id] ? '#7baa7a' : 'rgba(120,130,110,0.4)'}`,
                background: day.meals[m.id] ? '#7baa7a' : 'transparent', fontSize: '0.65rem', color: 'white', transition: 'all 0.2s',
              }}>{day.meals[m.id] ? '✓' : ''}</div>
              <span style={{ fontSize: '1rem' }}>{m.icon}</span>
              <span style={{ flex: 1, fontSize: '0.85rem', color: day.meals[m.id] ? '#a8c5a0' : '#d0ccc4' }}>{m.label}</span>
            </div>
          ))}

          <div style={{ marginTop: '0.875rem', fontSize: '0.78rem', color: '#8a8a82' }}>
            {mealsDone} of {MEALS.length} meals logged today
          </div>
        </div>
      </div>

      {/* 7-day water history */}
      <div style={card}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '1rem' }}>
          Water — last 7 days
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
          {days.map(d => {
            const dayData = all[d];
            const val = dayData ? dayData.water : 0;
            const pct = Math.min(100, (val / WATER_GOAL) * 100);
            const isToday = d === today;
            const label = new Date(d).toLocaleDateString('en-IN', { weekday: 'short' });
            return (
              <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ height: 16, fontSize: '0.65rem', color: '#8a8a82' }}>{val > 0 ? val : ''}</div>
                <div style={{
                  width: '100%', height: `${Math.max(pct * 0.55, 4)}px`,
                  borderRadius: '4px 4px 0 0',
                  background: val > 0 ? `rgba(122,170,200,${0.25 + pct / 150})` : 'rgba(255,255,255,0.06)',
                  border: isToday ? '1px solid rgba(122,170,200,0.5)' : 'none',
                  transition: 'height 0.4s ease',
                }} />
                <div style={{ fontSize: '0.65rem', color: isToday ? '#7aaac8' : '#555', fontWeight: isToday ? 600 : 400 }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WellnessTracker;
