import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fallback seed products for edge cases
const DEFAULT_SPIN_FRAMES = Array.from(
  { length: 36 },
  (_, i) => `https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800&frame=${i + 1}`
);

// GET /api/v1/products - List 360 products with search, category & sorting from Prisma PostgreSQL
router.get("/", async (req, res) => {
  try {
    const { search, category, sortBy } = req.query;

    const where = {};

    if (category && category !== "ALL" && category !== "All") {
      where.category = { contains: category, mode: "insensitive" };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sortBy === "title"
        ? { title: "asc" }
        : { createdAt: "desc" };

    const dbProducts = await prisma.product360.findMany({
      where,
      include: {
        variants: true,
        specHotspots: true,
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy,
    });

    const list = dbProducts.map((p) => {
      const primaryVariant = p.variants[0];
      const coverFrame =
        primaryVariant && primaryVariant.imageSequence && primaryVariant.imageSequence.length > 0
          ? primaryVariant.imageSequence[0]
          : DEFAULT_SPIN_FRAMES[0];

      return {
        id: p.id,
        title: p.title,
        subtitle: "360° Interactive Product Spin",
        price: 499,
        category: p.category,
        rating: 4.9,
        status: p.status,
        model3DUrl: p.model3DUrl || "/models/chair.glb",
        coverFrame,
        spinFrames: primaryVariant?.imageSequence || DEFAULT_SPIN_FRAMES,
        variants: p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          color: v.name,
          hex: v.colorHex,
          accent: v.accentHex,
          price: 499,
        })),
        variantCount: p.variants.length,
        hotspots: p.specHotspots.map((h) => ({
          id: h.id,
          angle: h.angle,
          x: h.xPercent,
          y: h.yPercent,
          title: h.title,
          description: h.description,
        })),
        author: p.author,
        createdAt: p.createdAt,
      };
    });

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch products from database" });
  }
});

// GET /api/v1/products/:id - Get single product details with spin frames and 3D model from PostgreSQL
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product360.findUnique({
      where: { id: req.params.id },
      include: {
        variants: true,
        specHotspots: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const primaryVariant = product.variants[0];
    const spinFrames =
      primaryVariant && primaryVariant.imageSequence && primaryVariant.imageSequence.length > 0
        ? primaryVariant.imageSequence
        : DEFAULT_SPIN_FRAMES;

    const formatted = {
      id: product.id,
      title: product.title,
      subtitle: "360° Interactive Product Spin & AR Preview",
      price: 499,
      category: product.category,
      rating: 4.9,
      reviewsCount: 128,
      status: product.status,
      model3DUrl: product.model3DUrl || "/models/chair.glb",
      coverFrame: spinFrames[0],
      spinFrames,
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        color: v.name,
        hex: v.colorHex,
        accent: v.accentHex,
        price: 499,
        imageSequence: v.imageSequence,
      })),
      hotspots: product.specHotspots.map((h) => ({
        id: h.id,
        frameIndex: Math.round(h.angle / 10),
        angle: h.angle,
        x: h.xPercent,
        y: h.yPercent,
        title: h.title,
        description: h.description,
      })),
      author: product.author,
      createdAt: product.createdAt,
    };

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("Fetch product by ID error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch product details" });
  }
});

// POST /api/v1/products - Create a new 360 product spin in PostgreSQL (Protected: CREATOR / ADMIN)
router.post("/", verifyToken, requireRole("CREATOR", "ADMIN"), async (req, res) => {
  try {
    const { title, category, model3DUrl, spinFrames, variants = [] } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const framesToSave = Array.isArray(spinFrames) && spinFrames.length > 0
      ? spinFrames
      : DEFAULT_SPIN_FRAMES;

    const newProduct = await prisma.product360.create({
      data: {
        title,
        category: category || "General",
        status: "Studio Ready",
        model3DUrl: model3DUrl || "/models/chair.glb",
        authorId: req.user.id,
        variants: {
          create: variants.length > 0
            ? variants.map((v) => ({
                name: v.name || "Default Variant",
                colorHex: v.hex || v.colorHex || "#1a1a1a",
                accentHex: v.accent || v.accentHex || "#3b82f6",
                imageSequence: framesToSave,
              }))
            : [
                {
                  name: "Default Variant",
                  colorHex: "#1a1a1a",
                  accentHex: "#3b82f6",
                  imageSequence: framesToSave,
                },
              ],
        },
      },
      include: {
        variants: true,
        specHotspots: true,
      },
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ success: false, error: "Failed to create product in database" });
  }
});

// DELETE /api/v1/products/:id - Delete a 360 product from PostgreSQL (Protected: CREATOR / ADMIN)
router.delete("/:id", verifyToken, requireRole("CREATOR", "ADMIN"), async (req, res) => {
  try {
    const product = await prisma.product360.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    // Ensure only author or ADMIN can delete
    if (product.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Access denied. You can only delete your own products." });
    }

    await prisma.product360.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: "Product deleted successfully from PostgreSQL" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ success: false, error: "Failed to delete product" });
  }
});

export default router;
