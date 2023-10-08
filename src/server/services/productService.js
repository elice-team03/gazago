const path = require('path');
const { mongoose } = require('mongoose');
const { Product, Order } = require('../db');
const { categoryService } = require('./categoryService');
const { uploadFile, deleteFile } = require('../utils/file-upload');

const uploadDirectory = path.join('public', 'upload', 'product');

class productService {
    static async addProduct({ newProduct, contentFile }) {
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
        const products = await Product.find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('category')
            .exec();

        const result = await Promise.all(
            products.map(async (product) => {
                product.totalSales = await this.findProductOrdered(product._id);
                if (product.category && product.category.parentCategory) {
                    await product.category.populate('parentCategory').exec;
                }
                return product;
            })
        );

        return result;
    }

    static async findProductOrdered(productId) {
        const orders = await Order.find({ products: productId });

        let totalSales = 0;
        for (const order of orders) {
            const productCount = order.products.filter((pId) => pId.toString() === productId.toString()).length;
            totalSales += productCount;
        }

        return totalSales;
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

    static async modifyProduct({ _id, productInfo, contentFile }) {
        const product = await this.findProduct(_id);
        if (!product) {
            const error = new Error('상품을 찾을 수 없습니다.');
            error.status = 404;
            throw error;
        }

        if (contentFile) {
            const contentSrvFileName = product.contentSrvFileName;
            await deleteFile(contentSrvFileName, uploadDirectory);

            const [contentInfo] = await Promise.all([uploadFile(contentFile, uploadDirectory)]);
            productInfo.contentUsrFileName = contentInfo.userFileName;
            productInfo.contentSrvFileName = contentInfo.serverFileName;
        }

        const category = await categoryService.findCategory(productInfo.categoryId);
        if (!category) {
            const error = new Error('카테고리를 찾을 수 없습니다.');
            error.status = 400;
            throw error;
        }
        productInfo.category = category;

        return await Product.findByIdAndUpdate(_id, productInfo, {
            new: true,
            runValidators: true,
        });
    }

    static async removeProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('상품 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }
        const product = await this.findProduct(id);
        await deleteFile(product.contentSrvFileName, uploadDirectory);

        return await Product.findByIdAndDelete(id);
    }
}

module.exports = { productService };
