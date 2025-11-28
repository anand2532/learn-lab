package service

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/learnlab/auth-service/internal/models"
	"github.com/learnlab/auth-service/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo  *repository.UserRepository
	jwtSecret string
	jwtExpiry time.Duration
}

func NewAuthService(userRepo *repository.UserRepository, jwtSecret string, jwtExpiry time.Duration) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
		jwtExpiry: jwtExpiry,
	}
}

func (s *AuthService) Register(email, password, name string) (*models.User, error) {
	if _, err := s.userRepo.FindByEmail(email); err == nil {
		return nil, errors.New("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        email,
		PasswordHash: string(hashedPassword),
		Name:         name,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(email, password string) (*TokenPair, *models.User, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	tokenPair, err := s.generateTokenPair(user.ID)
	if err != nil {
		return nil, nil, err
	}

	return tokenPair, user, nil
}

func (s *AuthService) ValidateToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return "", errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", errors.New("invalid token claims")
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return "", errors.New("invalid user ID in token")
	}

	return userID, nil
}

func (s *AuthService) GenerateTokenPair(userID string) (*TokenPair, error) {
	return s.generateTokenPair(userID)
}

func (s *AuthService) GetUser(userID string) (*models.User, error) {
	return s.userRepo.FindByID(userID)
}

func (s *AuthService) generateTokenPair(userID string) (*TokenPair, error) {
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(s.jwtExpiry).Unix(),
		"iat":     time.Now().Unix(),
	})

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	})

	accessTokenString, err := accessToken.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return nil, err
	}

	refreshTokenString, err := refreshToken.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return nil, err
	}

	return &TokenPair{
		AccessToken:  accessTokenString,
		RefreshToken: refreshTokenString,
		ExpiresIn:    int64(s.jwtExpiry.Seconds()),
	}, nil
}

type TokenPair struct {
	AccessToken  string
	RefreshToken string
	ExpiresIn    int64
}

