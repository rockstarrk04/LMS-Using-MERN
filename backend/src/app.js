// backend/src/app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const lessonRoutes = require("./routes/lessonRoutes");



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "LMS API is running 🚀" });
});


app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes); // Corrected import for enrollmentRoutes
app.use("/api/admin", adminRoutes); // Corrected import for adminRoutes
app.use("/api/lessons", lessonRoutes); // Corrected import for lessonRoutes

module.exports = app;
