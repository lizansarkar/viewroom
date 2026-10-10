import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";

import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { initTourSockets } from "./sockets/tourSocket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Express Gzip/Brotli response payload compression
app.use(compression());

// CORS configuration supporting frontend connections (Localhost, Custom Domain, & Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production" ||
        allowedOrigins.some((o) => origin.startsWith(o)) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Express JSON & URLencoded payload limit set to 100MB for 8K equirectangular 360 panoramas
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Serve static uploaded 360 images
app.use("/uploads", express.static("uploads"));

// Performance Cache-Control Header Middleware for API responses
app.use((req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
  } else {
    res.set("Cache-Control", "no-store");
  }
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    service: "ViewRoom 360 API Server with Socket.io Realtime Engine",
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
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/upload", uploadRoutes);

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

// Initialize Socket.io real-time engine
initTourSockets(server);

server.listen(PORT, () => {
  console.log(`🚀 ViewRoom 360° Backend & Socket.io Engine running on http://localhost:${PORT}`);
});

