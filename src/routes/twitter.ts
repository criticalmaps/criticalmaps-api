import express, { RequestHandler } from "express";
import Twitter from "twitter-lite";

export const router = express.Router();

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY ?? "",
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET ?? "",
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const twitterHandler: RequestHandler = (_req, res) => {
  console.log("foo");

  twitterClient
    .get("search/tweets", {
      q: "criticalmaps",
      count: 100,
    })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.send(error);
    });
};

router.get("/", twitterHandler);
router.get("/get.php", twitterHandler);
