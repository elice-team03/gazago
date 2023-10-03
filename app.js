const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const usersRouter = require('./src/server/routers/users');
const productsRouter = require('./src/server/routers/products');
// const indexRouter = require("./src/server/routers/index");
const viewsRotuer = require('./src/client/routers/views');

const app = express();

// MongoDB connect
require('dotenv').config();
const port = process.env.PORT || 5001;
const mongo_uri = process.env.MONGO_URI;

mongoose.connect(mongo_uri);
mongoose.connection.on('connected', () => {
    console.log('Successfully connected to MongoDB');
});

app.listen(port, () => {
    console.log(`Listening at PORT:${port}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'src', 'client', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/', viewsRotuer);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.json({ err: err.message });
});

module.exports = app;
