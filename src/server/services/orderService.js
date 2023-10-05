const { mongoose } = require('mongoose');
const { Order } = require('../db');

class orderService {
    static async addOrder(newOrder) {
        const { comment, orderer, productIds, delivery } = newOrder;
        const order = new Order({
            comment,
            orderer,
            // delivery: delivery,
            products: productIds,
        });
        return await Order.create(order);
    }
}

module.exports = { orderService };
