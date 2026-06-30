import React, { useState, useEffect, useRef } from 'react';

const PATTERNS = [
  {
    id: 'box',
    label: 'Box Breathing',
    desc: 'Equal counts — steadies the nervous system',
    phases: [
      { name: 'Inhale', sec: 4 },
      { name: 'Hold', sec: 4 },
      { name: 'Exhale', sec: 4 },
      { name: 'Hold', sec: 4 },
    ],
  },
  {
    id: '478',
    label: '4-7-8 Relaxing',
    desc: 'Deep relaxation — great before sleep',
    phases: [
      { name: 'Inhale', sec: 4 },
      { name: 'Hold', sec: 7 },
      { name: 'Exhale', sec: 8 },
    ],
  },
  {
    id: 'calm',
    label: 'Calming Breath',
    desc: 'Quick reset — anywhere, anytime',
    phases: [
      { name: 'Inhale', sec: 4 },
      { name: 'Exhale', sec: 6 },
    ],
  },
];

function Breathing() {
  const [patternId, setPatternId] = useState('box');
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secLeft, setSecLeft] = useState(PATTERNS[0].phases[0].sec);
  const [cycles, setCycles] = useState(0);
  const tickRef = useRef(null);

  const pattern = PATTERNS.find(p => p.id === patternId);
  const phase = pattern.phases[phaseIdx % pattern.phases.length];

  // Reset when pattern changes
  useEffect(() => {
    setRunning(false);
    setPhaseIdx(0);
    setCycles(0);
    setSecLeft(pattern.phases[0].sec);
  }, [patternId]);

  useEffect(() => {
    if (!running) { clearInterval(tickRef.current); return; }
    tickRef.current = setInterval(() => {
      setSecLeft(s => {
        if (s > 1) return s - 1;
        // time's up for this phase — advance to next phase
        setPhaseIdx(pi => {
          const next = (pi + 1) % pattern.phases.length;
          if (next === 0) setCycles(c => c + 1);
          return next;
        });
        return 0; // will be immediately overwritten by the phase-change effect below
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [running, pattern]);

  // Whenever the phase changes, load its duration as the new countdown
  useEffect(() => {
    setSecLeft(pattern.phases[phaseIdx % pattern.phases.length].sec);
  }, [phaseIdx, pattern]);

  // Circle grows on Inhale, shrinks on Exhale, and stays put during Hold
  // (Hold keeps whatever size the previous phase left it at)
  const prevPhase = pattern.phases[(phaseIdx - 1 + pattern.phases.length) % pattern.phases.length];
  let circleScale;
  if (phase.name === 'Inhale') circleScale = 1;
  else if (phase.name === 'Exhale') circleScale = 0.62;
  else circleScale = prevPhase.name === 'Inhale' ? 1 : 0.62; // Hold

  const toggle = () => setRunning(r => !r);
  const reset = () => { setRunning(false); setPhaseIdx(0); setCycles(0); setSecLeft(pattern.phases[0].sec); };

  const card = { background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.5rem', fontFamily: 'DM Sans, sans-serif' };
  const pill = (active) => ({
    padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: '0.8rem',
    border: `1px solid ${active ? 'rgba(123,170,122,0.5)' : 'rgba(120,130,110,0.22)'}`,
    background: active ? 'rgba(123,170,122,0.15)' : 'transparent',
    color: active ? '#a8c5a0' : '#8a8a82', transition: 'all 0.2s', textAlign: 'left',
  });
  const btn = (label, onClick, primary) => (
    <button onClick={onClick} style={{
      borderRadius: 8, padding: primary ? '9px 22px' : '8px 16px',
      fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500,
      cursor: 'pointer', border: primary ? 'none' : '1px solid rgba(120,130,110,0.22)',
      background: primary ? '#7baa7a' : 'transparent',
      color: primary ? 'white' : '#8a8a82', transition: 'all 0.2s',
    }}>{label}</button>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>

      {/* Breathing circle */}
      <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '1.5rem', alignSelf: 'flex-start' }}>
          Breathing guide
        </div>

        <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,170,122,0.18), rgba(123,170,122,0.04))',
            border: '1px solid rgba(123,170,122,0.3)',
            transform: `scale(${circleScale})`,
            transition: `transform ${phase.sec}s ease-in-out`,
          }} />
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: '#f0ebe0' }}>{phase.name}</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: '#a8c5a0' }}>{secLeft}</div>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#8a8a82', marginBottom: '1.25rem' }}>
          Cycle {cycles} {cycles === 1 ? 'completed' : 'completed'}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {btn(running ? 'Pause' : 'Start', toggle, true)}
          {btn('Reset', reset, false)}
        </div>
      </div>

      {/* Pattern picker + info */}
      <div style={card}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.875rem' }}>
          Choose a pattern
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.25rem' }}>
          {PATTERNS.map(p => (
            <button key={p.id} onClick={() => setPatternId(p.id)} style={pill(p.id === patternId)}>
              <div style={{ fontWeight: 500 }}>{p.label}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: 2 }}>{p.desc}</div>
              <div style={{ fontSize: '0.68rem', opacity: 0.6, marginTop: 4 }}>
                {p.phases.map(ph => `${ph.name[0]}${ph.sec}`).join(' · ')}
              </div>
            </button>
          ))}
        </div>

        <div style={{ background: 'rgba(123,170,122,0.06)', border: '1px solid rgba(123,170,122,0.2)', borderRadius: 8, padding: '10px 12px', fontSize: '0.75rem', color: '#8a8a82', lineHeight: 1.6 }}>
          <strong style={{ color: '#a8c5a0' }}>How to use:</strong><br />
          Follow the circle — it grows on inhale and shrinks on exhale. Sit comfortably, breathe through your nose, and let your shoulders relax. 3–5 cycles is usually enough to feel a shift.
        </div>
      </div>
    </div>
  );
}

export default Breathing;
