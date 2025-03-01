const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    review: { type: String, required: true },
    author: { type: String, default: "Unknown" },
});

const electronicsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subcategory:{ type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, required: true },
    images: [String],
    rating: { type: Number },
    discount: { type: String },
    reviews: [reviewSchema]
});

module.exports = mongoose.model("Electronic", electronicsSchema);
