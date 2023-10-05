const { Order } = require('../db');

class orderService {
    static async addorder(newOrder) {
        return await Order.create(newOrder);
    }

    static async findorder(_id) {
        return await Order.findById(_id);
    }

    static async findByOrderer(ordererId) {
        return await Order.find({ orderer: ordererId });
    }

    static async removeorder(_id) {
        return await Order.findByIdAndDelete(_id);
    }
}

module.exports = { orderService };
