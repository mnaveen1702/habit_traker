import React, { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'
import LevelBadge, { getLevel } from './LevelBadge'

const VILLAIN_QUOTES = [
  "The villain trains while the hero rests.",
  "Discipline is choosing your future over your feelings.",
  "Pain is temporary. Weak habits are permanent.",
  "Your future self is watching you right now.",
  "The dark side of discipline: no days off.",
  "While they celebrate, you dominate.",
  "Champions are made in the dark.",
  "You don't rise to the occasion. You fall to your training.",
  "The wolf doesn't perform for the sheep.",
  "Obsession is a gift the mediocre will never understand.",
  "Average is a choice. Excellence is a decision.",
  "The iron never lies. It reveals who you are.",
]

function StatCard({ label, value, color, sub }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statValue, color: color || 'var(--accent)' }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
      {sub && <div style={styles.statSub}>{sub}</div>}
    </div>
  )
}

export default function AnalyticsPanel({ habits }) {
  const [tab, setTab] = useState('overview')
  const quote = useMemo(() =>
    VILLAIN_QUOTES[Math.floor(Math.random() * VILLAIN_QUOTES.length)], [])

  const stats = useMemo(() => {
    if (!habits.length) return { total: 0, completed: 0, xp: 0, streak: 0, pct: 0, todayDone: 0, todayTotal: 0 }

    const total = habits.reduce((sum, h) => sum + h.days.length, 0)
    const completed = habits.reduce((sum, h) => sum + h.days.filter(Boolean).length, 0)
    const xp = completed * 10
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    const duration = habits[0]?.days?.length || 30
    const todayIdx = Math.min(new Date().getDate() - 1, duration - 1)
    const todayDone = habits.filter(h => h.days[todayIdx]).length
    const todayTotal = habits.length

    let streak = 0
    for (let i = todayIdx; i >= 0; i--) {
      const allDone = habits.every(h => h.days[i])
      if (allDone) streak++
      else break
    }

    return { total, completed, xp, streak, pct, todayDone, todayTotal }
  }, [habits])

  // Weekly bar chart data
  const weekData = useMemo(() => {
    if (!habits.length) return []
    const duration = habits[0]?.days?.length || 30
    const todayIdx = Math.min(new Date().getDate() - 1, duration - 1)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return Array.from({ length: 7 }, (_, i) => {
      const dayIdx = todayIdx - 6 + i
      if (dayIdx < 0) return { day: days[i], done: 0, total: habits.length }
      const done = habits.filter(h => h.days[dayIdx]).length
      return { day: days[i], done, total: habits.length }
    })
  }, [habits])

  const level = getLevel(stats.xp)
  const pieData = [
    { name: 'Done', value: stats.completed },
    { name: 'Left', value: stats.total - stats.completed },
  ]

  return (
    <div style={styles.panel}>
      {/* Quote */}
      <div style={styles.quoteBlock}>
        <div style={styles.quoteTop}>
          <span style={styles.quoteSymbol}>❝</span>
          <span style={styles.quoteTag}>DAILY INTEL</span>
        </div>
        <p style={styles.quoteText}>{quote}</p>
      </div>

      {/* Level + XP */}
      <div style={styles.xpBlock}>
        <div style={styles.xpHeader}>
          <LevelBadge xp={stats.xp} showProgress />
          <span style={styles.xpValue}>{stats.xp} XP</span>
        </div>
        <div style={styles.xpBar}>
          <div style={{ ...styles.xpFill, width: `${Math.min(stats.pct, 100)}%` }} />
        </div>
        <div style={styles.xpPct}>{stats.pct}% DOMINATION</div>
      </div>

      {/* Today's focus */}
      <div style={styles.todayBlock}>
        <div style={styles.todayLabel}>TODAY'S FOCUS</div>
        <div style={styles.todayRow}>
          <div style={styles.todayCount}>
            <span style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
              {stats.todayDone}
            </span>
            <span style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              /{stats.todayTotal}
            </span>
          </div>
          <div style={styles.todayBar}>
            <div style={{
              ...styles.todayBarFill,
              width: stats.todayTotal > 0 ? `${(stats.todayDone / stats.todayTotal) * 100}%` : '0%'
            }} />
          </div>
          <div style={{ ...styles.streakBadge, animation: stats.streak > 2 ? 'streakPop 0.4s ease' : 'none' }}>
            🔥 {stats.streak}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button onClick={() => setTab('overview')} style={tab === 'overview' ? styles.tabActive : styles.tab}>OVERVIEW</button>
        <button onClick={() => setTab('weekly')} style={tab === 'weekly' ? styles.tabActive : styles.tab}>WEEKLY</button>
        <button onClick={() => setTab('habits')} style={tab === 'habits' ? styles.tabActive : styles.tab}>HABITS</button>
      </div>

      {tab === 'overview' && (
        <>
          <div style={styles.statsGrid}>
            <StatCard label="COMPLETED" value={stats.completed} color="var(--red)" />
            <StatCard label="STREAK" value={`${stats.streak}🔥`} color="var(--gold)" />
            <StatCard label="TOTAL XP" value={stats.xp} color="var(--accent)" />
            <StatCard label="REMAINING" value={stats.total - stats.completed} color="var(--text3)" />
          </div>

          {stats.total > 0 && (
            <div style={styles.chartBlock}>
              <div style={styles.chartLabel}>COMPLETION MAP</div>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={56} dataKey="value" strokeWidth={0}>
                    <Cell fill="var(--red)" />
                    <Cell fill="var(--card2)" />
                  </Pie>
                  <Tooltip contentStyle={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: '6px', fontFamily: 'Space Mono',
                    fontSize: '0.7rem', color: 'var(--text)',
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {tab === 'weekly' && (
        <div style={styles.chartBlock}>
          <div style={styles.chartLabel}>LAST 7 DAYS</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: 'var(--text3)', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '6px', fontFamily: 'Space Mono',
                fontSize: '0.7rem', color: 'var(--text)',
              }} />
              <Bar dataKey="done" fill="var(--red)" radius={[3, 3, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'habits' && (
        <div style={styles.breakdownBlock}>
          {habits.map(h => {
            const done = h.days.filter(Boolean).length
            const pct = Math.round((done / h.days.length) * 100)
            return (
              <div key={h.id} style={styles.habitRow}>
                <span style={styles.habitRowName}>{h.name}</span>
                <div style={styles.miniBar}>
                  <div style={{ ...styles.miniBarFill, width: `${pct}%` }} />
                </div>
                <span style={styles.habitRowPct}>{pct}%</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  panel: {
    display: 'flex', flexDirection: 'column', gap: '10px',
    height: '100%', overflowY: 'auto', padding: '4px 2px',
  },
  quoteBlock: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderLeft: '3px solid var(--red)',
    borderRadius: '8px', padding: '12px',
  },
  quoteTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  quoteSymbol: { color: 'var(--red)', fontSize: '1.2rem' },
  quoteTag: { fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--text3)' },
  quoteText: { color: 'var(--text2)', fontSize: '0.78rem', fontStyle: 'italic', lineHeight: 1.5 },
  xpBlock: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '12px',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  xpHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  xpValue: { fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 },
  xpBar: {
    height: '5px', background: 'var(--bg2)', borderRadius: '3px', overflow: 'hidden',
  },
  xpFill: {
    height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--red))',
    borderRadius: '3px', transition: 'width 0.5s ease',
  },
  xpPct: { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--text3)', textAlign: 'right' },
  todayBlock: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '12px',
  },
  todayLabel: { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--text3)', marginBottom: '8px' },
  todayRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  todayCount: { display: 'flex', alignItems: 'baseline', gap: '2px', flexShrink: 0 },
  todayBar: { flex: 1, height: '6px', background: 'var(--bg2)', borderRadius: '3px', overflow: 'hidden' },
  todayBarFill: { height: '100%', background: 'var(--red)', borderRadius: '3px', transition: 'width 0.5s ease' },
  streakBadge: {
    fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
    color: 'var(--gold)', flexShrink: 0,
  },
  tabs: { display: 'flex', gap: '4px' },
  tab: {
    flex: 1, padding: '6px 4px',
    background: 'transparent', color: 'var(--text3)',
    border: '1px solid var(--border)', borderRadius: '4px',
    cursor: 'pointer', fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem', letterSpacing: '0.1em',
    transition: 'all 0.2s',
  },
  tabActive: {
    flex: 1, padding: '6px 4px',
    background: 'var(--red)', color: '#fff',
    border: '1px solid var(--red)', borderRadius: '4px',
    cursor: 'pointer', fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem', letterSpacing: '0.1em',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  statCard: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '10px', textAlign: 'center',
  },
  statValue: { fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.05em', lineHeight: 1 },
  statLabel: { fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--text3)', marginTop: '3px' },
  statSub: { fontSize: '0.7rem', color: 'var(--text3)', marginTop: '2px' },
  chartBlock: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '12px',
  },
  chartLabel: { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--text3)', marginBottom: '4px' },
  breakdownBlock: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '12px',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  habitRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  habitRowName: { fontSize: '0.75rem', color: 'var(--text2)', width: '80px', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  miniBar: { flex: 1, height: '4px', background: 'var(--bg2)', borderRadius: '2px', overflow: 'hidden' },
  miniBarFill: { height: '100%', background: 'var(--red)', borderRadius: '2px', transition: 'width 0.4s ease' },
  habitRowPct: { fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text3)', width: '30px', textAlign: 'right' },
}
