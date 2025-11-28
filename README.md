# Learn Lab

Full-stack learning platform with Next.js frontend and Go/gRPC backend.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Go microservices with gRPC
- **Database**: PostgreSQL on Raspberry Pi 5
- **Network**: WiFi hotspot for local access

## 🚀 Quick Start

### 1. Backend Setup (Raspberry Pi 5)

```bash
cd backend
sudo python3 setup_backend.py
```

See `backend/QUICK_START.md` for details.

### 2. Frontend Setup (Laptop)

```bash
# Install dependencies
npm install

# Configure API URL
cp .env.local.example .env.local
# Edit .env.local with Raspberry Pi IP

# Start development server
npm run dev
```

## 📁 Project Structure

```
learn-lab/
├── app/                # Next.js app directory
├── components/         # React components
├── lib/               # Utilities and API client
├── backend/           # Backend services
│   ├── services/      # Microservices
│   ├── gateway/       # API Gateway
│   └── setup_backend.py
├── package.json       # Frontend dependencies
└── next.config.js     # Next.js configuration
```

## 📚 Documentation

- `SETUP_INSTRUCTIONS.md` - Complete setup guide
- `COMPLETE_SETUP_GUIDE.md` - Full integration guide
- `backend/QUICK_START.md` - Backend quick start
- `backend/SETUP_GUIDE.md` - Backend detailed setup

## 🔧 Development

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
```

### Backend
```bash
cd backend
make build       # Build services
make run         # Start services
make stop        # Stop services
```

## 🌐 Network Configuration

- **Raspberry Pi IP**: `192.168.4.1` (hotspot mode)
- **Backend API**: `http://192.168.4.1:8080/api/v1/`
- **Frontend**: `http://localhost:3000`

## 📝 License

MIT
