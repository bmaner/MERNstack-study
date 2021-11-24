const express = require('express');
const multer = require('multer');
const { v4: uuid } = require('uuid');
// console.log('uuid', uuid()); // uuid 35c68427-f597-42ae-b932-d4e5d3f2267d
const mime = require('mime-types');

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

app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('imageTest'), (req, res) => {
    console.log(req.file);
    res.json(req.file);
});

app.listen(PORT, () => console.log(`Express server listening on PORT ${PORT}`));
