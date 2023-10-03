const { Schema } = require('mongoose');
const shortId = require('./types/short-id');
const CategorySchema = require('./category');

const ProductSchema = new Schema(
    {
        shortId,
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        categories: [CategorySchema],
    },
    {
        timestamps: true,
    }
);

module.exports = ProductSchema;
