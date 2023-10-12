const { Schema } = require('mongoose');

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },

        password: {
            type: String,

            required: true,
        },
        role: {
            type: String,
            default: 'user',
        },
        delivery: {
            type: Schema.Types.ObjectId,
            ref: 'Delivery',
            index: true,
        },
        wishList: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
        confirmationToken: {
            type: String,
        },
        confirmationAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = UserSchema;
