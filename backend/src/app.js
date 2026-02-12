const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");
const { handleStripeWebhook } = require("./controllers/payments.controller");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const companyRoutes = require("./routes/companies.routes");
const serviceRoutes = require("./routes/services.routes");
const bookingRoutes = require("./routes/bookings.routes");
const paymentRoutes = require("./routes/payments.routes");
const reviewRoutes = require("./routes/reviews.routes");
const categoryRoutes = require("./routes/category.routes");
const serviceTypeRoutes = require("./routes/serviceType.routes");
const staffRoutes= require("./routes/staff.routes")

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // allow only your frontend
  credentials: true, // allow cookies
};

// Handle BigInt serialization in JSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Security middleware
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));

// Stripe webhook MUST be defined before any body parsers
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/staff', staffRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/service-types", serviceTypeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
