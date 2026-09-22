import express from "express";

const router = express.Router();

// Mock in-memory Admin Users dataset (Syncs with seed data)
let mockAdminUsers = [
  {
    id: "dd08a141-21ce-46ad-9a6b-812a915a8cfe",
    email: "admin@viewroom.com",
    name: "ViewRoom Admin",
    role: "ADMIN",
    createdAt: "2026-09-18T14:00:00.000Z",
  },
  {
    id: "e07c3905-51ce-46ad-9a6b-812a915a8cfd",
    email: "client@viewroom.com",
    name: "John Client",
    role: "CLIENT",
    createdAt: "2026-09-19T10:30:00.000Z",
  },
  {
    id: "creator_demo_user",
    email: "creator@viewroom.com",
    name: "Sarah Studio Creator",
    role: "CREATOR",
    createdAt: "2026-09-20T08:15:00.000Z",
  },
];

let mockAdminTours = [
  {
    id: "tour_skyline_headquarters",
    title: "Skyline Innovation Campus 360°",
    authorEmail: "admin@viewroom.com",
    category: "Commercial Real Estate",
    viewsCount: 1420,
    isPublished: true,
  },
  {
    id: "tour_horizon_villa",
    title: "Horizon Coastal Villa 360°",
    authorEmail: "creator@viewroom.com",
    category: "Residential Villa",
    viewsCount: 890,
    isPublished: true,
  },
];

// GET /api/v1/admin/stats - Admin system statistics & server health
router.get("/stats", (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalUsers: mockAdminUsers.length,
        totalTours: mockAdminTours.length,
        totalViews: 2310,
        serverStatus: "Online (Healthy)",
        databaseEngine: "Neon PostgreSQL",
        geminiAiStatus: "Connected (Gemini 1.5 Flash)",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/admin/users - List all registered users
router.get("/users", (req, res) => {
  try {
    res.json({ success: true, data: mockAdminUsers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/admin/users/:id/role - Admin update user role (CLIENT ↔ CREATOR ↔ ADMIN)
router.put("/users/:id/role", (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["ADMIN", "CREATOR", "CLIENT", "VISITOR"].includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role value" });
    }

    const user = mockAdminUsers.find((u) => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    user.role = role;
    res.json({
      success: true,
      message: `User ${user.email} promoted to ${role}`,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/admin/content - List all platform tours for global moderation
router.get("/content", (req, res) => {
  try {
    res.json({ success: true, data: mockAdminTours });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/admin/tours/:id - Admin global delete tour
router.delete("/tours/:id", (req, res) => {
  try {
    const index = mockAdminTours.findIndex((t) => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Tour not found" });
    }

    mockAdminTours.splice(index, 1);
    res.json({ success: true, message: "Tour deleted platform-wide by Admin" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
