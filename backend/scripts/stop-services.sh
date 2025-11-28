#!/bin/bash

echo "🛑 Stopping Learn Lab Backend Services..."

# Stop services by PID file if it exists
if [ -f .pids ]; then
    while read pid; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null && echo "  ✓ Stopped process $pid"
        fi
    done < .pids
    rm -f .pids
fi

# Also try to kill by process name (fallback)
pkill -f "auth-service" && echo "  ✓ Stopped auth-service" || true
pkill -f "course-service" && echo "  ✓ Stopped course-service" || true
pkill -f "ai-service" && echo "  ✓ Stopped ai-service" || true
pkill -f "executor-service" && echo "  ✓ Stopped executor-service" || true
pkill -f "progress-service" && echo "  ✓ Stopped progress-service" || true
pkill -f "gateway" && echo "  ✓ Stopped gateway" || true

sleep 1

# Check if any are still running
if pgrep -f "auth-service|course-service|ai-service|executor-service|progress-service|gateway" > /dev/null; then
    echo "⚠️  Some services are still running. Force killing..."
    pkill -9 -f "auth-service|course-service|ai-service|executor-service|progress-service|gateway" || true
fi

echo "✅ All services stopped!"

