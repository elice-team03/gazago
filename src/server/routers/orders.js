const { Router } = require('express');
const { orderService } = require('../services/orderService');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        // 배송 정보 ID
        // const result = await productService.addProduct({ newProduct, contentFile });

        res.status(201).json({
            code: 201,
            message: '주문.',
            data: result,
        });
    })
);
