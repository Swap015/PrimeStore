require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user.model")
const jwt = require("jsonwebtoken");

router.post("/refresh-token", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
    }
    try {
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }
        jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        // Generate a new access token
        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const newRefreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        user.refreshToken = newRefreshToken;
        await user.save();
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 60d days
        });

        return res.status(200).json({ message: "Token refreshed successfully" });
    } catch (error) {
        console.error("Error during token refresh:", error);
        res.status(403).json({ error: "Invalid refresh token" });
    }
});

