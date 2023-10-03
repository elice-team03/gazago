const { Schema } = require('mongoose');
const shortId = require('./Schemas_tmp/types/short-id');

const CategorySchema = new Schema({
    shortId,
    use: {
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
