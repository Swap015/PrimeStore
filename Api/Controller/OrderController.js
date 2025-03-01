// orderController.js
const User = require('../models/user.model');

exports.moveToOrders = async (req, res) => {
    const { userId, products, totalPrice } = req.body;
    if (!userId || !products || !totalPrice) {
        return res.status(400).json({ error: 'Invalid request payload' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Add products to the order array
        user.order.push({
            products,
            totalPrice,
        });
        // Clear the bag
        user.bag = [];
        await user.save();
        res.status(200).json({ message: 'Order placed successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error moving products to orders', error });
    }
};

exports.getUserOrders = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('order');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ orders: user.order });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};