const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    getDashboard,
    generateReport
} = require("../controllers/dashboardController");

router.get("/", protect, getDashboard);
router.get("/report", protect, generateReport);

module.exports = router;