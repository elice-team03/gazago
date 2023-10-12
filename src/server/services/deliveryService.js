const { Delivery } = require('../db');
const { sendEmail } = require('../utils/send-email');
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
        const delivery = await Delivery.findById(deliveryId);
        const user = await userService.findUserById(delivery.owner);
        const email = user.email;

        sendEmail('changeDelivery', email, newDelivery);

        return delivery;
    }
}

module.exports = { deliveryService };
