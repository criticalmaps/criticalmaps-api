var express = require('express');
var router = express.Router();
var debug = require('debug')('http');
var QueryFile = require('pg-promise').QueryFile;

var QUERY_FILE_SAVE_LOCATIONS  = QueryFile('sql/save_locations.sql')
var QUERY_FILE_RETRIEVE_LOCATIONS  =QueryFile('sql/retrieve_locations.sql')
var QUERY_FILE_SAVE_MESSAGES  =QueryFile('sql/save_messages.sql')

var mainExchange = function(req, res, next) {
  console.log(req.body); // your JSON

  postgres_db.tx(function(t1) {
      return t1.batch([
        save_messages_batch(req, t1),
        save_own_location_task(req, t1)
      ]);
    }).then(function(data_dont_care) {
      postgres_db.tx(function(t1) {
        return t1.batch([
          retrieve_other_locations(req, t1),
          retrieve_chat_messages(req, t1)
        ])
      }).then(function(data) {
        var response_obj = {
          locations: {},
          chatMessages: {}
        };
        data[0].forEach(function(location_obj) {
          response_obj.locations[location_obj.device] = {
            "longitude": location_obj.longitude,
            "latitude": location_obj.latitude,
            "timestamp": location_obj.updated
          }
        });

        data[1].forEach(function(message_obj) {
          response_obj.chatMessages[message_obj.identifier] = {
            "message": message_obj.message,
            "timestamp": message_obj.created
          }
        });
        res.json(response_obj);
      }).catch(function(error) {
        handle_error(error,res)
      });
    })
    .catch(function(error) {
      handle_error(error,res)
    });
}

router.post('/', mainExchange);
router.post('/postv2', mainExchange);

var save_own_location_task = function(req, t) {
  if (req.body.hasOwnProperty("device") && req.body.hasOwnProperty("location")) {
    return t.none(QUERY_FILE_SAVE_LOCATIONS,
      [req.body.device, req.body.location.longitude, req.body.location.latitude]);
  } else {
    return null;
  }
}

var retrieve_other_locations = function(req, t) {
  var device = req.body.device || "undefined";
  return t.any(QUERY_FILE_RETRIEVE_LOCATIONS, [device]);
}

var save_messages_batch = function(req, t) {
  if (!req.body.hasOwnProperty("messages")) {
    return null;
  }

  req.body.messages.sort(function(a, b) {
    return a.timestamp - b.timestamp;
  });

  var save_messages_batch = [];
  var delay_counter = 0;
  req.body.messages.forEach(function(message) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress.replace(/^.*:/, '');
    var latitude;
    var longitude;

    if (req.body.hasOwnProperty("location")) {
      latitude = req.body.location.latitude
      longitude = req.body.location.longitude
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
  })
  return save_messages_batch;
}

var retrieve_chat_messages = function(req, t) {
  return t.any("SELECT * FROM chat_messages WHERE created > (NOW() - '$1 minutes'::INTERVAL)", [30]);
}

var handle_error = function(error,res) {
  console.log("ERROR:", error.message || error);
  res.status(500).json({
    error: error.message
  });
}

module.exports = router;
