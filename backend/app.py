from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import json
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            days TEXT NOT NULL DEFAULT '[]',
            duration INTEGER DEFAULT 30,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/')
def home():
    return "Habit Tracker Backend Running 🚀"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    conn = get_db()
    try:
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)',
                     (username, hash_password(password)))
        conn.commit()
        user = conn.execute('SELECT id, username FROM users WHERE username = ?', (username,)).fetchone()
        return jsonify({'id': user['id'], 'username': user['username']}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 409
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?',
                        (username, hash_password(password))).fetchone()
    conn.close()

    if user:
        return jsonify({'id': user['id'], 'username': user['username']}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/habits', methods=['GET'])
def get_habits():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400

    conn = get_db()
    habits = conn.execute('SELECT * FROM habits WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()

    result = []
    for h in habits:
        result.append({
            'id': h['id'],
            'name': h['name'],
            'days': json.loads(h['days']),
            'duration': h['duration']
        })
    return jsonify(result)

@app.route('/habits', methods=['POST'])
def create_habits():
    data = request.get_json()
    user_id = data.get('user_id')
    habits = data.get('habits', [])
    duration = data.get('duration', 30)

    if not user_id or not habits:
        return jsonify({'error': 'user_id and habits required'}), 400

    conn = get_db()
    conn.execute('DELETE FROM habits WHERE user_id = ?', (user_id,))

    created = []
    for name in habits:
        days = json.dumps([False] * duration)
        cursor = conn.execute(
            'INSERT INTO habits (user_id, name, days, duration) VALUES (?, ?, ?, ?)',
            (user_id, name, days, duration)
        )
        created.append({
            'id': cursor.lastrowid,
            'name': name,
            'days': [False] * duration,
            'duration': duration
        })

    conn.commit()
    conn.close()
    return jsonify(created), 201

@app.route('/toggle', methods=['POST'])
def toggle_habit():
    data = request.get_json()
    habit_id = data.get('habit_id')
    day_index = data.get('day_index')

    if habit_id is None or day_index is None:
        return jsonify({'error': 'habit_id and day_index required'}), 400

    conn = get_db()
    habit = conn.execute('SELECT * FROM habits WHERE id = ?', (habit_id,)).fetchone()

    if not habit:
        return jsonify({'error': 'Habit not found'}), 404

    days = json.loads(habit['days'])
    if 0 <= day_index < len(days):
        days[day_index] = not days[day_index]
        conn.execute('UPDATE habits SET days = ? WHERE id = ?', (json.dumps(days), habit_id))
        conn.commit()

    conn.close()
    return jsonify({'days': days})

# ✅ CORRECT PLACE (ONLY HERE)
if __name__ == '__main__':
    init_db()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)