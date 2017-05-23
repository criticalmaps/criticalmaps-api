var express = require('express');
var pgp = require('pg-promise')();
var bodyParser     = require('body-parser');

var app = express();

// connect to databases
postgres_db = pgp({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

app.set('port', 80);

app.use(bodyParser.json()); // Parses req.body json from html POST
app.use(bodyParser.urlencoded({
  extended: true
})); // Parses urlencoded req.body, including extended syntax

// app.configure('development', function() {
//   app.use(express.logger('dev'));
//   app.use(express.errorHandler({
//     dumpExceptions: true,
//     showStack: true
//   }));
// });

app.use('/postv2',   require('./routes/index'));
app.use('/exchange', require('./routes/index'));
app.use('/',         require('./routes/index'));

app.use('/twitter',         require('./routes/twitter'));
app.use('/twitter/get.php', require('./routes/twitter'));

app.use('/debug', require('./routes/debug'));


if (!module.parent) {
  app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
  })
}

module.exports = app;
