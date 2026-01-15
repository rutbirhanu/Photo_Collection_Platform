const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        // const authHeader = req.headers.authorization;
        // const token = authHeader?.split(" ")[1];
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json("unauthorized")
        }
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json("unauthorized")
            }
            req.user = decoded
            next()
        })

    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;