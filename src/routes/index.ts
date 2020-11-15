import express, { RequestHandler } from 'express';
import moment from 'moment';
import { QueryFile } from 'pg-promise';
import { postgres_db } from '../app'

export const router = express.Router();

const QUERY_FILE_SAVE_LOCATIONS = new QueryFile('sql/save_locations.sql')
const QUERY_FILE_RETRIEVE_LOCATIONS = new QueryFile('sql/retrieve_locations.sql')
const QUERY_FILE_SAVE_MESSAGES = new QueryFile('sql/save_messages.sql')

const mainExchange: RequestHandler = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  postgres_db.tx((t1) => t1.batch([
    save_messages_batch(req, t1),
    save_own_location_task(req, t1)
  ])).then(() => {
    postgres_db.tx((t1) => t1.batch([
      retrieve_other_locations(req, t1),
      retrieve_chat_messages(req, t1)
    ])).then((data) => {
      const response_obj = {
        locations: {},
        chatMessages: {}
      };
      data[0].forEach((location_obj) => {
        response_obj.locations[location_obj.device] = {
          "longitude": location_obj.longitude,
          "latitude": location_obj.latitude,
          "timestamp": Math.floor(moment(location_obj.updated).valueOf() / 1000),
          "name": location_obj.name,
          "color": location_obj.color
        };
      });

      data[1].forEach((message_obj) => {
        response_obj.chatMessages[message_obj.identifier] = {
          "message": message_obj.message,
          "timestamp": Math.floor(moment(message_obj.created).valueOf() / 1000)
        };
      });
      res.json(response_obj);
    }).catch((error) => {
      handle_error(error, res);
    });
  })
    .catch((error) => {
      handle_error(error, res);
    });
}

router.post('/', mainExchange);
router.get('/', mainExchange);
router.post('/postv2', mainExchange);

const save_own_location_task = (req, t) => {
  if (req.body.device && req.body.location) {
    const longitude = req.body.location.longitude;
    const latitude = req.body.location.latitude;
    const device = req.body.device;
    const name = req.body.name;
    const color = req.body.color;
    return t.none(QUERY_FILE_SAVE_LOCATIONS, [device, longitude, latitude, name, color]);
  } else {
    return null;
  }
}

const retrieve_other_locations = (req, t) => {
  const device = req.body.device || "undefined";
  return t.any(QUERY_FILE_RETRIEVE_LOCATIONS, [device]);
}

const save_messages_batch = (req, t) => {
  if (!req.body.messages) {
    return null;
  }

  req.body.messages.sort((a, b) => a.timestamp - b.timestamp);

  const save_messages_batch = [];
  let delay_counter = 0;
  req.body.messages.forEach((message) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress.replace(/^.*:/, '');
    let latitude;
    let longitude;

    if (req.body.location) {
      latitude = req.body.location.latitude;
      longitude = req.body.location.longitude;
    }

    save_messages_batch.push(
      t.none(QUERY_FILE_SAVE_MESSAGES, [
        message.text,
        delay_counter,
        ip,
        message.identifier,
        longitude,
        latitude
      ])
    );
    delay_counter++;
  });
  return save_messages_batch;
}

const retrieve_chat_messages = (_req, t) => t.any("SELECT * FROM chat_messages WHERE created > (NOW() - '$1 minutes'::INTERVAL)", [30])

const handle_error = (error, res) => {
  console.log("ERROR:", error.message || error);
  res.status(500).json({
    error: error.message
  });
}
