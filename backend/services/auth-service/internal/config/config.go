package config

import (
	"os"
	"time"
)

type Config struct {
	DatabaseURL string
	JWTSecret   string
	JWTExpiry   time.Duration
	GRPCPort    string
	HTTPPort    string
}

func Load() *Config {
	jwtExpiry := 24 * time.Hour
	if exp := os.Getenv("JWT_EXPIRY"); exp != "" {
		if d, err := time.ParseDuration(exp); err == nil {
			jwtExpiry = d
		}
	}

	return &Config{
		DatabaseURL: getEnv("DATABASE_URL", "postgres://learnlab_user:password@localhost:5432/learnlab?sslmode=disable"),
		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
		JWTExpiry:   jwtExpiry,
		GRPCPort:    getEnv("AUTH_SERVICE_GRPC_PORT", "50051"),
		HTTPPort:    getEnv("AUTH_SERVICE_HTTP_PORT", "8001"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

