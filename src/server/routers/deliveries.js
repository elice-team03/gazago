const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const { deliveryService } = require('../services/deliveryService');

/** 배송지 정보 전체 조회 API */
router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        const ITEMS_PER_PAGE = 3;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const limit = ITEMS_PER_PAGE;

        const user = req.user.user;

        const deliveries = await deliveryService.findAllDeliveriesByOwner(user._id, skip, limit);
        const totalDeliveriesCount = await deliveryService.getTotaldeliveriesCount(user._id);

        res.json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: {
                deliveries,
                currentPage: page,
                totalPages: Math.ceil(totalDeliveriesCount / ITEMS_PER_PAGE),
            },
        });
    })
);

/** 배송지 정보 상세 조회 API */
router.get(
    '/:id',
    asyncHandler(async (req, res, next) => {
        const deliveryId = req.params.id;

        const result = await deliveryService.findDeliveryById(deliveryId);

        res.json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

/** 배송지 정보 변경 API */
router.patch(
    '/:id',
    asyncHandler(async (req, res, next) => {
        const deliveryId = req.params.id;
        const { contact, code, address, subAddress } = req.body;

        const result = await deliveryService.modifyDelivery(deliveryId, {
            contact,
            code,
            address,
            subAddress,
        });

        res.json({
            code: 200,
            message: '주소 변경이 완료되었습니다',
            data: result,
        });
    })
);

module.exports = router;
