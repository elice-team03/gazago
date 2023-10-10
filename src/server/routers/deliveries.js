const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const { userService } = require('../services/userService');
const { deliveryService } = require('../services/deliveryService');

router.patch(
    '/',
    asyncHandler(async (req, res, next) => {
        const { orderId, newAddress } = req.body;

        const result = await deliveryService.changeAddress(orderId, newAddress);

        res.json({
            code: 200,
            message: '주소 변경이 성공하였습니다',
            data: result,
        });
    })
);

module.exports = router;
