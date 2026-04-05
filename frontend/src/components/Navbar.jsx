import React from 'react'
import ExportButton from './ExportButton'

export default function Navbar({ user, onLogout, onReset, theme, onToggleTheme, habits }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.bolt}>⚡</span>
        <span style={styles.brand}>VILTR</span>
        <span style={styles.version}>v2.0</span>
      </div>
      <div style={styles.right}>
        <span style={styles.user}>{user.username}</span>

        <ExportButton habits={habits || []} username={user.username} />

        <button style={styles.iconBtn} onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀' : '🌙'}
        </button>

        <button style={styles.resetBtn} onClick={onReset} title="Reconfigure habits">
          ⚙ RESET
        </button>

        <button style={styles.logoutBtn} onClick={onLogout}>
          ⏻ LOGOUT
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    height: '48px', minHeight: '48px',
    background: 'var(--card)', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px', flexShrink: 0,
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px' },
  bolt: { fontSize: '1rem' },
  brand: {
    fontFamily: 'var(--font-display)', fontSize: '1.6rem',
    color: 'var(--accent)', letterSpacing: '0.2em',
  },
  version: {
    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
    color: 'var(--text3)', letterSpacing: '0.1em',
    marginTop: '6px',
  },
  right: { display: 'flex', alignItems: 'center', gap: '10px' },
  user: {
    fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
    color: 'var(--text2)', letterSpacing: '0.1em',
    background: 'var(--bg2)', padding: '4px 10px',
    borderRadius: '4px', border: '1px solid var(--border)',
  },
  iconBtn: {
    background: 'transparent', border: '1px solid var(--border)',
    color: 'var(--text2)', padding: '4px 8px',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
  resetBtn: {
    background: 'transparent', border: '1px solid var(--border)',
    color: 'var(--text3)', padding: '4px 12px',
    borderRadius: '4px', cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
    letterSpacing: '0.1em', transition: 'all 0.2s',
  },
  logoutBtn: {
    background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
    color: 'var(--red)', padding: '4px 12px',
    borderRadius: '4px', cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
    letterSpacing: '0.1em', transition: 'all 0.2s',
  },
}
