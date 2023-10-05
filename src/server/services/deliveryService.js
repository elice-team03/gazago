const { Delivery, User } = require('../db');

class deliveryService {
    static async addDeliveryAndSetUserDelivery(newDelivery, id) {
        const delivery = await Delivery.create(newDelivery);
        await User.findOneAndUpdate({ _id: id }, { delivery: delivery._id });
        return delivery;
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
