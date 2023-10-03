const mongoose = require('mongoose');
const ProductSchema = require('./schemas/product');

exports.Product = mongoose.model('Product', ProductSchema);
