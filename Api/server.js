require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');
const clothingRoute = require("./routes/clothing.routes");
const electronicsRoute = require("./routes/electronics.routes");
const ProductDetailRoute = require("./routes/ProductDetail.routes");
const userRoute = require("./routes/user.routes");
const cookieParser = require('cookie-parser');
const WishlistRoute = require('./routes/wishlist.routes');
const bagRoute = require('./routes/Bag.routes');
const authMiddleware = require("./Middle-ware/authMiddleware");
const orderRoute = require('./routes/Payment.routes');

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, 
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Connection error:", err));

app.use("/clothing", clothingRoute);
app.use("/electronics", electronicsRoute);
app.use("/user", userRoute);
app.use("/product", ProductDetailRoute);
app.use("/wishlist", WishlistRoute);
app.use("/bag", bagRoute);
app.use('/order', orderRoute);

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;