var express = require('express');
var router = express.Router();
var debug = require('debug')('http');
var QueryFile = require('pg-promise').QueryFile;

var multer = require('multer');
var upload = multer({
  dest: '/tmp/'
})
var sizeOf = require('image-size');
var gm = require('gm');
var fs = require('fs');

var maxWidth = 100;

var saveImage = function(req, res, next) {
  var pathImage = req.file.path;
  var pathThumbnail = req.file.path + "_thumb";

  var dimensions = sizeOf(pathImage);

  var oldWidth = dimensions.width
  var oldHeight = dimensions.height

  var newWidth = maxWidth;
  var newHeight = Math.floor(oldHeight * (maxWidth / oldWidth));

  gm(req.file.path)
    .resize(newWidth, newHeight)
    .noProfile()
    .write(pathThumbnail, function(err) {
      if (err) {
        return res.send("error " + err);
      }
      fs.readFile(pathImage, function(err, dataImage) {
        fs.readFile(pathThumbnail, function(err, dataThumbnail) {
          postgres_db.none('INSERT INTO gallery(image, thumbnail, review_state, ip, longitude, latitude) \
            VALUES($1, $2, $3, $4)',
            [dataImage, dataThumbnail, 'pending',
            req.connection.remoteAddress.replace(/^.*:/, ''),
      console.log(req.body);
          ])
            .then(function() {
              res.send("success")
              // use http 200
            })
            .catch(function(error) {
              res.send("error: " + error)
              console.log( error)

              // use http code
            });
        });
      });
    });
}

router.post('/', upload.single('uploaded_file'), saveImage);
router.post('/post.php', upload.single('uploaded_file'), saveImage);

router.get('/', function(req, res, next) {
  postgres_db.any("SELECT id, longitude, latitude FROM gallery")
    .then(function(data) {
      console.log(data);
      res.send(data)
    })
});

router.get('/thumbnail/:id', function(req, res, next) {
  postgres_db.one("SELECT thumbnail FROM gallery WHERE id=$1", [req.params.id])
    .then(function(data) {
      console.log(data);
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.write(data.thumbnail);
      res.end();
    })
});

router.get('/image/:id', function(req, res, next) {
  postgres_db.one("SELECT image FROM gallery WHERE id=$1", [req.params.id])
    .then(function(data) {
      console.log(data);
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.write(data.image);
      res.end();
    });
});


module.exports = router;
