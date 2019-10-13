package controllers

import (
	"errors"

	"github.com/criticalmaps/criticalmaps-api/app/models"
	"github.com/revel/revel"
)

type Locations struct {
	App
}

func (c Locations) List() revel.Result {
	location := []models.Location{}

	result := DB.Find(&location)
	if result.Error != nil {
		return c.RenderError(errors.New("Record Not Found"))
	}

	return c.RenderJSON(location)
}

type MyData struct {
	Device    string
	Longitude string
	Latitude  string
}

func (c Locations) Post() revel.Result {
	data := MyData{}
	c.Params.BindJSON(&data)

	return c.RenderJSON(data)

	location := []models.Location{}

	result := DB.Find(&location)
	if result.Error != nil {
		return c.RenderError(errors.New("Record Not Found"))
	}

	return c.RenderJSON(location)
}
