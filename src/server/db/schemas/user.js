const { Schema } = require('mongoose');

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
        },
        password: {
            type: String,
            // TODO: 비회원 주문시 비밀번호 필요여부를 아직 몰라 required: false 해놓겠습니다
            required: false,
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
    },
    {
        timestamps: true,
    }
);

module.exports = UserSchema;
