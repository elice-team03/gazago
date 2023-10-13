const { Router } = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.post(
    '/process-payment',
    asyncHandler(async (req, res, next) => {
        const { token, amount } = req.body;

        if (amount < 668) {
            throw Object.assign(new Error('결제 금액이 최소 결제 금액 보다 작습니다.'), { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'krw',
            payment_method_types: ['card'],
            payment_method_data: {
                type: 'card',
                card: {
                    token: token,
                },
            },
            confirm: true,
        });

        res.status(200).json({
            code: 200,
            message: 'Payment was successful',
            data: {
                clientSecret: paymentIntent.client_secret,
            },
        });
    })
);

module.exports = router;
