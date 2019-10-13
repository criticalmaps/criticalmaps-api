package models

import "time"

type Location struct {
	ID        uint `gorm:"primary_key"`
	Updated   time.Time
	Device    string
	Color     string
	Longitude int
	Latitude  int
}

func (Location) TableName() string {
	return "locations"
}
