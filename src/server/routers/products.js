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

        const requiredFields = ['name', 'brand', 'color', 'price'];
        const missingFields = requiredFields.filter((field) => !newProduct[field]);

        if (missingFields.length > 0) {
            const error = new Error(`필수 입력 필드가 누락 되었습니다. 누락 된 필드 : ${missingFields.join(', ')}`);
            error.status = 400;
            throw error;
        }
        if (!thumbnailFile || !contentFile) {
            const error = new Error(`상품 대표 이미지와 상품 설명 이미지는 필수 입력 필드 입니다.`);
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
        const result = await productService.findAllProducts();

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
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
