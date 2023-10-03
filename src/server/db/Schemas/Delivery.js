const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const DeliverySchema = new Schema({
    shortId,
    title: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    subcontact: {
        type: Number,
    },
    defaultYn: {
        type: Boolean,
    },
});

module.exports = DeliverySchema;
