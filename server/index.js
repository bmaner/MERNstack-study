require('dotenv').config();
const express = require('express');
// console.log('uuid', uuid()); // uuid 35c68427-f597-42ae-b932-d4e5d3f2267d
const mongoose = require('mongoose');
const { imageRouter } = require('./routes/imageRouter');

const app = express();
const { MONGO_URI, PORT } = process.env;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('mongoDB connected!');
        app.use('/uploads', express.static('uploads'));
        app.use('/images', imageRouter);
        app.listen(PORT, () =>
            console.log(`Express server listening on PORT ${PORT}`)
        );
    })
    .catch(err => console.log(err));
