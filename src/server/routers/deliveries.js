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

/** 배송지 정보 변경  API */
router.patch(
    '/informs',
    asyncHandler(async (req, res, next) => {
        const { contact, code, address, subAddress } = req.body;
        const loggedInUser = req.user.user;
        const id = loggedInUser._id;

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

module.exports = router;
