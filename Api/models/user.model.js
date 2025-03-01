const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    refreshToken: [{ type: String }],
    wishlist: [{
        productId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }],
    bag: [{
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, default: 1 },
        size: { type: String, default: null }
    }],
    order: [{
        products: [{
            productId: { type: mongoose.Schema.Types.ObjectId, required: true },
            quantity: { type: Number, default: 1 },
            size: { type: String, default: null },
            //name: { type: String, required: true }
        }],
        totalPrice: { type: Number, required: true },
        orderDate: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
