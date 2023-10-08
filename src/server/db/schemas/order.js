const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const OrderSchema = new Schema(
    {
        orderNumber: shortId,
        status: {
            type: String,
            default: '주문접수',
        },
        comment: {
            type: String,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        orderUserId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        delivery: {
            type: Schema.Types.ObjectId,
            ref: 'Delivery',
            required: true,
            index: true,
        },
        products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    },
    {
        timestamps: true,
    }
);

module.exports = OrderSchema;
