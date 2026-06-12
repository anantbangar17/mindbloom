import React, { useState } from 'react';

const YEAR = new Date().getFullYear();

const CHANGELOG = [
  { version: 'v1.0.0', date: 'Jun 2025', notes: 'Initial release — Dashboard, Mood Log, Focus, Habits, Journal, Heart Space' },
  { version: 'v1.1.0', date: 'Jun 2025', notes: 'Multi-user auth (Login/Signup), Onboarding flow, per-user data isolation' },
  { version: 'v1.2.0', date: 'Jun 2025', notes: 'habits and mood chart now show real user entries only' },
  { version: 'v1.3.0', date: 'Jun 2025', notes: 'Mood streak counter, live clock' },
  { version: 'v1.4.0', date: 'Jun 2025', notes: 'Theme toggle (dark/light/system), Settings modal, clickable date viewer, Songs page' },
  { version: 'v1.5.0', date: 'Jun 2025', notes: 'Changelog, feedback/bug buttons, social links, privacy notice, app icon' },
  { version: 'v1.6.0', date: 'Jun 2025', notes: 'Typewriter greeting, mood-based tips, responsive mobile layout, delete account' },
];

function Footer({ theme, isMobile }) {
  const [expanded,      setExpanded]  = useState(false);
  const [showChangelog, setChangelog] = useState(false);
  const [showPrivacy,   setPrivacy]   = useState(false);
  const [copied,        setCopied]    = useState(false);

  const isDark     = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const bg         = isDark ? '#0d1117'                : '#eae7de';
  const cardBg     = isDark ? '#161b22'                : '#ffffff';
  const border     = isDark ? 'rgba(120,130,110,0.12)' : 'rgba(0,0,0,0.08)';
  const border2    = isDark ? 'rgba(120,130,110,0.2)'  : 'rgba(0,0,0,0.12)';
  const textMain   = isDark ? '#666'                   : '#888';
  const textAccent = isDark ? '#7baa7a'                : '#4a7a4a';
  const linkColor  = isDark ? '#8a8a82'                : '#777';
  const textFull   = isDark ? '#d0ccc4'                : '#2a2a24';
  const mutedColor = isDark ? '#444'                   : '#bbb';

  const handleFeedback = () => window.location.href = `mailto:anantbangar2005@gmail.com?subject=MindBloom Feedback&body=Hi Anant,%0D%0A%0D%0A`;
  const handleBug      = () => window.location.href = `mailto:anantbangar2005@gmail.com?subject=MindBloom Bug Report&body=Bug description:%0D%0A%0D%0ASteps:%0D%0A`;
  const handleShare    = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const dot = <span style={{ margin: '0 5px', opacity: 0.3 }}>·</span>;

  const chipBtn = (emoji, label, onClick) => (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99,
      background: 'transparent', border: `1px solid ${border2}`,
      color: linkColor, fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', cursor: 'pointer',
    }}><span>{emoji}</span>{label}</button>
  );

  const socialChip = (href, emoji, label) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99,
      background: 'transparent', border: `1px solid ${border2}`,
      color: linkColor, fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', textDecoration: 'none',
    }}><span>{emoji}</span>{label}</a>
  );

  const Modal = ({ children, onClose }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: cardBg, border: `1px solid ${border2}`, borderRadius: 16, padding: '1.5rem', width: '100%', maxWidth: 480, maxHeight: '80vh', overflowY: 'auto', fontFamily: 'DM Sans, sans-serif' }}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      <footer style={{
        background: bg,
        borderTop: `1px solid ${border}`,
        padding: isMobile ? '0.875rem 1rem' : '0.875rem 2rem',
        fontFamily: 'DM Sans, sans-serif',
        marginBottom: isMobile ? 58 : 0,
      }}>

        {/* Row 1: brand + copyright centred */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '0.625rem' }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '0.95rem', color: textAccent }}>
            mind<span style={{ color: '#c8a97a', fontStyle: 'italic' }}>bloom</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: textMain }}>
            © {YEAR} <strong style={{ color: linkColor }}>Anant Bangar</strong>. All rights reserved.
          </span>
        </div>

        {/* Row 2: version + More info left-ish, actions right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: '0.625rem', fontSize: '0.68rem', color: mutedColor, flexWrap: 'wrap' }}>
          <span>v1.6.0</span>
          {dot}
          <span>Rajasthan, India 🇮🇳</span>
          {dot}
          <button onClick={() => setExpanded(e => !e)} style={{
            background: 'transparent', border: 'none', color: textAccent,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', padding: 0,
          }}>
            {expanded ? 'Less ↑' : 'More info ↓'}
          </button>
        </div>

        {/* Row 3: contact LEFT, actions RIGHT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${border}` }}>

          {/* LEFT — social / contact links */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: mutedColor, marginRight: 2 }}>Connect:</span>
            {socialChip('https://www.linkedin.com/in/anant-bangar', '💼', 'LinkedIn')}
            {socialChip('https://www.hackerrank.com/profile/anantbangar2005', '⭐', 'HackerRank')}
            {socialChip('https://leetcode.com/u/anantbangar2005', '🧩', 'LeetCode')}
            {socialChip('mailto:anantbangar2005@gmail.com', '📧', 'Email')}
          </div>

          {/* RIGHT — action buttons */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
            {chipBtn('💬', 'Feedback', handleFeedback)}
            {chipBtn('🐛', 'Report bug', handleBug)}
            {chipBtn(copied ? '✓' : '🔗', copied ? 'Copied!' : 'Share', handleShare)}
            {chipBtn('📋', 'Changelog', () => setChangelog(true))}
            {chipBtn('🔒', 'Privacy', () => setPrivacy(true))}
          </div>
        </div>

        {/* Expanded "More info" section */}
        {expanded && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${border}`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.63rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: textAccent, marginBottom: 6 }}>About</div>
              <div style={{ fontSize: '0.71rem', color: textMain, lineHeight: 1.7 }}>MindBloom is an AI-powered mental health & productivity companion — a personal project by Anant Bangar, B.Tech CSE student at Arya College of Engineering & IT, Jaipur (2023–2027).</div>
            </div>
            <div>
              <div style={{ fontSize: '0.63rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: textAccent, marginBottom: 6 }}>Developer</div>
              <div style={{ fontSize: '0.71rem', color: textMain, lineHeight: 1.9 }}>
                <div>👨‍💻 Anant Bangar</div>
                <div>📧 anantbangar2005@gmail.com</div>
                <div>📍 Bhilwara, Rajasthan</div>
                <div>🎓 B.Tech CSE · 2023–2027</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.63rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: textAccent, marginBottom: 6 }}>Built with</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {['React 18', 'JavaScript', 'CSS-in-JS', 'localStorage', 'DM Sans', 'DM Serif Display'].map(t => (
                  <span key={t} style={{ fontSize: '0.63rem', padding: '2px 7px', borderRadius: 99, background: isDark ? 'rgba(123,170,122,0.1)' : 'rgba(123,170,122,0.12)', color: textAccent, border: `1px solid rgba(123,170,122,0.2)` }}>{t}</span>
                ))}
              </div>
              <div style={{ fontSize: '0.68rem', color: mutedColor, marginTop: 7, lineHeight: 1.6 }}>Backend + AI/ML coming soon.</div>
            </div>
            <div>
              <div style={{ fontSize: '0.63rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: textAccent, marginBottom: 6 }}>Disclaimer</div>
              <div style={{ fontSize: '0.71rem', color: textMain, lineHeight: 1.7 }}>For personal wellness use only. Not a substitute for professional medical advice. All data stored locally — nothing is sent to any server.</div>
            </div>
          </div>
        )}
      </footer>

      {/* Changelog Modal */}
      {showChangelog && (
        <Modal onClose={() => setChangelog(false)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 500, color: textFull }}>📋 Changelog</div>
            <button onClick={() => setChangelog(false)} style={{ background: 'transparent', border: 'none', color: linkColor, cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          </div>
          {[...CHANGELOG].reverse().map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: i < CHANGELOG.length - 1 ? `1px solid ${border2}` : 'none' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textAccent, fontFamily: 'monospace' }}>{c.version}</div>
                <div style={{ fontSize: '0.65rem', color: linkColor }}>{c.date}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: textMain, lineHeight: 1.6 }}>{c.notes}</div>
            </div>
          ))}
        </Modal>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <Modal onClose={() => setPrivacy(false)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 500, color: textFull }}>🔒 Privacy Policy</div>
            <button onClick={() => setPrivacy(false)} style={{ background: 'transparent', border: 'none', color: linkColor, cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          </div>
          {[
            { title: 'Data storage', body: 'All your data — mood logs, tasks, habits, journal entries, and profile — is stored exclusively in your browser\'s localStorage. Nothing is sent to any server.' },
            { title: 'No tracking', body: 'MindBloom uses no cookies, analytics, or advertising trackers. No third-party SDKs collect your data.' },
            { title: 'No account servers', body: 'Accounts are simulated locally. Your email and password exist only on your device.' },
            { title: 'Music app links', body: 'Music app buttons redirect to that app\'s public search page. No personal data is shared.' },
            { title: 'Email links', body: 'Feedback/bug buttons open your email client with a draft. Nothing is sent automatically.' },
            { title: 'Data deletion', body: 'Use "Delete account" in Settings, or clear all mb_ keys from browser DevTools → Application → Local Storage.' },
            { title: 'Contact', body: 'Privacy questions: anantbangar2005@gmail.com' },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textAccent, marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: '0.8rem', color: textMain, lineHeight: 1.7 }}>{s.body}</div>
            </div>
          ))}
          <div style={{ fontSize: '0.7rem', color: mutedColor, borderTop: `1px solid ${border2}`, paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            Last updated: June 2025 · MindBloom by Anant Bangar
          </div>
        </Modal>
      )}
    </>
  );
}

export default Footer;
