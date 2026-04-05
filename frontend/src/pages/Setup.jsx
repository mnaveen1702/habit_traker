import React, { useState } from 'react'
import { createHabits } from '../api/api'

const PRESET_HABITS = [
  { name: 'Gym', icon: '🏋️' },
  { name: 'Reading', icon: '📖' },
  { name: 'Coding', icon: '💻' },
  { name: 'Meditation', icon: '🧘' },
  { name: 'Running', icon: '🏃' },
  { name: 'Cold Shower', icon: '🚿' },
  { name: 'No Social Media', icon: '📵' },
  { name: 'Sleep by 11pm', icon: '😴' },
]

export default function Setup({ user, onComplete }) {
  const [selected, setSelected] = useState(['Gym', 'Coding', 'Reading'])
  const [custom, setCustom] = useState('')
  const [customHabits, setCustomHabits] = useState([])
  const [duration, setDuration] = useState(30)
  const [loading, setLoading] = useState(false)

  const togglePreset = (name) => {
    setSelected(prev => prev.includes(name)
      ? prev.filter(h => h !== name)
      : [...prev, name])
  }

  const addCustom = () => {
    const trimmed = custom.trim()
    if (trimmed && !customHabits.includes(trimmed) && !selected.includes(trimmed)) {
      setCustomHabits(prev => [...prev, trimmed])
      setSelected(prev => [...prev, trimmed])
      setCustom('')
    }
  }

  const handleSubmit = async () => {
    if (selected.length === 0) return
    setLoading(true)
    try {
      await createHabits(user.id, selected, duration)
      onComplete()
    } catch (e) {
      alert('Failed to save habits. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.grid} />
      <div style={styles.container} className="animate-in">
        <div style={styles.header}>
          <div style={styles.step}>STEP 01</div>
          <h1 style={styles.title}>CONFIGURE YOUR REGIME</h1>
          <p style={styles.sub}>Select habits to dominate. The weak choose comfort. You choose growth.</p>
        </div>

        {/* Preset habits */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>⚡ PRESET HABITS</div>
          <div style={styles.habitGrid}>
            {PRESET_HABITS.map(({ name, icon }) => {
              const active = selected.includes(name)
              return (
                <button key={name} onClick={() => togglePreset(name)}
                  style={active ? styles.habitBtnActive : styles.habitBtn}>
                  <span style={styles.habitIcon}>{icon}</span>
                  <span style={styles.habitName}>{name}</span>
                  {active && <span style={styles.checkmark}>✓</span>}
                </button>
              )
            })}
            {customHabits.map(name => {
              const active = selected.includes(name)
              return (
                <button key={name} onClick={() => togglePreset(name)}
                  style={active ? styles.habitBtnCustomActive : styles.habitBtnCustom}>
                  <span style={styles.habitIcon}>🎯</span>
                  <span style={styles.habitName}>{name}</span>
                  {active && <span style={styles.checkmark}>✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom habit */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>➕ ADD CUSTOM HABIT</div>
          <div style={styles.customRow}>
            <input style={styles.customInput} value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustom()}
              placeholder="e.g. Journaling, No Sugar..." />
            <button style={styles.addBtn} onClick={addCustom}>ADD</button>
          </div>
        </div>

        {/* Duration */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>📅 CHALLENGE DURATION</div>
          <div style={styles.durationRow}>
            {[7, 14, 21, 30, 60, 90].map(d => (
              <button key={d} onClick={() => setDuration(d)}
                style={duration === d ? styles.durActive : styles.dur}>
                {d}D
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <span style={styles.summaryText}>
            <span style={{ color: 'var(--accent)' }}>{selected.length}</span> habits ×{' '}
            <span style={{ color: 'var(--gold)' }}>{duration}</span> days ={' '}
            <span style={{ color: 'var(--red)' }}>{selected.length * duration * 10} XP</span> potential
          </span>
        </div>

        <button style={loading || selected.length === 0 ? styles.startBtnDisabled : styles.startBtn}
          onClick={handleSubmit} disabled={loading || selected.length === 0}>
          {loading ? 'INITIALIZING...' : '⚡ LAUNCH MY REGIME'}
        </button>

        <p style={styles.note}>Logged in as <span style={{ color: 'var(--accent)' }}>{user.username}</span></p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    height: '100vh', width: '100vw', overflow: 'auto',
    background: 'var(--bg)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    padding: '20px', position: 'relative',
  },
  grid: {
    position: 'fixed', inset: 0,
    backgroundImage: `linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)`,
    backgroundSize: '60px 60px', pointerEvents: 'none',
  },
  container: {
    width: '640px', maxWidth: '100%',
    display: 'flex', flexDirection: 'column', gap: '20px',
    position: 'relative', zIndex: 1,
  },
  header: { textAlign: 'center' },
  step: {
    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
    letterSpacing: '0.3em', color: 'var(--red)',
    marginBottom: '8px',
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: '3rem',
    letterSpacing: '0.1em', color: 'var(--text)',
    lineHeight: 1,
  },
  sub: { color: 'var(--text2)', fontSize: '0.85rem', marginTop: '8px' },
  section: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '18px',
    display: 'flex', flexDirection: 'column', gap: '14px',
  },
  sectionLabel: {
    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
    letterSpacing: '0.2em', color: 'var(--text3)',
  },
  habitGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '8px',
  },
  habitBtn: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '12px 10px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
    cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
  },
  habitBtnActive: {
    background: 'rgba(244,63,94,0.1)', border: '1px solid var(--red)',
    borderRadius: '8px', padding: '12px 10px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
    cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
  },
  habitBtnCustom: {
    background: 'var(--bg2)', border: '1px dashed var(--border)',
    borderRadius: '8px', padding: '12px 10px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
    cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
  },
  habitBtnCustomActive: {
    background: 'rgba(244,63,94,0.1)', border: '1px dashed var(--red)',
    borderRadius: '8px', padding: '12px 10px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
    cursor: 'pointer', position: 'relative',
  },
  habitIcon: { fontSize: '1.4rem' },
  habitName: { fontSize: '0.75rem', color: 'var(--text2)', fontWeight: 500 },
  checkmark: {
    position: 'absolute', top: '6px', right: '8px',
    color: 'var(--red)', fontSize: '0.7rem', fontWeight: 700,
  },
  customRow: { display: 'flex', gap: '8px' },
  customInput: {
    flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '10px 14px',
    color: 'var(--text)', fontSize: '0.9rem', outline: 'none',
    fontFamily: 'var(--font-body)',
  },
  addBtn: {
    background: 'var(--accent)', color: '#000',
    border: 'none', borderRadius: '6px', padding: '10px 18px',
    cursor: 'pointer', fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
  },
  durationRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  dur: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '8px 16px',
    color: 'var(--text2)', cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
    transition: 'all 0.2s',
  },
  durActive: {
    background: 'rgba(245,158,11,0.15)', border: '1px solid var(--gold)',
    borderRadius: '6px', padding: '8px 16px',
    color: 'var(--gold)', cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
  },
  summary: {
    textAlign: 'center', padding: '12px',
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '8px',
  },
  summaryText: { fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text2)' },
  startBtn: {
    padding: '16px', background: 'var(--red)',
    color: '#fff', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em',
    transition: 'all 0.2s',
  },
  startBtnDisabled: {
    padding: '16px', background: 'var(--border)',
    color: 'var(--text3)', border: 'none', borderRadius: '8px',
    cursor: 'not-allowed', fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem', letterSpacing: '0.15em',
  },
  note: {
    textAlign: 'center', fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--text3)',
  },
}
