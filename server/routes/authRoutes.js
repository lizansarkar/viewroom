import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "viewroom_jwt_secret_key";

// In-Memory mock storage for demo mode when database is not connected
const mockUsers = [];

// POST /api/v1/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const user = {
      id: `usr_${Date.now()}`,
      email,
      name: name || email.split("@")[0],
      role: "CLIENT",
      createdAt: new Date().toISOString(),
    };

    mockUsers.push({ ...user, passwordHash });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registration successful",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingUser = mockUsers.find((u) => u.email === email);
    const user = existingUser || {
      id: `usr_${Date.now()}`,
      email,
      name: email.split("@")[0],
      role: "CLIENT",
    };

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/auth/me
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
