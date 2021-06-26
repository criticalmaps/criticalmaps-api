package controllers

import (
	"errors"

	"github.com/criticalmaps/criticalmaps-api/app/models"
	"github.com/revel/revel"
)

type App struct {
	*revel.Controller
}

func (c App) Index() revel.Result {
	location := []models.Location{}

	result := DB.Find(&location)
	if result.Error != nil {
		return c.RenderError(errors.New("Record Not Found"))
	}

	return c.RenderJSON(location)
}
