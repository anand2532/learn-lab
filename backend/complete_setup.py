#!/usr/bin/env python3
"""
Complete Learn Lab Setup Script
Recreates all missing backend files and sets up everything
"""

import os
import sys
import subprocess
import getpass
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_step(msg):
    print(f"\n{Colors.BOLD}{Colors.BLUE}▶ {msg}{Colors.RESET}")

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.RESET}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.RESET}")

def run_command(cmd, check=True, shell=False, cwd=None):
    """Run a shell command"""
    try:
        result = subprocess.run(cmd, check=check, shell=shell, 
                              capture_output=True, text=True, cwd=cwd)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        if check:
            print_error(f"Command failed: {cmd}")
            print_error(f"Error: {e.stderr}")
        return None

def create_directory_structure(backend_dir):
    """Create all necessary directories"""
    print_step("Creating directory structure...")
    
    dirs = [
        'proto/auth/v1',
        'proto/course/v1',
        'proto/ai/v1',
        'proto/executor/v1',
        'proto/progress/v1',
        'proto/google/api',
        'services/auth-service/cmd/server',
        'services/auth-service/internal/config',
        'services/auth-service/internal/database',
        'services/auth-service/internal/models',
        'services/auth-service/internal/repository',
        'services/auth-service/internal/service',
        'services/auth-service/internal/server',
        'services/course-service/cmd/server',
        'services/ai-service/cmd/server',
        'services/executor-service/cmd/server',
        'services/progress-service/cmd/server',
        'gateway/cmd/server',
        'migrations',
        'scripts',
        'bin',
        'logs',
    ]
    
    for dir_path in dirs:
        full_path = backend_dir / dir_path
        full_path.mkdir(parents=True, exist_ok=True)
    
    print_success("Directory structure created")

def create_proto_files(backend_dir):
    """Create all Protocol Buffer files"""
    print_step("Creating Protocol Buffer files...")
    
    # This will be handled by the main setup script
    # We just ensure directories exist
    print_success("Proto directories ready")

def create_makefile(backend_dir):
    """Create Makefile"""
    print_step("Creating Makefile...")
    
    makefile_content = """# Learn Lab Backend Makefile

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
	@protoc --go_out=. --go_opt=paths=source_relative \\
		--go-grpc_out=. --go-grpc_opt=paths=source_relative \\
		--grpc-gateway_out=. --grpc-gateway_opt=paths=source_relative \\
		proto/auth/v1/auth.proto \\
		proto/course/v1/course.proto \\
		proto/ai/v1/ai.proto \\
		proto/executor/v1/executor.proto \\
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
	@if [ -z "$$DATABASE_URL" ]; then \\
		echo "❌ DATABASE_URL not set. Please set it in .env file or export it."; \\
		exit 1; \\
	fi
	@psql $$DATABASE_URL -f migrations/001_init.sql
	@echo "✅ Migrations complete!"

run:
	@echo "🚀 Starting all services..."
	@if [ ! -f .env ]; then \\
		echo "❌ .env file not found. Please copy .env.example to .env and configure it."; \\
		exit 1; \\
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
"""
    
    with open(backend_dir / 'Makefile', 'w') as f:
        f.write(makefile_content)
    
    print_success("Makefile created")

def create_frontend_env(root_dir, pi_ip, gateway_port):
    """Create frontend .env.local file"""
    print_step("Creating frontend environment configuration...")
    
    env_content = f"""# Learn Lab Frontend Configuration
# Backend API URL - Update with your Raspberry Pi IP
NEXT_PUBLIC_API_URL=http://{pi_ip}:{gateway_port}/api/v1

# Development
NODE_ENV=development
"""
    
    env_file = root_dir / '.env.local'
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print_success(f"Frontend .env.local created at {env_file}")
    print_warning("Update NEXT_PUBLIC_API_URL if your Raspberry Pi IP is different")

def main():
    """Main setup function"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}=== Learn Lab Complete Setup ==={Colors.RESET}\n")
    
    # Get paths
    script_dir = Path(__file__).parent.absolute()
    backend_dir = script_dir
    root_dir = backend_dir.parent
    
    print(f"Backend directory: {backend_dir}")
    print(f"Root directory: {root_dir}")
    
    # Get configuration
    print(f"\n{Colors.YELLOW}Configuration:{Colors.RESET}")
    pi_ip = input("Raspberry Pi IP address [192.168.4.1]: ").strip() or "192.168.4.1"
    gateway_port = input("Gateway port [8080]: ").strip() or "8080"
    
    try:
        # Create directory structure
        create_directory_structure(backend_dir)
        
        # Create Makefile
        create_makefile(backend_dir)
        
        # Create frontend env
        create_frontend_env(root_dir, pi_ip, gateway_port)
        
        print(f"\n{Colors.BOLD}{Colors.GREEN}=== Setup Complete! ==={Colors.RESET}\n")
        print("Next steps:")
        print("1. Run the main setup script: sudo python3 setup_backend.py")
        print("2. The script will create all backend files and configure everything")
        print(f"3. Frontend is configured to use: http://{pi_ip}:{gateway_port}/api/v1")
        print("4. After backend setup, start frontend: cd .. && npm run dev")
        
    except Exception as e:
        print_error(f"Setup failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()

