const { Delivery, User, Order } = require('../db');
const { userService } = require('./userService');

class deliveryService {
    static async addDeliveryAndSetUserDelivery(newDelivery) {
        const { title, receiver, code, address, subAddress, contact, loggedInUser } = newDelivery;

        const buildDelivery = new Delivery({
            title: title || '',
            receiver,
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
        const { contact, code, address, subAddress, deliveryId } = changedDelivery;
        await Delivery.updateOne(
            { _id: deliveryId },
            {
                contact: contact,
                code: code,
                address: address,
                subAddress: subAddress,
            }
        );

        return await Delivery.findById({ _id: deliveryId });

        //
    }

    static async changeAddress(userData) {
        const { orderId, code, newAddress, newSubAddress } = userData;
        console.log(orderId);

        const order = await Order.findById({ _id: orderId });
        const deliveryId = order.delivery;

        await Delivery.updateOne(
            { _id: deliveryId },
            {
                code: code,
                address: newAddress,
                subAddress: newSubAddress,
            }
        );

        return await Delivery.findById({ _id: deliveryId });
    }
}
module.exports = { deliveryService };
