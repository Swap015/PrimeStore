const express = require("express");
const router = express.Router();
const User = require("../models/user.model");


router.get("/:userId", async (req, res) => {

    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("bag");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ bag: user.bag });
    } catch (error) {
        console.error("Error fetching bag details:", error);
        res.status(500).json({ error: "Internal server error in fetching bag details" });
    }
})

router.post("/addToBag", async (req, res) => {
    const { userId, productId, quantity, size } = req.body;
    if (!userId || !productId || !quantity ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };
        const alreadyInBag = user.bag.find(item => item.productId.toString() === productId);
        if (alreadyInBag) {
            alreadyInBag.quantity += quantity;
        }
        else {
            user.bag.push({ productId, quantity, size: size || null });
        }
        await user.save();
        res.status(200).json({ message: "Product added to Bag", bag: user.bag });
    }
    catch (error) {
        console.error("Error adding product to Bag:", error);
        res.status(500).json({ message: "Internal server error in adding product in Bag" });
    }
});

router.delete("/removeFromBag", async (req, res) => {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
        return res.status(400).json({ message: "User ID and Product ID are required" });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.bag = user.bag.filter(item => item.productId.toString() !== productId);
        await user.save();
        res.status(200).json({ message: "Product removed from Bag", bag: user.bag });

    }
    catch (error) {
        console.error("Error removing product from Bag:", error);
        res.status(500).json({ message: "Internal server error in removing product from Bag" });

    }
})

router.put("/updateQuantity", async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
        return res.status(400).json({ message: "User ID, Product ID, and Quantity are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const productInBag = user.bag.find(item => item.productId.toString() === productId);

        if (!productInBag) {
            return res.status(404).json({ message: "Product not found in bag" });
        }

        productInBag.quantity = Math.max(1, productInBag.quantity + quantity); // Ensure minimum quantity is 1

        await user.save();
        res.status(200).json({ message: "Product quantity updated", bag: user.bag });
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({ message: "Internal server error in updating quantity" });
    }
});



router.delete('/clear/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.bag = []; // Clear the bag
        await user.save();
        res.status(200).json({ message: 'Bag cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing bag', error });
    }
});



module.exports = router;