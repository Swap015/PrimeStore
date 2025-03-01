require("dotenv").config();
const express = require("express");
const clothing = require("../models/Clothing.model");
const router = express.Router();

//All Clothing Products


router.get("/", async (req, res) => {
    try {
        const products = await clothing.find();
        res.status(200).json(products);
        console.log("Products fetched:", products)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch clothing products" });

    }
});

router.get("/id/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await clothing.findById(_id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch clothing products" });
    }
})


//Clothing by Subcategory
router.get("/:category", async (req, res) => {
    const { category } = req.params;

    try {
        const products = await clothing.find({ category });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this subcategory" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products for this subcategory" });
    }
});



// Get products by category and subcategory
router.get("/:category/:subcategory", async (req, res) => {
    const { category, subcategory } = req.params;

    try {

        const product = await clothing.find({ category, subcategory });
        if (!product || product.length === 0) {
            return res.status(404).json({ message: "No products found for this category and subcategory" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

//by searching
router.get("/search", async (req, res) => {
    const { query } = req.query; // Extract 'query' parameter from the request
    const filter = {};

    if (query) {
        filter.$or = [
            { name: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
            { subcategory: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
        ];
    }

    try {
        const products = await clothing.find(filter); // Perform the search in MongoDB
        res.status(200).json(products); // Return the search results to the client
    } catch (error) {
        console.error("Error fetching search results:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});




module.exports = router;