const { Delivery } = require('../db');
const { sendEmail } = require('../utils/send-email');
const { userService } = require('./userService');

class deliveryService {
    static async addDelivery(newDelivery) {
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

        const updatedDelivery = await Delivery.findByIdAndUpdate(
            deliveryId,
            {
                code,
                address,
                subAddress,
                contact,
            },
            { new: true }
        );
        const delivery = await Delivery.findById(deliveryId);
        const user = await userService.findUserById(delivery.owner);
        const email = user.email;

        await sendEmail('changeDelivery', email, newDelivery);

        if (!updatedDelivery) {
            const error = new Error('배송 정보를 찾을 수 없습니다.');
            error.status = 404;
            throw error;
        }

        return updatedDelivery;
    }
}

module.exports = { deliveryService };
