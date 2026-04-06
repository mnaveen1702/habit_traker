import axios from 'axios'

const api = axios.create({
  baseURL: 'https://habit-traker-awil.onrender.com',
  headers: { 'Content-Type': 'application/json' }
})

export const register = (username, password) =>
  api.post('/register', { username, password })

export const login = (username, password) =>
  api.post('/login', { username, password })

export const getHabits = (user_id) =>
  api.get('/habits', { params: { user_id } })

export const createHabits = (user_id, habits, duration) =>
  api.post('/habits', { user_id, habits, duration })

export const toggleHabit = (habit_id, day_index) =>
  api.post('/toggle', { habit_id, day_index })

export default api