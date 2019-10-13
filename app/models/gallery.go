package models

type Gallery struct {
	ID        uint `gorm:"primary_key"`
	Ip        string
	Latitude  int
	Longitude int
	Thumbnail []byte
	Image     []byte
}

func (Gallery) TableName() string {
	return "gallery"
}
