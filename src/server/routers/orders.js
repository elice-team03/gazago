const { Router } = require('express');
const { orderService } = require('../services/orderService');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const newOrder = req.body;
        const result = orderService.addOrder(newOrder);
        res.status(201).json({
            code: 201,
            message: '주문',
            data: result,
        });
    })
);

module.exports = router;
