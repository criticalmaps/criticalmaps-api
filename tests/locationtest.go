package tests

import (
	"bytes"
	"encoding/json"
	"time"

	"github.com/criticalmaps/criticalmaps-api/app/models"

	"github.com/revel/revel/testing"
)

type LocationTest struct {
	testing.TestSuite
}

func (t *LocationTest) Before() {
	println("Set up")
}

func (t *LocationTest) After() {
	println("Tear down")
}

func (t *LocationTest) TestGet() {
	t.Get("/v3/locations")
	t.AssertOk()
	t.AssertContentType("application/json; charset=utf-8")
	t.AssertEqual(isValidJSONArray(string(t.ResponseBody)), true)
}

func (t *LocationTest) TestValidPosts() {
	validPayloads := [...]string{
		// basic request
		`{"device":"726f10f23011c752e6b3f817578282bee914bc20","longitude":"-122084000","latitude":"37421998"}`,
		// with color
		`{"device":"726f10f23011c752e6b3f817578282bee914bc20","longitude":"-122084000","latitude":"37421998", "color": "FF0000"}`,
	}

	for _, payload := range validPayloads {
		t.Post(
			"/v3/locations",
			"application/json",
			bytes.NewReader([]byte(payload)))
		t.AssertOk()
		t.AssertContentType("application/json; charset=utf-8")
	}
}

func (t *LocationTest) TestInvalidPosts() {
	validPayloads := [...]string{
		// invalid JSON
		`meow`,
		// missing device
		`{"longitude":"-122084000","latitude":"37421998"}`,
		// missing location
		`{"device":"726f10f23011c752e6b3f817578282bee914bc20", "latitude":"37421998"}`,
		`{"device":"726f10f23011c752e6b3f817578282bee914bc20", "latitude":"37421998"}`,
		`{"device":"726f10f23011c752e6b3f817578282bee914bc20"}`,
	}

	for _, payload := range validPayloads {
		t.Post(
			"/v3/locations",
			"application/json",
			bytes.NewReader([]byte(payload)))
		t.AssertStatus(500)
	}
}

func (t *LocationTest) TestCorrectTimestamp() {
	postBody := `{"device":"726f10f23011c752e6b3f817578282bee914bc20","longitude":"-122084000","latitude":"37421998"}`
	t.Post(
		"/v3/locations",
		"application/json",
		bytes.NewReader([]byte(postBody)))
	t.Get("/v3/locations")
	err, foundLocation := getLocationByDevice("726f10f23011c752e6b3f817578282bee914bc20", t.ResponseBody)
	t.Assert(err == nil)
	t.AssertOk()

	// Assert that timestamp was updated within the last 5 seconds
	t.Assert(time.Now().UTC().Add(-5*time.Second).Unix() < foundLocation.Updated.UTC().Unix())
}

func (t *LocationTest) TestCorrectLocation() {
	postBody := `{"device":"726f10f23011c752e6b3f817578282bee914bc20","longitude":"1337","latitude":"1337"}`
	t.Post(
		"/v3/locations",
		"application/json",
		bytes.NewReader([]byte(postBody)))
	t.Get("/v3/locations")
	err, foundLocation := getLocationByDevice("726f10f23011c752e6b3f817578282bee914bc20", t.ResponseBody)
	t.Assert(err == nil)
	t.AssertOk()

	// Assert that location will be changed
	t.Assert(foundLocation.Latitude == "1337")
	t.Assert(foundLocation.Longitude == "1337")
}

func isValidJSONArray(s string) bool {
	var js []map[string]interface{}
	return json.Unmarshal([]byte(s), &js) == nil
}

func getLocationByDevice(device string, locationsResponse []byte) (error, models.Location) {
	var locations []models.Location
	err := json.Unmarshal(locationsResponse, &locations)

	var foundLocation models.Location
	for _, location := range locations {
		if location.Device == device {
			foundLocation = location
		}
	}

	return err, foundLocation
}
