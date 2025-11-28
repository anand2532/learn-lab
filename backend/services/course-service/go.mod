module github.com/learnlab/course-service

go 1.21

require (
	github.com/google/uuid v1.5.0
	github.com/grpc-ecosystem/grpc-gateway/v2 v2.18.1
	github.com/joho/godotenv v1.5.1
	google.golang.org/grpc v1.60.1
	google.golang.org/protobuf v1.31.0
	gorm.io/driver/postgres v1.5.4
	gorm.io/gorm v1.25.5
)

replace github.com/learnlab/proto => ../../proto

