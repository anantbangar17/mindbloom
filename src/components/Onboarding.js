import React, { useState } from 'react';

const occupations = ['Student', 'Working Professional', 'Freelancer', 'Entrepreneur', 'Homemaker', 'Researcher', 'Artist / Creative', 'Other'];

const diseaseSuggestions = [
  'Migraine', 'Anxiety', 'Depression', 'Insomnia', 'Hypertension',
  'Diabetes', 'Asthma', 'Back Pain', 'ADHD', 'PCOS', 'Thyroid', 'None',
];

const relationshipOptions = [
  { icon: '💔', label: 'Breakup / Heartbreak' },
  { icon: '😶', label: 'Communication issues' },
  { icon: '🤝', label: 'Trust problems' },
  { icon: '😔', label: 'Loneliness' },
  { icon: '💬', label: 'Family conflict' },
  { icon: '🌀', label: 'Something else' },
];

function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(1); // 1=profile, 2=health, 3=relationship fun
  const [profile, setProfile] = useState({ nickname: user.name, occupation: '', age: '', diseases: [] });
  const [relSection, setRelSection] = useState({ enabled: false, type: '', details: '', feeling: '' });

  const toggleDisease = d => {
    setProfile(p => ({
      ...p,
      diseases: p.diseases.includes(d) ? p.diseases.filter(x => x !== d) : [...p.diseases, d],
    }));
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(120,130,110,0.22)',
    color: '#f0ebe0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', outline: 'none',
    boxSizing: 'border-box',
  };

  const Pill = ({ label, selected, onClick }) => (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 99, border: `1px solid ${selected ? 'rgba(123,170,122,0.6)' : 'rgba(120,130,110,0.22)'}`,
      background: selected ? 'rgba(123,170,122,0.18)' : 'transparent',
      color: selected ? '#a8c5a0' : '#8a8a82', fontFamily: 'DM Sans, sans-serif',
      fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', margin: '3px',
    }}>{label}</button>
  );

  const saveAndContinue = () => {
    const key = `mb_user_${user.email}`;
    const raw = JSON.parse(localStorage.getItem(key) || '{}');
    const updated = { ...raw, profile, relSection, onboarded: true };
    localStorage.setItem(key, JSON.stringify(updated));
    onComplete(updated);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', padding: '2rem 1rem' }}>
      <div style={{ position: 'fixed', top: '10%', right: '8%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,170,122,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: '#a8c5a0' }}>
            mind<span style={{ color: '#c8a97a', fontStyle: 'italic' }}>bloom</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginTop: 4 }}>Let's set up your space</div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: '2rem' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ width: s === step ? 24 : 8, height: 8, borderRadius: 99, background: s === step ? '#7baa7a' : s < step ? 'rgba(123,170,122,0.4)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
          ))}
        </div>

        <div style={{ background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 18, padding: '2rem' }}>

          {step === 1 && (
            <>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#f0ebe0', marginBottom: '0.3rem' }}>👋 Tell us about yourself</div>
              <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: '1.5rem' }}>This helps us personalize your experience.</div>

              <label style={{ fontSize: '0.75rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>What should we call you?</label>
              <input style={{ ...inputStyle, marginBottom: '1.25rem' }} placeholder="Your nickname" value={profile.nickname}
                onChange={e => setProfile(p => ({ ...p, nickname: e.target.value }))} />

              <label style={{ fontSize: '0.75rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Age</label>
              <input style={{ ...inputStyle, marginBottom: '1.25rem' }} type="number" placeholder="Your age" value={profile.age}
                onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} />

              <label style={{ fontSize: '0.75rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Occupation</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {occupations.map(o => (
                  <Pill key={o} label={o} selected={profile.occupation === o} onClick={() => setProfile(p => ({ ...p, occupation: o }))} />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#f0ebe0', marginBottom: '0.3rem' }}>🩺 Health background</div>
              <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: '1.5rem' }}>
                Select any conditions that apply. This helps us give you better wellness tips.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {diseaseSuggestions.map(d => (
                  <Pill key={d} label={d} selected={profile.diseases.includes(d)} onClick={() => toggleDisease(d)} />
                ))}
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Anything else? (optional)</label>
                <input style={inputStyle} placeholder="e.g. Scoliosis, Eczema..." />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#f0ebe0', marginBottom: '0.3rem' }}>💬 Relationship corner <span style={{ fontSize: '0.75rem', color: '#8a8a82', fontWeight: 400 }}>(optional & fun)</span></div>
              <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: '1.25rem' }}>
                Sometimes we all need a little guidance. Enable this to get AI-powered relationship advice inside the app.
              </div>

              {/* Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                <div onClick={() => setRelSection(r => ({ ...r, enabled: !r.enabled }))} style={{
                  width: 44, height: 24, borderRadius: 99, background: relSection.enabled ? '#7baa7a' : 'rgba(255,255,255,0.1)',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
                }}>
                  <div style={{ position: 'absolute', top: 3, left: relSection.enabled ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.875rem', color: relSection.enabled ? '#a8c5a0' : '#8a8a82' }}>
                  {relSection.enabled ? 'Enabled ✓' : 'Enable relationship advisor'}
                </span>
              </div>

              {relSection.enabled && (
                <>
                  <label style={{ fontSize: '0.75rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>What's going on?</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {relationshipOptions.map(o => (
                      <button key={o.label} onClick={() => setRelSection(r => ({ ...r, type: o.label }))} style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 99, margin: '3px',
                        border: `1px solid ${relSection.type === o.label ? 'rgba(200,169,122,0.6)' : 'rgba(120,130,110,0.22)'}`,
                        background: relSection.type === o.label ? 'rgba(200,169,122,0.15)' : 'transparent',
                        color: relSection.type === o.label ? '#e8d0a8' : '#8a8a82',
                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer',
                      }}>
                        {o.icon} {o.label}
                      </button>
                    ))}
                  </div>

                  <label style={{ fontSize: '0.75rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Tell us a bit more (optional)</label>
                  <textarea value={relSection.details} onChange={e => setRelSection(r => ({ ...r, details: e.target.value }))}
                    placeholder="What's the situation? Feel free to share as much or as little as you want..."
                    style={{ ...inputStyle, minHeight: 90, resize: 'vertical', lineHeight: 1.6, marginBottom: '1rem' }} />

                  <label style={{ fontSize: '0.75rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>How are you feeling about it?</label>
                  <input style={inputStyle} placeholder="e.g. Confused, Hurt, Hopeful..."
                    value={relSection.feeling} onChange={e => setRelSection(r => ({ ...r, feeling: e.target.value }))} />
                </>
              )}
            </>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, marginTop: '1.75rem', justifyContent: 'space-between' }}>
            {step > 1
              ? <button onClick={() => setStep(s => s - 1)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(120,130,110,0.22)', background: 'transparent', color: '#8a8a82', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', cursor: 'pointer' }}>← Back</button>
              : <div />
            }
            <button onClick={step < 3 ? () => setStep(s => s + 1) : saveAndContinue} style={{
              padding: '10px 24px', borderRadius: 10, border: 'none',
              background: '#7baa7a', color: 'white',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
            }}>
              {step < 3 ? 'Continue →' : "Let's go 🌿"}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#444', marginTop: '1.25rem' }}>
          You can update all of this later in your profile settings.
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
