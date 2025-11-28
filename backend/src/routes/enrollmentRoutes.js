// backend/src/routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();

const { getMyEnrollments } = require("../controllers/enrollmentController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// GET /api/enrollments/me
router.get("/me", protect, allowRoles("student"), getMyEnrollments);

module.exports = router;
