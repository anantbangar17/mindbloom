import React from 'react';

const navItems = [
  { id: 'dashboard',   icon: '¼í', label: 'Dashboard' },
  { id: 'mood',        icon: 'ùæ', label: 'Mood Log' },
  { id: 'focus',       icon: 'ùÄ', label: 'Focus' },
  { id: 'habits',      icon: 'ûª', label: 'Habits' },
  { id: 'journal',     icon: 'û¤', label: 'Journal' },
  { id: 'songs',       icon: ' Re ', label: 'Songs' },
  { id: 'relationship', icon: '💬', label: 'Heart Space' },
];

function Sidebar({ view, setView, user, onLogout, onOpenSettings, theme, isOpen, onClose }) {
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const bg = isDark ? '#161b22' : '#f0ede6';
  const border = isDark ? 'rgba(120,130,110,0.18)' : 'rgba(0,0,0,0.1)';
  const activeText = '#a8c5a0';
  const inactiveText = isDark ? '#8a8a82' : '#888880';
  const activeBg = 'rgba(123,170,122,0.15)';
  const textColor = isDark ? '#d0ccc4' : '#3a3a34';

  return (
    <nav className={`sidebar-nav ${isOpen ? 'open' : ''}`} style={{
      width: 220, background: bg,
      borderRight: `1px solid ${border}`,
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem 1rem', gap: '0.25rem', flexShrink: 0, minHeight: '100vh',
    }}>
      {/* Brand Header + Mobile Close Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#a8c5a0' }}>
          mind<span style={{ color: '#c8a97a', fontStyle: 'italic' }}>bloom</span>
        </div>
        {/* Mobile Close 'X' Button */}
        <button className="menu-close-btn" onClick={onClose} style={{
          background: 'transparent', border: 'none', fontSize: '1.5rem', color: inactiveText, cursor: 'pointer', display: 'none'
        }}>
          &times;
        </button>
      </div>

      {navItems.map(n => (
        <button key={n.id}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '0.6rem 0.75rem', borderRadius: 8, cursor: 'pointer',
            fontSize: '0.875rem', border: 'none', width: '100%', textAlign: 'left', transition: 'all 0.2s',
            background: view === n.id ? activeBg : 'transparent',
            color: view === n.id ? activeText : inactiveText,
          }}
          onClick={() => {
            setView(n.id);
            if (onClose) onClose(); // Auto-closes sidebar panel on mobile link tap
          }}
        >
          <span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center' }}>{n.icon}</span>
          {n.label}
        </button>
      ))}

      <div style={{ marginTop: 'auto', borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>
        <button onClick={() => { onOpenSettings(); if (onClose) onClose(); }} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.75rem',
          borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', border: 'none',
          width: '100%', textAlign: 'left', background: 'transparent', color: inactiveText,
          marginBottom: '0.5rem', transition: 'all 0.2s',
        }}>
          <span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center' }}>⚙</span>
          Settings
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.25rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(123,170,122,0.2)', border: '1px solid rgba(123,170,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#a8c5a0', fontWeight: 500, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.profile?.nickname || user?.name}</div>
            <div style={{ fontSize: '0.65rem', color: inactiveText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
          <button onClick={onLogout} title="Sign out" style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.85rem', padding: 4 }}>⎻</button>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;