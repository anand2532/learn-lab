#!/bin/bash

set -e

echo "🚀 Installing Learn Lab Backend Dependencies..."

# Check Go installation
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.21+ first."
    echo "   Visit: https://go.dev/doc/install"
    exit 1
fi

GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
echo "✅ Go version: $GO_VERSION"

# Check protoc installation
if ! command -v protoc &> /dev/null; then
    echo "⚠️  protoc is not installed. Installing..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y protobuf-compiler
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install protobuf
    else
        echo "❌ Please install protoc manually for your OS"
        exit 1
    fi
fi

echo "✅ protoc version: $(protoc --version)"

# Add Go bin to PATH
export PATH="$PATH:$(go env GOPATH)/bin"

# Install Go protobuf plugins
echo "📦 Installing Go protobuf plugins..."
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest

# Verify plugins are installed
if ! command -v protoc-gen-go &> /dev/null; then
    echo "❌ protoc-gen-go not found in PATH"
    echo "   Add to PATH: export PATH=\"\$PATH:\$(go env GOPATH)/bin\""
    exit 1
fi

echo "✅ Go protobuf plugins installed"

# Install Go dependencies
echo "📦 Installing Go module dependencies..."
cd "$(dirname "$0")/.."
make deps

# Generate Protocol Buffer code
echo "🔨 Generating Protocol Buffer code..."
make generate

# Create .env from example if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file: nano .env"
echo "2. Run database migrations: make migrate"
echo "3. Build services: make build"
echo "4. Start services: make run"

