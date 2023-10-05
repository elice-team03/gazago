const express = require('express');
const asyncHandler = require('../utils/async-handler');
const { userService } = require('../services/userService');

const router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({ result: 'index' });
});

router.post(
    '/register',
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        if (email.length === 0 || password.length === 0 ) {
            throw Object.assign(new Error('이메일 혹은 패스워드를 입력해주세요'), { status: 400 });
        }

        const checkUser = await userService.findOneUser(email);
        if (checkUser) {
            throw Object.assign(new Error('이미 등록된 메일입니다'), { status: 400 });
        }

       
        // 원할한 테스트를 위해 잠시 주석처리 하겠습니다
        // const regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

        // if (!regExp.test(password)) {
        //     throw Object.assign(new Error('비밀번호 조건에 맞지 않습니다'), { status: 400 });
        // }

        const result = await userService.signUpUser({ email, password });
        res.status(201).json({
            code: 201,
            message: '회원가입이 완료되었습니다',
            data: result,
        });
    })
);

router.post(
    '/login',
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            throw Object.assign(new Error('이메일 혹은 패스워드를 입력해주세요'), { status: 400 });
        }

        const checkedUser = await userService.findOneUser(email);

        if (!checkedUser) {
            throw Object.assign(new Error('이메일 혹은 패스워드가 일치하지 않습니다'), { status: 400 });
        }

        const result = await userService.signInUser(checkedUser, password, res);
        res.status(200).json({
            code: 200,
            message: '로그인이 완료되었습니다',
            data: { email: result },
        });
    })
);

router.post(
    '/logout',
    asyncHandler(async (req, res, next) => {
        res.clearCookie('token');

        res.status(200).json({
            code: 200,
            message: '로그아웃이 완료되었습니다',
            data: null,
        });
    })
);

router.post(
    '/logout',
    asyncHandler(async (req, res, next) => {
        res.clearCookie('token');

        res.status(200).json({
            code: 200,
            message: '로그아웃이 완료되었습니다',
            data: null,
        });
    })
);

//테스트용 라우터
router.get('/auth', (req, res, next) => {
    if (req.user) {
        console.log('로그인 중');
    } else {
        console.log('로그아웃 중');
    }
    console.log(req.cookies);
    res.end();
});

module.exports = router;
