const { Schema } = require('mongoose');
// const shortId = require('../../utils/nanoid');
// 경로 에러 때문에 잠시 주석처리 하겠습니다
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
