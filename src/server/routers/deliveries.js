const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');

/* GET users listing. */
router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        if (!req.user) {
            throw Object.assign(new Error('로그인이 필요합니다'), { status: 400 });
        }
        res.json({
            code: 200,
            message: '요청이 성공하였습니다',
            data: { email, _id, wishList, orders },
        });
    })
);

module.exports = router;
