const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const OrderSchema = new Schema({
    shortId,
    status: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    orderer: {
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
    products: [[{ type: Schema.Types.ObjectId, ref: 'Product' }]],
});

module.exports = OrderSchema;
