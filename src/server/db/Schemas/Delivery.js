const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema(
    {
        address: { type: String, required: true },
        destination: { type: String, required: true },
        postCode: { type: Number, required: true },
        mainPhone: { type: Number, required: true },
        subPhone: { type: Number },
        isDefault: { type: Bullean },
    },
    {
        collections: 'Delivery',
    }
);

const Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delivery;
