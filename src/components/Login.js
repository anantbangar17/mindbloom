import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';

const SIGNUP_LINES = [
  "Your wellness journey starts here.",
  "Every great habit begins with day one.",
  "A healthier mind, one day at a time.",
  "Welcome to your personal safe space.",
];

const LOGIN_LINES = [
  "Welcome back.",
  "Good to see you again.",
  "Your streak is waiting for you.",
  "Ready to check in?",
];

function Login({ onLogin, onSwitch, isSignup }) {
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [typing, setTyping]   = useState(true);

  const lines = isSignup ? SIGNUP_LINES : LOGIN_LINES;

  // Cycle through taglines
  useEffect(() => {
    setLineIdx(0);
    setTyping(true);
  }, [isSignup]);

  const handleLineDone = () => {
    setTimeout(() => {
      setTyping(false);
      setTimeout(() => {
        setLineIdx(i => (i + 1) % lines.length);
        setTyping(true);
      }, 600);
    }, 1800);
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (isSignup && !form.name) { setError('Please enter your name.'); return; }
    if (!form.email.includes('@')) { setError('Enter a valid email address.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      const key = `mb_user_${form.email}`;
      if (isSignup) {
        if (localStorage.getItem(key)) { setError('Account already exists. Please log in.'); setLoading(false); return; }
        const userData = { name: form.name, email: form.email, password: form.password, onboarded: false };
        localStorage.setItem(key, JSON.stringify(userData));
        localStorage.setItem('mb_current', form.email);
        onLogin(userData);
      } else {
        const raw = localStorage.getItem(key);
        if (!raw) { setError('No account found. Please sign up.'); setLoading(false); return; }
        const userData = JSON.parse(raw);
        if (userData.password !== form.password) { setError('Incorrect password.'); setLoading(false); return; }
        localStorage.setItem('mb_current', form.email);
        onLogin(userData);
      }
      setLoading(false);
    }, 800);
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(120,130,110,0.22)',
    color: '#f0ebe0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none',
    marginBottom: '0.875rem', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', padding: '1rem' }}>
      {/* Background blobs */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,170,122,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,122,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.2rem', color: '#a8c5a0', marginBottom: 8 }}>
            mind<span style={{ color: '#c8a97a', fontStyle: 'italic' }}>bloom</span>
          </div>

          {/* Typewriter tagline */}
          <div style={{ fontSize: '0.9rem', color: '#8a8a82', minHeight: '1.5rem' }}>
            {typing && (
              <TypewriterText
                key={`${isSignup}-${lineIdx}`}
                text={lines[lineIdx]}
                speed={42}
                delay={100}
                color="#8a8a82"
                onDone={handleLineDone}
              />
            )}
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 18, padding: '2rem' }}>
          {/* Heading with typewriter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 500, color: '#f0ebe0', marginBottom: '0.25rem' }}>
              {isSignup ? 'Create your account' : (
                <TypewriterText text="Welcome back" speed={60} color="#f0ebe0" cursor={false} />
              )}
              {isSignup && ''}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#8a8a82' }}>
              {isSignup
                ? 'Start your wellness journey — it takes 30 seconds.'
                : <TypewriterText text="Your space is ready for you." speed={40} delay={900} color="#8a8a82" cursor={false} />
              }
            </div>
          </div>

          {isSignup && (
            <input style={inputStyle} placeholder="Full name" value={form.name} onChange={set('name')} />
          )}
          <input style={inputStyle} type="email" placeholder="Email address" value={form.email} onChange={set('email')} />
          <input style={inputStyle} type="password" placeholder="Password" value={form.password} onChange={set('password')}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

          {error && (
            <div style={{ background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.25)', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem', color: '#e07070', marginBottom: '0.75rem' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none',
            background: loading ? '#4a7a4a' : '#7baa7a', color: 'white',
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginBottom: '1rem',
          }}>
            {loading ? 'Please wait...' : (isSignup ? 'Create account' : 'Sign in')}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#8a8a82' }}>
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={onSwitch} style={{ color: '#a8c5a0', cursor: 'pointer', textDecoration: 'underline' }}>
              {isSignup ? 'Sign in' : 'Sign up'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#444', marginTop: '1.5rem' }}>
          🔒 All data stored locally on your device.
        </div>
      </div>
    </div>
  );
}

export default Login;
