var express = require('express');
var router = express.Router();
var debug = require('debug')('http');
var QueryFile = require('pg-promise').QueryFile;

var multer = require('multer');
var upload = multer({
  dest: '/tmp/'
})
var uniqid = require('uniqid');
var sizeOf = require('image-size');
var gm = require('gm');
var fs = require('fs');

var maxWidth = 100;

var saveImage = function(req, res, next) {
  var imageId = uniqid();

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
          postgres_db.none('INSERT INTO gallery(id, image, thumbnail, review_state, ip) \
            VALUES($1, $2, $3, $4, $5)',
            [imageId, dataImage, dataThumbnail, 'pending', req.connection.remoteAddress])
            .then(function() {
              res.send("success")
              // use http 200
            })
            .catch(function(error) {
              res.send("error: " + error)
              // use http code
            });
        });
      });
    });
}

router.post('/', upload.single('uploaded_image'), saveImage);
router.post('/post.php', upload.single('uploaded_image'), saveImage);

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

// <?php
//
// //save file
// $imageId = uniqid();
// $filename = "./images/" . $imageId . ".jpg";
// $filename_thumb = "./images/" . $imageId . "_thumb.jpg";
//
// if (!move_uploaded_file($_FILES['uploaded_file']['tmp_name'], $filename)) {
// 	die("fail: moving file");
// }
//
//
// //create thumbnail
// $final_width_of_image = 100;
//
// $image = imagecreatefromjpeg($filename);
//
// $oldWidth = imagesx($image);
// $oldHeight = imagesy($image);
//
// $newWidth = $final_width_of_image;
// $newHeight = floor($oldHeight * ($final_width_of_image / $oldWidth));
//
// $newImage = imagecreatetruecolor($newWidth, $newHeight);
//
// imagecopyresized($newImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $oldWidth, $oldHeight);
//
// imagejpeg($newImage, $filename_thumb);
//
//
// //save to database
// $jsonObject = json_decode($_POST["data"]);
//
// $longitude = filter_var($jsonObject -> longitude, FILTER_SANITIZE_STRING);
// $latitude = filter_var($jsonObject -> latitude, FILTER_SANITIZE_STRING);
//
//
// if (isset($longitude) && isset($latitude) && isset($imageId)) {
// 	$locationObject = $jsonObject -> location;
// 	$query = "INSERT INTO `db539887603`.`Images` (`id`, `timestamp`, `longitude`, `latitude`, `imageId` ) VALUES (NULL, CURRENT_TIMESTAMP,'" . $longitude . "', '" . $latitude . "', '" . $imageId . "' );";
// 	mysqli_query($con, $query);
// }
//
// mysqli_close($con);
//
// echo "success";
