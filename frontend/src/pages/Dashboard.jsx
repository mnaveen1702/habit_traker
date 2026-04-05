import React, { useState, useEffect, useCallback } from 'react'
import { getHabits } from '../api/api'
import Navbar from '../components/Navbar'
import HabitGrid from '../components/HabitGrid'
import AnalyticsPanel from '../components/AnalyticsPanel'

export default function Dashboard({ user, onLogout, onReset, theme, onToggleTheme }) {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getHabits(user.id)
      .then(res => setHabits(res.data))
      .catch(() => setError('Failed to load habits. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [user.id])

  const handleUpdate = useCallback((habitId, newDays) => {
    setHabits(prev => prev.map(h =>
      h.id === habitId ? { ...h, days: newDays } : h
    ))
  }, [])

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.loadingText}>LOADING REGIME...</div>
      <div style={styles.loadingBar}>
        <div style={styles.loadingFill} />
      </div>
    </div>
  )

  if (error) return (
    <div style={styles.loading}>
      <div style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{error}</div>
      <p style={{ color: 'var(--text3)', fontSize: '0.75rem', marginTop: '8px' }}>
        Make sure Flask is running: <code>python app.py</code>
      </p>
    </div>
  )

  return (
    <div style={styles.wrapper}>
      <Navbar
        user={user}
        onLogout={onLogout}
        onReset={onReset}
        theme={theme}
        onToggleTheme={onToggleTheme}
        habits={habits}
      />

      <div style={styles.body}>
        {/* Left 70%: Grid */}
        <div style={styles.left}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>HABIT MATRIX</span>
            <span style={styles.panelSub}>
              {habits.length} habits · {habits[0]?.days?.length || 0}-day challenge
            </span>
          </div>
          <div style={styles.gridWrapper}>
            <HabitGrid habits={habits} onUpdate={handleUpdate} />
          </div>
        </div>

        {/* Right 30%: Analytics */}
        <div style={styles.right}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>ANALYTICS</span>
            <span style={styles.panelSub}>LIVE STATS</span>
          </div>
          <div style={styles.analyticsWrapper}>
            <AnalyticsPanel habits={habits} />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    height: '100vh', display: 'flex', flexDirection: 'column',
    background: 'var(--bg)', overflow: 'hidden',
  },
  body: { flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 },
  left: {
    flex: '0 0 70%', display: 'flex', flexDirection: 'column',
    borderRight: '1px solid var(--border)', overflow: 'hidden',
  },
  right: {
    flex: '0 0 30%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  panelHeader: {
    height: '40px', minHeight: '40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px',
    background: 'var(--card2)', borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  panelTitle: {
    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
    letterSpacing: '0.25em', color: 'var(--text2)', fontWeight: 700,
  },
  panelSub: {
    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
    letterSpacing: '0.1em', color: 'var(--text3)',
  },
  gridWrapper: {
    flex: 1, overflow: 'hidden', display: 'flex',
    flexDirection: 'column', padding: '12px',
  },
  analyticsWrapper: { flex: 1, overflow: 'hidden', padding: '12px' },
  loading: {
    height: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg)', gap: '16px',
  },
  loadingText: {
    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
    letterSpacing: '0.3em', color: 'var(--accent)',
  },
  loadingBar: {
    width: '200px', height: '2px',
    background: 'var(--border)', borderRadius: '1px', overflow: 'hidden',
  },
  loadingFill: {
    height: '100%', width: '60%', background: 'var(--accent)',
    animation: 'scanline 1.5s ease-in-out infinite',
  },
}
