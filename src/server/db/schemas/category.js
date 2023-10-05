const { Schema } = require('mongoose');

const CategorySchema = new Schema({
    useYn: {
        type: Boolean,
        default: true,
    },
    sequence: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

module.exports = CategorySchema;
