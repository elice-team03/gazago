const mongoose = require('mongoose');
const { Order } = require('../db');
const { userService } = require('./userService');

class orderService {
    static async addOrder(newOrder) {
        const { comment, totalAmount, loggedInUser, delivery, productIds } = newOrder;
        if (!areProductIdsValid(productIds)) {
            throw Object.assign(new Error('유효하지 않은 상품 ID가 포함되어 있습니다.'), { status: 400 });
        }

        const buildOrder = new Order({
            comment,
            totalAmount,
            orderUserId: loggedInUser._id,
            delivery,
            products: productIds,
        });

        const order = await Order.create(buildOrder);

        await userService.addUserOrder(loggedInUser._id, order._id);

        return order;
    }

    static async findOrder(_id) {
        return await Order.findById(_id);
    }

    static async findByOrderer(orderUserId) {
        return await Order.find({ orderUserId: orderUserId });
    }

    static async removeOrder(_id) {
        return await Order.findByIdAndDelete(_id);
    }
}

function areProductIdsValid(productIds) {
    return productIds.every((productId) => mongoose.Types.ObjectId.isValid(productId));
}

module.exports = { orderService };
