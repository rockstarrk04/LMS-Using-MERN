// backend/src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // 👈 Add this line

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Hide password by default
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check password
userSchema.methods.checkPassword = async function (enteredPassword) {
  // The error was here because `bcrypt` was not defined
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;