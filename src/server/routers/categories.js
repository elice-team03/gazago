const express = require('express');
const { categoryService } = require('../services/categoryService');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const { name, parentCategoryId } = req.body;

        console.log(name);
        if (!name) {
            const error = new Error('카테고리 명을 입력 해주세요.');
            error.status = 400;
            throw error;
        }
        console.log('bye');

        let result;
        if (!parentCategoryId) {
            result = await categoryService.addParentCategory(name);
        } else {
            result = await categoryService.addCategory(name, parentCategoryId);
        }

        console.log('bye');
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
        result = await categoryService.findAllCategories();
        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: result,
        });
    })
);

router.get(
    '/children',
    asyncHandler(async (req, res, next) => {
        const parentCategoryId = req.query.parentCategoryId;

        let result;
        if (!parentCategoryId) {
            result = await categoryService.findCategoriesByDepth(1);
        } else {
            result = await categoryService.findCategoriesByParent(parentCategoryId);
        }

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
