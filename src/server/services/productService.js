const path = require('path');
const { mongoose } = require('mongoose');
const { Product, Order, User } = require('../db');
const { uploadFile, deleteFile } = require('../utils/file-upload');
const { sendEmail } = require('../utils/send-email');
const uploadDirectory = path.join('public', 'upload', 'product');

class productService {
    static async addProduct({ newProduct, category, contentFile }) {
        const [contentInfo] = await Promise.all([uploadFile(contentFile, uploadDirectory)]);

        newProduct.contentUsrFileName = contentInfo.userFileName;
        newProduct.contentSrvFileName = contentInfo.serverFileName;
        newProduct.category = category;

        return await Product.create(newProduct);
    }

    static async findProductsWithTotalSales(skip, limit, filter) {
        const products = await Product.find(filter)
            .populate({
                path: 'category',
                populate: {
                    path: 'parentCategory',
                },
            })
            .skip(skip)
            .limit(limit);

        for (const product of products) {
            product.totalSales = await this.findProductOrderedCount(product._id);
        }

        return products;
    }

    static async findBest3ProductsAndSendEmailToAllUsers() {
        const best3Items = await this.findBest3Products();
        const totalUsers = await User.find({}, 'email');

        for (let i = 0; i < totalUsers.length; i++) {
            const user = totalUsers[i];
            await sendEmail('sendCatalog', user.email, best3Items);
            console.log(`진행 중: ${i + 1} / ${totalUsers.length}`);
        }
    }

    static async findBest3Products() {
        return await Product.find({}).sort({ totalSales: -1 }).limit(3);
    }

    static async findProductOrderedCount(productId) {
        const orders = await Order.find({ products: productId });

        let totalSales = 0;
        for (const order of orders) {
            const productCount = order.products.filter((pId) => pId.toString() === productId.toString()).length;
            totalSales += productCount;
        }

        return totalSales;
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

    static async findProductsInWishList(wishlist, skip, limit) {
        const products = await Product.find({ _id: { $in: wishlist } })
            .skip(skip)
            .limit(limit);
        return products;
    }

    static async findProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('상품 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }
        return await Product.findById(id)
            .populate({
                path: 'category',
                populate: {
                    path: 'parentCategory',
                },
            })
            .exec();
    }

    static async getTotalProductsCount(filter) {
        return await Product.countDocuments(filter).exec();
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

        if (!mongoose.Types.ObjectId.isValid(productInfo.categoryId)) {
            const error = new Error('카테고리 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }
        productInfo.category = productInfo.categoryId;

        return await Product.findByIdAndUpdate(_id, productInfo, {
            new: true,
            runValidators: true,
        });
    }

    static async modifyProductStatus({ _id, status }) {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            const error = new Error('상품 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }

        return await Product.findByIdAndUpdate(
            _id,
            { status: status },
            {
                new: true,
                runValidators: true,
            }
        );
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
