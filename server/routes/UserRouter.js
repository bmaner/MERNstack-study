const { Router } = require('express');
const userRouter = Router();
const User = require('../models/User');
const { hash, compare } = require('bcryptjs');

userRouter.post('/register', async (req, res) => {
    try {
        if (req.body.password.length < 8) {
            throw new Error('비밀번를 최소 8자 이상으로 해주세요.');
        }
        const hashedPassword = await hash(req.body.password, 10);
        const user = await new User({
            name: req.body.name,
            username: req.body.username,
            hashedPassword,
        })
            .save()
            .catch(err => console.log(err));
        res.json({ message: 'user registered' });
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
        res.json({ message: 'user validated' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = { userRouter };
