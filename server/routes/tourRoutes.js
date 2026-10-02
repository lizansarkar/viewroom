import express from "express";
import { toursStore, addTour, getTourById, deleteTour } from "../data/toursData.js";

const router = express.Router();

// GET /api/v1/tours - List all 360 virtual tours with search, category & sortBy support
router.get("/", (req, res) => {
  try {
    const { search, category, sortBy } = req.query;

    let result = [...toursStore];

    // Search filter
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && category !== "ALL" && category !== "All") {
      const catQuery = category.toLowerCase().trim();
      result = result.filter((t) => t.category && t.category.toLowerCase().includes(catQuery));
    }

    // Sorting
    if (sortBy === "popular") {
      result.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
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
      totalScenes: (t.scenes || []).length,
    }));

    res.json({ success: true, count: tourSummaries.length, data: tourSummaries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/tours/:id - Get full 360 tour details by ID
router.get("/:id", (req, res) => {
  try {
    const tour = getTourById(req.params.id) || toursStore[0];
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
