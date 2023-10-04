const express = require('express');
const router = express.Router();
const { Product } = require('../db');

router.get('/', function (req, res, next) {
    res.json({ result: 'products' });
});

module.exports = router;
