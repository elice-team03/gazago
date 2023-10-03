const { Schema } = require('mongoose');
const shortId = require('./types/short-id');
const ProductSchema = require('./product');

const UserSchema = new Schema({
    shortId,
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
    defaultDelivery: {
        type: Schema.Types.ObjectId,
        ref: 'delivery',
        required: true,
        index: true,
    },
    wishLists: [{ type: Schema.Types.ObjectId, ref: 'product' }],
});
module.exports = UserSchema;
