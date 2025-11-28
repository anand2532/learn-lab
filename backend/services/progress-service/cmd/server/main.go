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

	pb "github.com/learnlab/proto/progress/v1"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	grpcPort := os.Getenv("PROGRESS_SERVICE_GRPC_PORT")
	if grpcPort == "" {
		grpcPort = "50055"
	}

	httpPort := os.Getenv("PROGRESS_SERVICE_HTTP_PORT")
	if httpPort == "" {
		httpPort = "8005"
	}

	grpcServer := grpc.NewServer()
	// TODO: Register ProgressService implementation
	reflection.Register(grpcServer)

	go func() {
		lis, err := net.Listen("tcp", ":"+grpcPort)
		if err != nil {
			log.Fatal("Failed to listen:", err)
		}
		log.Printf("Progress gRPC service starting on port %s", grpcPort)
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatal("Failed to serve:", err)
		}
	}()

	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	if err := pb.RegisterProgressServiceHandlerFromEndpoint(ctx, mux, "localhost:"+grpcPort, opts); err != nil {
		log.Fatal("Failed to register gateway:", err)
	}

	log.Printf("Progress HTTP Gateway starting on port %s", httpPort)
	if err := http.ListenAndServe(":"+httpPort, mux); err != nil {
		log.Fatal("Failed to serve gateway:", err)
	}
}

