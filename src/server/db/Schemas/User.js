const mongoose = require('mongoose');
const shortId = require('../../utils/nanoid');

const UserSchema = new mongoose.Schema(
    {
        shortId,
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        role: { type: String, default: 'user' },
        defaultAdress: { type: String },
        wishLists: [{ type: mongoose.Schema.Types.ObjectId, refer: 'Product' }],
        deliveries: [{ type: mongoose.Schema.Types.ObjectId, refer: 'Delivery' }],
        defaultDelivery: { type: mongoose.Schema.Types.ObjectId, refer: 'Delivery' },
    },
    {
        collection: 'User',
    }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
