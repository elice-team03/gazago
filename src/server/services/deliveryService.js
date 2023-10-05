const { Delivery } = require('../db');

class deliveryService {
    static async addDelivery(newDelivery) {
        return await Delivery.create(newDelivery);
    }

    static async findDelivery(_id) {
        return await Delivery.findById(_id);
    }

    static async findByOrderer(ordererId) {
        return await Delivery.find({ orderer: ordererId });
    }

    static async removeDelivery(_id) {
        return await Delivery.findByIdAndDelete(_id);
    }
}

module.exports = { deliveryService };
