const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');

/* GET users listing. */
router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const { title, code, address, contact, defaultYn } = req.body;

        console.log(req.body);

        res.json({
            code: 200,
            message: '요청이 성공하였습니다',
            data: null,
        });
    })
);

module.exports = router;
