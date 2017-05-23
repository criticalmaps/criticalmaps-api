var express = require('express');
var router = express.Router();
var debug = require('debug')('http');
var QueryFile = require('pg-promise').QueryFile;

router.post('/', function(req, res, next) {
  // TODO
});

module.exports = router;


// <?php
//
// header('Access-Control-Allow-Origin: *');
//
// $imagesFromDb = mysqli_query($con, "SELECT * FROM Images WHERE timestamp > (NOW() - INTERVAL 12 MONTH)");
//
// $imagesArray = [];
//
// while ($row = mysqli_fetch_array($imagesFromDb)) {
// 	  $imagesArray[$row['id']] = array(
//                 'longitude' => $row['longitude'],
//                 'latitude' => $row['latitude'],
//                 'timestamp' => strtotime($row['timestamp']),
// 				'imageId' => $row['imageId'] );
// }
//
// echo json_encode($imagesArray);
//
// mysqli_close($con);

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
