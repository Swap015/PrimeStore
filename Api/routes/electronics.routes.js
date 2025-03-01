const express = require("express");
const router = express.Router();
const Electronics = require("../models/Electronics.model");

// Get all electronics
router.get("/", async (req, res) => {
    try {
        const electronics = await Electronics.find();
        res.status(200).json(electronics);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch electronics" });
    }
});

router.get("/id/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const electronics = await Electronics.findById(_id);
        res.status(200).json(electronics);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch electronics" });
    }
})

// Get specific electronic categories
router.get("/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Electronics.find({ category });
        if (!products.length) {
            return res.status(404).json({ error: `No products found in category: ${category}` });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch electronic products" });
    }
});

router.get("/:category/:subcategory", async (req, res) => {
    const { category, subcategory } = req.params;
    try {
        const electronics = await Electronics.find({ category, subcategory });
        res.status(200).json(electronics);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch electronics products" });
    }
})

module.exports = router;
