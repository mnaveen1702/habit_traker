import React from 'react'

const LEVELS = [
  { min: 0,    max: 99,   rank: 'CIVILIAN',    color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  { min: 100,  max: 299,  rank: 'APPRENTICE',  color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
  { min: 300,  max: 699,  rank: 'OPERATIVE',   color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  { min: 700,  max: 1499, rank: 'ENFORCER',    color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { min: 1500, max: 2999, rank: 'VILLAIN',     color: '#f43f5e', bg: 'rgba(244,63,94,0.15)' },
  { min: 3000, max: 9999, rank: 'OVERLORD',    color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
  { min: 10000,max: Infinity, rank: 'LEGEND',  color: '#fbbf24', bg: 'rgba(251,191,36,0.2)' },
]

export function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0]
}

export function getNextLevel(xp) {
  const idx = LEVELS.findIndex(l => xp >= l.min && xp <= l.max)
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null
}

export default function LevelBadge({ xp, showProgress = false }) {
  const level = getLevel(xp)
  const next = getNextLevel(xp)
  const progress = next ? ((xp - level.min) / (next.min - level.min)) * 100 : 100

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.badge, color: level.color, background: level.bg, border: `1px solid ${level.color}40` }}>
        ⚡ {level.rank}
      </div>
      {showProgress && next && (
        <div style={styles.progressRow}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%`, background: level.color }} />
          </div>
          <span style={{ ...styles.nextLabel, color: level.color }}>{next.rank}</span>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '4px' },
  badge: {
    display: 'inline-block',
    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
    letterSpacing: '0.15em', fontWeight: 700,
    padding: '3px 10px', borderRadius: '4px',
  },
  progressRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  progressBar: {
    flex: 1, height: '3px', background: 'var(--border)',
    borderRadius: '2px', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  nextLabel: {
    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
    letterSpacing: '0.1em', whiteSpace: 'nowrap',
  },
}
