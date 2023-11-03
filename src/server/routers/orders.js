const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const { orderService } = require('../services/orderService');
const { deliveryService } = require('../services/deliveryService');
const { userService } = require('../services/userService');

const router = Router();

/** 주문 API */
router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const userId = req.user.user._id;
        const loggedInUser = await userService.findUserById(userId);
        const { title, receiver, code, address, subAddress, contact, comment, totalAmount, productIds } = req.body;

        if (!receiver || !code || !address || !subAddress || !contact) {
            throw Object.assign(new Error('필수 배송정보를 입력해주세요.'), { status: 400 });
        }

        const delivery = await deliveryService.addDelivery({
            title: title || '',
            receiver,
            code,
            address,
            subAddress,
            contact,
            loggedInUser,
        });
            
        await userService.addUserDelivery(loggedInUser._id, delivery._id);

        const order = await orderService.addOrder({
            comment,
            totalAmount,
            loggedInUser,
            delivery,
            productIds,
        });

        await userService.addUserOrder(loggedInUser._id, order._id);

        res.status(201).json({
            code: 201,
            message: '주문이 성공적으로 완료되었습니다.',
            data: order,
        });
    })
);

router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        const ITEMS_PER_PAGE = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const limit = ITEMS_PER_PAGE;

        const { beginDate, endDate, orderNumber, status, name } = req.query;
        const filter = {};

        if (beginDate && endDate) {
            const beginTimestamp = new Date(beginDate).getTime();
            const endTimestamp = new Date(endDate).getTime();

            filter.createdAt = { $gte: beginTimestamp, $lte: endTimestamp + 86400000 };
        }
        if (orderNumber) {
            filter.orderNumber = { $regex: new RegExp(orderNumber, 'i') };
        }
        if (status) {
            filter.status = status;
        }

        const deliveryFilter = {};
        if (name) {
            deliveryFilter.receiver = name;
        }

        const orders = await orderService.findAllOrders(filter, deliveryFilter, skip, limit);
        const totalOrdersCount = await orderService.getTotalOrdersCount(filter, deliveryFilter);

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: {
                orders,
                currentPage: page,
                totalPages: Math.ceil(totalOrdersCount / ITEMS_PER_PAGE),
            },
        });
    })
);

router.get(
    '/:id',
    asyncHandler(async (req, res, next) => {
        const _id = req.params.id;

        const result = await orderService.findOrderWithProducts(_id);

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
