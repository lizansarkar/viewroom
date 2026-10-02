import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// POST /api/v1/upload - Receive Base64 image and save to disk
router.post("/", (req, res) => {
  try {
    const { imageBase64, fileName } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "imageBase64 is required" });
    }

    // Extract base64 format & data
    const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    let ext = "jpg";
    let base64Data = imageBase64;

    if (matches) {
      ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      base64Data = matches[2];
    }

    const uniqueName = `360_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    const buffer = Buffer.from(base64Data, "base64");

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `http://localhost:5000/uploads/${uniqueName}`;

    res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
