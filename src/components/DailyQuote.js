import React, { useState } from 'react';

const MOOD_LABELS = ['Low', 'Meh', 'Okay', 'Good', 'Great'];

const QUOTES_BY_MOOD = {
  Low: [
    { text: 'This too shall pass — not because you make it, but because nothing stays the same forever.', author: 'Unknown' },
    { text: 'You don\u2019t have to see the whole staircase, just take the first step.', author: 'Martin Luther King Jr.' },
    { text: 'Rock bottom became the solid foundation on which I rebuilt my life.', author: 'J.K. Rowling' },
    { text: 'It\u2019s okay to not be okay, as long as you are not giving up.', author: 'Karen Salmansohn' },
    { text: 'Healing is not linear. Be patient with yourself.', author: 'Unknown' },
  ],
  Meh: [
    { text: 'Not every day has to be extraordinary. Some days just have to be lived.', author: 'Unknown' },
    { text: 'Small steps every day add up to big results.', author: 'Unknown' },
    { text: 'You don\u2019t need a reason to feel better — start anyway.', author: 'Unknown' },
    { text: 'Motivation is what gets you started. Habit is what keeps you going.', author: 'Jim Ryun' },
    { text: 'A little progress each day adds up to big results.', author: 'Unknown' },
  ],
  Okay: [
    { text: 'Steady wins the race.', author: 'Aesop' },
    { text: 'Consistency is what transforms average into excellence.', author: 'Unknown' },
    { text: 'Do something today that your future self will thank you for.', author: 'Sean Patrick Flanery' },
    { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { text: 'Calm seas build strong sailors slowly.', author: 'Unknown' },
  ],
  Good: [
    { text: 'Happiness is not by chance, but by choice.', author: 'Jim Rohn' },
    { text: 'Gratitude turns what we have into enough.', author: 'Aesop' },
    { text: 'The best way to spread good energy is to live it.', author: 'Unknown' },
    { text: 'Keep your face always toward the sunshine, and shadows will fall behind you.', author: 'Walt Whitman' },
    { text: 'Good vibes are contagious — pass them on.', author: 'Unknown' },
  ],
  Great: [
    { text: 'This is your moment — don\u2019t waste it waiting for the next one.', author: 'Unknown' },
    { text: 'Strike while the iron is hot — and right now, you\u2019re glowing.', author: 'Unknown' },
    { text: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
    { text: 'Use this feeling as fuel, not just a moment.', author: 'Unknown' },
    { text: 'Great things never came from comfort zones.', author: 'Unknown' },
  ],
  General: [
    { text: 'The mind is everything. What you think, you become.', author: 'Buddha' },
    { text: 'You are allowed to be both a masterpiece and a work in progress.', author: 'Sophia Bush' },
    { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
    { text: 'Self-care is how you take your power back.', author: 'Lalah Delia' },
    { text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
    { text: 'You don\u2019t have to control your thoughts. You just have to stop letting them control you.', author: 'Dan Millman' },
  ],
};

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

function DailyQuote({ selectedMood }) {
  const moodLabel = selectedMood !== null && selectedMood !== undefined ? MOOD_LABELS[selectedMood] : null;
  const pool = moodLabel ? QUOTES_BY_MOOD[moodLabel] : QUOTES_BY_MOOD.General;

  const [idx, setIdx] = useState(dayOfYear() % pool.length);

  const shuffle = () => setIdx(i => {
    let next = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && next === i) next = (next + 1) % pool.length;
    return next;
  });

  const quote = pool[idx % pool.length];

  const card = { background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.5rem', fontFamily: 'DM Sans, sans-serif' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8a82' }}>
            {moodLabel ? `Quote for feeling ${moodLabel.toLowerCase()}` : 'Quote of the day'}
          </div>
          {moodLabel && (
            <div style={{ fontSize: '0.7rem', color: '#a8c5a0', background: 'rgba(123,170,122,0.12)', border: '1px solid rgba(123,170,122,0.25)', borderRadius: 99, padding: '3px 10px' }}>
              based on today's mood
            </div>
          )}
        </div>

        <div style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: '1.3rem', color: '#e8d0a8', lineHeight: 1.65, borderLeft: '2px solid rgba(200,169,122,0.5)', paddingLeft: '1.25rem', minHeight: 80 }}>
          "{quote.text}"
        </div>
        <div style={{ fontSize: '0.78rem', color: '#8a8a82', marginTop: '0.875rem', paddingLeft: '1.25rem' }}>
          — {quote.author}
        </div>

        <button onClick={shuffle} style={{
          marginTop: '1.25rem', borderRadius: 8, padding: '8px 18px', fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
          background: 'transparent', border: '1px solid rgba(120,130,110,0.22)', color: '#8a8a82',
        }}>
          Shuffle →
        </button>
      </div>

      {!moodLabel && (
        <div style={{ ...card, background: 'rgba(123,170,122,0.06)', border: '1px solid rgba(123,170,122,0.2)' }}>
          <div style={{ fontSize: '0.8rem', color: '#a8c5a0', lineHeight: 1.6 }}>
            💡 Log your mood on the Dashboard or Mood page to get quotes tailored to how you're feeling.
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyQuote;
