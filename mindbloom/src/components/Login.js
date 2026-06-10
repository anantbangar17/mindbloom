import React, { useState } from 'react';

function Login({ onLogin, onSwitch, isSignup }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (isSignup && !form.name) { setError('Please enter your name.'); return; }
    if (!form.email.includes('@')) { setError('Enter a valid email address.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);

    // Simulate auth — in real app replace with API call
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
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Background blobs */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,170,122,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,122,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 1.5rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: '#a8c5a0', marginBottom: 4 }}>
            mind<span style={{ color: '#c8a97a', fontStyle: 'italic' }}>bloom</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8a8a82', letterSpacing: '0.06em' }}>your mental wellness companion</div>
        </div>

        {/* Card */}
        <div style={{ background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 18, padding: '2rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#f0ebe0', marginBottom: '0.3rem' }}>
            {isSignup ? 'Create your account' : 'Welcome back'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: '1.5rem' }}>
            {isSignup ? 'Start your wellness journey today.' : 'Your data is waiting for you.'}
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
            background: loading ? 'var(--sage-dark, #4a7a4a)' : '#7baa7a', color: 'white',
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

        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#555', marginTop: '1.5rem' }}>
          Your data is stored locally on this device. 🔒
        </div>
      </div>
    </div>
  );
}

export default Login;
