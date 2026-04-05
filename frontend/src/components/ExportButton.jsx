import React, { useState } from 'react'

export default function ExportButton({ habits, username }) {
  const [done, setDone] = useState(false)

  const handleExport = () => {
    if (!habits.length) return

    const duration = habits[0].days.length
    const header = ['Habit', ...Array.from({ length: duration }, (_, i) => `Day ${i + 1}`), 'Total', '%']
    const rows = habits.map(h => {
      const total = h.days.filter(Boolean).length
      const pct = Math.round((total / duration) * 100)
      return [h.name, ...h.days.map(d => d ? '1' : '0'), total, pct + '%']
    })

    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `viltr-${username}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)

    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }

  return (
    <button onClick={handleExport} style={done ? styles.btnDone : styles.btn}>
      {done ? '✓ EXPORTED' : '↓ EXPORT CSV'}
    </button>
  )
}

const styles = {
  btn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text3)',
    padding: '4px 12px', borderRadius: '4px',
    cursor: 'pointer', fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem', letterSpacing: '0.1em',
    transition: 'all 0.2s',
  },
  btnDone: {
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.4)',
    color: '#10b981',
    padding: '4px 12px', borderRadius: '4px',
    cursor: 'default', fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem', letterSpacing: '0.1em',
  },
}
