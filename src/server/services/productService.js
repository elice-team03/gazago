const path = require('path');
const { Product } = require('../db');
const { uploadFile } = require('../utils/file-upload');

class productService {
    static async addProduct({ newProduct, thumbnailFile, contentFile }) {
        const uploadDirectory = path.join('public', 'upload', 'product');
        const [thumbnailInfo, contentInfo] = await Promise.all([
            uploadFile(thumbnailFile, uploadDirectory),
            uploadFile(contentFile, uploadDirectory),
        ]);

        newProduct.thumbnailUsrFileName = thumbnailInfo.userFileName;
        newProduct.thumbnailSrvFileName = thumbnailInfo.serverFileName;
        newProduct.contentUsrFileName = contentInfo.userFileName;
        newProduct.contentSrvFileName = contentInfo.serverFileName;

        return await Product.create(newProduct);
    }

    static async findAllProducts() {
        return await Product.find({});
    }

    static async findProduct(_id) {
        return await Product.findById(_id);
    }

    static async removeProduct(_id) {
        return await Product.findByIdAndDelete(_id);
    }
}

module.exports = { productService };
