const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const UserSchema = new Schema({
    shortId,
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
        ref: 'delivery',
        index: true,
    },
    wishLists: [{ type: Schema.Types.ObjectId, ref: 'product' }],
});

module.exports = UserSchema;
