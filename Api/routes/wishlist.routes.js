const express = require("express");
const router = express.Router();
const User = require("../models/user.model"); // Assuming you have a User model

// ✅ Fetch wishlist with full product details
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ wishlist: user.wishlist }); // Now sending full product details
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Route to add a product to the wishlist
router.post("/addToWishlist", async (req, res) => {
    const { userId, productId} = req.body;
    if (!userId || !productId  ) {
        return res.status(400).json({ message: "User ID, Product ID and Category are required" });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the product is already in the wishlist
        const alreadyInWishlist = user.wishlist.some(item => item.productId.toString() === productId);
        if (alreadyInWishlist) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
        // Add product to wishlist
        user.wishlist.push({ productId });
        await user.save();
        res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route to remove a product from the wishlist
router.delete("/removeFromWishlist", async (req, res) => {
    const { userId, productId } = req.body;
    if (!userId || !productId ) {
        return res.status(400).json({ message: "User ID and Product ID are required" });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Remove the product from the wishlist
        user.wishlist = user.wishlist.filter(item => item.productId.toString() !== productId);
        await user.save();
        res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;


