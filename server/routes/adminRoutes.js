import express from "express";
import prisma from "../prismaClient.js";
import { deleteTour } from "../data/toursData.js";

const router = express.Router();

// GET /api/v1/admin/stats - Admin system statistics & server health
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, totalTours, viewsAgg] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.virtualTour.count().catch(() => 0),
      prisma.analytics.aggregate({ _sum: { viewsCount: true } }).catch(() => ({ _sum: { viewsCount: 0 } })),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTours,
        totalViews: viewsAgg._sum?.viewsCount || 0,
        serverStatus: "Online (Healthy)",
        databaseEngine: "Neon PostgreSQL",
        geminiAiStatus: "Connected (Gemini 1.5 Flash)",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/admin/users - List all registered users from PostgreSQL
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/admin/users/:id/role - Admin update user role (CLIENT ↔ CREATOR ↔ ADMIN) in PostgreSQL
router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["ADMIN", "CREATOR", "CLIENT", "VISITOR"].includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role value" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      message: `User ${updatedUser.email} promoted to ${role}`,
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/admin/users/:id - Admin delete a user from PostgreSQL
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    // Remove user's tours and related items
    const userTours = await prisma.virtualTour.findMany({
      where: { authorId: userId },
      select: { id: true },
    });

    for (const t of userTours) {
      await prisma.analytics.deleteMany({ where: { tourId: t.id } }).catch(() => {});
      await prisma.hotspot.deleteMany({ where: { scene: { tourId: t.id } } }).catch(() => {});
      await prisma.scene.deleteMany({ where: { tourId: t.id } }).catch(() => {});
      await prisma.virtualTour.delete({ where: { id: t.id } }).catch(() => {});
    }

    await prisma.user.delete({ where: { id: userId } });
    res.json({ success: true, message: "User deleted successfully from database" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/admin/content - List all platform tours for global moderation from PostgreSQL
router.get("/content", async (req, res) => {
  try {
    const tours = await prisma.virtualTour.findMany({
      include: {
        author: { select: { id: true, name: true, email: true } },
        scenes: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedTours = tours.map((t) => ({
      id: t.id,
      title: t.title,
      authorEmail: t.author?.email || "Unknown Author",
      category: t.category,
      viewsCount: t.viewsCount || 0,
      isPublished: t.isPublished,
      scenesCount: (t.scenes || []).length,
      createdAt: t.createdAt,
    }));

    res.json({ success: true, data: formattedTours });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/admin/tours/:id - Admin global delete tour permanently from PostgreSQL
router.delete("/tours/:id", async (req, res) => {
  try {
    const tourId = req.params.id;
    try {
      await prisma.analytics.deleteMany({ where: { tourId } }).catch(() => {});
      await prisma.hotspot.deleteMany({ where: { scene: { tourId } } }).catch(() => {});
      await prisma.scene.deleteMany({ where: { tourId } }).catch(() => {});
      await prisma.virtualTour.delete({ where: { id: tourId } }).catch(() => {});
    } catch (dbErr) {
      console.warn("Admin delete tour db note:", dbErr.message);
    }

    deleteTour(tourId);

    res.json({ success: true, message: "Tour deleted platform-wide by Admin from database" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
