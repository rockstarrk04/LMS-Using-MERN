// backend/src/controllers/adminController.js

const User = require("../models/User");
const Course = require("../models/Course");

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) { 
    console.error("getAllUsers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { block } = req.body; // true or false

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !!block;
    await user.save();

    return res.json({
      message: block ? "User blocked" : "User unblocked",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("toggleBlockUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    return res.json({ courses });
  } catch (error) {
    console.error("getAllCourses error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("deleteCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  toggleBlockUser,
  getAllCourses,
  deleteCourse,
};
