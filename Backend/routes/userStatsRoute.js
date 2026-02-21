const router = require("express").Router();
const { getUserStats } = require("../controllers/userStatsController");
const verifyToken = require("../middleware/auth");

// Get user statistics (protected)
router.get("/user-stats", verifyToken, getUserStats);

module.exports = router;
