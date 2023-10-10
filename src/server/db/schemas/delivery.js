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
        //상세주소
        subAddress: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        subcontact: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
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
