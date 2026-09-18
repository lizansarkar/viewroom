import express from "express";

const router = express.Router();

// Mock Product 360 seed dataset
const mockProducts = [
  {
    id: "prod_aero_chair",
    title: "Ergonomic Spatial Chair X1",
    subtitle: "360° Interactive Product Spin & AR Preview",
    price: 499,
    category: "Modern Furniture",
    rating: 4.9,
    reviewsCount: 128,
    spinFrames: Array.from({ length: 36 }, (_, i) => `https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800&frame=${i + 1}`),
    model3DUrl: "/models/aero_chair.gltf",
    description: "Designed for immersive virtual spatial visualization. High-density breathable mesh, 4D armrests, and dynamic posture calibration.",
    variants: [
      { id: "v1", color: "Matte Black", hex: "#1a1a1a", price: 499 },
      { id: "v2", color: "Cyber Cyan", hex: "#06b6d4", price: 549 },
      { id: "v3", color: "Titanium White", hex: "#f8fafc", price: 529 },
    ],
    hotspots: [
      { id: "hp_lumbar", frameIndex: 4, x: 50, y: 45, title: "Lumbar Support", description: "Adjustable height dynamic spine curve protection" },
      { id: "hp_headrest", frameIndex: 12, x: 48, y: 15, title: "3D Headrest", description: "Multi-angle rotational neck relief" },
    ],
  },
  {
    id: "prod_lunar_lamp",
    title: "Lunar Halo Ambient Light 360",
    subtitle: "Smart 3D Architectural Lighting",
    price: 249,
    category: "Smart Home",
    rating: 4.8,
    reviewsCount: 84,
    spinFrames: Array.from({ length: 36 }, (_, i) => `https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800&frame=${i + 1}`),
    model3DUrl: "/models/lunar_lamp.gltf",
    description: "360° light dispersion with voice control and smart color ambient synchronization.",
    variants: [
      { id: "vl1", color: "Warm Gold", hex: "#eab308", price: 249 },
      { id: "vl2", color: "Obsidian Black", hex: "#0f172a", price: 249 },
    ],
    hotspots: [
      { id: "hp_sensor", frameIndex: 1, x: 52, y: 80, title: "Touch Dimmer Sensor", description: "Capacitive touch brightness slider" },
    ],
  },
];

// GET /api/v1/products - List 360 products
router.get("/", (req, res) => {
  try {
    const list = mockProducts.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      price: p.price,
      category: p.category,
      rating: p.rating,
      coverFrame: p.spinFrames[0],
      variantCount: p.variants.length,
    }));
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/products/:id - Get single product details with spin frames and 3D model
router.get("/:id", (req, res) => {
  try {
    const product = mockProducts.find((p) => p.id === req.params.id) || mockProducts[0];
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/products - Create a 360 product spin
router.post("/", (req, res) => {
  try {
    const { title, price, category, description, spinFrames } = req.body;
    if (!title || !price) {
      return res.status(400).json({ success: false, error: "Title and price are required" });
    }

    const newProduct = {
      id: `prod_${Date.now()}`,
      title,
      subtitle: "360° Product Spin",
      price: Number(price),
      category: category || "General",
      rating: 5.0,
      reviewsCount: 1,
      spinFrames: spinFrames || [],
      description: description || "",
      variants: [],
      hotspots: [],
    };

    mockProducts.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
