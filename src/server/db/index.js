const mongoose = require('mongoose');
const ProductSchema = require('./schemas/product');
const UserSchema = require('./schemas/User');
const DeliverySchema = require('./schemas/Delivery');

exports.Product = mongoose.model('Product', ProductSchema);
exports.User = mongoose.model('User', UserSchema);
exports.Delivery = mongoose.model('Delivery', DeliverySchema);
