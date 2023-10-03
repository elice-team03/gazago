const express = require('express');
const router = express.Router();
const { Category } = require('../db');

router.get('/', function (req, res, next) {
    res.json({ result: 'categories' });
});

module.exports = router;
