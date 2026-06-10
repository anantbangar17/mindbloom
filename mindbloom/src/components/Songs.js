import React, { useState } from 'react';

const MOODS = ['Low', 'Meh', 'Okay', 'Good', 'Great'];

const LANGUAGES = ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Bengali', 'Kannada', 'Marathi', 'K-Pop', 'Spanish'];

const GENRES = ['Calm / Lo-fi', 'Upbeat / Pop', 'Motivational', 'Romantic', 'Devotional / Spiritual', 'Classical', 'Hip-hop', 'Indie', 'Party', 'Focus / Instrumental'];

const MUSIC_APPS = [
  { name: 'Spotify', icon: '🎵', url: 'https://open.spotify.com/search/' },
  { name: 'YouTube Music', icon: '▶️', url: 'https://music.youtube.com/search?q=' },
  { name: 'JioSaavn', icon: '🎶', url: 'https://www.jiosaavn.com/search/' },
  { name: 'Gaana', icon: '🎸', url: 'https://gaana.com/search/' },
  { name: 'Apple Music', icon: '🍎', url: 'https://music.apple.com/search?term=' },
  { name: 'Wynk', icon: '🎤', url: 'https://wynk.in/music' },
];

// Mood-based search queries
const MOOD_QUERIES = {
  Low:   { label: 'Comforting & healing',  queries: ['comforting sad songs', 'healing music', 'feel better songs', 'emotional healing playlist'] },
  Meh:   { label: 'Lift your spirits',     queries: ['mood booster songs', 'feel good playlist', 'happy vibes music', 'uplifting songs'] },
  Okay:  { label: 'Chill & relaxed',       queries: ['chill vibes playlist', 'relaxed afternoon music', 'easy listening songs', 'lo-fi chill'] },
  Good:  { label: 'Keep the good energy',  queries: ['good vibes playlist', 'positive energy music', 'feel good hits', 'happy playlist'] },
  Great: { label: 'Celebrate & dance',     queries: ['party hits', 'dance playlist', 'energy boost music', 'best upbeat songs'] },
};

function Songs({ selectedMood }) {
  const currentMoodLabel = selectedMood !== null ? MOODS[selectedMood] : null;
  const [selectedLangs, setSelectedLangs] = useState(['Hindi', 'English']);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [preferredApp, setPreferredApp] = useState(null);

  const toggleLang = l => setSelectedLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  const toggleGenre = g => setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const moodData = currentMoodLabel ? MOOD_QUERIES[currentMoodLabel] : null;

  const buildSearchQuery = () => {
    const parts = [];
    if (moodData) parts.push(moodData.queries[0]);
    if (selectedLangs.length > 0 && !selectedLangs.includes('English')) parts.push(selectedLangs[0]);
    if (selectedGenres.length > 0) parts.push(selectedGenres[0].split('/')[0].trim());
    return parts.join(' ').trim() || 'feel good music';
  };

  const openInApp = (app) => {
    const q = encodeURIComponent(buildSearchQuery());
    window.open(app.url + q, '_blank');
  };

  const Pill = ({ label, selected, onClick, color }) => (
    <button onClick={onClick} style={{
      padding: '5px 13px', borderRadius: 99, margin: '3px', cursor: 'pointer',
      border: `1px solid ${selected ? (color || 'rgba(123,170,122,0.5)') : 'rgba(120,130,110,0.22)'}`,
      background: selected ? `rgba(123,170,122,0.15)` : 'transparent',
      color: selected ? '#a8c5a0' : '#8a8a82',
      fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', transition: 'all 0.15s',
    }}>{label}</button>
  );

  const card = { background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif' };
  const secTitle = { fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82', marginBottom: '0.75rem' };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Mood-based recommendation banner */}
      <div style={{ ...card, background: currentMoodLabel ? 'rgba(123,170,122,0.07)' : '#161b22', border: `1px solid ${currentMoodLabel ? 'rgba(123,170,122,0.25)' : 'rgba(120,130,110,0.18)'}` }}>
        {currentMoodLabel ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🎵</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#f0ebe0' }}>Based on your mood: <span style={{ color: '#a8c5a0' }}>{currentMoodLabel}</span></div>
                <div style={{ fontSize: '0.78rem', color: '#8a8a82' }}>{moodData.label}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: '0.75rem' }}>
              {moodData.queries.map((q, i) => (
                <span key={i} style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(123,170,122,0.12)', border: '1px solid rgba(123,170,122,0.2)', fontSize: '0.75rem', color: '#a8c5a0' }}>
                  🎵 {q}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>🎵</span>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#f0ebe0' }}>Log your mood first</div>
              <div style={{ fontSize: '0.78rem', color: '#8a8a82' }}>Go to Dashboard or Mood Log and log how you're feeling — we'll recommend songs based on it.</div>
            </div>
          </div>
        )}
      </div>

      {/* Language preferences */}
      <div style={card}>
        <div style={secTitle}>Languages you enjoy</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {LANGUAGES.map(l => <Pill key={l} label={l} selected={selectedLangs.includes(l)} onClick={() => toggleLang(l)} />)}
        </div>
      </div>

      {/* Genre preferences */}
      <div style={card}>
        <div style={secTitle}>Genres (optional)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {GENRES.map(g => <Pill key={g} label={g} selected={selectedGenres.includes(g)} onClick={() => toggleGenre(g)} />)}
        </div>
      </div>

      {/* Music apps */}
      <div style={card}>
        <div style={secTitle}>Open in your music app</div>
        <div style={{ fontSize: '0.78rem', color: '#8a8a82', marginBottom: '0.875rem' }}>
          We'll search for "{buildSearchQuery()}" in your chosen app.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {MUSIC_APPS.map(app => (
            <button key={app.name} onClick={() => openInApp(app)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
              borderRadius: 10, border: `1px solid ${preferredApp === app.name ? 'rgba(123,170,122,0.5)' : 'rgba(120,130,110,0.22)'}`,
              background: preferredApp === app.name ? 'rgba(123,170,122,0.12)' : 'transparent',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{app.icon}</span>
              <span style={{ fontSize: '0.78rem', color: '#d0ccc4' }}>{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div style={{ fontSize: '0.72rem', color: '#555', textAlign: 'center', marginTop: '0.5rem', lineHeight: 1.6 }}>
        Clicking an app opens a search in that app. AI-powered playlists will be added when backend is ready.
      </div>
    </div>
  );
}

export default Songs;
