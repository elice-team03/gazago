const path = require('path');
const { mongoose } = require('mongoose');
const { Product } = require('../db');
const { categoryService } = require('./categoryService');
const { uploadFile } = require('../utils/file-upload');

class productService {
    static async addProduct({ newProduct, contentFile }) {
        const uploadDirectory = path.join('public', 'upload', 'product');
        const [contentInfo] = await Promise.all([uploadFile(contentFile, uploadDirectory)]);

        newProduct.contentUsrFileName = contentInfo.userFileName;
        newProduct.contentSrvFileName = contentInfo.serverFileName;

        const category = await categoryService.findCategory(newProduct.categoryId);

        if (!category) {
            const error = new Error('카테고리를 찾을 수 없습니다.');
            error.status = 400;
            throw error;
        }

        newProduct.category = category;

        return await Product.create(newProduct);
    }

    static async findProductsPaginated(skip, limit) {
        return await Product.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
    }

    static async findProductsByCategory(categoryId) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            const error = new Error('카테고리 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }
        return await Product.find({ category: categoryId });
    }

    static async findProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('상품 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }
        return await Product.findById(id);
    }

    static async getTotalProductsCount() {
        return await Product.countDocuments({}).exec();
    }

    static async removeProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('상품 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = { productService };
