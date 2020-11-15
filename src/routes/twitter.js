var express = require('express');
var router = express.Router();

var Twitter = require('twitter');

var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var twitterHandler = function(req, res, next) {
  console.log("foo")

  twitterClient.get('search/tweets', {
    q: 'criticalmaps',
    count: 100
  }, function(error, tweets, response) {
    if (!error) {
      res.json(tweets);
    } else {
      res.send(error);
    }
  });
}

router.get('/', twitterHandler);
router.get('/get.php', twitterHandler);

module.exports = router;
