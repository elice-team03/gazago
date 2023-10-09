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
        let loggedInUser = req.user?.user;

        // let guest = null;

        // if (!req.user) {
        //     const { userName, email } = req.body;
        //     guest = await userService.signUpGuest({ userName, email });
        // }

        // req.user ? (userWantingToBuy = req.user.user) : (userWantingToBuy = guest);

        const { title, receiver, code, address, contact } = req.body;
        if (!receiver || !code || !address || !contact) {
            throw Object.assign(new Error('필수 배송정보를 입력해주세요.'), { status: 400 });
        }

        let delivery = null;
        if (!loggedInUser.delivery) {
            delivery = await deliveryService.addDeliveryAndSetUserDelivery({
                title: title || '',
                receiver,
                code,
                address,
                contact,
                loggedInUser,
            });
        } else {
            delivery = await deliveryService.findDeliveryById(loggedInUser.delivery);
        }

        const { comment, totalAmount, productIds } = req.body;
        const result = await orderService.addOrder({
            comment,
            totalAmount,
            loggedInUser,
            delivery,
            productIds,
        });

        res.status(201).json({
            code: 201,
            message: '주문이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        const { beginDate, endDate, orderNumber, status, name } = req.query;
        const filter = {};

        if (beginDate && endDate) {
            const beginTimestamp = new Date(beginDate).getTime();
            const endTimestamp = new Date(endDate).getTime();

            filter.createdAt = { $gte: beginTimestamp, $lte: endTimestamp + 86400000 };
        }
        if (orderNumber) {
            filter.orderNumber = orderNumber;
        }
        if (status) {
            filter.status = status;
        }

        const deliveryFilter = {};
        if (name) {
            deliveryFilter.receiver = { $regex: new RegExp(name, 'i') };
        }

        const result = await orderService.findAllOrders(filter, deliveryFilter);
        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

router.patch(
    '/status/:id',
    asyncHandler(async (req, res, next) => {
        const _id = req.params.id;
        const status = req.body.status;

        const result = await orderService.modifyOrderStatus({ _id, status });

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

module.exports = router;
