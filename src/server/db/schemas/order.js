const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const OrderSchema = new Schema(
    {
        orderNumber: shortId,
        status: {
            type: String,
<<<<<<< HEAD
            default: '주문접수',
=======
            default: '주문완료',
>>>>>>> 634c840 (feat:관리자 카테고리 관리 조회, 등록, 삭제)
        },
        comment: {
            type: String,
            required: true,
        },
<<<<<<< HEAD
        totalAmount: {
            type: Number,
            required: true,
        },
=======
>>>>>>> 634c840 (feat:관리자 카테고리 관리 조회, 등록, 삭제)
        orderUserId: {
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
        products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    },
    {
        timestamps: true,
    }
);

module.exports = OrderSchema;
