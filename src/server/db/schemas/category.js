const { Schema } = require('mongoose');

const CategorySchema = new Schema(
    {
        useYn: {
            type: Boolean,
            default: true,
        },
        depth: {
            type: Number,
            default: 1,
        },
        name: {
            type: String,
            required: true,
        },
        parentCategory: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = CategorySchema;
