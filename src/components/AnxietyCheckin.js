import React, { useState } from 'react';

const STEPS = [
  { n: 5, sense: 'SEE',   icon: '👁️',  color: '#7baa7a',  prompt: 'Look around you. Name 5 things you can see right now.', placeholder: 'e.g. a window, a plant, my hands...' },
  { n: 4, sense: 'TOUCH', icon: '✋',  color: '#9ab5d4',  prompt: 'Name 4 things you can physically touch or feel right now.', placeholder: 'e.g. the chair, my shirt, the desk...' },
  { n: 3, sense: 'HEAR',  icon: '👂',  color: '#c8a97a',  prompt: 'Listen carefully. Name 3 things you can hear.', placeholder: 'e.g. birds, a fan, distant traffic...' },
  { n: 2, sense: 'SMELL', icon: '👃',  color: '#b49dd4',  prompt: 'Name 2 things you can smell (or scents you remember).', placeholder: 'e.g. coffee, fresh air...' },
  { n: 1, sense: 'TASTE', icon: '👅',  color: '#e07070',  prompt: 'Name 1 thing you can taste right now.', placeholder: 'e.g. toothpaste, water, nothing...' },
];

const BREATHING_CUE = "Before we begin — take one slow breath. Breathe in... and out. 🌬️";

