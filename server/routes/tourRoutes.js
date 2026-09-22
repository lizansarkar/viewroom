import express from "express";

const router = express.Router();

// Mock Virtual Tours seed dataset for demo/fallback mode
const mockTours = [
  {
    id: "tour_skyline_headquarters",
    title: "Skyline Innovation Campus 360°",
    description: "Explore our futuristic multi-story campus featuring state-of-the-art labs, open workspaces, and panoramic aerial views.",
    category: "Commercial Real Estate",
    price: "Free",
    viewsCount: 2450,
    createdAt: "2026-09-01T10:00:00Z",
    coverImage: "/panoramas/panorama_aerial.jpg",
    scenes: [
      {
        id: "aerial_view",
        name: "AERIAL VIEW",
        category: "Campus Aerial",
        thumbnail: "/panoramas/panorama_aerial.jpg",
        panorama: "/panoramas/panorama_aerial.jpg",
        markers: [
          {
            id: "m_entrance",
            position: { yaw: "0deg", pitch: "-15deg" },
            title: "Main Entrance",
            targetId: "entrance",
          },
        ],
      },
      {
        id: "entrance",
        name: "ENTRANCE",
        category: "Main Building",
        thumbnail: "/panoramas/panorama_entrance.jpg",
        panorama: "/panoramas/panorama_entrance.jpg",
        markers: [
          {
            id: "m_floor1",
            position: { yaw: "30deg", pitch: "-5deg" },
            title: "1ST FLOOR LOBBY",
            targetId: "floor_1",
          },
        ],
      },
      {
        id: "floor_1",
        name: "1ST FLOOR",
        category: "Reception Lobby",
        thumbnail: "/panoramas/panorama_floor1.jpg",
        panorama: "/panoramas/panorama_floor1.jpg",
        markers: [
          {
            id: "m_floor2",
            position: { yaw: "-45deg", pitch: "0deg" },
            title: "2ND FLOOR WORKSPACE",
            targetId: "floor_2",
          },
        ],
      },
    ],
  },
  {
    id: "tour_glass_pavilion",
    title: "The Glass Pavilion Penthouse",
    description: "Modern luxury penthouse featuring panoramic city views, minimalist architecture, and automated spatial lighting.",
    category: "Residential",
    price: "Free",
    viewsCount: 1890,
    createdAt: "2026-09-10T14:30:00Z",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    scenes: [
      {
        id: "glass_living",
        name: "PENTHOUSE LIVING",
        category: "Living Room",
        thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
        panorama: "/panoramas/panorama_floor1.jpg",
        markers: [],
      },
    ],
  },
  {
    id: "tour_horizon_villa",
    title: "Horizon Coastal Villa 360°",
    description: "Exclusive oceanfront villa with infinity pool, outdoor lounge, and seamless indoor-outdoor living spaces.",
    category: "Residential",
    price: "Free",
    viewsCount: 3120,
    createdAt: "2026-09-12T09:15:00Z",
    coverImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
    scenes: [
      {
        id: "villa_patio",
        name: "OCEAN PATIO",
        category: "Outdoor",
        thumbnail: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
        panorama: "/panoramas/panorama_aerial.jpg",
        markers: [],
      },
    ],
  },
  {
    id: "tour_metropolitan",
    title: "Metropolitan Luxury Hotel Suite",
    description: "Five-star hotel suite virtual tour with executive dining, spa bathroom, and master suite preview.",
    category: "Hotels",
    price: "Free",
    viewsCount: 4100,
    createdAt: "2026-09-15T18:00:00Z",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    scenes: [
      {
        id: "hotel_suite",
        name: "PRESIDENTIAL SUITE",
        category: "Guest Room",
        thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
        panorama: "/panoramas/panorama_entrance.jpg",
        markers: [],
      },
    ],
  },
  {
    id: "tour_alpine_sanctuary",
    title: "Alpine Mountain Sanctuary",
    description: "Rustic yet ultra-modern mountain lodge featuring floor-to-ceiling timber design and snowline views.",
    category: "Residential",
    price: "Free",
    viewsCount: 1540,
    createdAt: "2026-09-18T11:20:00Z",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    scenes: [
      {
        id: "alpine_greatroom",
        name: "GREAT ROOM",
        category: "Lounge",
        thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
        panorama: "/panoramas/panorama_floor1.jpg",
        markers: [],
      },
    ],
  },
];

// GET /api/v1/tours - List all 360 virtual tours with search, category & sortBy support
router.get("/", (req, res) => {
  try {
    const { search, category, sortBy } = req.query;

    let result = [...mockTours];

    // Search filter
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== "ALL" && category !== "All") {
      const catQuery = category.toLowerCase().trim();
      result = result.filter((t) => t.category.toLowerCase().includes(catQuery));
    }

    // Sorting
    if (sortBy === "popular") {
      result.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    const tourSummaries = result.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      category: t.category,
      price: t.price || "Free",
      viewsCount: t.viewsCount || 0,
      coverImage: t.coverImage,
      totalScenes: t.scenes.length,
    }));

    res.json({ success: true, count: tourSummaries.length, data: tourSummaries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/tours/:id - Get full 360 tour details by ID
router.get("/:id", (req, res) => {
  try {
    const tour = mockTours.find((t) => t.id === req.params.id) || mockTours[0];
    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/tours - Create a new 360 virtual tour
router.post("/", (req, res) => {
  try {
    const { title, description, category, coverImage } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const newTour = {
      id: `tour_${Date.now()}`,
      title,
      description: description || "",
      category: category || "General",
      coverImage: coverImage || "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
      scenes: [],
    };

    mockTours.push(newTour);
    res.status(201).json({ success: true, data: newTour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/tours/:id/scenes - Add a scene to a tour
router.post("/:id/scenes", (req, res) => {
  try {
    const tour = mockTours.find((t) => t.id === req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, error: "Tour not found" });
    }

    const { name, category, panorama, thumbnail } = req.body;
    const newScene = {
      id: `scene_${Date.now()}`,
      name: name || "New Room Scene",
      category: category || "Interior",
      panorama,
      thumbnail: thumbnail || panorama,
      markers: [],
    };

    tour.scenes.push(newScene);
    res.status(201).json({ success: true, data: newScene });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/tours/:id - Delete a 360 tour
router.delete("/:id", (req, res) => {
  try {
    const tourIndex = mockTours.findIndex((t) => t.id === req.params.id);
    if (tourIndex === -1) {
      return res.status(404).json({ success: false, error: "Tour not found" });
    }

    mockTours.splice(tourIndex, 1);
    res.json({ success: true, message: "Tour deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
