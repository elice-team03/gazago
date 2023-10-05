const { Schema } = require('mongoose');

const OrderSchema = new Schema(
    {
        status: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = OrderSchema;
