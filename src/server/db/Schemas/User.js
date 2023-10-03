const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const UserSchema = new Schema(
    {
        // shortId,
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        role: {
            type: String,
            default: 'user',
        },
        defaultAdress: {
            type: String,
        },
        wishLists: [{ type: Schema.Types.ObjectId, refer: 'Product' }],
        deliveries: [{ type: Schema.Types.ObjectId, refer: 'Delivery' }],
        defaultDelivery: { type: Schema.Types.ObjectId, refer: 'Delivery' },
    },
    {
        collection: 'User',
    }
);
module.exports = UserSchema;
