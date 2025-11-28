// backend/src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  toggleBlockUser,
  getAllCourses,
  deleteCourse,
} = require("../controllers/adminController");

const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// All /api/admin routes are admin-only
router.use(protect, allowRoles("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleBlockUser);

router.get("/courses", getAllCourses);
router.delete("/courses/:id", deleteCourse);

module.exports = router;
