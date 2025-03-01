const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const { moveToOrders, getUserOrders } = require('../Controller/OrderController');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
router.post('/create-order', async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise for INR)
        currency: 'INR',
        receipt: `order_rcptid_${Date.now()}`,

    };

    try {
        const order = await razorpayInstance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/move-to-orders', moveToOrders);
router.get('/:userId', getUserOrders);
module.exports = router;