import express from "express";

const router = express.Router();

// Mock Virtual Tours seed dataset for demo/fallback mode
const mockTours = [
  {
    id: "tour_skyline_headquarters",
    title: "Skyline Innovation Campus 360°",
    description: "Explore our futuristic multi-story campus featuring state-of-the-art labs, open workspaces, and panoramic aerial views.",
    category: "Commercial Real Estate",
    coverImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
    scenes: [
      {
        id: "aerial_view",
        name: "AERIAL VIEW",
        category: "Campus Aerial",
        thumbnail: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400",
        panorama: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=2000",
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
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
        panorama: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
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
        thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400",
        panorama: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000",
        markers: [
          {
            id: "m_floor2",
            position: { yaw: "-45deg", pitch: "0deg" },
            title: "2ND FLOOR WORKSPACE",
            targetId: "floor_2",
          },
        ],
      },
      {
        id: "floor_2",
        name: "2ND FLOOR",
        category: "Open Office",
        thumbnail: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400",
        panorama: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000",
        markers: [
          {
            id: "m_floor3",
            position: { yaw: "60deg", pitch: "0deg" },
            title: "3RD FLOOR LAB",
            targetId: "floor_3",
          },
        ],
      },
    ],
  },
];

// GET /api/v1/tours - List all 360 virtual tours
router.get("/", (req, res) => {
  try {
    const tourSummaries = mockTours.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      category: t.category,
      coverImage: t.coverImage,
      totalScenes: t.scenes.length,
    }));
    res.json({ success: true, data: tourSummaries });
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
