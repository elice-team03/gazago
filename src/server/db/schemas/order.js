const { Schema } = require('mongoose');
const shortId = require('./types/short-id');
const ProductSchema = require('./product');

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
    products: [ProductSchema],
    // delivery: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Delivery',
    //     required: true,
    //     index: true,
    // },
});

module.exports = OrderSchema;
