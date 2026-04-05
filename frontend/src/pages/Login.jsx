import React, { useState } from 'react'
import { login, register } from '../api/api'

const VILLAIN_QUOTES = [
  "The villain trains while the hero rests.",
  "Discipline is the bridge between goals and accomplishment.",
  "Pain is temporary. Glory is forever.",
  "Your future self is watching you right now.",
  "The dark side of discipline: you have no days off.",
  "While they celebrate, you dominate.",
  "Champions are made in the darkness.",
]

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const quote = VILLAIN_QUOTES[Math.floor(Math.random() * VILLAIN_QUOTES.length)]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fn = isRegister ? register : login
      const res = await fn(username, password)
      localStorage.setItem('user', JSON.stringify(res.data))
      onLogin(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Background grid */}
      <div style={styles.grid} />
      <div style={styles.scanline} />

      <div style={styles.container} className="animate-in">
        {/* Logo */}
        <div style={styles.logoBlock}>
          <div style={styles.logoIcon}>⚡</div>
          <h1 style={styles.logo} className="glow-text">VILTR</h1>
          <p style={styles.logoSub}>HABIT DOMINATION SYSTEM</p>
        </div>

        {/* Quote */}
        <div style={styles.quoteBox}>
          <span style={styles.quoteIcon}>"</span>
          <p style={styles.quoteText}>{quote}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.tabs}>
            <button type="button" style={isRegister ? styles.tabInactive : styles.tabActive}
              onClick={() => setIsRegister(false)}>LOGIN</button>
            <button type="button" style={isRegister ? styles.tabActive : styles.tabInactive}
              onClick={() => setIsRegister(true)}>REGISTER</button>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>USERNAME</label>
            <input style={styles.input} type="text" value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username" required autoFocus />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>PASSWORD</label>
            <input style={styles.input} type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password" required />
          </div>

          {error && <div style={styles.error}>⚠ {error}</div>}

          <button type="submit" style={loading ? styles.btnLoading : styles.btn} disabled={loading}>
            {loading ? 'INITIATING...' : isRegister ? 'CREATE ACCOUNT' : 'ENTER THE DOMAIN'}
          </button>
        </form>

        <p style={styles.footer}>VILTR © 2025 — NO EXCUSES. ONLY EXECUTION.</p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    height: '100vh', width: '100vw',
    background: 'var(--bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  scanline: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.15), transparent)',
    animation: 'scanline 8s linear infinite',
    pointerEvents: 'none',
  },
  container: {
    width: '420px', maxWidth: '95vw',
    display: 'flex', flexDirection: 'column', gap: '20px',
    position: 'relative', zIndex: 1,
  },
  logoBlock: { textAlign: 'center' },
  logoIcon: { fontSize: '2.5rem', marginBottom: '4px' },
  logo: {
    fontFamily: 'var(--font-display)', fontSize: '4.5rem',
    letterSpacing: '0.15em', color: 'var(--accent)',
    lineHeight: 1,
  },
  logoSub: {
    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
    letterSpacing: '0.35em', color: 'var(--text3)',
    marginTop: '4px',
  },
  quoteBox: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderLeft: '3px solid var(--red)',
    padding: '12px 16px', borderRadius: '6px',
    display: 'flex', gap: '8px', alignItems: 'flex-start',
  },
  quoteIcon: { color: 'var(--red)', fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 },
  quoteText: {
    color: 'var(--text2)', fontSize: '0.8rem', fontStyle: 'italic',
    lineHeight: 1.5,
  },
  form: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '16px',
  },
  tabs: { display: 'flex', gap: '4px' },
  tabActive: {
    flex: 1, padding: '8px',
    background: 'var(--accent)', color: '#000',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
    letterSpacing: '0.1em',
  },
  tabInactive: {
    flex: 1, padding: '8px',
    background: 'transparent', color: 'var(--text3)',
    border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
    letterSpacing: '0.1em',
    transition: 'all 0.2s',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
    letterSpacing: '0.15em', color: 'var(--text3)',
  },
  input: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '10px 14px',
    color: 'var(--text)', fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none', transition: 'border-color 0.2s',
  },
  error: {
    background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
    color: 'var(--red)', padding: '8px 12px', borderRadius: '4px',
    fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
  },
  btn: {
    padding: '12px', background: 'var(--red)',
    color: '#fff', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em',
    transition: 'all 0.2s', marginTop: '4px',
  },
  btnLoading: {
    padding: '12px', background: 'var(--border)',
    color: 'var(--text3)', border: 'none', borderRadius: '6px',
    cursor: 'not-allowed', fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem', letterSpacing: '0.15em',
  },
  footer: {
    textAlign: 'center', fontFamily: 'var(--font-mono)',
    fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--text3)',
  },
}
