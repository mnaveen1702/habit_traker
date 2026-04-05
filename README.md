# ⚡ VILTR — Student Habit Tracker

A villain-themed, production-ready habit tracking system for students.

---

## 🚀 QUICK START

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

---

## 1. START THE BACKEND

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at: http://localhost:5000

---

## 2. START THE FRONTEND

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 📁 PROJECT STRUCTURE

```
habit-tracker/
├── backend/
│   ├── app.py              # Flask API (all endpoints)
│   ├── requirements.txt    # Python deps
│   └── database.db         # SQLite DB (auto-created)
│
└── frontend/
    ├── index.html
    ├── vite.config.js       # Proxies /api → localhost:5000
    ├── package.json
    └── src/
        ├── App.jsx           # Root + routing logic
        ├── index.css         # Global villain theme
        ├── main.jsx
        ├── api/
        │   └── api.js        # Axios API calls
        ├── components/
        │   ├── Navbar.jsx
        │   ├── HabitGrid.jsx       # Excel-style grid
        │   └── AnalyticsPanel.jsx  # Charts + stats
        └── pages/
            ├── Login.jsx     # Auth page
            ├── Setup.jsx     # Habit configuration
            └── Dashboard.jsx # Main dashboard
```

---

## 🔗 API ENDPOINTS

| Method | Endpoint    | Description          |
|--------|-------------|----------------------|
| POST   | /register   | Create account       |
| POST   | /login      | Authenticate user    |
| GET    | /habits     | Get user habits      |
| POST   | /habits     | Create/reset habits  |
| POST   | /toggle     | Toggle a day cell    |

---

## 🎨 THEME

- **Font**: Bebas Neue (display) + Space Mono (code) + DM Sans (body)
- **Background**: #020617 (Dark Midnight)
- **Cards**: #0f1729 (Dark Navy)
- **Primary**: #38bdf8 (Neon Blue)
- **Action**: #f43f5e (Villain Red)
- **Gold**: #f59e0b (XP Gold)

---

## ⚡ FEATURES

- 🔐 Auth (register/login)
- 📅 30/60/90 day challenges
- 📊 Excel-style habit grid (sticky cols, horizontal scroll)
- 📈 Live analytics (pie chart, progress bars, streak counter)
- 🧠 Villain-style motivational quotes
- 💾 SQLite persistence
- ⚡ 10 XP per completed habit task

---

## 🏗️ BUILD FOR PRODUCTION

```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend (use gunicorn)
pip install gunicorn
cd backend
gunicorn app:app -w 4 -b 0.0.0.0:5000
```
