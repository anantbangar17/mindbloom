import React, { useMemo } from 'react';

const BADGES = [
  { id: 'first_mood',   icon: '🌱', name: 'First Step',        desc: 'Log your first mood',              check: (s) => s.totalMoods >= 1 },
  { id: 'mood7',        icon: '🌿', name: 'Mood Keeper',       desc: 'Log mood 7 days in a row',         check: (s) => s.moodStreak >= 7 },
  { id: 'mood30',       icon: '🌳', name: 'Steady Mind',       desc: 'Log mood 30 days in a row',        check: (s) => s.moodStreak >= 30 },
  { id: 'first_grat',   icon: '🙏', name: 'Grateful Heart',    desc: 'Write your first gratitude entry',  check: (s) => s.totalGratDays >= 1 },
  { id: 'grat7',        icon: '💛', name: 'Gratitude Streak',  desc: 'Write gratitude 7 days in a row',  check: (s) => s.gratStreak >= 7 },
  { id: 'sleep_goal',   icon: '🌙', name: 'Rest Well',         desc: 'Log 8h+ sleep 3 nights',           check: (s) => s.goodSleepDays >= 3 },
  { id: 'water5',       icon: '💧', name: 'Hydrated',          desc: 'Hit water goal 5 days',            check: (s) => s.waterGoalDays >= 5 },
  { id: 'session60',    icon: '⏱️', name: 'Flow State',        desc: 'Log 60+ min focus in one session', check: (s) => s.maxSession >= 60 },
  { id: 'session10',    icon: '🔥', name: 'Power User',        desc: 'Log 10 focus sessions',            check: (s) => s.totalSessions >= 10 },
  { id: 'journaled5',   icon: '📔', name: 'Journal Habit',     desc: 'Write 5 journal entries',          check: (s) => s.totalJournals >= 5 },
  { id: 'week_complete',icon: '⭐', name: 'Full Week',         desc: 'Complete a full 7-day mood log',   check: (s) => s.moodStreak >= 7 },
  { id: 'all10',        icon: '🏆', name: 'MindBloom Master',  desc: 'Earn 10 other badges',             check: (s, earned) => earned >= 10 },
];

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

function computeStreak(moodLog) {
  if (!moodLog.length) return 0;
  const sorted = [...moodLog].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let d = new Date();
  d.setHours(0, 0, 0, 0);
  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    const diff = Math.round((d - entryDate) / 86400000);
    if (diff > 1) break;
    if (diff === 0 || diff === 1) { streak++; d = entryDate; }
    else break;
  }
  return streak;
}

function computeGratStreak(gratData) {
  let streak = 0;
  let d = new Date();
  d.setHours(0, 0, 0, 0);
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (gratData[key]?.entries?.some(e => e)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

export default function StreakBadges({ user }) {
  const email = user?.email || 'guest';

  const stats = useMemo(() => {
    const moodLog    = loadJson(`mb_moodlog_${email}`, []);
    const gratData   = loadJson(`mb_gratitude_${email}`, {});
    const sleepData  = loadJson(`mb_sleep_${email}`, {});
    const sessions   = loadJson(`mb_sessions_${email}`, []);
    const journals   = loadJson(`mb_journals_${email}`, {});
    const wellness   = loadJson(`mb_wellness_${email}`, {});

    const moodStreak = computeStreak(moodLog);
    const gratStreak = computeGratStreak(gratData);
    const totalGratDays = Object.values(gratData).filter(d => d?.entries?.some(e => e)).length;

    const goodSleepDays = Object.values(sleepData).flatMap(wk => Object.values(wk)).filter(h => h >= 8).length;
    const waterGoalDays = Object.values(wellness).filter(d => (d?.water || 0) >= 8).length;
    const maxSession = sessions.length ? Math.max(...sessions.map(s => s.minutes || 0)) : 0;
    const totalSessions = sessions.length;
    const totalJournals = Object.values(journals).filter(e => e?.trim()).length;
    const totalMoods = moodLog.length;

    return { moodStreak, gratStreak, totalGratDays, goodSleepDays, waterGoalDays, maxSession, totalSessions, totalJournals, totalMoods };
  }, [email]);

  const earned = BADGES.filter((b, _, arr) => {
    const earnedCount = arr.filter(x => x.check(stats, 0)).length;
    return b.check(stats, earnedCount);
  });
  const earnedIds = new Set(earned.map(b => b.id));

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Streak cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { icon: '🌿', label: 'Mood streak', val: stats.moodStreak, unit: 'days' },
          { icon: '🙏', label: 'Gratitude streak', val: stats.gratStreak, unit: 'days' },
          { icon: '🏅', label: 'Badges earned', val: earned.length, unit: `/ ${BADGES.length}` },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 130px', background: 'rgba(123,170,122,0.07)', border: '1px solid rgba(123,170,122,0.15)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#a8c5a0' }}>{s.val}</div>
            <div style={{ fontSize: '0.68rem', color: '#8a8a82' }}>{s.unit} {s.label.split(' ')[0].toLowerCase()}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{ fontSize: '0.78rem', color: '#8a8a82', marginBottom: 12 }}>
        🏅 {earned.length} of {BADGES.length} badges unlocked
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        {BADGES.map(b => {
          const unlocked = earnedIds.has(b.id);
          return (
            <div key={b.id} style={{
              background: unlocked ? 'rgba(123,170,122,0.1)' : 'rgba(120,120,120,0.04)',
              border: `1px solid ${unlocked ? 'rgba(123,170,122,0.25)' : 'rgba(120,120,120,0.1)'}`,
              borderRadius: 12, padding: '14px 14px', textAlign: 'center',
              opacity: unlocked ? 1 : 0.45, transition: 'all 0.2s',
              position: 'relative',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6, filter: unlocked ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: unlocked ? '#a8c5a0' : '#8a8a82', marginBottom: 3 }}>{b.name}</div>
              <div style={{ fontSize: '0.65rem', color: '#8a8a82', lineHeight: 1.4 }}>{b.desc}</div>
              {unlocked && <div style={{ position: 'absolute', top: 8, right: 8, fontSize: '0.6rem', color: '#7baa7a' }}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
