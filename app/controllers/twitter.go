package controllers

import (
	"encoding/json"
	"io/ioutil"

	"github.com/mrjones/oauth"
	"github.com/revel/revel"
)

type Twitter struct {
	App
}

var CONSUMER *oauth.Consumer

func InitTwitterConsumer() {
	CONSUMER = oauth.NewConsumer(
		revel.Config.StringDefault("twitter.consumer_key", ""),
		revel.Config.StringDefault("twitter.consumer_secret", ""),
		oauth.ServiceProvider{
			AuthorizeTokenUrl: "https://api.twitter.com/oauth/authorize",
			RequestTokenUrl:   "https://api.twitter.com/oauth/request_token",
			AccessTokenUrl:    "https://api.twitter.com/oauth/access_token",
		},
	)
}

func (t Twitter) List() revel.Result {
	resp, err := CONSUMER.Get(
		"https://api.twitter.com/1.1/search/tweets.json",
		map[string]string{"q": "criticalmaps", "count": "100"},
		&oauth.AccessToken{
			Token:  revel.Config.StringDefault("twitter.access_token_key", ""),
			Secret: revel.Config.StringDefault("twitter.access_token_secret", ""),
		})
	if err != nil {
		return t.RenderError(err)
	}

	defer resp.Body.Close()

	respBody, err := ioutil.ReadAll(resp.Body)

	marshalledJSON := map[string]interface{}{}
	err = json.Unmarshal([]byte(respBody), &marshalledJSON)
	if err != nil {
		panic(err)
	}

	return t.RenderJSON(marshalledJSON)
}
