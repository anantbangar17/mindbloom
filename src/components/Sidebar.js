import React, { useState } from 'react';
import {
  Hexagon, CircleDot, Target, NotebookPen, Grid3x3,
  Wind, Moon, Droplets, LifeBuoy, Brain,
  HandHeart, LineChart, Sparkles, Heart, ClipboardList, Timer,
  Music, MessageCircle, Award, Goal,
  Settings, Power,
} from 'lucide-react';

// ── Navigation groups ────────────────────────────────────────────────────────
const NAV_MAIN = [
  { id: 'dashboard', icon: Hexagon,     label: 'Dashboard' },
  { id: 'mood',      icon: CircleDot,   label: 'Mood' },
  { id: 'focus',     icon: Target,      label: 'Focus' },
  { id: 'journal',   icon: NotebookPen, label: 'Journal' },
  { id: 'habits',    icon: Grid3x3,     label: 'Habits' },
];

// Each hub gets its own accent color — used for icon + active bg tint when active/hovered
const NAV_HUBS = [
  { id: 'hub_wellbeing', label: 'Wellbeing', color: '#7baa7a' }, // green
  { id: 'hub_reflect',   label: 'Reflect',   color: '#c8a97a' }, // gold/amber
  { id: 'hub_connect',   label: 'Connect',   color: '#9ab5d4' }, // blue
];

const HUB_CHILDREN = {
  hub_wellbeing: ['breathing', 'sleep', 'wellness', 'emergency', 'anxiety'],
  hub_reflect:   ['gratitude', 'insights', 'quote', 'affirmations', 'weeklyreview', 'sessions'],
  hub_connect:   ['songs', 'relationship', 'streaks', 'focusgoals'],
};

const ALL_LEAF_ITEMS = [
  // Wellbeing
  { id: 'breathing',    icon: Wind,         label: 'Breathing' },
  { id: 'sleep',        icon: Moon,         label: 'Sleep Tracker' },
  { id: 'wellness',     icon: Droplets,     label: 'Water & Meals' },
  { id: 'emergency',    icon: LifeBuoy,     label: 'Emergency Calm' },
  { id: 'anxiety',      icon: Brain,        label: 'Anxiety Check-in' },
  // Reflect
  { id: 'gratitude',    icon: HandHeart,    label: 'Gratitude' },
  { id: 'insights',     icon: LineChart,    label: 'Mood Insights' },
  { id: 'quote',        icon: Sparkles,     label: 'Daily Quote' },
  { id: 'affirmations', icon: Heart,        label: 'Affirmations' },
  { id: 'weeklyreview', icon: ClipboardList,label: 'Weekly Review' },
  { id: 'sessions',     icon: Timer,        label: 'Session Log' },
  // Connect
  { id: 'songs',        icon: Music,        label: 'Songs' },
  { id: 'relationship', icon: MessageCircle,label: 'Heart Space' },
  { id: 'streaks',      icon: Award,        label: 'Streaks & Badges' },
  { id: 'focusgoals',   icon: Goal,         label: 'Focus Goals' },
];

function parentHub(viewId) {
  for (const [hub, children] of Object.entries(HUB_CHILDREN)) {
    if (children.includes(viewId)) return hub;
  }
  return null;
}

