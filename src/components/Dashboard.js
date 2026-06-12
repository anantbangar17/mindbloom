import React, { useState } from 'react';

const MOODS = [
  { emoji: '😔', label: 'Low' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😊', label: 'Good' },
  { emoji: '🌟', label: 'Great' },
];

const AFFIRMATIONS = [
  "Progress, not perfection, is the goal.",
  "Your mind deserves rest as much as your body.",
  "Small steps still move you forward.",
  "You are more resilient than you realize.",
  "Today's effort is tomorrow's strength.",
];

// 8–10 tips per mood — purely rule-based, no AI needed
const MOOD_TIPS = {
  0: [ // Low
    "It's okay to not be okay. Rest is productive too.",
    "Try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s.",
    "Step outside for 5 minutes — sunlight helps reset your mood.",
    "Write down one thing that went okay today, however small.",
    "Drink a glass of water — dehydration quietly worsens low moods.",
    "Put on a song that feels like a warm blanket.",
    "Be gentle with yourself today. You're doing your best.",
    "Talk to someone you trust, even just a quick message.",
    "Avoid big decisions when you're feeling low — rest first.",
    "A short nap (20 min) can restore more than you think.",
  ],
  1: [ // Meh
    "Feeling 'meh' is valid. You don't have to feel amazing.",
    "Try a 10-minute walk — movement shifts energy better than anything.",
    "Pick one tiny task to complete. Done > perfect.",
    "Change your environment briefly — move to a different room.",
    "A warm drink and 5 minutes of silence can reset your head.",
    "Put on music that makes you want to move.",
    "Write 3 things you're looking forward to, even small ones.",
    "Stretch for 5 minutes — tension in the body affects your mood.",
    "Reach out to a friend — connection lifts 'meh' faster than solo effort.",
    "Sometimes 'meh' just means your brain needs a break. Take one.",
  ],
  2: [ // Okay
    "Okay is a great foundation — build something on it today.",
    "Use this steady energy for a task you've been putting off.",
    "Try the Pomodoro technique: 25 min focus, 5 min break.",
    "A 15-minute walk can push 'okay' to 'good' quickly.",
    "Write one thing you're grateful for — even if it feels ordinary.",
    "A calm mood is perfect for journaling your thoughts.",
    "Check in with someone — when you're okay is a great time to give.",
    "Do one thing that makes tomorrow-you grateful.",
    "Use this time to plan your evening so it's intentional.",
    "Hydrate, eat something nourishing, and keep the momentum.",
  ],
  3: [ // Good
    "Ride this energy — tackle something that matters to you.",
    "Good moods are contagious. Reach out and brighten someone's day.",
    "Log what made today feel good — patterns are powerful.",
    "Deep work is easiest when you feel good. Block 90 minutes.",
    "This is a great time to start a new habit.",
    "Exercise when you feel good — it amplifies the benefits.",
    "Write something creative — your imagination is sharper right now.",
    "Share your energy: help a classmate, colleague, or friend.",
    "Set a challenging goal today — you're in the zone.",
    "Take a moment to appreciate how you feel. Savour it.",
  ],
  4: [ // Great
    "You're at your best — protect this energy intentionally.",
    "Tackle your hardest, most important task right now.",
    "Share this energy — call someone who might need a boost.",
    "This is perfect for creative work, problem-solving, or learning.",
    "Plan your week ahead while your mind is sharp.",
    "Exercise hard today — your body matches your mood.",
    "Write down what created this feeling so you can recreate it.",
    "Start something you've been dreaming about — today is the day.",
    "Celebrate this feeling — you've earned it.",
    "Use this confidence to have a conversation you've been avoiding.",
  ],
};

// Default tips shown before mood is logged
const DEFAULT_TIPS = [
  "Log your mood to get personalised tips.",
  "How you start your morning shapes your whole day.",
  "Drink water. Seriously — most people are dehydrated.",
  "One deep breath is always available, always free.",
];

function getTip(moodIdx) {
  const pool = moodIdx !== null ? MOOD_TIPS[moodIdx] : DEFAULT_TIPS;
  const minuteSlot = Math.floor(Date.now() / 60000); // changes every minute
  return pool[minuteSlot % pool.length];
}

function Dashboard({ selectedMood, setSelectedMood, tasks, toggleTask, addTask, affIdx, setAffIdx, moodHistory, setMoodHistory }) {
  const [newTaskText, setNewTaskText] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  function getTodayIndex() {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  }

  const handleMoodSelect = (i) => {
    setSelectedMood(i);
    if (setMoodHistory) {
      const todayIdx = getTodayIndex();
      setMoodHistory({ ...moodHistory, [todayIdx]: i });
    }
  };

  const doneTasks = tasks.filter(t => t.done).length;
  const taskPct = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const tip = getTip(selectedMood);

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    addTask(newTaskText.trim());
    setNewTaskText('');
    setShowAddTask(false);
  };

  const statCard = (label, accent, value, sub, pct, pctColor) => (
    <div style={{ background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent }} />
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a8a82', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: '#f0ebe0' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#8a8a82', marginTop: 4 }}>{sub}</div>
      {pct !== null && (
        <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginTop: 10 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pctColor, borderRadius: 99, transition: 'width 0.4s ease' }} />
        </div>
      )}
    </div>
  );

  // Calculate mood logging streak (consecutive days ending today)
  function getTodayIndex() { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; }
  const todayIdx = getTodayIndex();
  let streak = 0;
  for (let i = todayIdx; i >= 0; i--) {
    if (moodHistory[i] !== undefined && moodHistory[i] !== null) streak++;
    else break;
  }
  const streakLabel = streak === 0 ? 'Log today to start' : streak === 1 ? '1 day — keep going!' : `${streak} days in a row 🔥`;

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Stat cards — auto-fit so they stack on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {statCard(
          "Today's mood",
          '#7baa7a',
          selectedMood !== null ? MOODS[selectedMood].emoji : '—',
          selectedMood !== null ? MOODS[selectedMood].label : 'Not logged yet',
          null, null
        )}
        {statCard(
          'Tasks done',
          '#7aaac8',
          tasks.length === 0 ? '—' : `${doneTasks}/${tasks.length}`,
          tasks.length === 0 ? 'No tasks added yet' : `${taskPct}% complete`,
          tasks.length > 0 ? taskPct : null,
          '#7aaac8'
        )}
        {statCard(
          'Mood streak',
          '#c8a97a',
          streak === 0 ? '—' : `${streak}`,
          streakLabel,
          null, null
        )}
      </div>

      {/* Mood check-in + Task list — stack on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>

        {/* Mood */}
        <div style={{ background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.75rem' }}>How are you feeling?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => handleMoodSelect(i)} style={{
                flex: 1, border: `1px solid ${selectedMood === i ? '#7baa7a' : 'rgba(120,130,110,0.22)'}`,
                background: selectedMood === i ? 'rgba(123,170,122,0.18)' : 'transparent',
                borderRadius: 8, padding: '8px 4px', cursor: 'pointer', fontSize: '1.2rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, transition: 'all 0.2s',
              }}>
                {m.emoji}
                <span style={{ fontSize: '0.6rem', color: '#8a8a82', fontFamily: 'DM Sans' }}>{m.label}</span>
              </button>
            ))}
          </div>
          {selectedMood !== null && (
            <div style={{ marginTop: '0.75rem', padding: '8px 12px', background: 'rgba(123,170,122,0.07)', border: '1px solid rgba(123,170,122,0.2)', borderRadius: 8, fontSize: '0.78rem', color: '#a8c5a0' }}>
              ✦ Feeling {MOODS[selectedMood].label} — logged at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          <div style={{ marginTop: '0.875rem', background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.15)', borderRadius: 8, padding: '10px 12px', fontSize: '0.78rem', color: '#a8c5a0', lineHeight: 1.65 }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7baa7a', marginBottom: 4, opacity: 0.8 }}>
              {selectedMood !== null ? `Tip for when you're feeling ${MOODS[selectedMood].label.toLowerCase()}` : 'Wellness tip'}
            </div>
            💡 {tip}
          </div>
        </div>

        {/* Tasks */}
        <div style={{ background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82' }}>Today's tasks</div>
            <button onClick={() => setShowAddTask(s => !s)} style={{
              background: 'transparent', border: '1px solid rgba(123,170,122,0.3)', borderRadius: 6,
              color: '#a8c5a0', fontSize: '0.72rem', padding: '3px 10px', cursor: 'pointer',
            }}>+ Add</button>
          </div>

          {showAddTask && (
            <div style={{ display: 'flex', gap: 6, marginBottom: '0.75rem' }}>
              <input
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                placeholder="What do you want to do?"
                autoFocus
                style={{
                  flex: 1, padding: '6px 10px', borderRadius: 7,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(120,130,110,0.22)',
                  color: '#f0ebe0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', outline: 'none',
                }}
              />
              <button onClick={handleAddTask} style={{ background: '#7baa7a', border: 'none', borderRadius: 7, color: 'white', padding: '6px 10px', cursor: 'pointer', fontSize: '0.78rem' }}>✓</button>
            </div>
          )}

          {tasks.length === 0 && !showAddTask && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#8a8a82', fontSize: '0.82rem' }}>
              No tasks yet — click + Add to start
            </div>
          )}

          {tasks.slice(0, 5).map(t => (
            <div key={t.id} onClick={() => toggleTask(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0',
              borderBottom: '1px solid rgba(120,130,110,0.1)', cursor: 'pointer',
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${t.done ? '#7baa7a' : 'rgba(120,130,110,0.4)'}`,
                background: t.done ? '#7baa7a' : 'transparent', fontSize: '0.6rem', color: 'white', transition: 'all 0.2s',
              }}>{t.done ? '✓' : ''}</div>
              <span style={{ flex: 1, fontSize: '0.82rem', color: t.done ? '#555' : '#d0ccc4', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            </div>
          ))}

          {tasks.length > 5 && (
            <div style={{ fontSize: '0.72rem', color: '#8a8a82', marginTop: 6, textAlign: 'center' }}>
              +{tasks.length - 5} more — see Focus page
            </div>
          )}
        </div>
      </div>

      {/* Affirmation */}
      <div style={{ background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.75rem' }}>Daily affirmation</div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: '1.1rem', color: '#e8d0a8', lineHeight: 1.6, borderLeft: '2px solid rgba(200,169,122,0.5)', paddingLeft: '1rem' }}>
          "{AFFIRMATIONS[affIdx]}"
        </div>
        <button onClick={() => setAffIdx(i => (i + 1) % AFFIRMATIONS.length)}
          style={{ marginTop: '0.875rem', background: 'transparent', border: '1px solid rgba(120,130,110,0.22)', borderRadius: 8, padding: '5px 14px', fontSize: '0.75rem', color: '#8a8a82', cursor: 'pointer' }}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
