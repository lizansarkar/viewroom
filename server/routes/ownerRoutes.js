import express from "express";

const router = express.Router();

// Mock Owner KPI stats & tours data fallback
let mockOwnerTours = [
  {
    id: "tour_skyline_headquarters",
    title: "Skyline Innovation Campus 360°",
    description: "Explore our futuristic multi-story campus featuring state-of-the-art labs, open workspaces, and panoramic aerial views.",
    category: "Commercial Real Estate",
    price: "$4,500,000",
    coverImage: "/panoramas/panorama_aerial.jpg",
    isPublished: true,
    viewsCount: 1420,
    scenes: [
      {
        id: "aerial_view",
        name: "AERIAL VIEW",
        floorLevel: "Campus Aerial",
        thumbnailUrl: "/panoramas/panorama_aerial.jpg",
        panoramaUrl: "/panoramas/panorama_aerial.jpg",
        hotspots: [
          { id: "hp1", yaw: "0deg", pitch: "-15deg", title: "Main Entrance", targetId: "entrance" },
        ],
      },
      {
        id: "entrance",
        name: "ENTRANCE",
        floorLevel: "Main Building",
        thumbnailUrl: "/panoramas/panorama_entrance.jpg",
        panoramaUrl: "/panoramas/panorama_entrance.jpg",
        hotspots: [
          { id: "hp2", yaw: "30deg", pitch: "-5deg", title: "1ST FLOOR LOBBY", targetId: "floor_1" },
        ],
      },
      {
        id: "floor_1",
        name: "1ST FLOOR",
        floorLevel: "Reception Lobby",
        thumbnailUrl: "/panoramas/panorama_floor1.jpg",
        panoramaUrl: "/panoramas/panorama_floor1.jpg",
        hotspots: [],
      },
    ],
  },
];

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
    const totalTours = mockOwnerTours.length;
    const totalProducts = mockOwnerProducts.length;
    const totalViews = mockOwnerTours.reduce((acc, t) => acc + (t.viewsCount || 0), 0) + 890;
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
    res.json({ success: true, data: mockOwnerTours });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/owner/tours - Create a new 360 Virtual Tour
router.post("/tours", (req, res) => {
  try {
    const { title, description, category, price, coverImage } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const newTour = {
      id: `tour_${Date.now()}`,
      title,
      description: description || "",
      category: category || "General",
      price: price || "Free",
      coverImage: coverImage || "/panoramas/panorama_aerial.jpg",
      isPublished: true,
      viewsCount: 0,
      scenes: [],
    };

    mockOwnerTours.unshift(newTour);
    res.status(201).json({ success: true, data: newTour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/owner/tours/:id/scenes - Add an 8K equirectangular scene to a tour
router.post("/tours/:id/scenes", (req, res) => {
  try {
    const tour = mockOwnerTours.find((t) => t.id === req.params.id);
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
    const tour = mockOwnerTours.find((t) => t.id === req.params.tourId);
    if (!tour) return res.status(404).json({ success: false, error: "Tour not found" });

    const scene = tour.scenes.find((s) => s.id === req.params.sceneId);
    if (!scene) return res.status(404).json({ success: false, error: "Scene not found" });

    const { pitch, yaw, title, targetId } = req.body;
    const newHotspot = {
      id: `hp_${Date.now()}`,
      pitch: pitch || "0deg",
      yaw: yaw || "0deg",
      title: title || "New Marker",
      targetId: targetId || null,
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
    const index = mockOwnerTours.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, error: "Tour not found" });

    mockOwnerTours.splice(index, 1);
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
