const { Delivery } = require('../db');

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
        const deliveries = await Delivery.find({ owner: userId }).skip(skip).limit(limit);

        const uniqueAddresses = new Set();
        const uniqueDeliveries = [];

        deliveries.forEach((delivery) => {
            const address = delivery.address;
            if (!uniqueAddresses.has(address)) {
                uniqueAddresses.add(address);
                uniqueDeliveries.push(delivery);
            }
        });

        return uniqueDeliveries;
    }

    static async findDeliveryById(_id) {
        return await Delivery.findById(_id);
    }
    static async getTotaldeliveriesCount(userId) {
        const deliveries = await Delivery.find({ owner: userId }).exec();

        const uniqueAddresses = new Set();

        deliveries.forEach((delivery) => {
            uniqueAddresses.add(delivery.address);
        });

        return uniqueAddresses.size;
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

        if (!updatedDelivery) {
            const error = new Error('배송 정보를 찾을 수 없습니다.');
            error.status = 404;
            throw error;
        }

        return updatedDelivery;
    }
}

module.exports = { deliveryService };
