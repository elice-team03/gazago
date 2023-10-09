const { Delivery, User } = require('../db');
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
            owner: loggedInUser._id,
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
        );
        return await Delivery.findById({ _id: id });
        //
    }

    /** 주소변경 */
    static async changeAddress(userId, newAddress) {
        const user = User.findById(userId);
        if (!user) {
            throw Object.assign(new Error('유저 ID가 올바르지 않습니다'), { status: 400 });
        }

        return await Delivery.findOneAndUpdate({ owner: userId }, { address: newAddress });
    }
}
module.exports = { deliveryService };