// Convert a hex color like #7baa7a to an rgba string with given alpha
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function Sidebar({ view, setView, user, onLogout, onOpenSettings, theme, isMobile }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const isDark    = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const bg        = isDark ? '#161b22'                : '#f0ede6';
  const drawerBg  = isDark ? '#1c2230'                : '#e8e4da';
  const border    = isDark ? 'rgba(120,130,110,0.18)' : 'rgba(0,0,0,0.1)';
  const activeText= '#a8c5a0';
  const inactive  = isDark ? '#8a8a82'                : '#888880';
  const activeBg  = 'rgba(123,170,122,0.15)';
  const textColor = isDark ? '#d0ccc4'                : '#3a3a34';
  const sectionLabelColor = isDark ? 'rgba(160,170,150,0.55)' : 'rgba(80,80,70,0.55)';

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const activeHub = HUB_CHILDREN.hasOwnProperty(view) ? view : parentHub(view);
  const navigate = (id) => { setView(id); setDrawerOpen(false); };
  const isActive = (id) => view === id || (HUB_CHILDREN[id] && HUB_CHILDREN[id].includes(view));

  // ── MOBILE ────────────────────────────────────────────────────────────
  if (isMobile) {
    const bottomItems = [...NAV_MAIN.slice(0, 4), { id: '_more', icon: Grid3x3, label: 'More' }];

    return (
      <>
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: bg, borderTop: `1px solid ${border}`,
          display: 'flex', alignItems: 'stretch', height: 58,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {bottomItems.map(n => {
            const active = n.id === '_more'
              ? (drawerOpen || activeHub || !NAV_MAIN.slice(0, 4).some(m => m.id === view))
              : isActive(n.id);
            const Icon = n.id === '_more' ? null : n.icon;
            return (
              <button key={n.id} onClick={() => n.id === '_more' ? setDrawerOpen(d => !d) : navigate(n.id)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, border: 'none', cursor: 'pointer',
                background: active ? activeBg : 'transparent',
                color: active ? activeText : inactive,
                borderTop: active ? '2px solid #7baa7a' : '2px solid transparent',
                transition: 'all 0.15s',
              }}>
                {n.id === '_more'
                  ? <DotsIcon color={active ? activeText : inactive} />
                  : <Icon size={19} strokeWidth={1.8} />}
                <span style={{ fontSize: '0.52rem', letterSpacing: '0.02em' }}>{n.label}</span>
              </button>
            );
          })}
        </nav>

        {drawerOpen && (
          <>
            <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60 }} />
            <div style={{
              position: 'fixed', bottom: 58, left: 0, right: 0, zIndex: 70,
              background: drawerBg, borderTop: `1px solid ${border}`,
              borderRadius: '18px 18px 0 0', padding: '0.75rem 1rem 1rem',
              animation: 'slideUp 0.22s ease', maxHeight: '70vh', overflowY: 'auto',
            }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', margin: '0 auto 1rem' }} />

              <MobileNavBtn n={NAV_MAIN[4]} view={view} navigate={navigate} activeText={activeText} textColor={textColor} activeBg={activeBg} inactive={inactive}
                hoveredId={hoveredId} setHoveredId={setHoveredId} />

              {NAV_HUBS.map(hub => (
                <div key={hub.id}>
                  <div style={{ fontSize: '0.64rem', color: sectionLabelColor, fontWeight: 600, padding: '10px 0.875rem 5px', letterSpacing: '0.09em', textTransform: 'uppercase' }}>{hub.label}</div>
                  {HUB_CHILDREN[hub.id].map(childId => {
                    const item = ALL_LEAF_ITEMS.find(l => l.id === childId);
                    if (!item) return null;
                    return (
                      <MobileNavBtn key={childId} n={item} view={view} navigate={navigate}
                        activeText={activeText} textColor={textColor} activeBg={activeBg} inactive={inactive}
                        indent accentColor={hub.color} hoveredId={hoveredId} setHoveredId={setHoveredId} />
                    );
                  })}
                </div>
              ))}

              <div style={{ height: 1, background: border, margin: '0.5rem 0' }} />

              <button onClick={() => { onOpenSettings(); setDrawerOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '0.7rem 0.875rem', borderRadius: 10, border: 'none',
                background: 'transparent', color: textColor,
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
              }}>
                <Settings size={18} strokeWidth={1.8} /> Settings & Profile
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 0.875rem', borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', margin: '0.5rem 0 0' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(123,170,122,0.2)', border: '1px solid rgba(123,170,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#a8c5a0', fontWeight: 600, flexShrink: 0 }}>{initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', color: textColor, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.profile?.nickname || user?.name}</div>
                  <div style={{ fontSize: '0.7rem', color: inactive, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                </div>
                <button onClick={() => { onLogout(); setDrawerOpen(false); }} style={{ background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.2)', borderRadius: 8, color: '#e07070', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', padding: '5px 10px' }}>
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
  return (
    <nav style={{
      width: 220, background: bg, borderRight: `1px solid ${border}`,
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem 1rem', gap: '0.15rem', flexShrink: 0, minHeight: '100vh',
    }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#a8c5a0', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
        mind<span style={{ color: '#c8a97a', fontStyle: 'italic' }}>bloom</span>
      </div>

      {NAV_MAIN.map(n => (
        <DesktopNavBtn key={n.id} n={n} active={isActive(n.id)} onClick={() => setView(n.id)}
          activeText={activeText} inactive={inactive} activeBg={activeBg}
          hoveredId={hoveredId} setHoveredId={setHoveredId} />
      ))}

      {NAV_HUBS.map(hub => (
        <div key={hub.id} style={{ marginTop: 10 }}>
          <div style={{
            fontSize: '0.62rem', color: sectionLabelColor, fontWeight: 600,
            padding: '4px 0.75rem 5px', letterSpacing: '0.09em', textTransform: 'uppercase',
            borderTop: `1px solid ${border}`, marginTop: 4, paddingTop: 12,
          }}>{hub.label}</div>
          {HUB_CHILDREN[hub.id].map(childId => {
            const item = ALL_LEAF_ITEMS.find(l => l.id === childId);
            if (!item) return null;
            return (
              <DesktopNavBtn key={childId} n={item} active={view === childId} onClick={() => setView(childId)}
                activeText={activeText} inactive={inactive} activeBg={activeBg}
                indent accentColor={hub.color} hoveredId={hoveredId} setHoveredId={setHoveredId} />
            );
          })}
        </div>
      ))}

      <div style={{ marginTop: 'auto', borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>
        <button onClick={onOpenSettings} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.55rem 0.75rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', border: 'none', width: '100%', textAlign: 'left', background: 'transparent', color: inactive, marginBottom: '0.5rem', transition: 'all 0.2s' }}>
          <Settings size={18} strokeWidth={1.8} /> Settings
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.25rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(123,170,122,0.2)', border: '1px solid rgba(123,170,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#a8c5a0', fontWeight: 500, flexShrink: 0 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.profile?.nickname || user?.name}</div>
            <div style={{ fontSize: '0.65rem', color: inactive, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
          <button onClick={onLogout} title="Sign out" style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <Power size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Small helper components ──────────────────────────────────────────────────
// accentColor: the hub's theme color (only passed for hub children, not main nav)
function DesktopNavBtn({ n, active, onClick, activeText, inactive, activeBg, indent, accentColor, hoveredId, setHoveredId }) {
  const Icon = n.icon;
  const isHovered = hoveredId === n.id;
  const lit = active || isHovered;

  // Color resolution: hub children use their accent color when lit, main nav uses default green
  const iconColor = accentColor
    ? (lit ? accentColor : inactive)
    : (active ? activeText : inactive);

  const bgColor = accentColor
    ? (lit ? hexToRgba(accentColor, 0.13) : 'transparent')
    : (active ? activeBg : 'transparent');

  const textColorResolved = accentColor
    ? (lit ? accentColor : inactive)
    : (active ? activeText : inactive);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHoveredId(n.id)}
      onMouseLeave={() => setHoveredId(null)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0.5rem 0.75rem', paddingLeft: indent ? '1.4rem' : '0.75rem',
        borderRadius: 8, cursor: 'pointer', fontSize: indent ? '0.81rem' : '0.875rem',
        fontWeight: indent ? 400 : 500,
        border: 'none', width: '100%', textAlign: 'left', transition: 'all 0.18s',
        background: bgColor,
        color: textColorResolved,
      }}
    >
      <Icon size={indent ? 15 : 17} strokeWidth={1.8} style={{ flexShrink: 0, color: iconColor, transition: 'color 0.18s' }} />
      {n.label}
    </button>
  );
}

function MobileNavBtn({ n, view, navigate, activeText, textColor, activeBg, inactive, indent, accentColor, hoveredId, setHoveredId }) {
  const Icon = n.icon;
  const active = view === n.id;
  const isHovered = hoveredId === n.id;
  const lit = active || isHovered;

  const iconColor = accentColor
    ? (lit ? accentColor : inactive)
    : (active ? activeText : inactive);

  const bgColor = accentColor
    ? (lit ? hexToRgba(accentColor, 0.13) : 'transparent')
    : (active ? activeBg : 'transparent');

  const textColorResolved = accentColor
    ? (lit ? accentColor : textColor)
    : (active ? activeText : textColor);

  return (
    <button
      onClick={() => navigate(n.id)}
      onTouchStart={() => setHoveredId(n.id)}
      onTouchEnd={() => setHoveredId(null)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '0.6rem 0.875rem', paddingLeft: indent ? '1.6rem' : '0.875rem',
        borderRadius: 10, border: 'none',
        background: bgColor,
        color: textColorResolved,
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.87rem',
        cursor: 'pointer', marginBottom: 2, textAlign: 'left', transition: 'all 0.18s',
      }}
    >
      <Icon size={17} strokeWidth={1.8} style={{ flexShrink: 0, color: iconColor, transition: 'color 0.18s' }} />
      {n.label}
    </button>
  );
}

function DotsIcon({ color }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="5" cy="12" r="1.4" fill={color} stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill={color} stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill={color} stroke="none" />
    </svg>
  );
}

export default Sidebar;