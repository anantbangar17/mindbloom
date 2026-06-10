import React, { useState, useEffect, useRef } from 'react';
import CircleProgress from './CircleProgress';

function Focus({ tasks, toggleTask, addTask, removeTask }) {
  const [timerOn, setTimerOn] = useState(false);
  const [timerSec, setTimerSec] = useState(25 * 60);
  const [timerMode, setTimerMode] = useState('focus');
  const [newTask, setNewTask] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTimerSec(s => {
          if (s <= 1) { clearInterval(timerRef.current); setTimerOn(false); return 0; }
          return s - 1;
        });
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  const totalSec = timerMode === 'focus' ? 25 * 60 : 5 * 60;
  const pct = Math.round(((totalSec - timerSec) / totalSec) * 100);
  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const switchMode = (mode) => { setTimerMode(mode); setTimerSec(mode === 'focus' ? 25 * 60 : 5 * 60); setTimerOn(false); };

  const handleAdd = () => {
    if (!newTask.trim()) return;
    addTask(newTask.trim());
    setNewTask('');
    setShowAdd(false);
  };

  const btn = (label, onClick, primary) => (
    <button onClick={onClick} style={{
      borderRadius: 8, padding: primary ? '9px 20px' : '6px 14px',
      fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500,
      cursor: 'pointer', border: primary ? 'none' : '1px solid rgba(120,130,110,0.22)',
      background: primary ? '#7baa7a' : 'transparent',
      color: primary ? 'white' : '#8a8a82', transition: 'all 0.2s',
    }}>{label}</button>
  );

  const card = { background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.5rem', fontFamily: 'DM Sans, sans-serif' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>

      {/* Timer */}
      <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '1.5rem', alignSelf: 'flex-start' }}>Pomodoro timer</div>

        <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'absolute' }}><CircleProgress pct={pct} color="#7baa7a" size={130} stroke={6} /></div>
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.2rem', color: '#f0ebe0' }}>{fmtTime(timerSec)}</div>
            <div style={{ fontSize: '0.7rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{timerMode}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          {btn('Focus', () => switchMode('focus'), timerMode === 'focus')}
          {btn('Break', () => switchMode('break'), timerMode === 'break')}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {btn(timerOn ? 'Pause' : 'Start', () => setTimerOn(t => !t), true)}
          {btn('Reset', () => { setTimerOn(false); setTimerSec(totalSec); }, false)}
        </div>

        <div style={{ marginTop: '1.5rem', width: '100%', background: 'rgba(123,170,122,0.06)', borderRadius: 8, padding: '10px 12px', fontSize: '0.75rem', color: '#8a8a82', lineHeight: 1.6 }}>
          <strong style={{ color: '#a8c5a0' }}>How it works:</strong><br />
          Focus 25 min → short break 5 min → repeat. After 4 rounds, take a long break.
        </div>
      </div>

      {/* Task list */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82' }}>Task list</div>
          <button onClick={() => setShowAdd(s => !s)} style={{
            background: 'transparent', border: '1px solid rgba(123,170,122,0.35)', borderRadius: 6,
            color: '#a8c5a0', fontSize: '0.72rem', padding: '3px 10px', cursor: 'pointer',
          }}>+ Add task</button>
        </div>

        {showAdd && (
          <div style={{ display: 'flex', gap: 6, marginBottom: '0.875rem' }}>
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="What do you want to focus on?"
              autoFocus
              style={{
                flex: 1, padding: '7px 10px', borderRadius: 7,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(120,130,110,0.22)',
                color: '#f0ebe0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none',
              }}
            />
            <button onClick={handleAdd} style={{ background: '#7baa7a', border: 'none', borderRadius: 7, color: 'white', padding: '7px 12px', cursor: 'pointer', fontSize: '0.78rem' }}>✓</button>
          </div>
        )}

        {tasks.length === 0 && !showAdd && (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#8a8a82', fontSize: '0.82rem' }}>
            No tasks yet — add one to get started
          </div>
        )}

        {tasks.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(120,130,110,0.1)' }}>
            <div onClick={() => toggleTask(t.id)} style={{
              width: 17, height: 17, borderRadius: 4, flexShrink: 0, cursor: 'pointer',
              border: `1px solid ${t.done ? '#7baa7a' : 'rgba(120,130,110,0.4)'}`,
              background: t.done ? '#7baa7a' : 'transparent', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.65rem', color: 'white', transition: 'all 0.2s',
            }}>{t.done ? '✓' : ''}</div>
            <span onClick={() => toggleTask(t.id)} style={{
              flex: 1, fontSize: '0.85rem', color: t.done ? '#555' : '#d0ccc4',
              textDecoration: t.done ? 'line-through' : 'none', cursor: 'pointer',
            }}>{t.text}</span>
            <button onClick={() => removeTask(t.id)} style={{
              background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px',
            }} title="Remove">✕</button>
          </div>
        ))}

        {tasks.length > 0 && (
          <div style={{ marginTop: '0.875rem', fontSize: '0.75rem', color: '#8a8a82' }}>
            {tasks.filter(t => t.done).length} of {tasks.length} completed
          </div>
        )}
      </div>
    </div>
  );
}

export default Focus;
