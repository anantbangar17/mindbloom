import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MoodLog from './components/MoodLog';
import Focus from './components/Focus';
import Habits from './components/Habits';
import Journal from './components/Journal';
import RelationshipAdvisor from './components/RelationshipAdvisor';
import Songs from './components/Songs';
import Settings from './components/Settings';
import DateViewer from './components/DateViewer';
import Footer from './components/Footer';

// Apply theme to document root
function applyTheme(theme) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.body.style.background = isDark ? '#0d1117' : '#f5f5f0';
  document.body.style.color = isDark ? '#e8e4dc' : '#1a1a1a';
}

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [appStage, setAppStage] = useState('auth');

  const [view, setView] = useState('dashboard');
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState({});
  const [tasks, setTasks] = useState([]);
  const [affIdx, setAffIdx] = useState(0);

  // UI state
  const [theme, setTheme] = useState(() => localStorage.getItem('mb_theme') || 'dark');
  const [showSettings, setShowSettings] = useState(false);
  const [showDateViewer, setShowDateViewer] = useState(false);
  const [greetVisible, setGreetVisible] = useState(true);
  const [now, setNow] = useState(new Date());

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('mb_theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme('system'); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // Clock tick
  useEffect(() => {
    const tick = setInterval(() => {
      const next = new Date();
      const prevH = now.getHours();
      const nextH = next.getHours();
      const pg = prevH < 12 ? 0 : prevH < 17 ? 1 : 2;
      const ng = nextH < 12 ? 0 : nextH < 17 ? 1 : 2;
      if (pg !== ng) {
        setGreetVisible(false);
        setTimeout(() => { setNow(next); setGreetVisible(true); }, 400);
      } else setNow(next);
    }, 60000);
    return () => clearInterval(tick);
  }, [now]);

  // Animate greeting on view change
  useEffect(() => {
    setGreetVisible(false);
    const t = setTimeout(() => setGreetVisible(true), 80);
    return () => clearTimeout(t);
  }, [view]);

  // Load session on mount
  useEffect(() => {
    const current = localStorage.getItem('mb_current');
    if (current) {
      const raw = localStorage.getItem(`mb_user_${current}`);
      if (raw) {
        const userData = JSON.parse(raw);
        setUser(userData);
        const savedTasks = localStorage.getItem(`mb_tasks_${current}`);
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        const savedMoods = localStorage.getItem(`mb_moods_${current}`);
        setMoodHistory(savedMoods ? JSON.parse(savedMoods) : {});
        setAppStage(userData.onboarded ? 'app' : 'onboarding');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    const savedTasks = localStorage.getItem(`mb_tasks_${userData.email}`);
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    const savedMoods = localStorage.getItem(`mb_moods_${userData.email}`);
    setMoodHistory(savedMoods ? JSON.parse(savedMoods) : {});
    setSelectedMood(null);
    setAppStage(userData.onboarded ? 'app' : 'onboarding');
  };

  const handleOnboardingComplete = (updatedUser) => { setUser(updatedUser); setAppStage('app'); };

  const handleLogout = () => {
    localStorage.removeItem('mb_current');
    setUser(null); setTasks([]); setSelectedMood(null); setMoodHistory({});
    setAppStage('auth'); setAuthMode('login'); setView('dashboard');
  };

  const handleUserUpdate = (updatedUser) => setUser(updatedUser);

  const saveMoods = (updated) => {
    setMoodHistory(updated);
    if (user) localStorage.setItem(`mb_moods_${user.email}`, JSON.stringify(updated));
  };
  const saveTasks = (updated) => {
    setTasks(updated);
    if (user) localStorage.setItem(`mb_tasks_${user.email}`, JSON.stringify(updated));
  };

  const toggleTask = id => saveTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const addTask = text => saveTasks([...tasks, { id: Date.now(), text, done: false }]);
  const removeTask = id => saveTasks(tasks.filter(t => t.id !== id));

  // Theme helpers
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const mainBg = isDark ? '#0d1117' : '#f5f5f0';
  const headerBg = isDark ? '#0d1117' : '#f5f5f0';
  const textColor = isDark ? '#f0ebe0' : '#1a1a1a';
  const mutedColor = isDark ? '#8a8a82' : '#6a6a62';
  const chipBg = isDark ? '#161b22' : '#e8e4da';
  const chipBorder = isDark ? 'rgba(120,130,110,0.18)' : 'rgba(0,0,0,0.1)';

  const hour = now.getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const greetEmoji = hour < 12 ? '🌤️' : hour < 17 ? '☀️' : '🌙';
  const today = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  const displayName = user?.profile?.nickname || user?.name || 'there';

  // TYPEWRITER LOGIC ADDED HERE
  const fullGreetingText = `Good ${greeting}, ${displayName}`;
  const [typedGreeting, setTypedGreeting] = useState('');

  useEffect(() => {
    let currentIdx = 0;
    let currentString = '';
    setTypedGreeting('');
    
    const typingInterval = setInterval(() => {
      if (currentIdx < fullGreetingText.length) {
        currentString += fullGreetingText.charAt(currentIdx);
        setTypedGreeting(currentString);
        currentIdx++;
      } else {
        clearInterval(typingInterval);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [fullGreetingText]);

  const THEME_ICONS = { dark: '🌙', light: '☀️', system: '💻' };
  const THEME_CYCLE = { dark: 'light', light: 'system', system: 'dark' };

  if (appStage === 'auth') return <Login isSignup={authMode === 'signup'} onLogin={handleLogin} onSwitch={() => setAuthMode(m => m === 'login' ? 'signup' : 'login')} />;
  if (appStage === 'onboarding') return <Onboarding user={user} onComplete={handleOnboardingComplete} />;

  const subtitles = {
    dashboard: 'How are you feeling today?',
    mood: 'Track your emotional patterns',
    focus: 'Deep work mode',
    habits: 'Build streaks that stick',
    journal: 'Write it out — clarity follows',
    songs: 'Music for your mood',
    relationship: 'A safe space for your heart',
  };

  const views = {
    dashboard:    <Dashboard selectedMood={selectedMood} setSelectedMood={setSelectedMood} tasks={tasks} toggleTask={toggleTask} addTask={addTask} affIdx={affIdx} setAffIdx={setAffIdx} moodHistory={moodHistory} setMoodHistory={saveMoods} />,
    mood:         <MoodLog selectedMood={selectedMood} setSelectedMood={setSelectedMood} moodHistory={moodHistory} setMoodHistory={saveMoods} />,
    focus:        <Focus tasks={tasks} toggleTask={toggleTask} addTask={addTask} removeTask={removeTask} />,
    habits:       <Habits />,
    journal:      <Journal affIdx={affIdx} setAffIdx={setAffIdx} />,
    songs:        <Songs selectedMood={selectedMood} />,
    relationship: <RelationshipAdvisor user={user} />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: mainBg }}>
      {/* MOVING BLINKING CURSOR STYLE INJECTED HERE */}
      <style>{`
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .portfolio-cursor {
          display: inline-block;
          margin-left: 2px;
          color: #7baa7a;
          font-weight: 300;
          animation: blinkCursor 0.8s infinite;
        }
      `}</style>

      <Sidebar view={view} setView={setView} user={user} onLogout={handleLogout} onOpenSettings={() => setShowSettings(true)} theme={theme} />

      {/* CHANGE 1: Added display flex and flexDirection column here */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: mainBg }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: headerBg }}>
          {/* Greeting */}
          <div style={{ opacity: greetVisible ? 1 : 0, transform: greetVisible ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: textColor, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.2rem' }}>{greetEmoji}</span>
              {/* UPDATED GREETING IN MOVING CURSOR FORM */}
              <span>{typedGreeting}</span>
              <span className="portfolio-cursor">|</span>
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: mutedColor, marginTop: 2 }}>
              {subtitles[view]}
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user?.profile?.occupation && (
              <div style={{ fontSize: '0.72rem', color: '#7baa7a', background: 'rgba(123,170,122,0.1)', border: '1px solid rgba(123,170,122,0.2)', borderRadius: 99, padding: '4px 12px' }}>
                {user.profile.occupation}
              </div>
            )}

            {/* Theme toggle */}
            <button onClick={() => setTheme(t => THEME_CYCLE[t])} title={`Theme: ${theme} (click to cycle)`} style={{
              background: chipBg, border: `1px solid ${chipBorder}`, borderRadius: 99,
              padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 5,
              color: mutedColor, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
            }}>
              <span>{THEME_ICONS[theme]}</span>
              <span style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{theme}</span>
            </button>

            {/* CHANGE 2: Removed the top-right Settings button completely from here */}

            {/* Clickable date */}
            <button onClick={() => setShowDateViewer(true)} style={{
              fontSize: '0.75rem', color: mutedColor, background: chipBg,
              border: `1px solid ${chipBorder}`, borderRadius: 20, padding: '4px 12px',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
            }}>
              📅 {today}
            </button>
          </div>
        </div>

        {/* CHANGE 3: Added flex: 1 to this view container wrapper to push the footer down */}
        <div style={{ padding: '1.5rem 2rem', flex: 1 }}>
          {views[view]}
        </div>
        
        <Footer theme={theme} />
      </main>

      {/* Modals */}
      {showSettings && <Settings user={user} onUpdate={handleUserUpdate} onClose={() => setShowSettings(false)} theme={theme} />}
      {showDateViewer && <DateViewer onClose={() => setShowDateViewer(false)} moodHistory={moodHistory} tasks={tasks} theme={theme} />}
    </div>
  );
}

export default App;