export default function AnxietyCheckin() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState(STEPS.map(() => Array(5).fill('')));
  const [done, setDone] = useState(false);
  const [anxiety, setAnxiety] = useState(null);

  const cur = STEPS[step];
  const curInputs = inputs[step].slice(0, cur.n);

  const setEntry = (si, val) => {
    setInputs(prev => {
      const updated = prev.map((arr, i) => i === step ? [...arr] : arr);
      updated[step][si] = val;
      return updated;
    });
  };

  const filled = curInputs.filter(v => v.trim()).length;
  const canNext = filled >= 1;

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else setDone(true);
  };
  const reset = () => { setStarted(false); setStep(0); setInputs(STEPS.map(() => Array(5).fill(''))); setDone(false); setAnxiety(null); };

  if (!started) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ background: 'rgba(154,181,212,0.08)', border: '1px solid rgba(154,181,212,0.2)', borderRadius: 16, padding: '28px 24px', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🧠</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#9ab5d4', marginBottom: 8 }}>Anxiety Check-in</div>
          <div style={{ fontSize: '0.85rem', color: '#8a8a82', lineHeight: 1.6, marginBottom: 20 }}>
            The 5-4-3-2-1 technique gently pulls your mind back to the present moment by engaging all five senses.
            Takes about 2–3 minutes.
          </div>
          <div style={{ fontSize: '0.82rem', color: '#c8c4bc', marginBottom: 24, fontStyle: 'italic' }}>{BREATHING_CUE}</div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.78rem', color: '#8a8a82', marginBottom: 8 }}>Before we start — how anxious do you feel right now?</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => setAnxiety(n)} style={{
                  width: 36, height: 36, borderRadius: '50%', border: `1px solid ${anxiety === n ? '#9ab5d4' : 'rgba(154,181,212,0.2)'}`,
                  background: anxiety === n ? 'rgba(154,181,212,0.2)' : 'rgba(154,181,212,0.04)',
                  color: anxiety === n ? '#9ab5d4' : '#8a8a82', cursor: 'pointer', fontSize: '0.8rem',
                  fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                }}>{n}</button>
              ))}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#8a8a82', marginTop: 4 }}>1 = calm, 10 = very anxious</div>
          </div>

          <button onClick={() => setStarted(true)} style={{ padding: '11px 30px', borderRadius: 24, background: 'rgba(154,181,212,0.15)', border: '1px solid rgba(154,181,212,0.3)', color: '#9ab5d4', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', cursor: 'pointer' }}>
            Begin →
          </button>
        </div>

        <div style={{ background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.1)', borderRadius: 10, padding: '12px 16px', fontSize: '0.78rem', color: '#8a8a82', lineHeight: 1.6 }}>
          <strong style={{ color: '#a8c5a0' }}>How it works:</strong> Each step asks you to notice things in your environment using a different sense, drawing attention away from anxious thoughts and into the present moment.
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}>
        <div style={{ background: 'rgba(123,170,122,0.08)', border: '1px solid rgba(123,170,122,0.2)', borderRadius: 16, padding: '32px 24px', marginBottom: 20 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌿</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#a8c5a0', marginBottom: 8 }}>Well done.</div>
          <div style={{ fontSize: '0.9rem', color: '#8a8a82', lineHeight: 1.6, marginBottom: 20 }}>
            You've completed the 5-4-3-2-1 grounding exercise. Take a moment to notice how your body feels now.
          </div>

          {anxiety && (
            <div style={{ background: 'rgba(154,181,212,0.07)', border: '1px solid rgba(154,181,212,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: '0.78rem', color: '#9ab5d4', marginBottom: 6 }}>How are you feeling now compared to when you started?</div>
              <div style={{ fontSize: '0.75rem', color: '#8a8a82' }}>You started at anxiety level <strong style={{ color: '#9ab5d4' }}>{anxiety}/10</strong></div>
            </div>
          )}

          {/* Summary of what they wrote */}
          <div style={{ textAlign: 'left', marginBottom: 20 }}>
            {STEPS.map((s, si) => (
              <div key={si} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '0.72rem', color: s.color, marginBottom: 3 }}>{s.icon} {s.n} things to {s.sense.toLowerCase()}</div>
                <div style={{ fontSize: '0.82rem', color: '#c8c4bc' }}>
                  {inputs[si].slice(0, s.n).filter(v => v.trim()).join(' · ') || '—'}
                </div>
              </div>
            ))}
          </div>

          <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 20, background: 'rgba(123,170,122,0.12)', border: '1px solid rgba(123,170,122,0.25)', color: '#7baa7a', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>
            Do it again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? s.color : 'rgba(120,120,120,0.15)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div style={{ background: `rgba(${cur.color === '#7baa7a' ? '123,170,122' : cur.color === '#9ab5d4' ? '154,181,212' : cur.color === '#c8a97a' ? '200,169,122' : cur.color === '#b49dd4' ? '180,157,212' : '224,112,112'},0.06)`, border: `1px solid ${cur.color}30`, borderRadius: 16, padding: '24px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: '1.8rem' }}>{cur.icon}</span>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#8a8a82' }}>Step {step + 1} of {STEPS.length}</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: cur.color }}>{cur.n} things to {cur.sense}</div>
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#c8c4bc', marginBottom: 16, lineHeight: 1.5 }}>{cur.prompt}</div>

        {curInputs.map((val, si) => (
          <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: val.trim() ? `${cur.color}33` : 'rgba(120,120,120,0.1)', border: `1px solid ${val.trim() ? cur.color + '55' : 'rgba(120,120,120,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: cur.color, flexShrink: 0, transition: 'all 0.2s' }}>
              {si + 1}
            </div>
            <input
              value={val}
              onChange={e => setEntry(si, e.target.value)}
              placeholder={si === 0 ? cur.placeholder : ''}
              style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: `1px solid ${val.trim() ? cur.color + '40' : 'rgba(120,130,110,0.2)'}`, background: 'rgba(123,170,122,0.03)', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none', transition: 'border 0.2s' }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: '#8a8a82' }}>{filled}/{cur.n} filled in</div>
        <button onClick={next} disabled={!canNext} style={{
          padding: '10px 24px', borderRadius: 20, cursor: canNext ? 'pointer' : 'not-allowed',
          background: canNext ? `${cur.color}22` : 'rgba(120,120,120,0.08)',
          border: `1px solid ${canNext ? cur.color + '44' : 'rgba(120,120,120,0.12)'}`,
          color: canNext ? cur.color : '#8a8a82', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', transition: 'all 0.2s',
        }}>
          {step < STEPS.length - 1 ? 'Next →' : 'Finish ✓'}
        </button>
      </div>
    </div>
  );
}
