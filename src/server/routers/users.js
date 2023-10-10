const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const { userService } = require('../services/userService');
const { deliveryService } = require('../services/deliveryService');
const { productService } = require('../services/productService');

/**이메일 인증 방식회원가입 */
router.post(
    '/register/email',
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        const result = await userService.signUpUser({ email, password, res });
        res.status(200).json({
            code: 200,
            message: '이메일 인증 단계로 넘어갑니다',
            data: result._id,
        });
    })
);

/** 이메일 인증번호 비교 */
router.post(
    '/register/:userId',
    asyncHandler(async (req, res, next) => {
        const { userId } = req.params;
        const { certificationNumber } = req.body;
        await userService.compareEmailNumber(userId, certificationNumber);

        res.status(201).json({
            code: 201,
            message: '회원가입이 완료되었습니다',
            data: null,
        });
    })
);

/** 이메일 중복확인 */
router.post(
    '/check-email',
    asyncHandler(async (req, res, next) => {
        const { email } = req.body;

        const checkUser = await userService.findUserByEmail(email);
        if (checkUser) {
            throw Object.assign(new Error('이미 등록된 메일입니다'), { status: 400 });
        }
        res.stauts(200).json({
            code: 200,
            message: '사용 가능한 이메일입니다',
            data: true,
        });
    })
);

/** 회원가입 */
router.post(
    '/register',
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        if (email.length === 0 || password.length === 0) {
            throw Object.assign(new Error('이메일 혹은 패스워드를 입력해주세요'), { status: 400 });
        }

        const checkUser = await userService.findUserByEmail(email);
        if (checkUser) {
            throw Object.assign(new Error('이미 등록된 메일입니다'), { status: 400 });
        }

        const result = await userService.signUpUser({ email, password, res });
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

        const checkedUser = await userService.findUserByEmail(email);

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

/** 로그인 확인 여부 API */
router.get(
    '/check',
    asyncHandler(async (req, res, next) => {
        if (req.user) {
            res.json({
                code: 200,
                message: '로그인 중입니다',
                data: true,
            });
        } else {
            res.json({
                code: 200,
                message: '로그아웃 중 입니다',
                data: false,
            });
        }
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
        const loggedInUser = req.user.user;
        const id = loggedInUser._id;
        const user = await userService.findUser(id);
        const { _id, email, password, role, wishList, delivery, orders, updatedAt, createdAt } = user;
        await deliveryService.findDeliveryById(delivery);
        res.json({
            code: 200,
            message: '요청이 성공하였습니다',
            data: {
                _id,
                password,
                email,
                role,
                wishList,
                delivery,
                orders,
                updatedAt,
                createdAt,
            },
        });
    })
);

/** 회원정보 변경 (임시 비밀번호 변경) API */
router.patch(
    '/',
    asyncHandler(async (req, res, next) => {
        const { contact, code, address, subAddress, password } = req.body;
        const loggedInUser = req.user.user;
        const id = loggedInUser.delivery;

        //임시 비밀번호 변경
        await userService.tempChangePassword(loggedInUser.email, password);

        const result = await deliveryService.findDeliveryAndUpdate({
            contact,
            code,
            address,
            subAddress,
            id,
        });
        res.status(200).json({
            code: 200,
            message: '유저 정보가 업데이트 되었습니다',
            data: result,
        });
    })
);

/** 회원 비밀번호 변경 API */
router.patch(
    '/password',
    asyncHandler(async (req, res, next) => {
        const loggedInUser = req.user.user;
        const { oldPassword, newPassword } = req.body;

        await userService.changePassword({ oldPassword, newPassword, loggedInUser });
        res.json({
            code: 200,
            message: '비밀번호 변경을 완료하였습니다',
            data: null,
        });
    })
);

/** 회원 임시 비밀번호 발송 API */
router.post(
    '/password',
    asyncHandler(async (req, res, next) => {
        const { email } = req.body;
        await userService.changePasswordAndSendByEmail(email);

        res.status(200).json({
            code: 200,
            message: '임시 비밀번호가 이메일로 발송되었습니다',
            data: null,
        });
    })
);

module.exports = router;
