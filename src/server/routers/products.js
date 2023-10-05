const { Router } = require('express');
const { productService } = require('../services/productService');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const newProduct = req.body;
        const thumbnailFile = req.files.thumbnail;
        const contentFile = req.files.content;

        const requiredFields = ['name', 'brand', 'price'];
        const missingFields = requiredFields.filter((field) => !newProduct[field]);

        if (missingFields.length > 0 || !thumbnailFile || !contentFile) {
            const error = new Error('누락된 입력 항목이 존재합니다.');
            error.status = 400;
            throw error;
        }

        const result = await productService.addProduct({ newProduct, thumbnailFile, contentFile });
        res.status(201).json({
            code: 201,
            message: '상품 등록이 완료되었습니다.',
            data: result,
        });
    })
);

router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        const ITEMS_PER_PAGE = 20;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const limit = ITEMS_PER_PAGE;

        const result = await productService.findProductsPaginated(skip, limit);
        const totalProductsCount = await productService.getTotalProductsCount();

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
            currentPage: page,
            totalPages: Math.ceil(totalProductsCount / ITEMS_PER_PAGE),
        });
    })
);

router.get(
    '/:id',
    asyncHandler(async (req, res, next) => {
        const _id = req.params.id;
        const result = await productService.findProduct(_id);

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

router.delete(
    '/:id',
    asyncHandler(async (req, res, next) => {
        const _id = req.params.id;
        const result = await productService.removeProduct(_id);

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

module.exports = router;
