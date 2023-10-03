const express = require('express');
const { User } = require('../db');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({ result: 'index' });
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.create({ email });
    res.json({ user: user });
});
module.exports = router;
