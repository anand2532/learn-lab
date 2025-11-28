package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/reflection"

	pb "github.com/learnlab/proto/course/v1"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	grpcPort := os.Getenv("COURSE_SERVICE_GRPC_PORT")
	if grpcPort == "" {
		grpcPort = "50052"
	}

	httpPort := os.Getenv("COURSE_SERVICE_HTTP_PORT")
	if httpPort == "" {
		httpPort = "8002"
	}

	grpcServer := grpc.NewServer()
	// TODO: Register CourseService implementation
	reflection.Register(grpcServer)

	go func() {
		lis, err := net.Listen("tcp", ":"+grpcPort)
		if err != nil {
			log.Fatal("Failed to listen:", err)
		}
		log.Printf("Course gRPC service starting on port %s", grpcPort)
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatal("Failed to serve:", err)
		}
	}()

	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	if err := pb.RegisterCourseServiceHandlerFromEndpoint(ctx, mux, "localhost:"+grpcPort, opts); err != nil {
		log.Fatal("Failed to register gateway:", err)
	}

	log.Printf("Course HTTP Gateway starting on port %s", httpPort)
	if err := http.ListenAndServe(":"+httpPort, mux); err != nil {
		log.Fatal("Failed to serve gateway:", err)
	}
}

