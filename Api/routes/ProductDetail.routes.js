const express = require("express");
const router = express.Router();
const Clothing = require("../models/Clothing.model");
const Electronics = require("../models/Electronics.model");

// Map categories to their respective models
const categoryModels = {
    clothing: Clothing,
    electronics: Electronics,
};

// Search across multiple collections
router.get("/search", async (req, res) => {
    try {
        const { name, subcategory, category, minPrice, maxPrice, brand, gender } = req.query;

        let searchFilters = {};
        if (name) searchFilters.name = { $regex: name, $options: "i" };
        if (category) searchFilters.category = { $regex: category, $options: "i" };
        if (subcategory) searchFilters.subcategory = { $regex: subcategory, $options: "i" };
        if (gender) searchFilters.subcategory = { $regex: gender, $options: "i" }
        if (brand) searchFilters.brand = { $regex: brand, $options: "i" };
        if (minPrice || maxPrice) {
            searchFilters.price = {};
            if (!isNaN(parseFloat(minPrice))) searchFilters.price.$gte = parseFloat(minPrice);
            if (!isNaN(parseFloat(maxPrice))) searchFilters.price.$lte = parseFloat(maxPrice);
        }
        let results = [];
        for (const category in categoryModels) {
            const Model = categoryModels[category];
            const data = await Model.find(searchFilters);
            results = [...results, ...data];
        }
        res.status(200).json(results);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ error: "Failed to fetch search results" });
    }
});

// Fetch product by category and ID
router.get("/:category/:_id", async (req, res) => {
    const { category, _id } = req.params;
    try {
        const Model = categoryModels[category.toLowerCase()]; // Dynamically get the model based on category
        if (!Model) {
            return res.status(400).json({ error: "Invalid category specified" });
        }
        const product = await Model.findById(_id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product details" });
    }
});

router.get("/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        let product = null;
        let categoryFound = null;
        // Check each model for the product ID
        for (const category in categoryModels) {
            const Model = categoryModels[category];
            product = await Model.findById(_id);
            if (product) {
                categoryFound = category;
                break;
            }
        }
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ ...product.toObject(), category: categoryFound });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product details" });
    }
});


module.exports = router;
