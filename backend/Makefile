.PHONY: help generate build test clean migrate run stop install deps

help:
	@echo "Learn Lab Backend - Available commands:"
	@echo "  make install     - Install all dependencies and setup"
	@echo "  make generate    - Generate Protocol Buffer code"
	@echo "  make build       - Build all services"
	@echo "  make test        - Run tests"
	@echo "  make migrate     - Run database migrations"
	@echo "  make run         - Start all services"
	@echo "  make stop        - Stop all services"
	@echo "  make clean       - Clean build artifacts"

install:
	@echo "🚀 Installing dependencies..."
	@./scripts/install-dependencies.sh
	@echo "✅ Installation complete!"

generate:
	@echo "🔨 Generating Protocol Buffer code..."
	@mkdir -p proto/google/api
	@protoc --go_out=. --go_opt=paths=source_relative \
		--go-grpc_out=. --go-grpc_opt=paths=source_relative \
		--grpc-gateway_out=. --grpc-gateway_opt=paths=source_relative \
		proto/auth/v1/auth.proto \
		proto/course/v1/course.proto \
		proto/ai/v1/ai.proto \
		proto/executor/v1/executor.proto \
		proto/progress/v1/progress.proto
	@echo "✅ Protocol Buffer code generated!"

build:
	@echo "🏗️  Building services..."
	@mkdir -p bin
	@cd services/auth-service && go build -o ../../bin/auth-service ./cmd/server
	@cd services/course-service && go build -o ../../bin/course-service ./cmd/server
	@cd services/ai-service && go build -o ../../bin/ai-service ./cmd/server
	@cd services/executor-service && go build -o ../../bin/executor-service ./cmd/server
	@cd services/progress-service && go build -o ../../bin/progress-service ./cmd/server
	@cd gateway && go build -o ../bin/gateway ./cmd/server
	@echo "✅ Build complete!"

test:
	@echo "🧪 Running tests..."
	@go test ./...

migrate:
	@echo "📊 Running database migrations..."
	@if [ -z "$$DATABASE_URL" ]; then \
		echo "❌ DATABASE_URL not set. Please set it in .env file or export it."; \
		exit 1; \
	fi
	@psql $$DATABASE_URL -f migrations/001_init.sql
	@echo "✅ Migrations complete!"

run:
	@echo "🚀 Starting all services..."
	@if [ ! -f .env ]; then \
		echo "❌ .env file not found. Please copy .env.example to .env and configure it."; \
		exit 1; \
	fi
	@./scripts/start-services.sh

stop:
	@echo "🛑 Stopping all services..."
	@./scripts/stop-services.sh

clean:
	@echo "🧹 Cleaning..."
	@rm -rf bin/
	@find proto -name "*.pb.go" -delete 2>/dev/null || true
	@find proto -name "*.pb.gw.go" -delete 2>/dev/null || true
	@echo "✅ Clean complete!"

deps:
	@echo "📦 Installing Go dependencies..."
	@cd services/auth-service && go mod download && go mod tidy
	@cd services/course-service && go mod download && go mod tidy
	@cd services/ai-service && go mod download && go mod tidy
	@cd services/executor-service && go mod download && go mod tidy
	@cd services/progress-service && go mod download && go mod tidy
	@cd gateway && go mod download && go mod tidy
	@echo "✅ Dependencies installed!"

