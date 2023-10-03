const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema(
    {
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
        isDefault: {
            type: Bullean,
        },
    },
    {
        collections: 'Delivery',
    }
);

module.exports = DeliverySchema;
