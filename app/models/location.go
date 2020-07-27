package models

import "time"

type Location struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	Updated   time.Time `json:"updated"`
	Device    string    `json:"device"`
	Color     string    `json:"color"`
	Longitude string    `json:"longitude"`
	Latitude  string    `json:"latitude"`
}

func (Location) TableName() string {
	return "locations"
}
