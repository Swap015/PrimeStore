const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review: { type: String, required: true },
    author: { type: String, default: "Unknown" },
});

const clothingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: Number, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    description: { type: String },
    gender: { type: String },
    price: { type: Number, required: true },
    images: [String],
    brand: { type: String },
    stock: { type: Number },
    rating: { type: Number, required: true },
    discount: { type: String, required: true },
    reviews: [reviewSchema],
    size: [String]
});

module.exports = mongoose.model("Clothing", clothingSchema);
