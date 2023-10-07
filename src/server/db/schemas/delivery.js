const { Schema } = require('mongoose');

const DeliverySchema = new Schema(
    {
        title: {
            type: String,
        },
        receiver: {
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
    },
    {
        timestamps: true,
    }
);

module.exports = DeliverySchema;
