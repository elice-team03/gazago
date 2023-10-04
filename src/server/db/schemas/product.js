const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const ProductSchema = new Schema(
    {
        shortId,
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
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnailUsrFileName: {
            type: String,
            required: true,
        },
        thumbnailSrvFileName: {
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
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = ProductSchema;
