package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	authpb "github.com/learnlab/proto/auth/v1"
	coursepb "github.com/learnlab/proto/course/v1"
	aipb "github.com/learnlab/proto/ai/v1"
	executorpb "github.com/learnlab/proto/executor/v1"
	progresspb "github.com/learnlab/proto/progress/v1"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	gatewayPort := os.Getenv("GATEWAY_PORT")
	if gatewayPort == "" {
		gatewayPort = "8080"
	}

	authServiceURL := os.Getenv("AUTH_SERVICE_URL")
	if authServiceURL == "" {
		authServiceURL = "localhost:50051"
	}

	courseServiceURL := os.Getenv("COURSE_SERVICE_URL")
	if courseServiceURL == "" {
		courseServiceURL = "localhost:50052"
	}

	aiServiceURL := os.Getenv("AI_SERVICE_URL")
	if aiServiceURL == "" {
		aiServiceURL = "localhost:50053"
	}

	executorServiceURL := os.Getenv("EXECUTOR_SERVICE_URL")
	if executorServiceURL == "" {
		executorServiceURL = "localhost:50054"
	}

	progressServiceURL := os.Getenv("PROGRESS_SERVICE_URL")
	if progressServiceURL == "" {
		progressServiceURL = "localhost:50055"
	}

	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	// Register Auth Service
	if err := authpb.RegisterAuthServiceHandlerFromEndpoint(ctx, mux, authServiceURL, opts); err != nil {
		log.Fatal("Failed to register auth service:", err)
	}

	// Register Course Service
	if err := coursepb.RegisterCourseServiceHandlerFromEndpoint(ctx, mux, courseServiceURL, opts); err != nil {
		log.Fatal("Failed to register course service:", err)
	}

	// Register AI Service
	if err := aipb.RegisterAIServiceHandlerFromEndpoint(ctx, mux, aiServiceURL, opts); err != nil {
		log.Fatal("Failed to register ai service:", err)
	}

	// Register Executor Service
	if err := executorpb.RegisterExecutorServiceHandlerFromEndpoint(ctx, mux, executorServiceURL, opts); err != nil {
		log.Fatal("Failed to register executor service:", err)
	}

	// Register Progress Service
	if err := progresspb.RegisterProgressServiceHandlerFromEndpoint(ctx, mux, progressServiceURL, opts); err != nil {
		log.Fatal("Failed to register progress service:", err)
	}

	log.Printf("gRPC Gateway starting on port %s", gatewayPort)
	log.Printf("REST API available at: http://localhost:%s/api/v1/", gatewayPort)
	if err := http.ListenAndServe(":"+gatewayPort, mux); err != nil {
		log.Fatal("Failed to serve gateway:", err)
	}
}

