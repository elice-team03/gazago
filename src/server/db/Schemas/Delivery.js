const { Schema } = require('mongoose');

const DeliverySchema = new Schema(
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
        defaultYn: {
            type: Boolean,
        },
    },
    {
        collection: 'Delivery',
    }
);

module.exports = DeliverySchema;
