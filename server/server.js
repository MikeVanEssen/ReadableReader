const EPub = require("./patched_modules/epub");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const FileStore = require('session-file-store');
const fsp = require('fs-promise');
const path = require('path');
const Promise = require('bluebird');
const session = require('express-session');
const URL = require('url');
const _ = require('lodash');
const mongoose = require('mongoose');
const request = require('superagent');

Promise.longStackTraces();

//create express app
const app = express();

// Serve static files
app.use(express.static(path.join(`${__dirname}/images`)));

//import express routers
const bookRouter = require('./routers/bookRouter');
const userRouter = require('./routers/userRouter');

//define server adress
const serverPort = 3000;
const serverLocation = `http://localhost:${serverPort}`;

//apply bodyparser middleware
app.use(bodyParser.json());
//apply session
app.use(cookieParser())
app.use(session({resave: false, saveUninitialized: false, secret: '1234'}));


//make the server accept requests from localhost:8080
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Cookie');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

//apply book router
app.use('/user', userRouter);
app.use('/book', bookRouter);

//run the server
app.listen(serverPort);
console.log(`Server is running on port: ${serverPort}`)
