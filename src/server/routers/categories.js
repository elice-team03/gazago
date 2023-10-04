const express = require('express');
const { categoryService } = require('../services/categoryService');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const { name } = req.body;

        if (!name) {
            const error = new Error('카테고리명을 입력해주세요.');
            error.statusCode = 400;
            throw error;
        }

        const result = await categoryService.addCategory(name);
        res.status(201).json({
            code: 201,
            message: '카테고리 등록이 완료되었습니다.',
            data: result,
        });
    })
);

router.get(
    '/',
    asyncHandler(async (req, res, next) => {
        const result = await categoryService.findAllCategories();

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
        const result = await categoryService.removeCategory(_id);

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

module.exports = router;
