const { Delivery, User } = require('../db');
const { userService } = require('./userService');

class deliveryService {
    static async addDeliveryAndSetUserDelivery(newDelivery) {
        const { title, receiver, code, address, subAddress, contact, loggedInUser } = newDelivery;

        const buildDelivery = new Delivery({
            title: title || '',
            receiver: receiver || '',
            code,
            address,
            subAddress,
            contact,
            owner: loggedInUser._id,
        });

        const delivery = await Delivery.create(buildDelivery);

        await userService.addUserDelivery(loggedInUser._id, delivery._id);
        return delivery;
    }

    static async findAllDeliveriesByOwner(userId) {
        return await Delivery.find({ owner: userId });
    }

    static async findDeliveryById(_id) {
        return await Delivery.findById(_id);
    }

    static async modifyDelivery(deliveryId, newDelivery) {
        const { contact, code, address, subAddress } = newDelivery;
        await Delivery.updateOne(
            { _id: deliveryId },
            {
                code: code,
                address: address,
                subAddress: subAddress,
                contact: contact,
            }
        );
        return Delivery.findById(deliveryId);
    }

    static async changeAddress(userId, newAddress) {
        const user = User.findById(userId);
        if (!user) {
            throw Object.assign(new Error('유저 ID가 올바르지 않습니다'), { status: 400 });
        }

        return await Delivery.findOneAndUpdate({ owner: userId }, { address: newAddress });
    }
}

module.exports = { deliveryService };
