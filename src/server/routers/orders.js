const { Router } = require('express');
const { orderService } = require('../services/orderService');
const { deliveryService } = require('../services/deliveryService');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const loggedInUser = req.user.user;
        let delivery;
        if (!loggedInUser.delivery) {
            const { title, receiver, code, address, contact } = req.body;
            if (!receiver || !code || !address || !contact) {
                console.log('필수 배송정보를 입력해주세요');
            }
            delivery = await deliveryService.addDeliveryAndUpdateUser(req.body, loggedInUser._id);
        } else {
            delivery = await deliveryService.findDelivery(loggedInUser.delivery);
        }

        // const result = orderService.addOrder(newOrder);
        res.status(201).json({
            code: 201,
            message: '주문.',
            data: delivery,
        });
    })
);
module.exports = router;
