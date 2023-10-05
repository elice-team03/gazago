const { Router } = require('express');
const { orderService } = require('../services/orderService');
const { deliveryService } = require('../services/deliveryService');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const { receiver, code, address, contact } = req.body;
        if (!receiver || !code || !address || !contact) {
            throw Object.assign(new Error('필수 배송정보를 입력해주세요.'), { status: 400 });
        }

        const loggedInUser = req.user.user;
        let delivery = null;
        if (!loggedInUser.delivery) {
            delivery = await deliveryService.addDeliveryAndSetUserDelivery(req.body, loggedInUser._id);
        } else {
            delivery = await deliveryService.findDelivery(loggedInUser.delivery);
        }
        const { comment, productIds } = req.body;
        const result = await orderService.addOrder({ comment, loggedInUser, delivery, productIds });

        res.status(201).json({
            code: 201,
            message: '주문이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

module.exports = router;
