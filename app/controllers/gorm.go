package controllers

import (
	"fmt"

	"github.com/criticalmaps/criticalmaps-api/app/models"
	"github.com/jinzhu/gorm"
	"github.com/revel/revel"
)

var DB *gorm.DB

func InitDB() {
	db, err := gorm.Open("postgres",

		fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			revel.Config.StringDefault("db.host", "127.0.0.1"),
			revel.Config.StringDefault("db.port", "5432"),
			revel.Config.StringDefault("db.username", "foo"),
			revel.Config.StringDefault("db.password", "bar"),
			revel.Config.StringDefault("db.database", "criticalmaps"),
		))

	if err != nil {
		revel.AppLog.Fatal(err.Error())
	}

	db.DB()

	db.AutoMigrate(&models.Location{})

	DB = db
}
