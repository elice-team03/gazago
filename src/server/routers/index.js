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
        const userInform = req.body;
        const result = await userService.signUpUser(userInform);
        res.status(201).json({
            code: 201,
            message: '회원가입이 완료되었습니다.',
            data: result,
        });
    })
);

router.post(
    '/login',
    asyncHandler(async (req, res, next) => {
        const userInform = req.body;
        const result = await userService.signInUser(userInform);
        res.status(200).json({
            code: 200,
            message: '로그인이 완료되었습니다.',
            data: result,
        });
    })
);

module.exports = router;
