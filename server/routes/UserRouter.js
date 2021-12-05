const { Router } = require('express');
const userRouter = Router();
const User = require('../models/User');
const { hash, compare } = require('bcryptjs');
const mongoose = require('mongoose');

userRouter.post('/register', async (req, res) => {
    try {
        if (req.body.password.length < 8) {
            throw new Error('비밀번를 최소 8자 이상으로 해주세요.');
        }
        const hashedPassword = await hash(req.body.password, 10);
        const user = await new User({
            name: req.body.name,
            username: req.body.username,
            hashedPassword: hashedPassword,
            sessions: [{ createdAt: new Date() }],
        }).save();
        const session = user.sessions[0];
        res.json({
            message: 'user registered',
            sessionsId: session._id,
            name: user.name,
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
            sessionId: session._id,
            name: user.name,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userRouter.post('/logout', async (req, res) => {
    try {
        const { sessionid } = req.headers;
        if (!mongoose.isValidObjectId(sessionid))
            throw new Error('invalid sessionid');
        const user = await User.findOne({ 'sessio._id': sessionid });
        console.log(user);
        if (!user) throw new Error('invalid sessionid');
        await User.updateOne(
            { _id: user.id },
            { $pull: { sessions: { _id: sessionid } } }
        );
        res.json({ message: 'user is logged out' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = { userRouter };
