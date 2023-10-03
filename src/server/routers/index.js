var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('change');
    res.json({ result: 'index' });
});

module.exports = router;
