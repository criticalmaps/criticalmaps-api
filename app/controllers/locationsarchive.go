package controllers

import (
	"fmt"
	"time"

	"github.com/Jeffail/gabs"
	"github.com/revel/revel"
)

type LocationsArchive struct {
	App
}

func (c LocationsArchive) List() revel.Result {
	rows, err := DB.Raw(`SELECT device, created, longitude, latitude 
	FROM locations_archive 
	WHERE created BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()`).Rows()

	if err != nil {
		return c.RenderError(err)
	}

	jsonObj := gabs.New()

	defer rows.Close()
	for rows.Next() {
		var device string
		var created time.Time
		var longitude string
		var latitude string

		rows.Scan(&device, &created, &longitude, &latitude)

		fmt.Println(created)

		if !jsonObj.Exists(device) {
			jsonObj.Array(device)
		}

		location := gabs.New()

		location.Set(created.Unix(), "created")
		location.Set(latitude, "latitude")
		location.Set(longitude, "longitude")

		jsonObj.ArrayAppend(location.Data(), device)
	}

	return c.RenderJSON(jsonObj.Data())
}
