# Learn Lab Backend

Complete backend implementation for Learn Lab using Golang, gRPC, and PostgreSQL on Raspberry Pi 5.

## 🚀 Quick Start (Raspberry Pi 5)

### 1. Clone and Setup

```bash
cd backend
chmod +x scripts/*.sh
make install
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env  # Edit with your database credentials
```

Update `DATABASE_URL` with your Raspberry Pi IP:
```
DATABASE_URL=postgres://learnlab_user:password@192.168.1.100:5432/learnlab?sslmode=disable
```

### 3. Run Database Migrations

```bash
export DATABASE_URL="postgres://learnlab_user:password@raspberry-pi-ip:5432/learnlab?sslmode=disable"
make migrate
```

Or if DATABASE_URL is in .env:
```bash
source .env
make migrate
```

### 4. Build and Run Services

```bash
make build
make run
```

## 📋 Prerequisites

- **Go 1.21+**: `go version`
- **Protocol Buffers**: `protoc --version`
- **PostgreSQL Client**: `psql --version` (for migrations)
- **Raspberry Pi 5** with PostgreSQL 15+ running

## 🏗️ Architecture

```
Frontend (Next.js)
    ↓ HTTP/REST
gRPC Gateway (Port 8080)
    ↓ gRPC
┌─────────────────────────────────┐
│ Auth Service      (50051/8001)  │
│ Course Service    (50052/8002)  │
│ AI Service        (50053/8003)  │
│ Executor Service  (50054/8004)  │
│ Progress Service  (50055/8005)  │
└─────────────────────────────────┘
    ↓ PostgreSQL
Raspberry Pi 5 Database
```

## 📁 Project Structure

```
backend/
├── proto/              # Protocol Buffer definitions
├── services/           # Microservices
│   ├── auth-service/
│   ├── course-service/
│   ├── ai-service/
│   ├── executor-service/
│   └── progress-service/
├── gateway/            # gRPC Gateway (REST API)
├── migrations/         # Database migrations
├── scripts/            # Setup and utility scripts
└── bin/                # Compiled binaries
```

## 🔧 Available Commands

- `make install` - Install all dependencies
- `make generate` - Generate Protocol Buffer code
- `make build` - Build all services
- `make migrate` - Run database migrations
- `make run` - Start all services
- `make stop` - Stop all services
- `make test` - Run tests
- `make clean` - Clean build artifacts

## 🌐 API Endpoints

All REST endpoints available at: `http://localhost:8080/api/v1/`

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

### Courses
- `GET /api/v1/courses` - List courses
- `GET /api/v1/courses/{id}` - Get course
- `POST /api/v1/courses` - Create course
- `PUT /api/v1/courses/{id}` - Update course
- `DELETE /api/v1/courses/{id}` - Delete course

## 🍓 Raspberry Pi 5 Setup

### Recommended OS: **Raspberry Pi OS (64-bit) Bookworm**

### 1. Install PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql-15 postgresql-contrib-15
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 2. Create Database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE learnlab;
CREATE USER learnlab_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE learnlab TO learnlab_user;
\c learnlab
GRANT ALL ON SCHEMA public TO learnlab_user;
\q
```

### 3. Configure PostgreSQL

Edit `/etc/postgresql/15/main/postgresql.conf`:
```conf
shared_buffers = 2GB
effective_cache_size = 6GB
max_connections = 100
listen_addresses = '*'
```

Edit `/etc/postgresql/15/main/pg_hba.conf`:
```conf
host    learnlab    learnlab_user    0.0.0.0/0    md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 4. Configure Firewall

```bash
sudo ufw allow 5432/tcp
sudo ufw enable
```

### 5. Find Raspberry Pi IP

```bash
hostname -I
```

Use this IP in your `.env` file.

## 🧪 Testing

Test the API:

```bash
# Register a user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Development

### Run Individual Service

```bash
cd services/auth-service
go run cmd/server/main.go
```

### Regenerate Protocol Buffers

```bash
make generate
```

## 🔒 Security Notes

- Change `JWT_SECRET` in production
- Use strong database passwords
- Enable SSL/TLS for PostgreSQL in production
- Configure firewall rules properly
- Use VPN or secure tunnel for database access

## 🆘 Troubleshooting

### Services won't start
- Check if ports are already in use: `lsof -i :50051`
- Verify `.env` file exists and is configured
- Check database connection: `psql $DATABASE_URL`

### Protocol Buffer errors
- Ensure `protoc` is installed: `protoc --version`
- Install Go plugins: `go install google.golang.org/protobuf/cmd/protoc-gen-go@latest`

### Database connection errors
- Verify PostgreSQL is running on Raspberry Pi
- Check firewall rules
- Verify credentials in `.env`
- Test connection: `psql $DATABASE_URL`

## 📄 License

MIT

