# Learn Lab Backend

Backend implementation for Learn Lab using Golang, gRPC, and PostgreSQL on Raspberry Pi 5.

## 🚀 Quick Setup

### On Raspberry Pi 5:

```bash
cd ~/learn-lab/backend
sudo python3 setup_backend.py
```

Follow the prompts to configure database, network, and hotspot.

### After Setup:

```bash
# Start services
sudo systemctl start learnlab-*

# Check status
sudo systemctl status learnlab-gateway
```

## 📁 Structure

```
backend/
├── proto/              # Protocol Buffer definitions
├── services/           # Microservices (Auth, Course, AI, Executor, Progress)
├── gateway/            # gRPC Gateway (REST API)
├── migrations/         # Database migrations
├── scripts/            # Setup and utility scripts
├── setup_backend.py    # Automated setup script
└── Makefile           # Build commands
```

## 📚 Documentation

- `QUICK_START.md` - Quick start guide
- `SETUP_GUIDE.md` - Detailed setup instructions
- `REPOSITORY_STRUCTURE.md` - Architecture overview

## 🔧 Commands

```bash
make install    # Install dependencies
make generate   # Generate Protocol Buffer code
make build      # Build all services
make migrate    # Run database migrations
make run        # Start all services
make stop       # Stop all services
```

## 🌐 API Endpoints

All REST endpoints available at: `http://<raspberry-pi-ip>:8080/api/v1/`

See `QUICK_START.md` for detailed API documentation.

