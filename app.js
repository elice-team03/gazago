require('dotenv').config();
require('./src/server/passport')();
const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');
const passport = require('passport');
const getUserFromJwt = require('./src/server/middlewares/get-user-from-jwt');
const connectToMongoDB = require('./db-connect');
const viewsRotuer = require('./src/client/routers/views');
const apiRouter = require('./src/server/routers/index');
const controlAccess = require('./src/server/middlewares/access-control.js');
const { requiredLogin, checkAdmin, blockLogin } = require('./src/server/middlewares/access-control.js');

const app = express();
const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Listening at PORT:${port}`);
    connectToMongoDB();
});
app.set('views', path.join(__dirname, 'src', 'client', 'views'));
app.use('/', viewsRotuer);
app.use('/api', apiRouter);
app.use('/upload', express.static('upload'));
app.use(requiredLogin, checkAdmin, blockLogin);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(fileUpload());
app.use(passport.initialize());
app.use(getUserFromJwt);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ code: errStatus, message: err.message });
});

module.exports = app;
