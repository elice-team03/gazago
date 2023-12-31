const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const { userService } = require('../services/userService');
const { deliveryService } = require('../services/deliveryService');
const { productService } = require('../services/productService');

/** 회원가입 API */
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

/** 회원정보 조회 API */
router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        const loggedInUser = req.user.user;
        const id = loggedInUser._id;
        const user = await userService.findUserById(id);
        const { _id, email, role, wishList, delivery, orders, createdAt, updatedAt } = user;

        res.json({
            code: 200,
            message: '요청이 성공하였습니다',
            data: {
                _id,
                email,
                role,
                wishList,
                delivery,
                orders,
                createdAt,
                updatedAt,
            },
        });
    })
);

/** 사용자 위시리스트 조회 API */
router.get(
    '/wishlist',
    asyncHandler(async (req, res, next) => {
        const ITEMS_PER_PAGE = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const limit = ITEMS_PER_PAGE;

        const user = req.user.user;
        const foundUser = await userService.findUserById(user._id);
        const wishlist = await productService.findProductsInWishList(foundUser.wishList, skip, limit);
        const totalItems = foundUser.wishList.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        res.json({
            code: 200,
            message: '요청이 성공하였습니다',
            data: {
                wishlist,
                currentPage: page,
                totalPages: totalPages,
            },
        });
    })
);

/** 사용자 주문 내역 조회 API */
router.get(
    '/orders',
    asyncHandler(async (req, res, next) => {
        const ITEMS_PER_PAGE = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const limit = ITEMS_PER_PAGE;

        const user = req.user.user;
        const result = await userService.findUserById(user._id);

        const orders = result.orders
            .slice()
            .reverse()
            .slice(skip, skip + limit);

        res.json({
            code: 200,
            message: '요청이 성공하였습니다',
            data: {
                orders,
                currentPage: page,
                totalPages: Math.ceil(result.orders.length / ITEMS_PER_PAGE),
            },
        });
    })
);

/** 회원 비밀번호 변경 API */
router.patch(
    '/password',
    asyncHandler(async (req, res, next) => {
        const loggedInUser = req.user.user;
        const { newPassword } = req.body;

        await userService.changePassword({ newPassword, loggedInUser });
        res.json({
            code: 200,
            message: '비밀번호 변경을 완료하였습니다',
            data: null,
        });
    })
);

/** 사용자 배송 정보 변경 API */
router.patch(
    '/delivery',
    asyncHandler(async (req, res, next) => {
        const userId = req.user.user._id;
        const loggedInUser = await userService.findUserById(userId);
        const delivery = loggedInUser.delivery;

        const { contact, code, address, subAddress } = req.body;
        let result = null;
        if (!delivery) {
            result = await deliveryService.addDeliveryAndSetUserDelivery({
                code,
                address,
                subAddress,
                contact,
                loggedInUser,
            });
        } else {
            result = await deliveryService.modifyDelivery(delivery, {
                code,
                address,
                subAddress,
                contact,
                email: loggedInUser.email,
            });
        }

        res.json({
            code: 200,
            message: '요청을 성공적으로 완료했습니다.',
            data: result,
        });
    })
);

/** 위시리스트 추가 API */
router.patch(
    '/wishlist',
    asyncHandler(async (req, res, next) => {
        const user = req.user.user;
        const { productId } = req.body;

        if (!user) {
            const error = new Error('로그인 후 이용 가능합니다.');
            error.status = 400;
            throw error;
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            const error = new Error('상품 ID가 올바르지 않습니다.');
            error.status = 400;
            throw error;
        }

        const product = await productService.findProduct(productId);

        if (!product) {
            const error = new Error('상품 정보를 찾을 수 없습니다..');
            error.status = 400;
            throw error;
        }

        const result = await userService.addUserWishlist(user._id, productId);

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

/** 위시리스트 삭제 API */
router.delete(
    '/wishlist/:productIds',
    asyncHandler(async (req, res, next) => {
        const productIds = req.params.productIds.split(',');
        const user = req.user.user;
        if (!user) {
            const error = new Error('로그인 후 이용 가능합니다.');
            error.status = 400;
            throw error;
        }

        const result = await userService.removeUserWishlist(user._id, productIds);

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

module.exports = router;
