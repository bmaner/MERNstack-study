const multer = require('multer');
const { v4: uuid } = require('uuid');
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
    limits: { fileSize: 1024 * 1024 * 50 }, // 파일 크기 제한
});

module.exports = { upload };
