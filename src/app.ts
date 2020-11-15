import express from 'express';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
const pgp = pgPromise();

const app = express();

// connect to databases
const postgres_db = pgp({
  connectionString: process.env.DATABASE_URL
});

app.set('port', 3001);

app.use(bodyParser.json({
  limit: '5mb'
})); // Parses req.body json from html POST
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true
})); // Parses urlencoded req.body, including extended syntax

// app.configure('development', function() {
//   app.use(express.logger('dev'));
//   app.use(express.errorHandler({
//     dumpExceptions: true,
//     showStack: true
//   }));
// });

import { router as index } from './routes/index';
app.use('/postv2', index);
app.use('/exchange', index);
app.use('/', index);

import { router as twitter } from './routes/twitter';
app.use('/twitter', twitter);
app.use('/twitter/get.php', twitter);

import { router as gallery } from './routes/gallery';
app.use('/gallery', gallery);

import { router as debug } from './routes/debug';
app.use('/debug', debug);


if (!module.parent) {
  app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
  })
}

module.exports = app;

export {postgres_db}