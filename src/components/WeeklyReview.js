import React, { useMemo } from 'react';

const MOOD_LABELS = ['Low', 'Meh', 'Okay', 'Good', 'Great'];
const MOOD_COLORS = ['#e07070', '#c8a97a', '#9ab5d4', '#7baa7a', '#a8c5a0'];
const MOOD_EMOJI  = ['😔', '😕', '😐', '🙂', '😊'];

function getWeekDates() {
  const today = new Date();
  const dow = today.getDay() === 0 ? 6 : today.getDay() - 1; // Mon=0
  const mon = new Date(today);
  mon.setDate(today.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

export default function WeeklyReview({ user }) {
  const email = user?.email || 'guest';
  const weekDates = useMemo(getWeekDates, []);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Gather data from all localStorage sources
  const moodLog = loadJson(`mb_moodlog_${email}`, []);
  const tasks   = loadJson(`mb_tasks_${email}`, []);
  const sleepData = loadJson(`mb_sleep_${email}`, {});
  const sessions  = loadJson(`mb_sessions_${email}`, []);
  const gratitude = loadJson(`mb_gratitude_${email}`, {});
  const wellness  = loadJson(`mb_wellness_${email}`, {});

  // Per-day mood this week
  const weekMoods = weekDates.map(d => {
    const entry = moodLog.find(e => e.date === d);
    return entry ? entry.moodIdx : null;
  });

  const avgMood = (() => {
    const v = weekMoods.filter(m => m !== null);
    return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : null;
  })();

  // Tasks this week
  const doneTasks = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;

  // Sleep this week (get most recent week key)
  const sleepVals = (() => {
    const keys = Object.keys(sleepData);
    if (!keys.length) return [];
    const latestWeek = keys.sort().reverse()[0];
    return Object.values(sleepData[latestWeek] || {}).filter(v => typeof v === 'number');
  })();
  const avgSleep = sleepVals.length ? (sleepVals.reduce((a, b) => a + b, 0) / sleepVals.length).toFixed(1) : null;

  // Sessions this week
  const weekSessionMins = sessions
    .filter(s => weekDates.includes(s.date))
    .reduce((a, s) => a + (s.minutes || 0), 0);

  // Gratitude entries this week
  const gratDays = weekDates.filter(d => gratitude[d]?.entries?.some(e => e)).length;

  // Water avg this week
  const waterVals = weekDates.map(d => wellness[d]?.water || 0).filter(v => v > 0);
  const avgWater = waterVals.length ? (waterVals.reduce((a, b) => a + b, 0) / waterVals.length).toFixed(1) : null;

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Auto-insight
  const insight = (() => {
    if (!avgMood) return "Log some moods this week to see your insights here.";
    const m = parseFloat(avgMood);
    if (m >= 3.5) return "You had a strong emotional week. Keep nurturing what's working.";
    if (m >= 2.5) return "A balanced week — some highs, some lows. That's real life.";
    return "This was a tough week. Remember: hard weeks make room for growth.";
  })();

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'rgba(123,170,122,0.07)', border: '1px solid rgba(123,170,122,0.15)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: '0.72rem', color: '#8a8a82', marginBottom: 4 }}>Week of {weekDates[0]} → {weekDates[6]}</div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#a8c5a0', marginBottom: 6 }}>📋 Weekly Review</div>
        <div style={{ fontSize: '0.83rem', color: '#8a8a82', fontStyle: 'italic', lineHeight: 1.5 }}>{insight}</div>
      </div>

      {/* Mood strip */}
      <div style={{ background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.12)', borderRadius: 12, padding: '16px 18px', marginBottom: 14 }}>
        <div style={{ fontSize: '0.78rem', color: '#8a8a82', marginBottom: 12 }}>😌 Mood this week {avgMood ? `· avg ${MOOD_LABELS[Math.round(avgMood)]}` : ''}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {weekMoods.map((m, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{m !== null ? MOOD_EMOJI[m] : '·'}</div>
              <div style={{ fontSize: '0.6rem', color: '#8a8a82' }}>{DAYS[i]}</div>
              {m !== null && <div style={{ width: '100%', height: 4, borderRadius: 2, background: MOOD_COLORS[m], marginTop: 4 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { icon: '✅', label: 'Tasks done', val: totalTasks ? `${doneTasks}/${totalTasks}` : '—', sub: totalTasks ? `${Math.round(doneTasks / totalTasks * 100)}% completion` : 'no tasks yet' },
          { icon: '🌙', label: 'Avg sleep', val: avgSleep ? `${avgSleep}h` : '—', sub: avgSleep ? (avgSleep >= 7 ? 'well rested' : 'could be better') : 'not tracked' },
          { icon: '⏱️', label: 'Focus time', val: weekSessionMins ? `${Math.round(weekSessionMins / 60)}h ${weekSessionMins % 60}m` : '—', sub: 'this week' },
          { icon: '🙏', label: 'Gratitude', val: `${gratDays}/7`, sub: 'days logged' },
          { icon: '💧', label: 'Avg water', val: avgWater ? `${avgWater}/8` : '—', sub: 'glasses per day' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.12)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: '0.7rem', color: '#8a8a82', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#a8c5a0' }}>{s.val}</div>
            <div style={{ fontSize: '0.68rem', color: '#8a8a82', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Reflection prompts */}
      <div style={{ background: 'rgba(200,169,122,0.06)', border: '1px solid rgba(200,169,122,0.15)', borderRadius: 12, padding: '16px 18px' }}>
        <div style={{ fontSize: '0.78rem', color: '#c8a97a', marginBottom: 10, fontWeight: 500 }}>✍️ Reflect on this week</div>
        {[
          "What was one win, however small?",
          "What drained you most this week?",
          "What would you do differently next week?",
        ].map((q, i) => (
          <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
            <div style={{ fontSize: '0.78rem', color: '#8a8a82', marginBottom: 4 }}>{q}</div>
            <textarea
              placeholder="Write anything..."
              rows={2}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: 8, resize: 'vertical',
                border: '1px solid rgba(200,169,122,0.15)', background: 'rgba(200,169,122,0.04)',
                color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
        <div style={{ fontSize: '0.68rem', color: '#8a8a82', marginTop: 8 }}>Reflections are private and not saved — just for you to think through.</div>
      </div>
    </div>
  );
}
