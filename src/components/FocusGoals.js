import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Work', 'Study', 'Health', 'Personal', 'Creative', 'Other'];
const CATEGORY_COLORS = { Work: '#9ab5d4', Study: '#c8a97a', Health: '#7baa7a', Personal: '#b49dd4', Creative: '#e07070', Other: '#8a8a82' };

function loadData(email) {
  try { return JSON.parse(localStorage.getItem(`mb_focusgoals_${email}`) || '[]'); } catch { return []; }
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function FocusGoals({ user }) {
  const email = user?.email || 'guest';
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Work', targetDate: '', notes: '', priority: 'medium' });
  const [filter, setFilter] = useState('all'); // all | active | done

  useEffect(() => { setGoals(loadData(email)); }, [email]);

  const save = (updated) => {
    setGoals(updated);
    localStorage.setItem(`mb_focusgoals_${email}`, JSON.stringify(updated));
  };

  const addGoal = () => {
    if (!form.title.trim()) return;
    const goal = { id: Date.now(), ...form, title: form.title.trim(), done: false, createdAt: todayStr(), milestones: [] };
    save([...goals, goal]);
    setForm({ title: '', category: 'Work', targetDate: '', notes: '', priority: 'medium' });
    setShowAdd(false);
  };

  const toggleDone = (id) => save(goals.map(g => g.id === id ? { ...g, done: !g.done, doneAt: !g.done ? todayStr() : null } : g));
  const deleteGoal = (id) => save(goals.filter(g => g.id !== id));

  const addMilestone = (goalId, text) => {
    if (!text.trim()) return;
    save(goals.map(g => g.id === goalId ? { ...g, milestones: [...(g.milestones || []), { id: Date.now(), text: text.trim(), done: false }] } : g));
  };

  const toggleMilestone = (goalId, mId) => {
    save(goals.map(g => g.id === goalId ? { ...g, milestones: (g.milestones || []).map(m => m.id === mId ? { ...m, done: !m.done } : m) } : g));
  };

  const PRIORITY_COLORS = { high: '#e07070', medium: '#c8a97a', low: '#7baa7a' };

  const filtered = goals.filter(g => filter === 'all' ? true : filter === 'done' ? g.done : !g.done);
  const active = goals.filter(g => !g.done).length;
  const done = goals.filter(g => g.done).length;

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Active goals', val: active, color: '#a8c5a0' },
          { label: 'Completed', val: done, color: '#c8a97a' },
          { label: 'Total', val: goals.length, color: '#8a8a82' },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 100px', background: 'rgba(123,170,122,0.06)', border: '1px solid rgba(123,170,122,0.12)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '0.68rem', color: '#8a8a82' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Add */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'active', 'done'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', cursor: 'pointer',
              border: `1px solid ${filter === f ? 'rgba(123,170,122,0.3)' : 'rgba(123,170,122,0.12)'}`,
              background: filter === f ? 'rgba(123,170,122,0.12)' : 'transparent',
              color: filter === f ? '#a8c5a0' : '#8a8a82', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        <button onClick={() => setShowAdd(v => !v)} style={{
          padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(123,170,122,0.3)',
          background: 'rgba(123,170,122,0.1)', color: '#a8c5a0', cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
        }}>
          {showAdd ? '✕ Cancel' : '+ New goal'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ background: 'rgba(123,170,122,0.05)', border: '1px solid rgba(123,170,122,0.15)', borderRadius: 12, padding: '18px 18px', marginBottom: 16 }}>
          <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: 12 }}>New Focus Goal</div>
          <input
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Goal title..."
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(120,130,110,0.2)', background: 'rgba(123,170,122,0.04)', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.87rem', outline: 'none', marginBottom: 10, boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ flex: '1 1 120px', padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(120,130,110,0.2)', background: '#161b22', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none' }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={{ flex: '1 1 100px', padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(120,130,110,0.2)', background: '#161b22', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none' }}>
              <option value="high">High priority</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input type="date" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} style={{ flex: '1 1 140px', padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(120,130,110,0.2)', background: '#161b22', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none' }} />
          </div>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes (optional)..." rows={2} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(120,130,110,0.2)', background: 'rgba(123,170,122,0.04)', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', outline: 'none', resize: 'vertical', marginBottom: 10, boxSizing: 'border-box' }} />
          <button onClick={addGoal} style={{ padding: '8px 20px', borderRadius: 8, background: 'rgba(123,170,122,0.15)', border: '1px solid rgba(123,170,122,0.3)', color: '#a8c5a0', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>
            Save goal
          </button>
        </div>
      )}

      {/* Goals list */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#8a8a82', fontSize: '0.85rem' }}>
          {filter === 'all' ? 'No goals yet. Add one above! 🎯' : `No ${filter} goals.`}
        </div>
      )}

      {filtered.map(g => {
        const catColor = CATEGORY_COLORS[g.category] || '#8a8a82';
        const priColor = PRIORITY_COLORS[g.priority] || '#8a8a82';
        const milestones = g.milestones || [];
        const doneMs = milestones.filter(m => m.done).length;
        const overdue = g.targetDate && !g.done && g.targetDate < todayStr();

        return (
          <GoalCard key={g.id} goal={g} catColor={catColor} priColor={priColor} doneMs={doneMs} milestones={milestones} overdue={overdue} onToggle={() => toggleDone(g.id)} onDelete={() => deleteGoal(g.id)} onAddMilestone={(t) => addMilestone(g.id, t)} onToggleMilestone={(mId) => toggleMilestone(g.id, mId)} />
        );
      })}
    </div>
  );
}

