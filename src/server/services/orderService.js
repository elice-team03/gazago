const mongoose = require('mongoose');
const { Order } = require('../db');
const { userService } = require('./userService');

class orderService {
    static async addOrder(newOrder) {
        const { comment, loggedInUser, delivery, productIds } = newOrder;
        if (!areProductIdsValid(productIds)) {
            throw Object.assign(new Error('유효하지 않은 상품 ID가 포함되어 있습니다.'), { status: 400 });
        }

        const buildOrder = new Order({
            comment,
            orderUserId: loggedInUser._id,
            delivery,
            products: productIds,
        });

        const order = await Order.create(buildOrder);

        await userService.findUserByIdAndPushNewOrderId(loggedInUser._id, order._id);

        return order;
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

function areProductIdsValid(productIds) {
    return productIds.every((productId) => mongoose.Types.ObjectId.isValid(productId));
}

module.exports = { orderService };
