const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const OrderSchema = new Schema({
    orderNumber: shortId,
    status: {
        type: String,
        default: '주문완료',
    },
    comment: {
        type: String,
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
});

module.exports = OrderSchema;
