const mongoose = require('mongoose');
const ProductSchema = require('./schemas/product');
const UserSchema = require('./Schemas/User');
const DeliverySchema = require('./Schemas/Delivery');

exports.Product = mongoose.model('Product', ProductSchema);
exports.User = mongoose.model('User', UserSchema);
exports.Delivery = mongoose.model('Delivery', DeliverySchema);
