const createError = require('http-errors');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const getUserFromJwt = require('./src/server/middlewares/get-user-from-jwt');
const cors = require('cors');

const viewsRotuer = require('./src/client/routers/views');
const indexRouter = require('./src/server/routers/index');
const usersRouter = require('./src/server/routers/users');
const productsRouter = require('./src/server/routers/products');
const categoriesRouter = require('./src/server/routers/categories');
const deliveriesRouter = require('./src/server/routers/deliveries');
const ordersRouter = require('./src/server/routers/orders');

const app = express();
app.use(fileUpload());
app.use(cors());

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

require('./src/server/passport')();
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(getUserFromJwt);

app.use('/', viewsRotuer);

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/deliveries', deliveriesRouter);
app.use('/api/orders', ordersRouter);

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
    const errStatus = err.status || 500;
    res.status(errStatus).json({ code: errStatus, message: err.message });
});

module.exports = app;
