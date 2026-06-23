require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const sequelize = require("./config/db");

require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || true
}));

app.use(express.json({
  limit: "1mb"
}));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use("/api/rooms", require("./routes/roomRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/bungalow-admin", require("./routes/bungalowAdminRoutes"));

app.use("/api/calendar", require("./routes/calendarRoutes"));

app.use(
  "/api/users",
  require("./routes/userManagementRoutes")
);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

sequelize.sync()
  .then(() => {
    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });
