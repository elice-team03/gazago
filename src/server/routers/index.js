var express = require('express');
const User = require('../db/Schemas/User');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('change');
    res.json({ result: 'index' });
});

router.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.create({ email });
    res.json({ user: user });
});
module.exports = router;
