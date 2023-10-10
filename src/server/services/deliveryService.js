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

        return await Delivery.create(buildDelivery);
    }

    static async findAllDeliveriesByOwner(userId, skip, limit) {
        return await Delivery.find({ owner: userId }).skip(skip).limit(limit);
    }

    static async findDeliveryById(_id) {
        return await Delivery.findById(_id);
    }
    static async getTotaldeliveriesCount(userId) {
        return await Delivery.countDocuments({ owner: userId }).exec();
    }
    static async modifyDelivery(deliveryId, newDelivery) {
        const { contact, code, address, subAddress } = newDelivery;

    static async removeDelivery(_id) {
        return await Delivery.findByIdAndDelete(_id);
    }

    static async findDeliveryAndUpdate(changedDelivery) {
        const { contact, code, address, subAddress, id } = changedDelivery;
        await Delivery.updateOne(
            { _id: id },
            {
                contact: contact,
                code: code,
                address: address,
                subAddress: subAddress,
            }
        );

        return await Delivery.findOne({ id });

        return updatedDelivery;
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
