const { Delivery } = require('../db');
const { userService } = require('./userService');

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

        await userService.addUserDelivery(loggedInUser._id, delivery._id);
        return delivery;
    }

    static async findDeliveryById(_id) {
        return await Delivery.findById(_id);
    }

    static async findByOrderer(ordererId) {
        return await Delivery.find({ orderer: ordererId });
    }

    static async removeDelivery(_id) {
        return await Delivery.findByIdAndDelete(_id);
    }

    static async findDeliveryAndUpdate(changedDelivery) {
        const { contact, code, address, id } = changedDelivery;
        await Delivery.updateOne(
            { _id: id },
            {
                contact: contact,
                code: code,
                address: address,
            }
            //업데이트 후 값이 안 담겨서 일단 다시 DB에서 불러옵니다.
        );

        return await Delivery.findById({ _id: id });

        //
    }
}
module.exports = { deliveryService };
