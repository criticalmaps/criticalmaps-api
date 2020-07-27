package controllers

import (
	"errors"
	"fmt"
	"time"

	"regexp"

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

func (c Locations) Post() revel.Result {
	receivedLocation := models.Location{}
	c.Params.BindJSON(&receivedLocation)

	if receivedLocation.Device == "" || receivedLocation.Latitude == "" || receivedLocation.Longitude == "" {
		return c.RenderError(fmt.Errorf("required parameters were left empty"))
	}

	if !c.isValidCoordinateFormat(receivedLocation.Latitude, receivedLocation.Longitude) {
		return c.RenderError(fmt.Errorf("coordinates are not valid: %q, %q", receivedLocation.Longitude, receivedLocation.Latitude))
	}

	receivedLocation.Updated = time.Now()

	//TODO fix bug: wrong time is used here

	// fmt.Printf("%#+v\n", receivedLocation)

	// savedLocation := models.Location{}

	DB.Where(models.Location{Device: receivedLocation.Device}).Attrs(receivedLocation).FirstOrInit(&receivedLocation)
	DB.Save(&receivedLocation)

	return c.RenderJSON(receivedLocation)
}

func (c Locations) isValidCoordinateFormat(latitude string, longitude string) bool {
	regex := "^[-+]?[0-9]+$"

	matched, err := regexp.Match(regex, []byte(latitude))
	if !matched || err != nil {
		return false
	}
	matched, err = regexp.Match(regex, []byte(longitude))
	if !matched || err != nil {
		return false
	}
	return true
}
