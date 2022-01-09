const { Router } = require('express');
const userRouter = Router();
const User = require('../models/User');
const { hash, compare } = require('bcryptjs');
const mongoose = require('mongoose');
const Image = require('../models/Image');

userRouter.post('/register', async (req, res) => {
    console.log('여기까지 왔나', req.body);
    try {
        if (req.body.password.length < 8) {
            console.log('여긴 아니제?');
            throw new Error('비밀번를 최소 8자 이상으로 해주세요.');
        }
        const hashedPassword = await hash(req.body.password, 10);
        console.log(hashedPassword);
        console.log('해시드 비밀번호까지 왓니');
        const user = await new User({
            name: req.body.name,
            username: req.body.username,
            hashedPassword: hashedPassword,
            sessions: [{ createdAt: new Date() }],
        }).save();
        const session = user.sessions[0];
        console.log('session._id', session._id);
        res.json({
            message: 'user registered',
            sessionsId: session._id,
            name: user.name,
            userId: user.username,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
        });
        const isValid = await compare(req.body.password, user.hashedPassword);
        if (!isValid) throw new Error('입력하신 정보가 올바르지 않습니다.');
        user.sessions.push({ createdAt: new Date() });
        const session = user.sessions[user.sessions.length - 1];
        await user.save();
        res.json({
            message: 'user validated',
            sessionsId: session._id,
            name: user.name,
            userId: user.username,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userRouter.post('/logout', async (req, res) => {
    try {
        console.log(req.user);
        if (!req.user) throw new Error('invalid sessionid');
        await User.updateOne(
            { _id: req.user.id },
            { $pull: { sessions: { _id: req.headers.sessionid } } }
        );
        res.json({ message: 'user is logged out' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

userRouter.get('/me', (req, res) => {
    try {
        console.log(req);
        if (!req.user) throw new Error('권한이 없습니다.');
        res.json({
            message: 'success',
            sessionsId: req.headers.sessionid,
            name: req.user.name,
            userId: req.user.username,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

userRouter.get('/me/images', async (req, res) => {
    //본인의 사진들만 리턴(public === false)
    try {
        const { lastId } = req.query;
        if (lastId && !mongoose.isValidObjectId(lastId))
            throw new Error('invalid lastid');
        if (!req.user) throw new Error('권한이 없습니다.');
        const images = await Image.find(
            lastId
                ? { 'user._id': req.user.id, _id: { $lt: lastId } }
                : { 'user._id': req.user.id }
        )
            .sort({
                _id: -1,
            })
            .limit(30);
        res.json(images);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = { userRouter };
