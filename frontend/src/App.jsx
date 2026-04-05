import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Setup from './pages/Setup'
import Dashboard from './pages/Dashboard'
import { getHabits } from './api/api'

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login')
  const [checking, setChecking] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  // Apply theme to body
  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      getHabits(u.id)
        .then(res => setView(res.data.length > 0 ? 'dashboard' : 'setup'))
        .catch(() => setView('setup'))
        .finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [])

  const handleLogin = async (userData) => {
    setUser(userData)
    try {
      const res = await getHabits(userData.id)
      setView(res.data.length > 0 ? 'dashboard' : 'setup')
    } catch {
      setView('setup')
    }
  }

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  if (checking) return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--accent)',
    }}>
      INITIALIZING...
    </div>
  )

  if (view === 'login') return <Login onLogin={handleLogin} />
  if (view === 'setup') return <Setup user={user} onComplete={() => setView('dashboard')} />
  return (
    <Dashboard
      user={user}
      onLogout={() => { localStorage.removeItem('user'); setUser(null); setView('login') }}
      onReset={() => setView('setup')}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  )
}
