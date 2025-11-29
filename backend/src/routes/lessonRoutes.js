// backend/src/routes/lessonRoutes.js
const express = require("express");
const router = express.Router();

const Lesson = require("../models/Lesson");
const { getLessonById } = require("../controllers/lessonController");
const { protect } = require("../middlewares/authMiddleware");


// GET /api/lessons/:id
router.get("/:id", protect, getLessonById); // Protect this route

module.exports = router;
