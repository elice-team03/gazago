const express = require('express');
const router = express.Router();
const { orderService } = require('../services/orderService');
const asyncHandler = require('../utils/async-handler');
const { userService } = require('../services/userService');
const { deliveryService } = require('../services/deliveryService');

/** 회원가입 API */
router.post(
    '/register',
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        if (email.length === 0 || password.length === 0) {
            throw Object.assign(new Error('이메일 혹은 패스워드를 입력해주세요'), { status: 400 });
        }

        const checkUser = await userService.findOneUser(email);
        if (checkUser) {
            throw Object.assign(new Error('이미 등록된 메일입니다'), { status: 400 });
        }

        // TODO: 원할한 테스트를 위해 잠시 주석처리 하겠습니다
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

/** 로그인 API */
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

/** 로그아웃 API */
router.post(
    '/logout',
    asyncHandler(async (req, res, next) => {
        res.clearCookie('authorization');

        res.status(200).json({
            code: 200,
            message: '로그아웃이 완료되었습니다',
            data: null,
        });
    })
);

/** 회원정보 조회 API */
router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        if (!req.user) {
            throw Object.assign(new Error('로그인이 필요합니다'), { status: 401 });
        }
        const loggedInUser = req.user.user;
        const { email, _id, wishList, delivery } = loggedInUser;
        const orders = await orderService.findByOrderer(_id);
        const deliveyInform = await deliveryService.findDeliveryById(delivery);
        res.json({
            code: 200,
            message: '요청이 성공하였습니다',
            data: { email, _id, wishList, orders, deliveyInform },
        });
    })
);

/** 회원정보 변경 API */
router.patch(
    '/',
    asyncHandler(async (req, res, next) => {
        // delivery 없는 유저는 변경이 가능하게

        const { contact, code, address } = req.body;
        const loggedInUser = req.user.user;
        const id = loggedInUser.delivery;

        const result = await deliveryService.findDeliveryAndUpdate({ contact, code, address, id });
        console.log(result);
        res.status(200).json({
            code: 200,
            message: '유저 정보가 업데이트 되었습니다',
            data: result,
        });
    })
);

module.exports = router;
