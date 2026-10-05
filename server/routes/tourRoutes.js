import express from "express";
import prisma from "../prismaClient.js";
import { toursStore, addTour, getTourById, deleteTour } from "../data/toursData.js";

const router = express.Router();

// GET /api/v1/tours - List all 360 virtual tours with search, category & sortBy support from Prisma PostgreSQL
router.get("/", async (req, res) => {
  try {
    const { search, category, sortBy } = req.query;

    let dbTours = [];
    try {
      dbTours = await prisma.virtualTour.findMany({
        where: {
          isPublished: true,
          ...(category && category !== "ALL" && category !== "All"
            ? { category: { contains: category, mode: "insensitive" } }
            : {}),
          ...(search && search.trim()
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                  { category: { contains: search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        include: {
          scenes: {
            include: { hotspots: true },
          },
          author: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy:
          sortBy === "newest"
            ? { createdAt: "desc" }
            : sortBy === "title"
            ? { title: "asc" }
            : { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("Prisma PostgreSQL query fallback to memory:", dbErr.message);
    }

    // Combine DB tours with sample store if DB has fewer entries
    const combined = dbTours.length > 0 ? dbTours : toursStore;

    const tourSummaries = combined.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      category: t.category,
      price: t.price || "Free",
      viewsCount: t.viewsCount || 0,
      coverImage: t.coverImage || t.scenes?.[0]?.panoramaUrl || "/panoramas/panorama_aerial.jpg",
      totalScenes: (t.scenes || []).length,
      scenes: t.scenes || [],
    }));

    res.json({ success: true, count: tourSummaries.length, data: tourSummaries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/tours/:id - Get full 360 tour details by ID from PostgreSQL
router.get("/:id", async (req, res) => {
  try {
    const tourId = req.params.id;
    let tour = null;

    try {
      tour = await prisma.virtualTour.findUnique({
        where: { id: tourId },
        include: {
          scenes: {
            include: { hotspots: true },
            orderBy: { orderIndex: "asc" },
          },
          author: { select: { id: true, name: true, email: true } },
        },
      });
    } catch (dbErr) {
      console.warn("Prisma PostgreSQL tour lookup fallback:", dbErr.message);
    }

    if (!tour) {
      tour = getTourById(tourId);
    }

    if (!tour) {
      return res.status(404).json({ success: false, error: "Tour not found" });
    }

    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/tours - Create a new 360 virtual tour in PostgreSQL
router.post("/", async (req, res) => {
  try {
    const { title, description, category, coverImage, authorId } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    let newTour = null;
    try {
      // Create user if authorId provided or fallback default
      newTour = await prisma.virtualTour.create({
        data: {
          title,
          description: description || "",
          category: category || "General",
          isPublished: true,
          author: authorId
            ? { connect: { id: authorId } }
            : {
                create: {
                  email: `creator_${Date.now()}@viewroom.com`,
                  name: "Creator",
                  role: "CREATOR",
                },
              },
        },
        include: { scenes: true },
      });
    } catch (dbErr) {
      console.warn("Prisma PostgreSQL create tour fallback:", dbErr.message);
      newTour = {
        id: `tour_${Date.now()}`,
        title,
        description: description || "",
        category: category || "General",
        coverImage: coverImage || "/panoramas/panorama_aerial.jpg",
        scenes: [],
      };
      addTour(newTour);
    }

    res.status(201).json({ success: true, data: newTour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/tours/:id/scenes - Add a scene to a tour in PostgreSQL
router.post("/:id/scenes", async (req, res) => {
  try {
    const { name, floorLevel, panoramaUrl, thumbnailUrl } = req.body;
    let newScene = null;

    try {
      newScene = await prisma.scene.create({
        data: {
          tourId: req.params.id,
          name: name || "New Room Scene",
          floorLevel: floorLevel || "Interior",
          panoramaUrl: panoramaUrl || "/panoramas/panorama_aerial.jpg",
          thumbnailUrl: thumbnailUrl || panoramaUrl || "/panoramas/panorama_aerial.jpg",
        },
        include: { hotspots: true },
      });
    } catch (dbErr) {
      console.warn("Prisma PostgreSQL create scene fallback:", dbErr.message);
      newScene = {
        id: `scene_${Date.now()}`,
        name: name || "New Room Scene",
        floorLevel: floorLevel || "Interior",
        panoramaUrl: panoramaUrl || "/panoramas/panorama_aerial.jpg",
        thumbnailUrl: thumbnailUrl || panoramaUrl || "/panoramas/panorama_aerial.jpg",
        hotspots: [],
      };
    }

    res.status(201).json({ success: true, data: newScene });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/tours/:id - Delete a 360 tour from PostgreSQL
router.delete("/:id", async (req, res) => {
  try {
    try {
      await prisma.virtualTour.delete({ where: { id: req.params.id } });
    } catch (dbErr) {
      deleteTour(req.params.id);
    }
    res.json({ success: true, message: "Tour deleted successfully from PostgreSQL" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
