import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration supporting frontend connections
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    service: "ViewRoom 360 API Server",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/owner", ownerRoutes);
app.use("/api/v1/admin", adminRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "ViewRoom 360° Backend Engine",
    version: "1.0.0",
    docs: "/api/v1/docs",
    endpoints: {
      auth: "/api/v1/auth",
      tours: "/api/v1/tours",
      products: "/api/v1/products",
      ai: "/api/v1/ai/spatial-concierge",
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 ViewRoom 360° Backend Engine running on http://localhost:${PORT}`);
});
