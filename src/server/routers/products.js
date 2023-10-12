const { Router } = require('express');
const { productService } = require('../services/productService');
const { categoryService } = require('../services/categoryService');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
        const newProduct = req.body;
        const contentFile = req.files.content;

        const requiredFields = ['name', 'brand', 'price', 'thumbnailPath'];
        const missingFields = requiredFields.filter((field) => !newProduct[field]);

        if (missingFields.length > 0 || !contentFile) {
            const error = new Error('누락된 입력 항목이 존재합니다.');
            error.status = 400;
            throw error;
        }

        const category = await categoryService.findCategory(newProduct.categoryId);

        if (!category) {
            const error = new Error('카테고리를 찾을 수 없습니다.');
            error.status = 400;
            throw error;
        }

        const result = await productService.addProduct({ newProduct, category, contentFile });

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

        const { brand, beginPrice, endPrice, color, parentCategoryId, categoryId, searchKeyword } = req.query;
        const filter = {};

        if (brand) {
            filter.brand = brand;
        }
        if (beginPrice && endPrice) {
            filter.price = { $gte: parseInt(beginPrice), $lte: parseInt(endPrice) };
        }
        if (color) {
            filter.color = color;
        }
        if (categoryId) {
            filter.category = categoryId;
        } else if (parentCategoryId) {
            const categories = await categoryService.findCategoriesByParent(parentCategoryId);
            const categoryIds = categories.map((category) => category._id);

        if (categoryId) {
            filter.category = categoryId;
        } else if (parentCategoryId) {
            const categories = await categoryService.findCategoriesByParent(parentCategoryId);
            const categoryIds = categories.map((category) => category._id);

            filter.category = { $in: categoryIds };
        }
        if (searchKeyword) {
            filter.name = { $regex: new RegExp(searchKeyword, 'i') };
        }

        const result = await productService.findProductsPaginated(skip, limit, filter);
        const totalProductsCount = await productService.getTotalProductsCount(filter);

        res.status(200).json({
            code: 200,
            message: '요청이 성공적으로 완료되었습니다.',
            data: {
                products,
                currentPage: page,
                totalPages: Math.ceil(totalProductsCount / ITEMS_PER_PAGE),
            },
        });
    })
);

router.get(
    '/:id',
    asyncHandler(async (req, res, next) => {
        const _id = req.params.id;
        const result = await productService.findProduct(_id);
        if (!result) {
            throw Object.assign(new Error('상품 정보를 찾을 수 없습니다.'), { status: 400 });
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
        const _id = req.params.id;
        const productInfo = req.body;
        let contentFile;
        try {
            contentFile = req.files.content;
        } catch (e) {
            contentFile = null;
        }

        const requiredFields = ['name', 'brand', 'price', 'thumbnailPath', 'categoryId'];
        const missingFields = requiredFields.filter((field) => !productInfo[field]);

        if (missingFields.length > 0) {
            const error = new Error('누락된 입력 항목이 존재합니다.');
            error.status = 400;
            throw error;
        }

        const result = await productService.modifyProduct({ _id, productInfo, contentFile });

        res.status(201).json({
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
        if (!status) {
            const error = new Error('변경 상태 값을 입력해주세요.');
            error.status = 400;
            throw error;
        }

        const result = await productService.modifyProductStatus({ _id, status });
        res.status(201).json({
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
