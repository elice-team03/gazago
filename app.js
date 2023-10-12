require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const errorHandler = require('./src/server/utils/error-handler');
const connectToMongoDB = require('./src/server/db/db-connect');
const viewsRotuer = require('./src/client/routers/views');
const indexRouter = require('./src/server/routers/index');
const usersRouter = require('./src/server/routers/users');
const productsRouter = require('./src/server/routers/products');
const categoriesRouter = require('./src/server/routers/categories');
const deliveriesRouter = require('./src/server/routers/deliveries');
const ordersRouter = require('./src/server/routers/orders');
const controlAccess = require('./src/server/middlewares/access-control.js');
const { requiredLogin, checkAdmin, blockLogin } = require('./src/server/middlewares/access-control.js');

const app = express();
const port = process.env.PORT || 5001;

// MongoDB 연결
connectToMongoDB();

// 애플리케이션 설정
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS 설정
app.use(cors());

// 파일 업로드 설정
app.use(fileUpload());

// Passport 설정
require('./src/server/passport')();
app.use(passport.initialize());

// 미들웨어 설정
app.use(getUserFromJwt);
app.use(requiredLogin, checkAdmin, blockLogin);

// 라우팅 설정
app.use('/', viewsRotuer);
app.use('/api', apiRouter);

// 정적 파일 설정
app.use('/upload', express.static('upload'));

// 에러 핸들러 설정
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Listening at PORT:${port}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'src', 'client', 'views'));

require('./src/server/passport')();
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(getUserFromJwt);

app.use(requiredLogin, checkAdmin, blockLogin);

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
    const errStatus = err.status || 500;
    res.status(errStatus).json({ code: errStatus, message: err.message });
});

module.exports = app;
