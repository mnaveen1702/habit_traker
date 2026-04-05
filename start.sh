#!/bin/bash
# Start VILTR Habit Tracker

echo "⚡ VILTR — Starting Habit Tracker System"
echo "========================================="

# Start backend
echo "→ Starting Flask backend on port 5000..."
cd backend && python app.py &
BACKEND_PID=$!

# Wait a moment
sleep 2

# Start frontend
echo "→ Starting Vite frontend on port 3000..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ App running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services."

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'" EXIT
wait
