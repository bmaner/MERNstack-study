const { Router } = require('express');
const imageRouter = Router();
const Image = require('../models/Image');
const { upload } = require('../middleware/ImageUpload');
const fs = require('fs');
const { promisify } = require('util');
const mongoose = require('mongoose');

const fileUnlink = promisify(fs.unlink);

imageRouter.post('/', upload.array('image', 30), async (req, res) => {
    // 유저 정보, public 유무 확인
    try {
        if (!req.user) throw new Error('권한이 없습니다.');
        const images = await Promise.all(
            req.files.map(async file => {
                const image = await new Image({
                    user: {
                        _id: req.user.id,
                        name: req.user.name,
                        username: req.user.username,
                    },
                    public: req.body.public,
                    key: file.filename,
                    originalFileName: file.originalname,
                }).save();
                return image;
            })
        );

        res.json(images);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});
imageRouter.get('/', async (req, res) => {
    try {
        const { lastId } = req.query;
        if (lastId && !mongoose.isValidObjectId(lastId))
            throw new Error('invalid lastid');
        // public 이미지만 제공
        const images = await Image.find(
            lastId
                ? {
                      public: true,
                      _id: { $lt: lastId },
                  }
                : { public: true }
        )
            .sort({ _id: -1 })
            .limit(10);
        // const images = await Image.find({ public: true });
        // 위 find()안에는 3개의 컬리브라켓({})이 들어갈 수 있다. 첫번째는 탐색, 두번째는 수정할 것, 세번째는 옵션
        res.json(images);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

imageRouter.get('/:imageId', async (req, res) => {
    try {
        const { imageId } = req.params;
        if (!mongoose.isValidObjectId(imageId))
            throw new Error('올바르지 않는 이미지 id 입니다.');
        const image = await Image.findOne({ _id: imageId });
        if (!image) throw new Error('해당 이미지는 존재하지 않습니다.');
        if (!image.public && (!req.user || req.user.id !== image.user.id))
            throw new Error('권한이 없습니다.'); // private 이미지인데 로그인이 되어있지
        res.json(image);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

imageRouter.delete('/:imageId', async (req, res) => {
    // 유저 권한 확인
    // 사진 삭제
    // 1. uploads 폴더에 있는 사진 데이터를 삭제
    // 2. 데이터베이스에 있는 image 문서를 삭제
    try {
        console.log(req.params);
        if (!req.user) throw new Error('권한이 없습니다.');
        else if (!mongoose.isValidObjectId(req.params.imageId))
            throw new Error('올바르지 않은 이미지 id입니다.');
        // fs.unlink('./test.jpeg', err => {});
        const image = await Image.findOneAndDelete({ _id: req.params.imageId });
        if (!image)
            return res.json({
                message: '요청하신 사진은 이미 삭제되었습니다.',
            });
        await fileUnlink(`./uploads/${image.key}`); //package.json을 기준으로 위치를 작성해 주어야 함.
        res.json({ message: '요청하신 이미지가 삭제되었습니다.', image });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

imageRouter.patch('/:imageId/like', async (req, res) => {
    // 유저 권한 확인
    // like 중복 안되도록 확인
    try {
        if (!req.user) throw new Error('권한이 없습니다.');
        else if (!mongoose.isValidObjectId(req.params.imageId))
            throw new Error('올바르지 않은 이미지 id입니다.');
        const image = await Image.findOneAndUpdate(
            { _id: req.params.imageId },
            // { $push: { likes: user.id } }, push의 경우 누르면 같은 아이디이더라도 계속 넣어버림
            { $addToSet: { likes: req.user.id } }, // push하려는 값이 배열에 존재하지 않는 경우에만 추가를 해주어야함
            { new: true }
        );
        res.json(image);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});
imageRouter.patch('/:imageId/unlike', async (req, res) => {
    // 유저 권한 확인
    // like 중복 취소 안되도록 확인
    try {
        if (!req.user) throw new Error('권한이 없습니다.');
        else if (!mongoose.isValidObjectId(req.params.imageId))
            throw new Error('올바르지 않은 이미지 id입니다.');
        const image = await Image.findOneAndUpdate(
            { _id: req.params.imageId },
            { $pull: { likes: req.user.id } }, //push의 경우 누르면 같은 아이디이더라도 계속 넣어버림
            { new: true }
        );
        res.json(image);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = { imageRouter };
