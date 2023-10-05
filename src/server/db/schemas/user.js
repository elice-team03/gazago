const { Schema } = require('mongoose');

const UserSchema = new Schema({
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
    defaultDelivery: {
        type: Schema.Types.ObjectId,
        ref: 'Delivery',
        index: true,
    },
    wishList: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

module.exports = UserSchema;
