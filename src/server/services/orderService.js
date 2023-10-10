const mongoose = require('mongoose');
const { Order, Delivery, Product } = require('../db');
const { userService } = require('./userService');

class orderService {
    static async addOrder(newOrder) {
        const { comment, totalAmount, loggedInUser, delivery, productIds } = newOrder;
        if (!productIds.every((productId) => mongoose.Types.ObjectId.isValid(productId))) {
            throw Object.assign(new Error('유효하지 않은 상품 ID가 포함되어 있습니다.'), { status: 400 });
        }

        const buildOrder = new Order({
            comment,
            totalAmount,
            orderUserId: loggedInUser._id,
            delivery,
            products: productIds,
        });

        return await Order.create(buildOrder);
    }

    static async findAllOrders(filter, deliveryFilter, skip, limit) {
        const deliveryDocs = await Delivery.find(deliveryFilter, '_id');
        const orderIds = deliveryDocs.map((doc) => doc._id);
        filter.delivery = { $in: orderIds };

        const orders = await Order.find(filter)
            .populate({
                path: 'delivery',
                select: 'receiver',
            })
            .sort({ createdAt: -1 })
            .exec();

        const ordersWithProductQty = orders.map((order) => {
            return {
                ...order.toObject(),
                productQty: order.products.length,
            };
        });

        return ordersWithProductQty;
    }

    static async findProductOrderedCount(productId) {
        const orders = await Order.find({ products: productId });

        let totalSales = 0;
        for (const order of orders) {
            const productCount = order.products.filter((pId) => pId.toString() === productId.toString()).length;
            totalSales += productCount;
        }

        return totalSales;
    }

    static async findOrderWithProducts(_id) {
        const order = await Order.findById(_id).populate('delivery');
        if (!order) {
            throw Object.assign(new Error('주문 내역을 찾을 수 없습니다.'), { status: 400 });
        }
        const productIds = order.products;
        const products = await Product.find({ _id: { $in: productIds } }).populate({
            path: 'category',
            populate: {
                path: 'parentCategory',
            },
        });
        order.products = products;

        return order;
    }

    static async findOrder(_id) {
        return await Order.findById(_id);
    }

    static async getTotalOrdersCount(filter, deliveryFilter) {
        const deliveryDocs = await Delivery.find(deliveryFilter, '_id');
        const orderIds = deliveryDocs.map((doc) => doc._id);
        filter.delivery = { $in: orderIds };

        return await Order.countDocuments(filter).exec();
    }

    static async findOrderWithProducts(_id) {
        const order = await Order.findById(_id).populate('delivery');
        if (!order) {
            throw Object.assign(new Error('주문 내역을 찾을 수 없습니다.'), { status: 400 });
        }
        const productIds = order.products;
        const products = await Product.find({ _id: { $in: productIds } }).populate({
            path: 'category',
            populate: {
                path: 'parentCategory',
            },
        });
        order.products = products;

        return order;
    }

    static async modifyOrderStatus({ _id, status }) {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            const error = new Error('주문 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }

        return await Order.findByIdAndUpdate(
            _id,
            { status: status },
            {
                new: true,
                runValidators: true,
            }
        );
    }
}

module.exports = { orderService };
