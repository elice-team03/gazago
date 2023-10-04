const express = require('express');
const asyncHandler = require('../utils/async-handler');
const { userService } = require('../services/userService');

const router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({ result: 'index' });
});

router.post(
    '/register',
    asyncHandler(async (req, res, next) => {
        const newUser = req.body;
        const result = await userService.signUpUser(newUser);
        res.status(201).json({
            code: 201,
            message: '회원가입이 완료되었습니다.',
            data: result,
        });
    })
);

module.exports = router;
