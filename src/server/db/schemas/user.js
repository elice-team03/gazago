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
<<<<<<< HEAD
        orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
=======
>>>>>>> 634c840 (feat:관리자 카테고리 관리 조회, 등록, 삭제)
    },
    {
        timestamps: true,
    }
);

module.exports = UserSchema;
