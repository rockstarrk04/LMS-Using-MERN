require("dotenv").config();
const app = require("./app.js"); // Ensure .js extension for consistency
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
