const { Schema } = require('mongoose');

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnailPath: {
            type: String,
            required: true,
        },
        contentUsrFileName: {
            type: String,
            required: true,
        },
        contentSrvFileName: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: '판매중',
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        totalSales: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = ProductSchema;
