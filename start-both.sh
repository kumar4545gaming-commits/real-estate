#!/bin/bash

echo "🚀 Starting Real Estate Applications..."
echo "======================================"

# Function to kill processes on specific ports
cleanup() {
    echo "🛑 Stopping applications..."
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    kill -9 $(lsof -t -i:3001) 2>/dev/null || true
    kill -9 $(lsof -t -i:5001) 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📱 Starting Main Website (Port 3000)..."
cd /Users/bhuvanaa/Documents/my-react-app
npm start &
MAIN_PID=$!

echo "⏳ Waiting for main website to start..."
sleep 10

echo "🔧 Starting Admin Panel (Port 3001)..."
cd /Users/bhuvanaa/Documents/my-react-app/admin-panel
npm start &
ADMIN_PID=$!

echo "⏳ Waiting for admin panel to start..."
sleep 10

echo ""
echo "✅ Both applications are running!"
echo "======================================"
echo "🌐 Main Website:    http://localhost:3000"
echo "🔧 Admin Panel:     http://localhost:3001"
echo "======================================"
echo ""
echo "Press Ctrl+C to stop both applications"

# Wait for both processes
wait $MAIN_PID $ADMIN_PID














