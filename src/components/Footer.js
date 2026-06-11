import React, { useState } from 'react';

const YEAR = new Date().getFullYear();

const CHANGELOG = [
  { version: 'v1.0.0', date: 'Jun 2025', notes: 'Initial release — Dashboard, Mood Log, Focus timer, Habits, Journal, Heart Space' },
  { version: 'v1.1.0', date: 'Jun 2025', notes: 'Added multi-user auth (Login / Signup), Onboarding flow, per-user data isolation' },
  { version: 'v1.2.0', date: 'Jun 2025', notes: 'Fixed hardcoded fake data — habits and mood chart now show only real user entries' },
  { version: 'v1.3.0', date: 'Jun 2025', notes: 'Added mood streak counter, greeting animation, live clock' },
  { version: 'v1.4.0', date: 'Jun 2025', notes: 'Theme toggle (dark/light/system), Settings modal, clickable date viewer, Songs page, footer' },
  { version: 'v1.5.0', date: 'Jun 2025', notes: 'Added changelog, feedback button, social links, privacy notice, report a bug, app icon' },
];

function Footer({ theme }) {
  const [expanded, setExpanded]       = useState(false);
  const [showChangelog, setChangelog] = useState(false);
  const [showPrivacy, setPrivacy]     = useState(false);
  const [copied, setCopied]           = useState(false);

  const isDark     = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const bg         = isDark ? '#0d1117'                : '#f0ede6';
  const cardBg     = isDark ? '#161b22'                : '#ffffff';
  const border     = isDark ? 'rgba(120,130,110,0.12)' : 'rgba(0,0,0,0.08)';
  const border2    = isDark ? 'rgba(120,130,110,0.18)' : 'rgba(0,0,0,0.1)';
  const textMain   = isDark ? '#666'                   : '#888';
  const textMuted  = isDark ? '#3a3a34'                : '#bbb';
  const textAccent = isDark ? '#7baa7a'                : '#4a7a4a';
  const linkColor  = isDark ? '#8a8a82'                : '#777';
  const textFull   = isDark ? '#d0ccc4'                : '#2a2a24';

  const dot = <span style={{ margin: '0 6px', opacity: 0.35 }}>·</span>;

  const iconBtn = (label, emoji, onClick, title) => (
    <button onClick={onClick} className="footer-chip" title={title || label} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '5px 12px', borderRadius: 99,
      background: 'transparent', border: `1px solid ${border2}`,
      color: linkColor, fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem',
      cursor: 'pointer',
    }}>
      <span>{emoji}</span> {label}
    </button>
  );

  const socialLink = (href, emoji, label) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="footer-chip" style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '5px 12px', borderRadius: 99,
      background: 'transparent', border: `1px solid ${border2}`,
      color: linkColor, fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem',
      textDecoration: 'none',
    }}>
      <span>{emoji}</span> {label}
    </a>
  );

  const handleFeedback = () => {
    window.location.href = `mailto:anantbangar2005@gmail.com?subject=MindBloom Feedback&body=Hi Anant,%0D%0A%0D%0AHere's my feedback on MindBloom:%0D%0A%0D%0A`;
  };

  const handleBug = () => {
    window.location.href = `mailto:anantbangar2005@gmail.com?subject=MindBloom Bug Report&body=Hi Anant,%0D%0A%0D%0ABug description:%0D%0A%0D%0ASteps to reproduce:%0D%0A1.%0D%0A2.%0D%0A%0D%0AExpected behavior:%0D%0A%0D%0AActual behavior:%0D%0A`;
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
        padding: '1.5rem 2rem', 
        fontFamily: 'DM Sans, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        marginTop: 'auto'
      }}>
        
        {/* Smooth Glow Hover Effects Style Block */}
        <style>{`
          .footer-chip {
            transition: all 0.25s ease-in-out !important;
            opacity: 0.65;
          }
          .footer-chip:hover {
            opacity: 1 !important;
            background: ${isDark ? 'rgba(123, 170, 122, 0.1)' : 'rgba(74, 122, 74, 0.08)'} !important;
            border-color: ${textAccent} !important;
            color: ${textAccent} !important;
            box-shadow: 0 2px 8px ${isDark ? 'rgba(123, 170, 122, 0.15)' : 'rgba(74, 122, 74, 0.1)'};
            transform: translateY(-1px);
          }
        `}</style>

        {/* ROW 1: System Actions & Social Badges arranged professionally */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* App Utility Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            {iconBtn('Feedback', '💬', handleFeedback, 'Send feedback via email')}
            {iconBtn('Report a bug', '🐛', handleBug, 'Report a bug via email')}
            {iconBtn(copied ? 'Copied!' : 'Share app', copied ? '✓' : '🔗', handleShare, 'Copy app URL to clipboard')}
            {iconBtn('Changelog', '📋', () => setChangelog(true), 'View version history')}
            {iconBtn('Privacy', '🔒', () => setPrivacy(true), 'Privacy policy')}
          </div>

          {/* Social Profiles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: textMuted, marginRight: 4 }}>Connect:</span>
            {socialLink('https://www.linkedin.com/in/anant-bangar', '💼', 'LinkedIn')}
            {socialLink('https://www.hackerrank.com/profile/anantbangar2005', '⭐', 'HackerRank')}
            {socialLink('https://leetcode.com/u/anantbangar2005', '🧩', 'LeetCode')}
            {socialLink('mailto:anantbangar2005@gmail.com', '📧', 'Email')}
          </div>
        </div>

        {/* ROW 2: System info with perfectly centered Copyright alignment */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          fontSize: '0.72rem', 
          color: linkColor,
          borderTop: `1px solid ${border}`,
          paddingTop: '1rem',
          position: 'relative',
          minHeight: '24px'
        }}>
          
          {/* Left Block: Version Info & Interactive Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, zIndex: 2 }}>
            <span style={{ opacity: 0.6 }}>v1.5.0</span>
            {dot}
            <button onClick={() => setExpanded(e => !e)} style={{ background: 'transparent', border: 'none', color: textAccent, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', padding: 0, textDecoration: 'underline' }}>
              {expanded ? 'Less ↑' : 'More info ↓'}
            </button>
          </div>

          {/* Center Block: Calculated Absolute Central Branding & Copyright */}
          <div style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            textAlign: 'center', 
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 1
          }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '0.95rem', color: textAccent }}>
              mind<span style={{ color: '#c8a97a', fontStyle: 'italic' }}>bloom</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: textMain }}>
              © {YEAR} <strong style={{ color: linkColor }}>Anant Bangar</strong>. All rights reserved.
            </span>
          </div>

          {/* Right Block: User Metadata Location */}
          <div style={{ opacity: 0.6, zIndex: 2 }}>
            Rajasthan, India 🇮🇳
          </div>
        </div>

        {/* Expanded info dropdown container layout */}
        {expanded && (
          <div style={{ marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: `1px solid ${border}`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.25rem' }}>
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
              <div style={{ fontSize: '0.68rem', color: textMuted, marginTop: 7, lineHeight: 1.6 }}>Backend + AI/ML features coming soon.</div>
            </div>
            <div>
              <div style={{ fontSize: '0.63rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: textAccent, marginBottom: 6 }}>Disclaimer</div>
              <div style={{ fontSize: '0.71rem', color: textMain, lineHeight: 1.7 }}>For personal wellness use only. Not a substitute for professional medical advice. All data stored locally on your device — nothing is sent to any server.</div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[...CHANGELOG].reverse().map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: '0.875rem', borderBottom: i < CHANGELOG.length - 1 ? `1px solid ${border2}` : 'none' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textAccent, fontFamily: 'monospace' }}>{c.version}</div>
                  <div style={{ fontSize: '0.65rem', color: linkColor }}>{c.date}</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: textMain, lineHeight: 1.6 }}>{c.notes}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: textMuted, borderTop: `1px solid ${border2}`, paddingTop: '0.75rem' }}>
            Future: Backend integration, AI insights, ML mood prediction, mobile app, deploy to Vercel.
          </div>
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
            { title: 'Data storage', body: 'All your data — mood logs, tasks, habits, journal entries, and profile information — is stored exclusively in your browser\'s localStorage. Nothing is transmitted to any external server or third party.' },
            { title: 'No tracking', body: 'MindBloom does not use cookies, analytics, advertising trackers, or any form of user tracking. There are no third-party SDKs that collect your data.' },
            { title: 'No account servers', body: 'Accounts are simulated locally using localStorage. Your email and password are stored only on your own device. This will change in a future backend phase — users will be notified before that update.' },
            { title: 'Music app links', body: 'When you click a music app button in the Songs section, you are redirected to that app\'s public search page. MindBloom does not share any personal data with those services.' },
            { title: 'Email links', body: 'Feedback and bug report buttons open your default email client with a pre-filled draft. No email is sent automatically — you choose whether to send it.' },
            { title: 'Data deletion', body: 'To delete all your data, open your browser\'s Developer Tools → Application → Local Storage and clear all mb_ keys. Logging out removes your active session but not your stored data.' },
            { title: 'Contact', body: 'For any privacy concerns, email anantbangar2005@gmail.com' },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textAccent, marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: '0.8rem', color: textMain, lineHeight: 1.7 }}>{s.body}</div>
            </div>
          ))}
          <div style={{ fontSize: '0.7rem', color: textMuted, borderTop: `1px solid ${border2}`, paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            Last updated: June 2025 · MindBloom by Anant Bangar
          </div>
        </Modal>
      )}
    </>
  );
}

export default Footer;