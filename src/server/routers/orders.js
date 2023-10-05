const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const { deliveryService } = require('../services/deliveryService');
const { LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb');

const router = Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        let delivery;
        const loggedInUser = req.user.user;
        if (!loggedInUser.delivery) {
            const { title, receiver, code, address, contact } = req.body;
            if (!receiver || !code || !address || !contact) {
                console.log('필수 배송정보를 입력해주세요');
            }
            delivery = await deliveryService.addDeliveryAndUpdateUser(req.body, loggedInUser._id);
        } else {
            delivery = await deliveryService.findDelivery(loggedInUser.delivery);
        }

        res.status(201).json({
            code: 201,
            message: '주문.',
            data: delivery,
        });
    })
);
module.exports = router;
