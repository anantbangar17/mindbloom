import React, { useState, useEffect, useRef } from 'react';

const TECHNIQUES = [
  {
    id: 'box',
    label: 'Box Breathing',
    icon: '⬜',
    desc: 'Equal counts — inhale, hold, exhale, hold',
    phases: [
      { name: 'Inhale', dur: 4, color: '#7baa7a' },
      { name: 'Hold', dur: 4, color: '#c8a97a' },
      { name: 'Exhale', dur: 4, color: '#6b9fd4' },
      { name: 'Hold', dur: 4, color: '#c8a97a' },
    ],
  },
  {
    id: 'ground',
    label: '5-4-3-2-1 Grounding',
    icon: '🌿',
    desc: 'Name things you can see, hear, touch…',
    steps: [
      { n: 5, sense: 'things you can SEE', icon: '👁️' },
      { n: 4, sense: 'things you can TOUCH', icon: '✋' },
      { n: 3, sense: 'things you can HEAR', icon: '👂' },
      { n: 2, sense: 'things you can SMELL', icon: '👃' },
      { n: 1, sense: 'thing you can TASTE', icon: '👅' },
    ],
  },
  {
    id: 'affirm',
    label: 'Crisis Affirmations',
    icon: '💛',
    desc: 'Words to hold onto right now',
    affirmations: [
      "This feeling is temporary. It will pass.",
      "I am safe right now, in this moment.",
      "I have survived hard moments before.",
      "I can breathe through this.",
      "My feelings are valid and I can handle them.",
      "One breath at a time is enough.",
      "I am stronger than this moment.",
      "Right now, I just need to breathe.",
    ],
  },
];

function BoxBreath({ phases }) {
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(phases[0].dur);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhase(p => {
            const next = (p + 1) % phases.length;
            if (next === 0) setCycles(cy => cy + 1);
            setCount(phases[next].dur);
            return next;
          });
          return phases[(phase + 1) % phases.length].dur;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running, phase, phases]);

  const cur = phases[phase];
  const progress = 1 - (count - 1) / cur.dur;
  const scale = cur.name === 'Inhale' ? 1 + progress * 0.4
    : cur.name === 'Exhale' ? 1.4 - progress * 0.4
    : cur.name === 'Hold' && phase === 1 ? 1.4
    : 1;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 180, height: 180, margin: '24px auto' }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%', margin: '30px auto',
          background: `radial-gradient(circle, ${cur.color}33, ${cur.color}11)`,
          border: `2px solid ${cur.color}66`,
          transform: `scale(${scale})`, transition: 'transform 1s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: cur.color }}>{count}</div>
        </div>
      </div>
      <div style={{ fontSize: '1rem', color: cur.color, fontWeight: 600, marginBottom: 4 }}>{cur.name}</div>
      <div style={{ fontSize: '0.75rem', color: '#8a8a82', marginBottom: 20 }}>Cycle {cycles + 1}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        {phases.map((p, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === phase ? cur.color : 'rgba(120,120,120,0.2)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <button onClick={() => setRunning(r => !r)} style={{
        padding: '10px 28px', borderRadius: 24, cursor: 'pointer', fontSize: '0.9rem',
        background: running ? 'rgba(224,112,112,0.15)' : 'rgba(123,170,122,0.15)',
        border: `1px solid ${running ? 'rgba(224,112,112,0.3)' : 'rgba(123,170,122,0.3)'}`,
        color: running ? '#e07070' : '#7baa7a', fontFamily: 'DM Sans, sans-serif',
      }}>
        {running ? 'Pause' : 'Start Breathing'}
      </button>
    </div>
  );
}

