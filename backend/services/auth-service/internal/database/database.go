package database

import (
	"github.com/learnlab/auth-service/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return db, nil
}

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
	)
}

