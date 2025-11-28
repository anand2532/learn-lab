# Repository Structure Analysis

## Current Structure

```
learn-lab/
├── app/                    # Next.js frontend app directory
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/              # React components
├── lib/                    # Frontend utilities
│   └── utils.ts
├── public/                 # Static assets
├── backend/                # Backend services (Go/gRPC)
│   ├── proto/              # Protocol Buffer definitions
│   ├── services/           # Microservices
│   │   ├── auth-service/
│   │   ├── course-service/
│   │   ├── ai-service/
│   │   ├── executor-service/
│   │   └── progress-service/
│   ├── gateway/            # gRPC Gateway (REST API)
│   ├── migrations/         # Database migrations
│   ├── scripts/            # Setup scripts
│   └── setup_backend.py    # Automated setup script
├── package.json            # Frontend dependencies
├── next.config.js          # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## Integration Points

1. **Frontend → Backend API**
   - Frontend makes HTTP requests to backend gateway
   - API Base URL: `http://<raspberry-pi-ip>:8080/api/v1/`
   - Configured via `NEXT_PUBLIC_API_URL` environment variable

2. **Backend Services**
   - Auth Service: Port 50051 (gRPC), 8001 (HTTP)
   - Course Service: Port 50052 (gRPC), 8002 (HTTP)
   - AI Service: Port 50053 (gRPC), 8003 (HTTP)
   - Executor Service: Port 50054 (gRPC), 8004 (HTTP)
   - Progress Service: Port 50055 (gRPC), 8005 (HTTP)
   - Gateway: Port 8080 (REST API)

3. **Database**
   - PostgreSQL on Raspberry Pi 5
   - Connection: `postgres://learnlab_user:password@<pi-ip>:5432/learnlab`

## Setup Flow

1. **On Raspberry Pi:**
   - Run `setup_backend.py` to configure backend
   - Setup creates database, builds services, configures network

2. **On Laptop:**
   - Connect to Raspberry Pi hotspot
   - Configure frontend `.env.local` with API URL
   - Run `npm run dev` to start frontend

3. **Access:**
   - Frontend: `http://localhost:3000` (on laptop)
   - Backend API: `http://192.168.4.1:8080/api/v1/` (from laptop)

