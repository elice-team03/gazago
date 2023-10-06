const { Delivery, User } = require('../db');

class deliveryService {
    static async addDeliveryAndSetUserDelivery(newDelivery) {
        const { title, receiver, code, address, contact, loggedInUser } = newDelivery;

        const buildDelivery = new Delivery({
            title: title || '',
            receiver,
            code,
            address,
            contact,
        });

        const delivery = await Delivery.create(buildDelivery);

        await User.findOneAndUpdate({ _id: loggedInUser._id }, { delivery: delivery._id });
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

    static async findDeliveryAndUpdate(changedDelivery) {
        console.log(changedDelivery);
        // const { id, contact, code, address } = changedDelivery;
        // return await Delivery.findByIdAndUpdate({ _id: id }, { updatedInformName: content });
    }

    // static async changeUpdatedInform(changedDelivery) {
    //     const { updatedInformName, contact = null, code = null, address = null } = changedDelivery;
    //     const delivery = await deliveryService.findDeliveryAndUpdate(changedDelivery);
    //     return delivery;
    // }
}

module.exports = { deliveryService };
