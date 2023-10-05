const { Schema } = require('mongoose');

const OrderSchema = new Schema(
    {
        orderNumber: {
            type: Number,
            require: true,
        },
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
    },
    {
        timestamps: true,
    }
);

module.exports = OrderSchema;