function GoalCard({ goal, catColor, priColor, doneMs, milestones, overdue, onToggle, onDelete, onAddMilestone, onToggleMilestone }) {
  const [expanded, setExpanded] = useState(false);
  const [msInput, setMsInput] = useState('');

  return (
    <div style={{ background: goal.done ? 'rgba(120,120,120,0.04)' : 'rgba(123,170,122,0.05)', border: `1px solid ${goal.done ? 'rgba(120,120,120,0.1)' : 'rgba(123,170,122,0.12)'}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10, opacity: goal.done ? 0.65 : 1, transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <button onClick={onToggle} style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, border: `2px solid ${goal.done ? '#7baa7a' : 'rgba(120,130,110,0.3)'}`, background: goal.done ? 'rgba(123,170,122,0.2)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, color: '#7baa7a', fontSize: '0.7rem' }}>
          {goal.done && '✓'}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: goal.done ? '#8a8a82' : '#c8c4bc', textDecoration: goal.done ? 'line-through' : 'none' }}>{goal.title}</span>
            <span style={{ fontSize: '0.63rem', padding: '2px 7px', borderRadius: 10, background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}33` }}>{goal.category}</span>
            <span style={{ fontSize: '0.63rem', padding: '2px 7px', borderRadius: 10, background: `${priColor}15`, color: priColor }}>{goal.priority}</span>
            {overdue && <span style={{ fontSize: '0.63rem', color: '#e07070' }}>⚠ overdue</span>}
          </div>
          {goal.targetDate && <div style={{ fontSize: '0.7rem', color: '#8a8a82' }}>Target: {goal.targetDate}</div>}
          {milestones.length > 0 && <div style={{ fontSize: '0.7rem', color: '#8a8a82', marginTop: 2 }}>{doneMs}/{milestones.length} milestones</div>}
        </div>
        <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', color: '#8a8a82', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</button>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#e07070', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0, opacity: 0.5 }}>✕</button>
      </div>

      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(120,120,120,0.1)' }}>
          {goal.notes && <div style={{ fontSize: '0.8rem', color: '#8a8a82', marginBottom: 10, lineHeight: 1.5 }}>{goal.notes}</div>}

          <div style={{ fontSize: '0.73rem', color: '#8a8a82', marginBottom: 6 }}>Milestones</div>
          {milestones.map(m => (
            <div key={m.id} onClick={() => onToggleMilestone(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, cursor: 'pointer' }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${m.done ? '#7baa7a' : 'rgba(120,130,110,0.3)'}`, background: m.done ? 'rgba(123,170,122,0.2)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#7baa7a' }}>{m.done && '✓'}</div>
              <span style={{ fontSize: '0.8rem', color: m.done ? '#8a8a82' : '#c8c4bc', textDecoration: m.done ? 'line-through' : 'none' }}>{m.text}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <input value={msInput} onChange={e => setMsInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { onAddMilestone(msInput); setMsInput(''); } }} placeholder="Add milestone..." style={{ flex: 1, padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(120,130,110,0.2)', background: 'rgba(123,170,122,0.04)', color: '#c8c4bc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', outline: 'none' }} />
            <button onClick={() => { onAddMilestone(msInput); setMsInput(''); }} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(123,170,122,0.1)', border: '1px solid rgba(123,170,122,0.2)', color: '#a8c5a0', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem' }}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}
