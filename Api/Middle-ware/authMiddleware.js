const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user; // Add user info to request object
        next();
    });
};

module.exports = authenticateToken;
