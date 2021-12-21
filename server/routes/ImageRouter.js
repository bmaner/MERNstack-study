const { Router } = require('express');
const imageRouter = Router();
const Image = require('../models/Image');
const { upload } = require('../middleware/ImageUpload');

imageRouter.post('/', upload.single('image'), async (req, res) => {
    // 유저 정보, public 유무 확인
    try {
        if (!req.user) throw new Error('권한이 없습니다.');
        const image = await new Image({
            user: {
                _id: req.user.id,
                name: req.user.name,
                username: req.user.username,
            },
            public: req.body.public,
            key: req.file.filename,
            originalFileName: req.file.originalname,
        }).save();
        res.json(image);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});
imageRouter.get('/', async (req, res) => {
    // public 이미지만 제공
    const images = await Image.find({ public: true });
    // const images = await Image.find({ public: true });
    // 위 find()안에는 3개의 컬리브라켓({})이 들어갈 수 있다. 첫번째는 탐색, 두번째는 수정할 것, 세번째는 옵션
    res.json(images);
});

imageRouter.delete('/:imageId', (req, res) => {
    // 유저 권한 확인
    // 사진 삭제
});

imageRouter.patch('/:imageId/like', (req, res) => {
    // 유저 권한 확인
    // like 중복 안되도록 확인
});
imageRouter.patch('/:imageId/unlike', (req, res) => {
    // 유저 권한 확인
    // like 중복 취소 안되도록 확인
});

module.exports = { imageRouter };