function Grounding({ steps }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const s = steps[step];
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      {!done ? (
        <>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>{s.icon}</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7baa7a', marginBottom: 8 }}>{s.n}</div>
          <div style={{ fontSize: '1rem', color: '#c8c4bc', marginBottom: 8 }}>{s.sense}</div>
          <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: 24 }}>
            Take your time. Look around, notice each one.
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= step ? '#7baa7a' : 'rgba(120,120,120,0.2)', transition: 'background 0.3s' }} />
            ))}
          </div>
          <button onClick={() => { if (step < steps.length - 1) setStep(s => s + 1); else setDone(true); }} style={{
            padding: '10px 28px', borderRadius: 24, cursor: 'pointer',
            background: 'rgba(123,170,122,0.15)', border: '1px solid rgba(123,170,122,0.3)',
            color: '#7baa7a', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
          }}>
            {step < steps.length - 1 ? 'Next →' : 'Finish'}
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌟</div>
          <div style={{ fontSize: '1.1rem', color: '#a8c5a0', fontWeight: 600, marginBottom: 8 }}>You did it.</div>
          <div style={{ fontSize: '0.85rem', color: '#8a8a82', marginBottom: 20 }}>Grounding complete. Notice how you feel now.</div>
          <button onClick={() => { setStep(0); setDone(false); }} style={{
            padding: '8px 20px', borderRadius: 20, cursor: 'pointer',
            background: 'rgba(123,170,122,0.1)', border: '1px solid rgba(123,170,122,0.2)',
            color: '#7baa7a', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem',
          }}>Start again</button>
        </>
      )}
    </div>
  );
}

function Affirmations({ affirmations }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const next = () => {
    setFade(false);
    setTimeout(() => { setIdx(i => (i + 1) % affirmations.length); setFade(true); }, 250);
  };
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.25s', fontSize: '1.05rem', color: '#c8c4bc', lineHeight: 1.6, fontStyle: 'italic', maxWidth: 320 }}>
          "{affirmations[idx]}"
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        {affirmations.map((_, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === idx ? '#c8a97a' : 'rgba(120,120,120,0.2)', transition: 'background 0.3s', cursor: 'pointer' }} onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 250); }} />
        ))}
      </div>
      <button onClick={next} style={{
        padding: '10px 28px', borderRadius: 24, cursor: 'pointer',
        background: 'rgba(200,169,122,0.15)', border: '1px solid rgba(200,169,122,0.3)',
        color: '#c8a97a', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
      }}>
        Next affirmation
      </button>
    </div>
  );
}

export default function EmergencyCalm() {
  const [active, setActive] = useState(null);

  if (active !== null) {
    const t = TECHNIQUES[active];
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
        <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', color: '#8a8a82', cursor: 'pointer', fontSize: '0.85rem', marginBottom: 20, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Back
        </button>
        <div style={{ background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.15)', borderRadius: 16, padding: '24px 20px', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{t.icon}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#a8c5a0', marginBottom: 4 }}>{t.label}</div>
          <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: 20 }}>{t.desc}</div>
          {t.phases && <BoxBreath phases={t.phases} />}
          {t.steps && <Grounding steps={t.steps} />}
          {t.affirmations && <Affirmations affirmations={t.affirmations} />}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      {/* SOS banner */}
      <div style={{ background: 'rgba(200,169,122,0.1)', border: '1px solid rgba(200,169,122,0.25)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🆘</div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#c8a97a', marginBottom: 4 }}>Emergency Calm Mode</div>
        <div style={{ fontSize: '0.82rem', color: '#8a8a82', lineHeight: 1.5 }}>
          Take a breath. Pick a technique below. You've got this.
        </div>
      </div>

      {/* Technique cards */}
      {TECHNIQUES.map((t, i) => (
        <button key={t.id} onClick={() => setActive(i)} style={{
          display: 'flex', alignItems: 'center', gap: 14, width: '100%', marginBottom: 10,
          padding: '16px 18px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
          background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.12)',
          fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
        }}>
          <span style={{ fontSize: '1.8rem' }}>{t.icon}</span>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#c8c4bc', marginBottom: 2 }}>{t.label}</div>
            <div style={{ fontSize: '0.78rem', color: '#8a8a82' }}>{t.desc}</div>
          </div>
          <span style={{ marginLeft: 'auto', color: '#8a8a82' }}>→</span>
        </button>
      ))}

      <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(224,112,112,0.05)', border: '1px solid rgba(224,112,112,0.12)', borderRadius: 10, fontSize: '0.78rem', color: '#8a8a82', lineHeight: 1.5 }}>
        If you're in crisis, please reach out: <span style={{ color: '#e07070' }}>iCall India — 9152987821</span> · <span style={{ color: '#e07070' }}>Vandrevala Foundation — 1860-2662-345</span>
      </div>
    </div>
  );
}
