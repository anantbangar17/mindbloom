import React from 'react';

const MOODS = [
  { emoji: '😔', label: 'Low', value: 1 },
  { emoji: '😐', label: 'Meh', value: 2 },
  { emoji: '🙂', label: 'Okay', value: 3 },
  { emoji: '😊', label: 'Good', value: 4 },
  { emoji: '🌟', label: 'Great', value: 5 },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function MoodInsights({ moodLog }) {
  const log = moodLog || []; // [{ date: 'YYYY-MM-DD', moodIdx: 0-4 }]
  const card = { background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem', fontFamily: 'DM Sans, sans-serif' };

  if (log.length === 0) {
    return (
      <div style={card}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.75rem' }}>
          Mood pattern insights
        </div>
        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#8a8a82', fontSize: '0.85rem' }}>
          Log your mood a few times on the Dashboard or Mood page — patterns will show up here once there's enough data.
        </div>
      </div>
    );
  }

  // last 14 days strip (most recent entry per date)
  const byDate = {};
  log.forEach(e => { byDate[e.date] = e.moodIdx; });
  const last14 = Array.from({ length: 14 }, (_, i) => daysAgo(13 - i));

  const valuesAll = log.map(e => MOODS[e.moodIdx].value);
  const avgAll = (valuesAll.reduce((a, v) => a + v, 0) / valuesAll.length).toFixed(1);

  const last7Dates = new Set(Array.from({ length: 7 }, (_, i) => daysAgo(i)));
  const prev7Dates = new Set(Array.from({ length: 7 }, (_, i) => daysAgo(i + 7)));
  const last7Vals = log.filter(e => last7Dates.has(e.date)).map(e => MOODS[e.moodIdx].value);
  const prev7Vals = log.filter(e => prev7Dates.has(e.date)).map(e => MOODS[e.moodIdx].value);
  const avgLast7 = last7Vals.length ? last7Vals.reduce((a, v) => a + v, 0) / last7Vals.length : null;
  const avgPrev7 = prev7Vals.length ? prev7Vals.reduce((a, v) => a + v, 0) / prev7Vals.length : null;

  // most frequent mood
  const counts = [0, 0, 0, 0, 0];
  log.forEach(e => counts[e.moodIdx]++);
  const mostFrequentIdx = counts.indexOf(Math.max(...counts));

  // average mood by weekday
  const byWeekday = WEEKDAYS.map((_, wd) => {
    const entries = log.filter(e => new Date(e.date).getDay() === wd);
    const vals = entries.map(e => MOODS[e.moodIdx].value);
    return vals.length ? vals.reduce((a, v) => a + v, 0) / vals.length : null;
  });
  const validWeekdays = byWeekday.map((v, i) => ({ v, i })).filter(x => x.v !== null);
  const bestWeekday = validWeekdays.length ? validWeekdays.reduce((a, b) => b.v > a.v ? b : a) : null;
  const worstWeekday = validWeekdays.length ? validWeekdays.reduce((a, b) => b.v < a.v ? b : a) : null;

  // current streak of consecutive logged days ending today
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    if (byDate[daysAgo(i)] !== undefined) streak++;
    else break;
  }

  const trend = avgLast7 !== null && avgPrev7 !== null
    ? avgLast7 - avgPrev7 > 0.3 ? 'up' : avgPrev7 - avgLast7 > 0.3 ? 'down' : 'flat'
    : null;

  const insights = [];
  if (trend === 'up') insights.push('Your mood has been trending upward over the last 7 days compared to the week before. Whatever you\u2019ve been doing, keep it going.');
  if (trend === 'down') insights.push('Your mood has dipped a bit over the last 7 days compared to the week before. Be extra gentle with yourself this week.');
  if (trend === 'flat') insights.push('Your mood has been fairly steady over the last two weeks.');
  if (bestWeekday) insights.push(`You tend to feel best on ${WEEKDAYS[bestWeekday.i]}s.`);
  if (worstWeekday && worstWeekday.i !== bestWeekday?.i) insights.push(`${WEEKDAYS[worstWeekday.i]}s tend to be your toughest days — worth planning something supportive on those.`);
  if (streak >= 3) insights.push(`You're on a ${streak}-day logging streak — consistent tracking makes these patterns more reliable.`);

  const statBox = (label, value, sub) => (
    <div style={{ flex: 1, minWidth: 110 }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: '#f0ebe0' }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: '#8a8a82', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.68rem', color: '#a8c5a0', marginTop: 2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Stat row */}
      <div style={{ ...card, display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {statBox('Avg mood (all time)', `${avgAll} / 5`)}
        {statBox('Most frequent', `${MOODS[mostFrequentIdx].emoji} ${MOODS[mostFrequentIdx].label}`)}
        {statBox('Logging streak', streak > 0 ? `${streak}d` : '—', streak > 0 ? '🔥' : null)}
        {statBox('Total entries', log.length)}
      </div>

      {/* 14-day strip */}
      <div style={card}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '1rem' }}>
          Last 14 days
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 90 }}>
          {last14.map(d => {
            const idx = byDate[d];
            const hasData = idx !== undefined;
            const barHeight = hasData ? (MOODS[idx].value / 5) * 70 : 0;
            const label = new Date(d).toLocaleDateString('en-IN', { day: 'numeric' });
            return (
              <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ height: 18, display: 'flex', alignItems: 'flex-end' }}>
                  {hasData && <span style={{ fontSize: '0.75rem' }}>{MOODS[idx].emoji}</span>}
                </div>
                <div style={{
                  width: '100%', height: hasData ? `${barHeight}px` : '4px',
                  borderRadius: hasData ? '3px 3px 0 0' : 3,
                  background: hasData ? `rgba(123,170,122,${0.2 + MOODS[idx].value * 0.1})` : 'rgba(255,255,255,0.05)',
                  transition: 'height 0.4s ease',
                }} />
                <div style={{ fontSize: '0.58rem', color: '#555' }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekday pattern */}
      <div style={card}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '1rem' }}>
          Average mood by day of week
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 70 }}>
          {byWeekday.map((v, i) => {
            const hasData = v !== null;
            const h = hasData ? (v / 5) * 55 : 0;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', height: hasData ? `${h}px` : '4px',
                  borderRadius: hasData ? '3px 3px 0 0' : 3,
                  background: hasData ? 'rgba(200,169,122,0.55)' : 'rgba(255,255,255,0.05)',
                  transition: 'height 0.4s ease',
                }} />
                <div style={{ fontSize: '0.65rem', color: '#8a8a82' }}>{WEEKDAYS[i]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Text insights */}
      {insights.length > 0 && (
        <div style={{ ...card, background: 'rgba(123,170,122,0.06)', border: '1px solid rgba(123,170,122,0.2)' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7baa7a', marginBottom: '0.75rem' }}>
            What we're noticing
          </div>
          {insights.map((line, i) => (
            <div key={i} style={{ fontSize: '0.82rem', color: '#a8c5a0', lineHeight: 1.6, marginBottom: i === insights.length - 1 ? 0 : 8 }}>
              💡 {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MoodInsights;
