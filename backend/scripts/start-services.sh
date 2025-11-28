#!/bin/bash

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi

# Check if binaries exist
if [ ! -f bin/auth-service ]; then
    echo "❌ Binaries not found. Run 'make build' first"
    exit 1
fi

echo "🚀 Starting Learn Lab Backend Services..."
echo ""

# Create logs directory
mkdir -p logs

# Start Auth Service
echo "Starting Auth Service (gRPC: ${AUTH_SERVICE_GRPC_PORT:-50051}, HTTP: ${AUTH_SERVICE_HTTP_PORT:-8001})..."
cd "$(dirname "$0")/.."
./bin/auth-service > logs/auth-service.log 2>&1 &
AUTH_PID=$!
echo "  ✓ Auth Service started (PID: $AUTH_PID)"

sleep 1

# Start Course Service
echo "Starting Course Service (gRPC: ${COURSE_SERVICE_GRPC_PORT:-50052}, HTTP: ${COURSE_SERVICE_HTTP_PORT:-8002})..."
./bin/course-service > logs/course-service.log 2>&1 &
COURSE_PID=$!
echo "  ✓ Course Service started (PID: $COURSE_PID)"

sleep 1

# Start AI Service
echo "Starting AI Service (gRPC: ${AI_SERVICE_GRPC_PORT:-50053}, HTTP: ${AI_SERVICE_HTTP_PORT:-8003})..."
./bin/ai-service > logs/ai-service.log 2>&1 &
AI_PID=$!
echo "  ✓ AI Service started (PID: $AI_PID)"

sleep 1

# Start Executor Service
echo "Starting Executor Service (gRPC: ${EXECUTOR_SERVICE_GRPC_PORT:-50054}, HTTP: ${EXECUTOR_SERVICE_HTTP_PORT:-8004})..."
./bin/executor-service > logs/executor-service.log 2>&1 &
EXECUTOR_PID=$!
echo "  ✓ Executor Service started (PID: $EXECUTOR_PID)"

sleep 1

# Start Progress Service
echo "Starting Progress Service (gRPC: ${PROGRESS_SERVICE_GRPC_PORT:-50055}, HTTP: ${PROGRESS_SERVICE_HTTP_PORT:-8005})..."
./bin/progress-service > logs/progress-service.log 2>&1 &
PROGRESS_PID=$!
echo "  ✓ Progress Service started (PID: $PROGRESS_PID)"

sleep 1

# Start Gateway
echo "Starting Gateway (HTTP: ${GATEWAY_PORT:-8080})..."
./bin/gateway > logs/gateway.log 2>&1 &
GATEWAY_PID=$!
echo "  ✓ Gateway started (PID: $GATEWAY_PID)"

sleep 2

# Save PIDs to file for stop script
echo "$AUTH_PID" > .pids
echo "$COURSE_PID" >> .pids
echo "$AI_PID" >> .pids
echo "$EXECUTOR_PID" >> .pids
echo "$PROGRESS_PID" >> .pids
echo "$GATEWAY_PID" >> .pids

echo ""
echo "✅ All services started!"
echo ""
echo "Service Status:"
echo "  - Auth Service:     http://localhost:${AUTH_SERVICE_HTTP_PORT:-8001}"
echo "  - Course Service:   http://localhost:${COURSE_SERVICE_HTTP_PORT:-8002}"
echo "  - AI Service:       http://localhost:${AI_SERVICE_HTTP_PORT:-8003}"
echo "  - Executor Service: http://localhost:${EXECUTOR_SERVICE_HTTP_PORT:-8004}"
echo "  - Progress Service: http://localhost:${PROGRESS_SERVICE_HTTP_PORT:-8005}"
echo "  - Gateway (REST):   http://localhost:${GATEWAY_PORT:-8080}"
echo ""
echo "Logs are in ./logs/ directory"
echo "To stop services: make stop"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for interrupt
trap 'echo ""; echo "Stopping services..."; make stop; exit' INT TERM
wait

