import React, { useState } from 'react';

const occupations = ['Student', 'Working Professional', 'Freelancer', 'Entrepreneur', 'Homemaker', 'Researcher', 'Artist / Creative', 'Other'];
const diseaseSuggestions = ['Migraine', 'Anxiety', 'Depression', 'Insomnia', 'Hypertension', 'Diabetes', 'Asthma', 'Back Pain', 'ADHD', 'PCOS', 'Thyroid', 'None'];

function Settings({ user, onUpdate, onClose, theme, onDelete }) {
  const p = user?.profile || {};
  const [form, setForm] = useState({
    nickname: p.nickname || user?.name || '',
    age: p.age || '',
    occupation: p.occupation || '',
    diseases: p.diseases || [],
  });
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const toggleDisease = d => setForm(f => ({
    ...f,
    diseases: f.diseases.includes(d) ? f.diseases.filter(x => x !== d) : [...f.diseases, d],
  }));

  const handleSave = () => {
    const key = `mb_user_${user.email}`;
    const raw = JSON.parse(localStorage.getItem(key) || '{}');
    const updated = { ...raw, profile: { ...raw.profile, ...form }, name: form.nickname };
    localStorage.setItem(key, JSON.stringify(updated));
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    // Remove all user data
    localStorage.removeItem(`mb_user_${user.email}`);
    localStorage.removeItem(`mb_tasks_${user.email}`);
    localStorage.removeItem(`mb_moods_${user.email}`);
    localStorage.removeItem('mb_current');
    if (onDelete) onDelete();
  };

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const bg = isDark ? '#0d1117' : '#f5f5f0';
  const cardBg = isDark ? '#161b22' : '#ffffff';
  const border = isDark ? 'rgba(120,130,110,0.18)' : 'rgba(0,0,0,0.1)';
  const text = isDark ? '#f0ebe0' : '#1a1a1a';
  const muted = isDark ? '#8a8a82' : '#6a6a62';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 9,
    background: inputBg, border: `1px solid ${border}`,
    color: text, fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', outline: 'none',
    boxSizing: 'border-box',
  };

  const Pill = ({ label, selected, onClick }) => (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: 99, margin: '3px',
      border: `1px solid ${selected ? 'rgba(123,170,122,0.5)' : border}`,
      background: selected ? 'rgba(123,170,122,0.15)' : 'transparent',
      color: selected ? '#7baa7a' : muted,
      fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', cursor: 'pointer',
    }}>{label}</button>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: '1.75rem', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 500, color: text }}>Profile settings</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: muted, cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', padding: '0.875rem', background: inputBg, borderRadius: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(123,170,122,0.2)', border: '1px solid rgba(123,170,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#7baa7a', fontWeight: 600 }}>
            {(form.nickname || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: text, fontWeight: 500 }}>{form.nickname || 'Your name'}</div>
            <div style={{ fontSize: '0.75rem', color: muted }}>{user?.email}</div>
          </div>
        </div>

        <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: muted, display: 'block', marginBottom: 5 }}>Display name</label>
        <input style={{ ...inputStyle, marginBottom: '1rem' }} value={form.nickname} onChange={set('nickname')} placeholder="Your name" />

        <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: muted, display: 'block', marginBottom: 5 }}>Age</label>
        <input style={{ ...inputStyle, marginBottom: '1rem' }} type="number" value={form.age} onChange={set('age')} placeholder="Your age" />

        <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: muted, display: 'block', marginBottom: 8 }}>Occupation</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {occupations.map(o => <Pill key={o} label={o} selected={form.occupation === o} onClick={() => setForm(f => ({ ...f, occupation: o }))} />)}
        </div>

        <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: muted, display: 'block', marginBottom: 8 }}>Health conditions</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {diseaseSuggestions.map(d => <Pill key={d} label={d} selected={form.diseases.includes(d)} onClick={() => toggleDisease(d)} />)}
        </div>

        <button onClick={handleSave} style={{
          width: '100%', padding: '11px', borderRadius: 10, border: 'none',
          background: saved ? '#4a7a4a' : '#7baa7a', color: 'white',
          fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s',
        }}>
          {saved ? '✓ Saved!' : 'Save changes'}
        </button>

        {/* Delete account */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: `1px solid ${border}` }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e07070', marginBottom: 8 }}>Danger zone</div>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} style={{
              width: '100%', padding: '10px', borderRadius: 10,
              border: '1px solid rgba(224,112,112,0.3)', background: 'rgba(224,112,112,0.07)',
              color: '#e07070', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', cursor: 'pointer',
            }}>
              🗑 Delete my account
            </button>
          ) : (
            <div style={{ background: 'rgba(224,112,112,0.08)', border: '1px solid rgba(224,112,112,0.25)', borderRadius: 10, padding: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#f0ebe0', marginBottom: '0.5rem', fontWeight: 500 }}>Are you sure?</div>
              <div style={{ fontSize: '0.78rem', color: muted, marginBottom: '0.875rem', lineHeight: 1.6 }}>
                This will permanently delete your account, all mood logs, tasks, habits, and journal entries. This cannot be undone.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfirmDelete(false)} style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${border}`,
                  background: 'transparent', color: muted, fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', cursor: 'pointer',
                }}>Cancel</button>
                <button onClick={handleDelete} style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                  background: '#c0392b', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', cursor: 'pointer',
                }}>Yes, delete everything</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
