const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review: { type: String, required: true },
    author: { type: String, default: "Unknown" },
});


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    price: { type: Number, required: true },
    description: { type: String },
    specifications: { type: mongoose.Schema.Types.Mixed },
    stock: { type: Number, required: true },
    images: [String],
    rating: { type: Number, required: true },
    discount: { type: String },
    reviews: [reviewSchema], // List of reviews
    brand: { type: String },
    size: [String],
    material: { type: String },
    color: [String],
    warranty: { type: String },

}, { timestamps: true }); // Adds createdAt & updatedAt timestamps

module.exports = mongoose.model("Product", productSchema);
