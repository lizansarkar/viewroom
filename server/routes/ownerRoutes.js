import express from "express";
import { toursStore, addTour, getTourById, deleteTour } from "../data/toursData.js";

const router = express.Router();

let mockOwnerProducts = [
  {
    id: "prod_aero_chair",
    title: "Ergonomic Spatial Chair X1",
    category: "Modern Furniture",
    price: 499,
    viewsCount: 890,
    spinFramesCount: 36,
    coverFrame: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
  },
];

// GET /api/v1/owner/stats - Fetch owner KPI overview metrics
router.get("/stats", (req, res) => {
  try {
    const totalTours = toursStore.length;
    const totalProducts = mockOwnerProducts.length;
    const totalViews = toursStore.reduce((acc, t) => acc + (t.viewsCount || 0), 0) + 890;
    const aiConversations = 124;

    res.json({
      success: true,
      data: {
        totalTours,
        totalProducts,
        totalViews,
        aiConversations,
        engagementRate: "94.2%",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/owner/tours - Fetch all tours belonging to the owner
router.get("/tours", (req, res) => {
  try {
    res.json({ success: true, data: toursStore });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/owner/tours - Create a new 360 Virtual Tour
router.post("/tours", (req, res) => {
  try {
    const { id, title, description, category, price, coverImage, scenes } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const newTour = {
      id: id || `tour_${Date.now()}`,
      title,
      description: description || "",
      category: category || "General",
      price: price || "Free",
      coverImage: coverImage || "/panoramas/panorama_aerial.jpg",
      isPublished: true,
      viewsCount: 0,
      scenes: scenes || [],
    };

    addTour(newTour);
    res.status(201).json({ success: true, data: newTour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/owner/tours/:id/scenes - Add an 8K equirectangular scene to a tour
router.post("/tours/:id/scenes", (req, res) => {
  try {
    const tour = getTourById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, error: "Tour not found" });
    }

    const { name, floorLevel, panoramaUrl, thumbnailUrl } = req.body;
    const newScene = {
      id: `scene_${Date.now()}`,
      name: name || "New Room Scene",
      floorLevel: floorLevel || "Interior",
      panoramaUrl: panoramaUrl || "/panoramas/panorama_aerial.jpg",
      thumbnailUrl: thumbnailUrl || panoramaUrl || "/panoramas/panorama_aerial.jpg",
      panorama: panoramaUrl || "/panoramas/panorama_aerial.jpg",
      thumbnail: thumbnailUrl || panoramaUrl || "/panoramas/panorama_aerial.jpg",
      hotspots: [],
    };

    tour.scenes.push(newScene);
    res.status(201).json({ success: true, data: newScene });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/owner/tours/:tourId/scenes/:sceneId/hotspots - Save pitch/yaw hotspot coordinates
router.post("/tours/:tourId/scenes/:sceneId/hotspots", (req, res) => {
  try {
    const tour = getTourById(req.params.tourId);
    if (!tour) return res.status(404).json({ success: false, error: "Tour not found" });

    const scene = tour.scenes.find((s) => s.id === req.params.sceneId);
    if (!scene) return res.status(404).json({ success: false, error: "Scene not found" });

    const { pitch, yaw, title, targetId, type } = req.body;
    const newHotspot = {
      id: `hp_${Date.now()}`,
      pitch: pitch || "0deg",
      yaw: yaw || "0deg",
      title: title || "New Marker",
      targetId: targetId || null,
      type: type || "arrow",
    };

    scene.hotspots.push(newHotspot);
    res.status(201).json({ success: true, data: newHotspot });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/owner/tours/:id - Delete tour
router.delete("/tours/:id", (req, res) => {
  try {
    const deleted = deleteTour(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Tour not found" });

    res.json({ success: true, message: "Tour deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/owner/promote - 1-click user promotion to CREATOR role
router.post("/promote", (req, res) => {
  try {
    res.json({
      success: true,
      message: "Account upgraded to CREATOR role successfully",
      role: "CREATOR",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
