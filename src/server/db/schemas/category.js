const { Schema } = require('mongoose');

const CategorySchema = new Schema({
    useYn: {
        type: Boolean,
        default: true,
    },
    depth: {
        type: Number,
        default: 0,
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
});

module.exports = CategorySchema;
