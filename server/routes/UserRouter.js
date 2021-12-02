const { Router } = require('express');
const userRouter = Router();
const User = require('../models/User');

userRouter.post('/register', async (req, res) => {
    console.log(req.body);
    const user = await new User(req.body).save().catch(err => console.log(err));
    res.json({ message: 'user registered' });
});

module.exports = { userRouter };
