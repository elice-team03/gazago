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

        await userService.addUserDelivery(loggedInUser._id, delivery._id);

        return delivery;
    }

    static async findAllDeliveriesByOwner(userId) {
        return await Delivery.find({ owner: userId });
    }

    static async findDeliveryById(_id) {
        return await Delivery.findById(_id);
    }
    static async getTotaldeliveriesCount(userId) {
<<<<<<< HEAD
        const deliveries = await Delivery.find({ owner: userId }).exec();

=======
        return await Delivery.countDocuments({ owner: userId }).exec();
    }
>>>>>>> 6fd42b7 (feature: 페이지네이션 필요한 목록 조회 API에 페이지네이션 기능 추가)
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
