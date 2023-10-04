const mongoose = require('mongoose');
const { Product } = require('../db');

class productService {
    static async addProduct(newProduct) {
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
