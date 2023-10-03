const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const CategorySchema = new Schema({
    shortId,
    useYn: {
        type: Boolean,
        required: true,
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
