const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
const sequelize = require("./config/database");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api", routes);

// Initialize and test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = app;
