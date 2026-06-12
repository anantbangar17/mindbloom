import React, { useState } from 'react';

const NAV_MAIN = [
  { id: 'dashboard',    icon: '⬡', label: 'Dashboard' },
  { id: 'mood',         icon: '◑', label: 'Mood' },
  { id: 'focus',        icon: '◎', label: 'Focus' },
  { id: 'habits',       icon: '▦', label: 'Habits' },
  { id: 'journal',      icon: '▤', label: 'Journal' },
];

const NAV_MORE = [
  { id: 'songs',        icon: '🎵', label: 'Songs' },
  { id: 'relationship', icon: '💬', label: 'Heart Space' },
];

function Sidebar({ view, setView, user, onLogout, onOpenSettings, theme, isMobile }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isDark     = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const bg         = isDark ? '#161b22'                : '#f0ede6';
  const drawerBg   = isDark ? '#1c2230'                : '#e8e4da';
  const border     = isDark ? 'rgba(120,130,110,0.18)' : 'rgba(0,0,0,0.1)';
  const activeText = '#a8c5a0';
  const inactive   = isDark ? '#8a8a82'                : '#888880';
  const activeBg   = 'rgba(123,170,122,0.15)';
  const textColor  = isDark ? '#d0ccc4'                : '#3a3a34';

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const isMoreActive = NAV_MORE.some(n => n.id === view);

  const navigate = (id) => { setView(id); setDrawerOpen(false); };

  // ── MOBILE ────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Bottom tab bar */}
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: bg, borderTop: `1px solid ${border}`,
          display: 'flex', alignItems: 'stretch', height: 58,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {NAV_MAIN.map(n => (
            <button key={n.id} onClick={() => navigate(n.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 2, border: 'none', cursor: 'pointer',
              background: view === n.id ? activeBg : 'transparent',
              color: view === n.id ? activeText : inactive,
              borderTop: view === n.id ? '2px solid #7baa7a' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{n.icon}</span>
              <span style={{ fontSize: '0.52rem', letterSpacing: '0.02em' }}>{n.label}</span>
            </button>
          ))}

          {/* More button */}
          <button onClick={() => setDrawerOpen(d => !d)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 2, border: 'none', cursor: 'pointer',
            background: (isMoreActive || drawerOpen) ? activeBg : 'transparent',
            color: (isMoreActive || drawerOpen) ? activeText : inactive,
            borderTop: (isMoreActive || drawerOpen) ? '2px solid #7baa7a' : '2px solid transparent',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: '1.1rem' }}>☰</span>
            <span style={{ fontSize: '0.52rem' }}>More</span>
          </button>
        </nav>

        {/* More drawer — slides up from bottom */}
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <div onClick={() => setDrawerOpen(false)} style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60,
            }} />

            {/* Drawer panel */}
            <div style={{
              position: 'fixed', bottom: 58, left: 0, right: 0, zIndex: 70,
              background: drawerBg, borderTop: `1px solid ${border}`,
              borderRadius: '18px 18px 0 0',
              padding: '0.75rem 1rem 1rem',
              animation: 'slideUp 0.22s ease',
            }}>
              {/* Handle */}
              <div style={{ width: 36, height: 4, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', margin: '0 auto 1rem' }} />

              {/* More nav items */}
              <div style={{ marginBottom: '0.75rem' }}>
                {NAV_MORE.map(n => (
                  <button key={n.id} onClick={() => navigate(n.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    width: '100%', padding: '0.75rem 0.875rem', borderRadius: 10,
                    border: 'none', background: view === n.id ? activeBg : 'transparent',
                    color: view === n.id ? activeText : textColor,
                    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
                    cursor: 'pointer', marginBottom: 2, textAlign: 'left',
                  }}>
                    <span style={{ fontSize: '1.1rem', width: 22 }}>{n.icon}</span>
                    {n.label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: border, margin: '0.5rem 0' }} />

              {/* Settings + Logout */}
              <button onClick={() => { onOpenSettings(); setDrawerOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '0.75rem 0.875rem', borderRadius: 10,
                border: 'none', background: 'transparent', color: textColor,
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
              }}>
                <span style={{ fontSize: '1.1rem', width: 22 }}>⚙</span> Settings & Profile
              </button>

              {/* User info row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 0.875rem', borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', margin: '0.5rem 0 0' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(123,170,122,0.2)', border: '1px solid rgba(123,170,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#a8c5a0', fontWeight: 600, flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', color: textColor, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.profile?.nickname || user?.name}</div>
                  <div style={{ fontSize: '0.7rem', color: inactive, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                </div>
                <button onClick={() => { onLogout(); setDrawerOpen(false); }} style={{
                  background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.2)',
                  borderRadius: 8, color: '#e07070', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', padding: '5px 10px',
                }}>
                  Sign out
                </button>
              </div>
            </div>

            <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
          </>
        )}
      </>
    );
  }

  // ── DESKTOP sidebar ───────────────────────────────────────────────────
  const allNav = [...NAV_MAIN, ...NAV_MORE];
  return (
    <nav style={{
      width: 220, background: bg, borderRight: `1px solid ${border}`,
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem 1rem', gap: '0.25rem', flexShrink: 0, minHeight: '100vh',
    }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#a8c5a0', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
        mind<span style={{ color: '#c8a97a', fontStyle: 'italic' }}>bloom</span>
      </div>
      {allNav.map(n => (
        <button key={n.id} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0.6rem 0.75rem', borderRadius: 8, cursor: 'pointer',
          fontSize: '0.875rem', border: 'none', width: '100%', textAlign: 'left', transition: 'all 0.2s',
          background: view === n.id ? activeBg : 'transparent',
          color: view === n.id ? activeText : inactive,
        }} onClick={() => setView(n.id)}>
          <span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center' }}>{n.icon}</span>
          {n.label}
        </button>
      ))}

      <div style={{ marginTop: 'auto', borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>
        <button onClick={onOpenSettings} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.75rem',
          borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', border: 'none',
          width: '100%', textAlign: 'left', background: 'transparent', color: inactive,
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
            <div style={{ fontSize: '0.65rem', color: inactive, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
          <button onClick={onLogout} title="Sign out" style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.85rem', padding: 4 }}>⏻</button>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
