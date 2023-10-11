const { Schema } = require('mongoose');

const DeliverySchema = new Schema(
    {
        title: {
            type: String,
        },
        receiver: {
            type: String,
        },
        code: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        subAddress: {
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
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = DeliverySchema;
