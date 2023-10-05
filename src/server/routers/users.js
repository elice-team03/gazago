const express = require('express');
const router = express.Router();
const { orderService } = require('../services/orderService');
const asyncHandler = require('../utils/async-handler');

/* GET users listing. */
router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        if (!req.user) {
            throw Object.assign(new Error('로그인이 필요합니다'), { status: 400 });
        }

        const { email, _id, wishList } = req.user.user;
        const orders = await orderService.findByOrderer(_id);

        res.json({
            code: 200,
            message: '요청이 성공하였습니다',
            data: { email, _id, wishList, orders },
        });
    })
);

module.exports = router;
