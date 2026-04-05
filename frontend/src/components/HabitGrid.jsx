import React, { useCallback } from 'react'
import { toggleHabit } from '../api/api'

function getDayLabel(index) {
  return `D${String(index + 1).padStart(2, '0')}`
}

export default function HabitGrid({ habits, onUpdate }) {
  const handleToggle = useCallback(async (habitId, dayIndex) => {
    try {
      const res = await toggleHabit(habitId, dayIndex)
      onUpdate(habitId, res.data.days)
    } catch (e) {
      console.error('Toggle failed', e)
    }
  }, [onUpdate])

  if (!habits.length) return (
    <div style={styles.empty}>No habits configured.</div>
  )

  const duration = habits[0]?.days?.length || 30
  const today = new Date().getDate() - 1 // 0-indexed "today"

  return (
    <div style={styles.wrapper}>
      {/* Header row */}
      <div style={styles.gridContainer}>
        <div style={styles.table}>
          {/* Sticky header */}
          <div style={styles.headerRow}>
            <div style={styles.stickyHeaderCell}>HABIT</div>
            {Array.from({ length: duration }, (_, i) => (
              <div key={i}
                style={i === today ? styles.dayHeaderToday : styles.dayHeader}>
                {getDayLabel(i)}
              </div>
            ))}
          </div>

          {/* Habit rows */}
          {habits.map((habit) => {
            const completed = habit.days.filter(Boolean).length
            const pct = Math.round((completed / duration) * 100)

            return (
              <div key={habit.id} style={styles.row}>
                {/* Sticky habit name */}
                <div style={styles.stickyCell}>
                  <div style={styles.habitName}>{habit.name}</div>
                  <div style={styles.habitPct}>{pct}%</div>
                </div>

                {/* Day cells */}
                {habit.days.map((done, i) => (
                  <div key={i}
                    onClick={() => handleToggle(habit.id, i)}
                    style={done
                      ? styles.cellDone
                      : i === today
                        ? styles.cellToday
                        : i < today
                          ? styles.cellMissed
                          : styles.cell
                    }
                    title={done ? 'Completed ✓' : `Day ${i + 1}`}
                  >
                    {done && <span style={styles.zapIcon}>⚡</span>}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const CELL_SIZE = '34px'
const STICKY_W = '130px'

const styles = {
  wrapper: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  gridContainer: { flex: 1, overflow: 'auto' },
  table: { display: 'flex', flexDirection: 'column', minWidth: 'max-content' },
  headerRow: {
    display: 'flex', position: 'sticky', top: 0, zIndex: 10,
    background: 'var(--bg)',
  },
  stickyHeaderCell: {
    width: STICKY_W, minWidth: STICKY_W, height: '30px',
    position: 'sticky', left: 0, zIndex: 20,
    background: 'var(--bg)',
    display: 'flex', alignItems: 'center',
    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
    letterSpacing: '0.2em', color: 'var(--text3)',
    borderBottom: '1px solid var(--border)',
    borderRight: '1px solid var(--border)',
    paddingLeft: '8px',
  },
  dayHeader: {
    width: CELL_SIZE, minWidth: CELL_SIZE, height: '30px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
    color: 'var(--text3)', borderBottom: '1px solid var(--border)',
    borderRight: '1px solid rgba(30,58,95,0.3)',
  },
  dayHeaderToday: {
    width: CELL_SIZE, minWidth: CELL_SIZE, height: '30px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
    color: 'var(--accent)', borderBottom: '1px solid var(--accent)',
    borderRight: '1px solid rgba(30,58,95,0.3)',
    background: 'rgba(56,189,248,0.05)',
  },
  row: {
    display: 'flex',
    borderBottom: '1px solid rgba(30,58,95,0.4)',
    transition: 'background 0.15s',
  },
  stickyCell: {
    width: STICKY_W, minWidth: STICKY_W,
    position: 'sticky', left: 0, zIndex: 5,
    background: 'var(--bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 10px 0 8px',
    borderRight: '1px solid var(--border)',
    height: '38px',
  },
  habitName: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
    fontWeight: 500, color: 'var(--text)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    maxWidth: '85px',
  },
  habitPct: {
    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
    color: 'var(--text3)',
  },
  cell: {
    width: CELL_SIZE, minWidth: CELL_SIZE, height: '38px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', borderRight: '1px solid rgba(30,58,95,0.2)',
    transition: 'all 0.15s',
    background: 'transparent',
  },
  cellToday: {
    width: CELL_SIZE, minWidth: CELL_SIZE, height: '38px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', borderRight: '1px solid rgba(56,189,248,0.2)',
    background: 'rgba(56,189,248,0.04)',
    borderLeft: '1px solid rgba(56,189,248,0.15)',
  },
  cellMissed: {
    width: CELL_SIZE, minWidth: CELL_SIZE, height: '38px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', borderRight: '1px solid rgba(30,58,95,0.2)',
    background: 'transparent',
    opacity: 0.5,
  },
  cellDone: {
    width: CELL_SIZE, minWidth: CELL_SIZE, height: '38px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', borderRight: '1px solid rgba(244,63,94,0.2)',
    background: 'rgba(244,63,94,0.15)',
    animation: 'pulse-red 2s ease infinite',
  },
  zapIcon: { fontSize: '0.85rem' },
  empty: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100%', color: 'var(--text3)',
    fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
  },
}
