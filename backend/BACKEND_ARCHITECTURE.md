# Backend Architecture - Learn Lab

## Overview

This document outlines the backend architecture for the Learn Lab web application. The backend will be built using **Golang** with **gRPC** for inter-service communication, with the database hosted on a **Raspberry Pi 5**.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Setup (Raspberry Pi 5)](#database-setup-raspberry-pi-5)
4. [Service Architecture](#service-architecture)
5. [gRPC API Design](#grpc-api-design)
6. [Golang Services](#golang-services)
7. [gRPC Implementation](#grpc-implementation)
8. [Database Schema](#database-schema)
9. [Authentication & Authorization](#authentication--authorization)
10. [Security Considerations](#security-considerations)
11. [Deployment Strategy](#deployment-strategy)
12. [Development Setup](#development-setup)
13. [Monitoring & Logging](#monitoring--logging)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────┐
│   Next.js App   │ (Frontend - Current)
└────────┬────────┘
         │ HTTP/HTTPS (REST for frontend)
         │ gRPC-Web (optional)
         │
┌────────▼─────────────────────────────────────┐
│      gRPC Gateway / Envoy Proxy               │
│      (Converts gRPC to REST for frontend)     │
└────────┬─────────────────────────────────────┘
         │ gRPC
         │
    ┌────┴────┬──────────────┬──────────────┐
    │         │              │              │
┌───▼───┐ ┌──▼───┐    ┌─────▼─────┐  ┌─────▼─────┐
│ Golang│ │Golang│    │  Golang   │  │  Golang   │
│ Auth  │ │ AI   │    │  Code     │  │  Course   │
│Service│ │Service│   │  Executor │  │  Service  │
│(gRPC) │ │(gRPC)│    │  (gRPC)   │  │  (gRPC)   │
└───┬───┘ └──┬───┘    └─────┬─────┘  └─────┬─────┘
    │        │              │              │
    │        │              │              │
    └────────┴──────────────┴──────────────┘
                    │ gRPC Inter-service
                    │
            ┌───────▼────────┐
            │  Raspberry Pi 5 │
            │   PostgreSQL    │
            │   (Database)    │
            └─────────────────┘
```

### Service Responsibilities

- **Golang gRPC Services**: 
  - Authentication & User Management Service
  - Course Content Management Service
  - AI/ML Services (Study Buddy, Code Analysis)
  - Code Execution Engine Service
  - User Progress Tracking Service
  - Real-time WebSocket Service (gRPC streaming)

### Communication Patterns

- **Frontend ↔ Backend**: HTTP/REST (via gRPC Gateway)
- **Service ↔ Service**: gRPC (high-performance, type-safe)
- **Service ↔ Database**: Direct PostgreSQL connection
- **Real-time**: gRPC Streaming or WebSocket

---

## Technology Stack

### Backend Language

#### Golang
- **gRPC Framework**: google.golang.org/grpc
- **Protocol Buffers**: Protocol Buffers (protobuf) for service definitions
- **ORM**: GORM or Ent (database abstraction)
- **HTTP Gateway**: grpc-gateway (REST API for frontend)
- **Use Cases**:
  - All microservices (Auth, Course, AI, Code Execution)
  - gRPC service-to-service communication
  - REST API via gRPC Gateway for frontend
  - Authentication & session management
  - Course content CRUD operations
  - User progress tracking
  - AI/ML inference services
  - Code execution engine (sandboxed)
  - Real-time streaming (gRPC streaming)
  - Background job processing

### gRPC & Protocol Buffers

- **gRPC**: High-performance RPC framework
- **Protocol Buffers**: Language-neutral, platform-neutral serialization
- **Benefits**:
  - Type-safe service definitions
  - Efficient binary serialization
  - Streaming support (unary, server-streaming, client-streaming, bidirectional)
  - Code generation for multiple languages
  - Built-in load balancing and health checking

### Database

- **Primary Database**: PostgreSQL 15+
- **Host**: Raspberry Pi 5
- **Connection Pooling**: PgBouncer (optional, for connection management)
- **Backup**: Automated daily backups
- **gRPC Database**: Use sqlx or GORM with connection pooling

### Additional Services

- **Redis**: Caching, session storage, rate limiting
- **Message Queue**: NATS (gRPC-compatible) or RabbitMQ (for async job processing)
- **File Storage**: MinIO or S3-compatible storage
- **gRPC Gateway**: Envoy Proxy or grpc-gateway (REST to gRPC conversion)
- **Service Discovery**: Consul or etcd (for service registration)
- **Monitoring**: Prometheus + Grafana (gRPC metrics)
- **Logging**: ELK Stack or Loki

---

## Database Setup (Raspberry Pi 5)

### Hardware Requirements

- **Raspberry Pi 5** (8GB RAM recommended)
- **MicroSD Card**: 64GB+ (Class 10, A2)
- **Power Supply**: Official Raspberry Pi 5 PSU
- **Cooling**: Active cooling recommended for sustained loads
- **Storage**: Consider external SSD via USB 3.0 for better performance

### Operating System

```bash
# Recommended OS
- Raspberry Pi OS (64-bit) - Bookworm
- Ubuntu Server 22.04 LTS (64-bit) - Alternative
```

### PostgreSQL Installation

```bash
# Install PostgreSQL 15+
sudo apt update
sudo apt install -y postgresql-15 postgresql-contrib-15

# Configure PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql
```

```sql
-- Create database
CREATE DATABASE learnlab;

-- Create user
CREATE USER learnlab_user WITH PASSWORD 'secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE learnlab TO learnlab_user;

-- Connect to database
\c learnlab

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO learnlab_user;
```

### PostgreSQL Configuration

Edit `/etc/postgresql/15/main/postgresql.conf`:

```conf
# Memory settings (adjust based on Pi 5 RAM)
shared_buffers = 2GB              # 25% of RAM
effective_cache_size = 6GB       # 75% of RAM
maintenance_work_mem = 512MB
work_mem = 64MB

# Connection settings
max_connections = 100
listen_addresses = '*'            # Or specific IP

# Performance
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1            # Lower for SSD
effective_io_concurrency = 200    # Higher for SSD

# Logging
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_min_duration_statement = 1000  # Log slow queries
```

Edit `/etc/postgresql/15/main/pg_hba.conf`:

```conf
# Allow connections from backend servers
host    learnlab    learnlab_user    10.0.0.0/24    md5
host    learnlab    learnlab_user    192.168.1.0/24 md5
```

### Performance Optimization

```bash
# Install additional tools
sudo apt install -y postgresql-15-pg-stat-statements

# Enable extensions
sudo -u postgres psql -d learnlab
```

```sql
-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- For text search
CREATE EXTENSION IF NOT EXISTS uuid-ossp; -- For UUID generation
```

### Backup Strategy

```bash
# Create backup script
sudo nano /usr/local/bin/backup-learnlab.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/mnt/backup/learnlab"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="learnlab_backup_$DATE.sql"

mkdir -p $BACKUP_DIR

# Create backup
PGPASSWORD='secure_password' pg_dump -h localhost -U learnlab_user -d learnlab > "$BACKUP_DIR/$FILENAME"

# Compress
gzip "$BACKUP_DIR/$FILENAME"

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $FILENAME.gz"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-learnlab.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-learnlab.sh
```

### Network Configuration

```bash
# Static IP configuration (recommended)
sudo nano /etc/dhcpcd.conf
```

```
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4
```

### Security Hardening

```bash
# Firewall setup
sudo apt install -y ufw
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 5432/tcp  # PostgreSQL (only from internal network)
sudo ufw enable

# Fail2ban for SSH protection
sudo apt install -y fail2ban
```

---

## Service Architecture

### Service Breakdown

#### 1. Authentication Service (Golang gRPC)
- **gRPC Port**: 50051
- **HTTP Port**: 8001 (via gRPC Gateway)
- **Responsibilities**:
  - User registration/login
  - JWT token generation/validation
  - Session management
  - Password hashing (bcrypt)
  - OAuth integration (Google)
- **gRPC Methods**: Register, Login, Logout, ValidateToken, RefreshToken

#### 2. Course Service (Golang gRPC)
- **gRPC Port**: 50052
- **HTTP Port**: 8002 (via gRPC Gateway)
- **Responsibilities**:
  - Course CRUD operations
  - Topic/subtopic management
  - Content delivery
  - Progress tracking
  - Course analytics
- **gRPC Methods**: GetCourse, ListCourses, CreateCourse, UpdateCourse, DeleteCourse, GetTopics, GetSubtopics

#### 3. AI Service (Golang gRPC)
- **gRPC Port**: 50053
- **HTTP Port**: 8003 (via gRPC Gateway)
- **Responsibilities**:
  - Study Buddy AI responses
  - Code analysis and suggestions
  - Natural language processing
  - ML model inference
- **gRPC Methods**: GetHelp, AnalyzeCode, ExplainConcept, GenerateExercise (with streaming support)

#### 4. Code Execution Service (Golang gRPC)
- **gRPC Port**: 50054
- **HTTP Port**: 8004 (via gRPC Gateway)
- **Responsibilities**:
  - Sandboxed code execution
  - Multiple language support (Python, JavaScript, etc.)
  - Resource limits (CPU, memory, time)
  - Security isolation
- **gRPC Methods**: ExecuteCode, ExecuteCodeStream (streaming output), GetExecutionStatus

#### 5. Progress Service (Golang gRPC)
- **gRPC Port**: 50055
- **HTTP Port**: 8005 (via gRPC Gateway)
- **Responsibilities**:
  - User progress tracking
  - Real-time progress updates (streaming)
  - Progress synchronization
  - Analytics
- **gRPC Methods**: UpdateProgress, GetProgress, StreamProgress (server-streaming), GetAnalytics

---

## gRPC API Design

### gRPC Service Definitions

All services use Protocol Buffers (protobuf) for service definitions. The frontend accesses these via gRPC Gateway which converts gRPC to REST.

### Protocol Buffer Definitions

#### Authentication Service (auth.proto)

```protobuf
syntax = "proto3";

package learnlab.auth.v1;

option go_package = "github.com/learnlab/proto/auth/v1;authv1";

service AuthService {
  rpc Register(RegisterRequest) returns (RegisterResponse);
  rpc Login(LoginRequest) returns (LoginResponse);
  rpc Logout(LogoutRequest) returns (LogoutResponse);
  rpc ValidateToken(ValidateTokenRequest) returns (ValidateTokenResponse);
  rpc RefreshToken(RefreshTokenRequest) returns (RefreshTokenResponse);
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
}

message RegisterRequest {
  string email = 1;
  string password = 2;
  string name = 3;
}

message RegisterResponse {
  string user_id = 1;
  string email = 2;
  string name = 3;
}

message LoginRequest {
  string email = 1;
  string password = 2;
}

message LoginResponse {
  string access_token = 1;
  string refresh_token = 2;
  int64 expires_in = 3;
  User user = 4;
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
  string created_at = 4;
}
```

#### Course Service (course.proto)

```protobuf
syntax = "proto3";

package learnlab.course.v1;

option go_package = "github.com/learnlab/proto/course/v1;coursev1";

service CourseService {
  rpc GetCourse(GetCourseRequest) returns (GetCourseResponse);
  rpc ListCourses(ListCoursesRequest) returns (ListCoursesResponse);
  rpc CreateCourse(CreateCourseRequest) returns (CreateCourseResponse);
  rpc UpdateCourse(UpdateCourseRequest) returns (UpdateCourseResponse);
  rpc DeleteCourse(DeleteCourseRequest) returns (DeleteCourseResponse);
  rpc GetTopics(GetTopicsRequest) returns (GetTopicsResponse);
  rpc GetSubtopics(GetSubtopicsRequest) returns (GetSubtopicsResponse);
}

message Course {
  string id = 1;
  string title = 2;
  string description = 3;
  string slug = 4;
  repeated Topic topics = 5;
}

message Topic {
  string id = 1;
  string title = 2;
  string description = 3;
  int32 order_index = 4;
  repeated Subtopic subtopics = 5;
}

message Subtopic {
  string id = 1;
  string title = 2;
  string content = 3;
  string code_example = 4;
  bool has_3d = 5;
  int32 order_index = 6;
}
```

#### AI Service (ai.proto)

```protobuf
syntax = "proto3";

package learnlab.ai.v1;

option go_package = "github.com/learnlab/proto/ai/v1;aiv1";

service AIService {
  rpc GetHelp(GetHelpRequest) returns (GetHelpResponse);
  rpc AnalyzeCode(AnalyzeCodeRequest) returns (AnalyzeCodeResponse);
  rpc ExplainConcept(ExplainConceptRequest) returns (ExplainConceptResponse);
  rpc GenerateExercise(GenerateExerciseRequest) returns (stream GenerateExerciseResponse);
}

message GetHelpRequest {
  string question = 1;
  string context = 2;
  string user_id = 3;
}

message GetHelpResponse {
  string answer = 1;
  repeated string suggestions = 2;
}
```

#### Code Execution Service (executor.proto)

```protobuf
syntax = "proto3";

package learnlab.executor.v1;

option go_package = "github.com/learnlab/proto/executor/v1;executorv1";

service ExecutorService {
  rpc ExecuteCode(ExecuteCodeRequest) returns (ExecuteCodeResponse);
  rpc ExecuteCodeStream(ExecuteCodeRequest) returns (stream ExecuteCodeStreamResponse);
  rpc GetExecutionStatus(GetExecutionStatusRequest) returns (GetExecutionStatusResponse);
}

message ExecuteCodeRequest {
  string code = 1;
  string language = 2;
  string user_id = 3;
  int32 timeout_seconds = 4;
  int64 memory_limit_mb = 5;
}

message ExecuteCodeResponse {
  string execution_id = 1;
  string output = 2;
  string error = 3;
  int32 execution_time_ms = 4;
  string status = 5;
}

message ExecuteCodeStreamResponse {
  string chunk = 1;
  bool is_error = 2;
  bool is_complete = 3;
}
```

### gRPC Gateway (REST API for Frontend)

The gRPC Gateway automatically generates REST endpoints from gRPC services:

```
# Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

# Courses
GET    /api/v1/courses
POST   /api/v1/courses
GET    /api/v1/courses/{id}
PUT    /api/v1/courses/{id}
DELETE /api/v1/courses/{id}
GET    /api/v1/courses/{id}/topics
GET    /api/v1/courses/{id}/subtopics

# AI
POST   /api/v1/ai/help
POST   /api/v1/ai/analyze-code
POST   /api/v1/ai/explain-concept

# Code Execution
POST   /api/v1/execute
GET    /api/v1/execute/{id}
```

### gRPC Streaming

For real-time features, use gRPC streaming:

- **Server Streaming**: Progress updates, code execution output
- **Client Streaming**: Batch operations
- **Bidirectional Streaming**: Real-time collaboration

---

## Golang Services

### Project Structure

```
learnlab-backend/
├── proto/                          # Protocol Buffer definitions
│   ├── auth/
│   │   └── v1/
│   │       └── auth.proto
│   ├── course/
│   │   └── v1/
│   │       └── course.proto
│   ├── ai/
│   │   └── v1/
│   │       └── ai.proto
│   └── executor/
│       └── v1/
│           └── executor.proto
│
├── services/
│   ├── auth-service/
│   │   ├── cmd/
│   │   │   └── server/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── server/            # gRPC server implementation
│   │   │   ├── handlers/          # gRPC handlers
│   │   │   ├── models/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   ├── pkg/
│   │   │   ├── jwt/
│   │   │   └── password/
│   │   ├── config/
│   │   ├── migrations/
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── course-service/
│   │   ├── cmd/
│   │   │   └── server/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── server/
│   │   │   ├── handlers/
│   │   │   ├── models/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── ai-service/
│   │   └── ...
│   │
│   └── executor-service/
│       └── ...
│
└── gateway/                        # gRPC Gateway (REST API)
    ├── cmd/
    │   └── server/
    │       └── main.go
    └── go.mod
```

### Example: Auth Service (Golang gRPC)

**go.mod**
```go
module github.com/learnlab/auth-service

go 1.21

require (
    google.golang.org/grpc v1.60.0
    google.golang.org/protobuf v1.31.0
    github.com/grpc-ecosystem/grpc-gateway/v2 v2.18.1
    gorm.io/gorm v1.25.5
    gorm.io/driver/postgres v1.5.4
    golang.org/x/crypto v0.17.0
    github.com/golang-jwt/jwt/v5 v5.2.0
    github.com/joho/godotenv v1.5.1
)
```

**main.go**
```go
package main

import (
    "context"
    "log"
    "net"
    "os"
    
    "github.com/joho/godotenv"
    "google.golang.org/grpc"
    "google.golang.org/grpc/reflection"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    
    pb "github.com/learnlab/proto/auth/v1"
    "github.com/learnlab/auth-service/internal/server"
    "github.com/learnlab/auth-service/internal/repository"
    "github.com/learnlab/auth-service/internal/service"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }
    
    // Database connection
    dsn := os.Getenv("DATABASE_URL")
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    
    // Initialize repositories
    userRepo := repository.NewUserRepository(db)
    
    // Initialize services
    authService := service.NewAuthService(userRepo)
    
    // Initialize gRPC server
    grpcServer := grpc.NewServer()
    authServer := server.NewAuthServer(authService)
    
    // Register gRPC service
    pb.RegisterAuthServiceServer(grpcServer, authServer)
    
    // Enable reflection for testing
    reflection.Register(grpcServer)
    
    // Start gRPC server
    grpcPort := os.Getenv("GRPC_PORT")
    if grpcPort == "" {
        grpcPort = "50051"
    }
    
    lis, err := net.Listen("tcp", ":"+grpcPort)
    if err != nil {
        log.Fatal("Failed to listen:", err)
    }
    
    log.Printf("Auth gRPC service starting on port %s", grpcPort)
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatal("Failed to serve:", err)
    }
}
```

**internal/server/auth_server.go**
```go
package server

import (
    "context"
    
    pb "github.com/learnlab/proto/auth/v1"
    "github.com/learnlab/auth-service/internal/service"
)

type AuthServer struct {
    pb.UnimplementedAuthServiceServer
    authService *service.AuthService
}

func NewAuthServer(authService *service.AuthService) *AuthServer {
    return &AuthServer{
        authService: authService,
    }
}

func (s *AuthServer) Register(ctx context.Context, req *pb.RegisterRequest) (*pb.RegisterResponse, error) {
    user, err := s.authService.Register(req.Email, req.Password, req.Name)
    if err != nil {
        return nil, err
    }
    
    return &pb.RegisterResponse{
        UserId: user.ID,
        Email:  user.Email,
        Name:    user.Name,
    }, nil
}

func (s *AuthServer) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
    token, user, err := s.authService.Login(req.Email, req.Password)
    if err != nil {
        return nil, err
    }
    
    return &pb.LoginResponse{
        AccessToken:  token.AccessToken,
        RefreshToken: token.RefreshToken,
        ExpiresIn:    token.ExpiresIn,
        User: &pb.User{
            Id:        user.ID,
            Email:     user.Email,
            Name:      user.Name,
            CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
        },
    }, nil
}
```

### Environment Variables

```bash
# .env.example for Golang gRPC services
DATABASE_URL=postgres://learnlab_user:password@raspberry-pi-ip:5432/learnlab?sslmode=disable
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h
GRPC_PORT=50051
HTTP_PORT=8001
LOG_LEVEL=info
```

---

## gRPC Implementation

### Protocol Buffer Compilation

Generate Go code from .proto files:

```bash
# Install protoc compiler
# https://grpc.io/docs/protoc-installation/

# Install Go plugins
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest

# Generate code
protoc --go_out=. --go_opt=paths=source_relative \
       --go-grpc_out=. --go-grpc_opt=paths=source_relative \
       --grpc-gateway_out=. --grpc-gateway_opt=paths=source_relative \
       proto/auth/v1/auth.proto
```

### gRPC Gateway Setup

The gRPC Gateway provides REST API endpoints for the frontend:

**gateway/cmd/server/main.go**
```go
package main

import (
    "context"
    "log"
    "net/http"
    
    "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
    
    pb "github.com/learnlab/proto/auth/v1"
)

func main() {
    ctx := context.Background()
    ctx, cancel := context.WithCancel(ctx)
    defer cancel()
    
    // Create gRPC Gateway mux
    mux := runtime.NewServeMux()
    
    // Register services
    opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
    
    // Auth Service
    if err := pb.RegisterAuthServiceHandlerFromEndpoint(
        ctx, mux, "localhost:50051", opts,
    ); err != nil {
        log.Fatal("Failed to register auth service:", err)
    }
    
    // Course Service
    if err := pb.RegisterCourseServiceHandlerFromEndpoint(
        ctx, mux, "localhost:50052", opts,
    ); err != nil {
        log.Fatal("Failed to register course service:", err)
    }
    
    // Start HTTP server
    log.Println("gRPC Gateway starting on port 8080")
    if err := http.ListenAndServe(":8080", mux); err != nil {
        log.Fatal("Failed to serve:", err)
    }
}
```

### gRPC Streaming Example

**AI Service with Streaming**
```go
func (s *AIServer) GenerateExercise(
    req *pb.GenerateExerciseRequest,
    stream pb.AIService_GenerateExerciseServer,
) error {
    // Generate exercise in chunks
    for i := 0; i < 10; i++ {
        chunk := &pb.GenerateExerciseResponse{
            Chunk: fmt.Sprintf("Exercise part %d", i),
            IsComplete: i == 9,
        }
        
        if err := stream.Send(chunk); err != nil {
            return err
        }
        
        time.Sleep(100 * time.Millisecond)
    }
    
    return nil
}
```

### Inter-Service Communication

Services communicate via gRPC:

```go
// Course Service calling Auth Service
conn, err := grpc.Dial("auth-service:50051", grpc.WithInsecure())
if err != nil {
    log.Fatal(err)
}
defer conn.Close()

client := pb.NewAuthServiceClient(conn)
resp, err := client.ValidateToken(ctx, &pb.ValidateTokenRequest{
    Token: token,
})
```

### Key Features

- **Type Safety**: Protocol Buffers ensure type-safe communication
- **Performance**: Binary serialization is faster than JSON
- **Streaming**: Support for real-time data streams
- **Code Generation**: Automatic client/server code generation
- **Load Balancing**: Built-in support for load balancing
- **Health Checking**: gRPC health checking protocol

---

## Database Schema

### Core Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subtopics table
CREATE TABLE subtopics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    code_example TEXT,
    order_index INTEGER NOT NULL,
    has_3d BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    subtopic_id UUID REFERENCES subtopics(id) ON DELETE SET NULL,
    completed BOOLEAN DEFAULT FALSE,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subtopic_id)
);

-- Code executions table
CREATE TABLE code_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    output TEXT,
    error TEXT,
    execution_time_ms INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX idx_topics_course_id ON topics(course_id);
CREATE INDEX idx_subtopics_topic_id ON subtopics(topic_id);
CREATE INDEX idx_code_executions_user_id ON code_executions(user_id);
CREATE INDEX idx_users_email ON users(email);
```

---

## Authentication & Authorization

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "uuid",
    "email": "user@example.com",
    "exp": 1234567890,
    "iat": 1234567890
  }
}
```

### Authentication Flow

1. User logs in → Auth Service validates credentials
2. Auth Service generates JWT token
3. Frontend stores token (httpOnly cookie or localStorage)
4. Frontend includes token in Authorization header
5. Services validate token using shared secret

### gRPC Interceptor (Authentication)

```go
// gRPC Unary Interceptor for authentication
func AuthInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    // Extract token from metadata
    md, ok := metadata.FromIncomingContext(ctx)
    if !ok {
        return nil, status.Errorf(codes.Unauthenticated, "missing metadata")
    }
    
    tokens := md.Get("authorization")
    if len(tokens) == 0 {
        return nil, status.Errorf(codes.Unauthenticated, "missing authorization token")
    }
    
    token := strings.TrimPrefix(tokens[0], "Bearer ")
    
    // Validate token
    claims, err := ValidateToken(token)
    if err != nil {
        return nil, status.Errorf(codes.Unauthenticated, "invalid token: %v", err)
    }
    
    // Add user ID to context
    ctx = context.WithValue(ctx, "user_id", claims.UserID)
    
    return handler(ctx, req)
}

// Register interceptor
grpcServer := grpc.NewServer(
    grpc.UnaryInterceptor(AuthInterceptor),
)
```

### gRPC Metadata (Headers)

```go
// Client side - adding token
md := metadata.New(map[string]string{
    "authorization": "Bearer " + token,
})
ctx := metadata.NewOutgoingContext(context.Background(), md)

// Server side - extracting metadata
md, ok := metadata.FromIncomingContext(ctx)
if ok {
    tokens := md.Get("authorization")
    // Process token
}
```

---

## Security Considerations

### 1. Database Security
- Use strong passwords
- Enable SSL/TLS connections
- Restrict network access (firewall)
- Regular security updates
- Encrypted backups

### 2. API Security
- Rate limiting (prevent DDoS) - use gRPC interceptors
- Input validation and sanitization - Protocol Buffers provide type safety
- SQL injection prevention (use ORM/prepared statements)
- CORS configuration (for gRPC Gateway REST endpoints)
- HTTPS/TLS for gRPC connections
- gRPC authentication interceptors

### 3. Code Execution Security
- Docker-based sandboxing
- Resource limits (CPU, memory, time)
- Network isolation
- File system restrictions
- Timeout mechanisms

### 4. Authentication Security
- Strong password requirements
- Bcrypt hashing (cost factor 12+)
- JWT token expiration
- Refresh token rotation
- Rate limiting on login endpoints

---

## Deployment Strategy

### Development Environment

```bash
# Local development
- Docker Compose for local services
- Local PostgreSQL instance
- Hot reload for development
```

### Production Environment

```
┌─────────────────────────────────────┐
│         Production Server           │
│  (VPS / Cloud Instance)             │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Golang   │  │ Rust     │        │
│  │ Services │  │ Services │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────────────────────┐      │
│  │   Nginx / Traefik        │      │
│  │   (Reverse Proxy)        │      │
│  └──────────────────────────┘      │
└─────────────────────────────────────┘
              │
              │ VPN / Secure Tunnel
              │
┌─────────────▼──────────────────────┐
│      Raspberry Pi 5                 │
│      (Home Network)                 │
│                                     │
│  ┌──────────────────────────┐      │
│  │   PostgreSQL Database    │      │
│  └──────────────────────────┘      │
└─────────────────────────────────────┘
```

### Deployment Options

1. **Docker Containers**
   - Each service in separate container
   - Docker Compose for orchestration
   - Easy scaling and updates

2. **Kubernetes** (if scaling needed)
   - Container orchestration
   - Auto-scaling
   - Service discovery

3. **Systemd Services** (Simple deployment)
   - Direct binary execution
   - Systemd for process management
   - Simpler for small deployments

### Network Configuration

- **VPN**: WireGuard or Tailscale for secure connection
- **Port Forwarding**: Only expose necessary ports
- **Firewall**: UFW or iptables rules
- **SSL/TLS**: Let's Encrypt certificates for gRPC Gateway
- **gRPC TLS**: Mutual TLS (mTLS) for service-to-service communication
- **Service Mesh**: Consider Istio or Linkerd for advanced traffic management

---

## Development Setup

### Prerequisites

```bash
# Golang
go version  # 1.21+

# Rust
rustc --version  # 1.70+

# Docker
docker --version

# PostgreSQL client
psql --version
```

### Local Development

```bash
# Clone repository
git clone https://github.com/learnlab/learnlab-backend.git
cd learnlab-backend

# Generate Protocol Buffer code
make generate

# Setup environment
cp .env.example .env
# Edit .env with local database URL

# Run migrations
cd services/auth-service
go run cmd/migrate/main.go

# Start gRPC services (in separate terminals)
cd services/auth-service && go run cmd/server/main.go
cd services/course-service && go run cmd/server/main.go
cd services/ai-service && go run cmd/server/main.go
cd services/executor-service && go run cmd/server/main.go

# Start gRPC Gateway
cd gateway && go run cmd/server/main.go
```

### Makefile Example

```makefile
.PHONY: generate
generate:
	@echo "Generating Protocol Buffer code..."
	protoc --go_out=. --go_opt=paths=source_relative \
	       --go-grpc_out=. --go-grpc_opt=paths=source_relative \
	       --grpc-gateway_out=. --grpc-gateway_opt=paths=source_relative \
	       proto/**/*.proto

.PHONY: build
build:
	@echo "Building services..."
	go build -o bin/auth-service ./services/auth-service/cmd/server
	go build -o bin/course-service ./services/course-service/cmd/server
	go build -o bin/ai-service ./services/ai-service/cmd/server
	go build -o bin/executor-service ./services/executor-service/cmd/server
	go build -o bin/gateway ./gateway/cmd/server

.PHONY: test
test:
	go test ./...
```

### Docker Compose (Local)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: learnlab
      POSTGRES_USER: learnlab_user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  auth-service:
    build: ./services/auth-service
    ports:
      - "50051:50051"  # gRPC
      - "8001:8001"    # HTTP (if needed)
    environment:
      DATABASE_URL: postgres://learnlab_user:password@postgres:5432/learnlab
      REDIS_URL: redis://redis:6379
      GRPC_PORT: 50051
    depends_on:
      - postgres
      - redis

  course-service:
    build: ./services/course-service
    ports:
      - "50052:50052"  # gRPC
    environment:
      DATABASE_URL: postgres://learnlab_user:password@postgres:5432/learnlab
      GRPC_PORT: 50052
    depends_on:
      - postgres

  ai-service:
    build: ./services/ai-service
    ports:
      - "50053:50053"  # gRPC
    environment:
      DATABASE_URL: postgres://learnlab_user:password@postgres:5432/learnlab
      GRPC_PORT: 50053
    depends_on:
      - postgres

  executor-service:
    build: ./services/executor-service
    ports:
      - "50054:50054"  # gRPC
    environment:
      DATABASE_URL: postgres://learnlab_user:password@postgres:5432/learnlab
      GRPC_PORT: 50054
    depends_on:
      - postgres
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock  # For Docker-based code execution

  gateway:
    build: ./gateway
    ports:
      - "8080:8080"    # REST API
    environment:
      AUTH_SERVICE_URL: auth-service:50051
      COURSE_SERVICE_URL: course-service:50052
      AI_SERVICE_URL: ai-service:50053
      EXECUTOR_SERVICE_URL: executor-service:50054
    depends_on:
      - auth-service
      - course-service
      - ai-service
      - executor-service

volumes:
  postgres_data:
```

---

## Monitoring & Logging

### Logging Strategy

- **Structured Logging**: JSON format
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Centralized Logging**: ELK Stack or Loki
- **Log Rotation**: Prevent disk space issues

### Monitoring

- **Health Checks**: gRPC health checking protocol for each service
- **Metrics**: Prometheus for gRPC metrics collection
- **Dashboards**: Grafana for visualization
- **Alerts**: AlertManager for critical issues
- **Tracing**: OpenTelemetry for distributed tracing

### gRPC Health Checking

```go
import "google.golang.org/grpc/health"
import "google.golang.org/grpc/health/grpc_health_v1"

// Register health service
healthServer := health.NewServer()
grpc_health_v1.RegisterHealthServer(grpcServer, healthServer)
healthServer.SetServingStatus("auth.v1", grpc_health_v1.HealthCheckResponse_SERVING)
```

### Key Metrics

- gRPC request rate and latency
- Error rates (gRPC status codes)
- Database connection pool usage
- Code execution success/failure rates
- Resource usage (CPU, memory)
- gRPC streaming performance
- Inter-service call latency

---

## Next Steps

1. **Setup Raspberry Pi 5**
   - Install OS and PostgreSQL
   - Configure network and security
   - Setup backups

2. **Develop Services**
   - Define Protocol Buffer schemas (.proto files)
   - Generate Go code from protobuf definitions
   - Start with Auth Service (Golang gRPC)
   - Implement Course Service (Golang gRPC)
   - Build AI Service (Golang gRPC)
   - Create Code Executor (Golang gRPC)
   - Setup gRPC Gateway for REST API

3. **Integration**
   - Connect services to database
   - Setup API Gateway
   - Configure authentication

4. **Testing**
   - Unit tests
   - Integration tests
   - Load testing

5. **Deployment**
   - Setup production environment
   - Configure monitoring
   - Deploy services

---

## Resources

- [gRPC Documentation](https://grpc.io/docs/)
- [Protocol Buffers Guide](https://protobuf.dev/)
- [gRPC Gateway](https://github.com/grpc-ecosystem/grpc-gateway)
- [Golang gRPC Tutorial](https://grpc.io/docs/languages/go/)
- [Golang Best Practices](https://go.dev/doc/effective_go)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Raspberry Pi 5 Documentation](https://www.raspberrypi.com/documentation/)

---

**Last Updated**: 2024
**Version**: 1.0

