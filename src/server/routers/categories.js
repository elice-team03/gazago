const express = require('express');
const asyncHandler = require('../utils/async-handler');
const { categoryService } = require('../services/categoryService');

const router = express.Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const { name, parentCategoryId } = req.body;

        if (!name) {
            const error = new Error('카테고리 명을 입력 해주세요.');
            error.status = 400;
            throw error;
        }

        let result;
        if (!parentCategoryId) {
            result = await categoryService.addParentCategory(name);
        } else {
            result = await categoryService.addCategory(name, parentCategoryId);
        }

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
        const ITEMS_PER_PAGE = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const limit = ITEMS_PER_PAGE;

        const categories = await categoryService.findCategoriesByDepth(2);
        const result = await categoryService.findCategoriesWithProductCountByDepth(categories, skip, limit);

        const totalItems = categories.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: {
                categories: result,
                currentPage: page,
                totalPages: totalPages,
            },
        });
    })
);

router.get(
    '/menu',
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

router.patch(
    '/:id',
    asyncHandler(async (req, res, next) => {
        const categoryId = req.params.id;
        const useYn = req.body.useYn;

        const result = await categoryService.modifyCategory(categoryId, useYn);
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
