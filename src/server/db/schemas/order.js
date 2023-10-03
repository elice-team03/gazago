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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true,
    },
    delivery: {
        type: Schema.Types.ObjectId,
        ref: 'delivery',
        required: true,
        index: true,
    },
    products: [[{ type: Schema.Types.ObjectId, ref: 'product' }]],
});

module.exports = OrderSchema;
