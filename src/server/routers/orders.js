const { Router } = require('express');
const { orderService } = require('../services/orderService');
const { deliveryService } = require('../services/deliveryService');
const asyncHandler = require('../utils/async-handler');
const { userService } = require('../services/userService');

const router = Router();

/** 주문 API */
router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        let userWantingToBuy = null;
        let guest = null;

        if (!req.user) {
            const { userName, email } = req.body;
            guest = await userService.signUpGuest({ userName, email });
        }

        req.user ? (userWantingToBuy = req.user.user) : (userWantingToBuy = guest);

        const { title, receiver, code, address, contact } = req.body;
        if (!receiver || !code || !address || !contact) {
            throw Object.assign(new Error('필수 배송정보를 입력해주세요.'), { status: 400 });
        }

        let delivery = null;
        if (!userWantingToBuy.delivery) {
            delivery = await deliveryService.addDeliveryAndSetUserDelivery({
                title: title || '',
                receiver,
                code,
                address,
                contact,
                userWantingToBuy,
            });
        } else {
            delivery = await deliveryService.findDeliveryById(userWantingToBuy.delivery);
        }
        const { comment, productIds } = req.body;
        const result = await orderService.addOrder({ comment, userWantingToBuy, delivery, productIds });

        res.status(201).json({
            code: 201,
            message: '주문이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

module.exports = router;
