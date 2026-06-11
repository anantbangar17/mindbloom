import React, { useState, useRef, useEffect } from 'react';

const quickTopics = [
  { icon: '💔', label: 'Breakup / Heartbreak' },
  { icon: '😶', label: 'Communication issues' },
  { icon: '🤝', label: 'Trust & jealousy' },
  { icon: '😔', label: 'Loneliness' },
  { icon: '💬', label: 'Family conflict' },
  { icon: '🌀', label: 'Moving on' },
  { icon: '❓', label: 'Should I stay or go?' },
  { icon: '💌', label: 'Long distance' },
];

// Canned AI responses based on topic keywords (no API needed for now — easy to swap for real Claude API later)
function generateAdvice(topic, feeling, details) {
  const base = {
    'Breakup / Heartbreak': [
      "Heartbreak is genuinely one of the hardest human experiences — don't let anyone tell you otherwise.",
      "Give yourself permission to grieve. It's not weakness; it's processing.",
      "The urge to reach out is normal but rarely helpful in early stages. Give it time.",
      "Focus on what you can control: your sleep, nutrition, movement, and the people who show up for you.",
      "This pain has an expiry date, even when it doesn't feel like it.",
    ],
    'Communication issues': [
      "Most relationship conflicts aren't about the topic — they're about feeling unheard.",
      "Try the '2-minute rule': each person speaks for 2 uninterrupted minutes. No rebuttals, just listening.",
      "Use 'I feel...' instead of 'You always...' — it keeps the conversation from becoming an accusation.",
      "Timing matters. Don't try to have important conversations when either of you is hungry, tired, or stressed.",
      "It's okay to say 'I need to think about this and come back to it.'",
    ],
    'Trust & jealousy': [
      "Jealousy is almost always about insecurity, not the other person's actions.",
      "Before reacting, ask yourself: 'Is this based on evidence or fear?'",
      "If trust was broken, rebuilding it takes consistent small actions over time — from both sides.",
      "Communicate what you need clearly, without ultimatums.",
      "If jealousy is controlling your daily life, speaking with a counselor can help enormously.",
    ],
    'Loneliness': [
      "Feeling lonely in a relationship is actually more common than people admit.",
      "Loneliness often signals an unmet need — try identifying what specifically is missing.",
      "Sometimes loneliness is your inner compass pointing toward what matters to you.",
      "Connection starts with vulnerability — is there one person you could open up to today?",
      "Building a life you love outside of relationships is one of the best things you can do for yourself.",
    ],
    'Family conflict': [
      "Family relationships are uniquely hard because you didn't choose them — and they didn't choose you.",
      "Setting boundaries with family isn't abandonment — it's self-respect.",
      "Try to separate the person from the behaviour when possible.",
      "It's okay to love someone and still limit your time with them.",
      "You are not responsible for managing everyone else's emotions.",
    ],
    'Moving on': [
      "Moving on doesn't mean forgetting — it means choosing your future over your past.",
      "Cut digital ties if you need to. Muting, unfollowing, or blocking is an act of self-care.",
      "Create new routines so your day isn't full of triggers from the old relationship.",
      "Let yourself miss them AND still choose yourself. Those two things coexist.",
      "Progress isn't linear. A bad day doesn't erase the healing you've done.",
    ],
    'Should I stay or go?': [
      "Ask yourself: 'Am I staying out of love, or out of fear?'",
      "Write out what your life looks like in 2 years if you stay — and 2 years if you leave.",
      "Pay attention to how you feel in their presence: energized or drained?",
      "Don't make this decision at the peak of a fight or at the peak of romance.",
      "Your gut already knows. The question is whether you're ready to listen to it.",
    ],
    'Long distance': [
      "Long distance works best when there's an endpoint — a plan to close the gap.",
      "Scheduled communication can reduce anxiety more than constant availability.",
      "Jealousy spikes in LDR because of the imagination gap — talk about your daily life in detail.",
      "Send something physical occasionally: a letter, a small gift. It matters more than you think.",
      "Trust is the load-bearing wall of long distance. Build it intentionally.",
    ],
  };

  const topicKey = Object.keys(base).find(k => topic && topic.includes(k.split(' ')[0])) || Object.keys(base)[0];
  const points = base[topicKey] || base['Breakup / Heartbreak'];

  return { points, topic: topicKey };
}

