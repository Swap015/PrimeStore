require("dotenv").config();
const express = require("express");
const ProductModel = require("../models/Product.model");
const router = express.Router();

//by searching
router.get('/search', async (req, res) => {
    const { name, category, subcategory, minPrice, maxPrice, description, rating, discount, brand } = req.query;
    try {
        let searchCriteria = [];
        if (name) searchCriteria.push({ name: { $regex: name, $options: 'i' } });
        if (category) searchCriteria.push({ category: { $regex: category, $options: 'i' } });
        if (subcategory) searchCriteria.push({ subcategory: { $regex: subcategory, $options: 'i' } });
        if (description) searchCriteria.push({ description: { $regex: description, $options: 'i' } });
        if (brand) searchCriteria.push({ brand: { $regex: brand, $options: 'i' } });
        if (discount) searchCriteria.push({ discount: { $regex: discount, $options: 'i' } });
        if (rating) searchCriteria.push({ rating: { $gte: parseFloat(rating) } });
        if (minPrice || maxPrice) {
            const priceRange = {};
            if (minPrice) priceRange.$gte = parseFloat(minPrice);
            if (maxPrice) priceRange.$lte = parseFloat(maxPrice);
            searchCriteria.push({ price: priceRange });
        }
        // Final MongoDB query using $or for flexible matching
        const products = await ProductModel.find(searchCriteria.length > 0 ? { $or: searchCriteria } : {});
        res.status(200).json(products);
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

//All  Products

router.get("/", async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json(products);
        console.log("Products fetched:", products)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch clothing products" });
    }
});

router.get("/id/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await ProductModel.findById(_id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch clothing products" });
    }
})

router.get("/:category", async (req, res) => {
    const { category } = req.params;

    try {
        const products = await ProductModel.find({ category });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this subcategory" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products for this subcategory" });
    }
});

router.get("/:category/:_id", async (req, res) => {
    const { category, _id } = req.params;

    try {
        const products = await ProductModel.find({ category, _id });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this category" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products for this category" });
    }
});

// Get products by category and subcategory
router.get("/:category/:subcategory", async (req, res) => {
    const { category, subcategory } = req.params;

    try {
        const product = await ProductModel.find({ category, subcategory });
        if (!product || product.length === 0) {
            return res.status(404).json({ message: "No products found for this category and subcategory" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

module.exports = router;