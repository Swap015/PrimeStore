require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const authenticate = require("../Middle-ware/authMiddleware")

router.post("/signup", async (req, res) => {
    console.log("Signup Request Body:", req.body);
    const { name, email, password } = req.body;

    const saltRounds = 10;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully " });
    } catch (error) {
        res.status(500).json({ error: "Error signing up the user " });
        console.error("Signup Error:", error);
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
        if (!Array.isArray(user.refreshToken)) {
            user.refreshToken = [];
        }
        user.refreshToken.push(refreshToken);
        await user.save();

        const accessTokenOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        }

        const refreshTokenOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }
        res.status(200).cookie("accessToken", accessToken, accessTokenOptions).cookie("refreshToken", refreshToken, refreshTokenOptions).send({ message: "Login Successful" });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Invalid credentials" });
    }
})

router.post("/logout", async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(400).json({ error: "No token provided" });
    }
    try {
        const user = await User.findOne({ refreshToken });
        const isValid = jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err) => !err);
        if (!isValid || !user) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }
        // Fix: Only remove the specific refresh token from the user's array
        user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);
        await user.save();
        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ error: "An error occurred during logout" });
    }
});

router.get("/check-auth", (req, res) => {
    const { accessToken } = req.cookies;
    if (!accessToken) return res.json({ isAuthenticated: false });

    try {
        jwt.verify(accessToken, process.env.JWT_SECRET);
        res.json({ isAuthenticated: true });
    } catch {
        res.json({ isAuthenticated: false });
    }
});

router.get("/profile", authenticate, async (req, res) => {
    try {
        const userId = req.user.id; // Extracted user ID from the token
        const user = await User.findById(userId); // Fetch user details from DB
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
        console.log(user + "User details fetched successfully");
    } catch (error) {
        res.status(500).json({ error: "Error fetching user details" });
    }
});
module.exports = router;