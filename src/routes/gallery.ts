import express, { RequestHandler } from 'express'
import multer from 'multer';
import sizeOf from 'image-size';
import gm from 'gm';
import fs from 'fs';
import { postgres_db } from '../app'

export const router = express.Router();

const upload = multer({
  dest: '/tmp/'
})

const maxWidth = 100;

const saveImage: RequestHandler = (req, res) => {
  const pathImage = req.file.path;
  const pathThumbnail = req.file.path + "_thumb";

  const dimensions = sizeOf(pathImage);

  const oldWidth = dimensions.width
  const oldHeight = dimensions.height

  const newWidth = maxWidth;
  const newHeight = Math.floor(oldHeight * (maxWidth / oldWidth));

  gm(req.file.path)
    .resize(newWidth, newHeight)
    .noProfile()
    .write(pathThumbnail, (err) => {
      if (err) {
        return res.send("error " + err);
      }
      fs.readFile(pathImage, (err, dataImage) => {
        fs.readFile(pathThumbnail, (err, dataThumbnail) => {
          postgres_db.none('INSERT INTO gallery(image, thumbnail, review_state, ip, longitude, latitude) \
            VALUES($1, $2, $3, $4, $5, $6)', [dataImage, dataThumbnail, 'pending',
            req.connection.remoteAddress.replace(/^.*:/, ''),
            JSON.parse(req.body.data).longitude,
            JSON.parse(req.body.data).latitude
          ])
            .then(() => {
              res.send("success")
              // use http 200
            })
            .catch((error) => {
              res.send("error: " + error)
              console.log(error)

              // use http code
            });
        });
      });
    });
}

router.post('/', upload.single('uploaded_file'), saveImage);
router.post('/post.php', upload.single('uploaded_file'), saveImage);

router.get('/', (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  postgres_db.any("SELECT id, longitude, latitude FROM gallery")
    .then((data) => {
      res.send(data)
    })
});

router.get('/thumbnail/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  postgres_db.one("SELECT thumbnail FROM gallery WHERE id=$1", [req.params.id])
    .then((data) => {
      console.log(data);
      res.writeHead(200, {
        'Content-Type': 'image/jpeg'
      });
      res.write(data.thumbnail);
      res.end();
    })
});

router.get('/image/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  postgres_db.one("SELECT image FROM gallery WHERE id=$1", [req.params.id])
    .then((data) => {
      console.log(data);
      res.writeHead(200, {
        'Content-Type': 'image/jpeg'
      });
      res.write(data.image);
      res.end();
    });
});
