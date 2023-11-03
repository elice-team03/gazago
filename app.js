const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const errorHandler = require('./src/server/utils/error-handler');
const connectToMongoDB = require('./src/server/db/db-connect');
const fileUpload = require('express-fileupload');
const viewsRotuer = require('./src/client/routers/views');
const apiRouter = require('./src/server/routers/index');
const stripeRouter = require('./src/server/stripe');
const getUserFromJwt = require('./src/server/middlewares/get-user-from-jwt');
const { requiredLogin, checkAdmin, blockLogin } = require('./src/server/middlewares/access-control');
const mailScheduler = require('./src/server/utils/time-scheduler');

const dotenv = require('dotenv');
const dotenvPath = path.join(__dirname, 'submodule', '.env');
const result = dotenv.config({ path: dotenvPath });
if (result.error) {
    console.error('Error loading .env file: ', result.error);
}

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

// 메일 스케줄러 실행
mailScheduler();

// 라우팅 설정
app.use('/', viewsRotuer);
app.use('/api', apiRouter);
app.use('/api/stripe', stripeRouter);

// 정적 파일 설정
app.use('/public', express.static('public'));

// 에러 핸들러 설정
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Listening at PORT:${port}`);
});

module.exports = app;
