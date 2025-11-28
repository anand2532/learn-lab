module github.com/learnlab/ai-service

go 1.21

require (
	github.com/grpc-ecosystem/grpc-gateway/v2 v2.18.1
	github.com/joho/godotenv v1.5.1
	google.golang.org/grpc v1.60.1
	google.golang.org/protobuf v1.31.0
)

replace github.com/learnlab/proto => ../../proto