function RelationshipAdvisor({ user }) {
  const [stage, setStage] = useState('start'); // start | form | advice
  const [form, setForm] = useState({ topic: '', feeling: '', details: '', duration: '' });
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const adviceRef = useRef(null);

  useEffect(() => {
    if (stage === 'advice' && adviceRef.current) {
      adviceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [stage]);

  const getAdvice = () => {
    setLoading(true);
    setTimeout(() => {
      const result = generateAdvice(form.topic, form.feeling, form.details);
      setAdvice(result);
      setLoading(false);
      setStage('advice');
    }, 1200);
  };

  const card = { background: '#161b22', border: '1px solid rgba(120,130,110,0.18)', borderRadius: 14, padding: '1.5rem' };
  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(120,130,110,0.22)', color: '#f0ebe0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {stage === 'start' && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💬</span>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 500, color: '#f0ebe0' }}>Relationship corner</div>
              <div style={{ fontSize: '0.75rem', color: '#8a8a82' }}>A safe, judgment-free space</div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#8a8a82', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Whether it's a breakup, a confusing situation, or just needing someone to talk to —
            this space is for you. Pick what's on your mind and get personalized guidance.
          </p>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a8a82', marginBottom: '0.75rem' }}>What's going on?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem' }}>
            {quickTopics.map(t => (
              <button key={t.label} onClick={() => { setForm(f => ({ ...f, topic: t.label })); setStage('form'); }} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 99,
                border: '1px solid rgba(120,130,110,0.22)', background: 'transparent',
                color: '#a8c5a0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <button onClick={() => setStage('form')} style={{ background: 'transparent', border: 'none', color: '#8a8a82', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
            Or describe something else →
          </button>
        </div>
      )}

      {stage === 'form' && (
        <div style={card}>
          <button onClick={() => setStage('start')} style={{ background: 'transparent', border: 'none', color: '#8a8a82', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>← Back</button>

          <div style={{ fontSize: '1rem', fontWeight: 500, color: '#f0ebe0', marginBottom: '0.3rem' }}>
            {form.topic ? `About: ${form.topic}` : 'Tell me what\'s happening'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: '1.5rem' }}>The more you share, the better I can help.</div>

          {!form.topic && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.72rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>What's the situation?</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {quickTopics.map(t => (
                  <button key={t.label} onClick={() => setForm(f => ({ ...f, topic: t.label }))} style={{
                    padding: '6px 12px', borderRadius: 99, border: `1px solid ${form.topic === t.label ? 'rgba(200,169,122,0.6)' : 'rgba(120,130,110,0.22)'}`,
                    background: form.topic === t.label ? 'rgba(200,169,122,0.15)' : 'transparent',
                    color: form.topic === t.label ? '#e8d0a8' : '#8a8a82', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', cursor: 'pointer',
                  }}>{t.icon} {t.label}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.72rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>How long has this been going on?</label>
            <input style={inputStyle} placeholder="e.g. A few days, 3 months, years..."
              value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.72rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Tell me what happened</label>
            <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.65 }}
              placeholder="Share as much or as little as you'd like. This is a safe space..."
              value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.72rem', color: '#8a8a82', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>How does it make you feel?</label>
            <input style={inputStyle} placeholder="e.g. Confused, anxious, hopeful, exhausted..."
              value={form.feeling} onChange={e => setForm(f => ({ ...f, feeling: e.target.value }))} />
          </div>

          <button onClick={getAdvice} disabled={loading} style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none',
            background: loading ? '#4a7a4a' : '#7baa7a', color: 'white',
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? '✨ Thinking...' : 'Get guidance →'}
          </button>
        </div>
      )}

      {stage === 'advice' && advice && (
        <div ref={adviceRef}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🌿</span>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: '#f0ebe0' }}>Here's what I think</div>
                <div style={{ fontSize: '0.75rem', color: '#8a8a82' }}>About: {advice.topic}</div>
              </div>
            </div>

            {form.feeling && (
              <div style={{ background: 'rgba(200,169,122,0.08)', border: '1px solid rgba(200,169,122,0.2)', borderRadius: 10, padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#e8d0a8', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Feeling <strong>{form.feeling}</strong> is completely valid. What you're going through is real, and it matters.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {advice.points.map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(123,170,122,0.15)', border: '1px solid rgba(123,170,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#7baa7a', flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#d0ccc4', lineHeight: 1.65 }}>{point}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: '0.78rem', color: '#666', lineHeight: 1.6 }}>
              💙 This guidance is for reflection purposes. For serious emotional distress, please reach out to a mental health professional or someone you trust.
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: '1.25rem' }}>
              <button onClick={() => { setForm({ topic: '', feeling: '', details: '', duration: '' }); setStage('start'); }} style={{
                flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(120,130,110,0.22)',
                background: 'transparent', color: '#8a8a82', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', cursor: 'pointer',
              }}>Try another topic</button>
              <button onClick={() => setStage('form')} style={{
                flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                background: '#7baa7a', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', cursor: 'pointer',
              }}>Add more details →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelationshipAdvisor;
