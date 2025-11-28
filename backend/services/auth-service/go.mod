module github.com/learnlab/auth-service

go 1.21

require (
	github.com/golang-jwt/jwt/v5 v5.2.0
	github.com/google/uuid v1.5.0
	github.com/grpc-ecosystem/grpc-gateway/v2 v2.18.1
	github.com/joho/godotenv v1.5.1
	golang.org/x/crypto v0.17.0
	google.golang.org/grpc v1.60.1
	google.golang.org/protobuf v1.31.0
	gorm.io/driver/postgres v1.5.4
	gorm.io/gorm v1.25.5
)

replace github.com/learnlab/proto => ../../proto

