require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { v4: uuid } = require('uuid');
// console.log('uuid', uuid()); // uuid 35c68427-f597-42ae-b932-d4e5d3f2267d
const mime = require('mime-types');
const mongoose = require('mongoose');
const Image = require('./models/Image');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) =>
        cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('invalid file type.'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // 파일 크기 제한
});

const app = express();
const PORT = 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('mongoDB connected!');
        app.use('/uploads', express.static('uploads'));

        app.post('/images', upload.single('image'), async (req, res) => {
            const image = await new Image({
                key: req.file.filename,
                originalFileName: req.file.originalname,
            }).save();
            res.json(image);
        });
        app.get('/images', async (req, res) => {
            const images = await Image.find();
            res.json(images);
        });
        app.listen(PORT, () =>
            console.log(`Express server listening on PORT ${PORT}`)
        );
    })
    .catch(err => console.log(err));
