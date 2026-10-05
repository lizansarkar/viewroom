import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine configuration for 8K Equirectangular Panoramas & MP3 Audio tracks
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.mimetype.includes("audio") ? ".mp3" : ".jpg");
    const prefix = file.mimetype.includes("audio") ? "audio" : "panorama_360";
    const uniqueName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for high-res 8K panoramas & high-quality audio
});

// Helper to return full public URL
const getPublicUrl = (req, filename) => {
  const host = req.get("host") || "localhost:5000";
  const protocol = req.protocol || "http";
  return `${protocol}://${host}/uploads/${filename}`;
};

// 1. POST /api/v1/upload/panorama - Multipart/FormData file upload for 360° Equirectangular Images
router.post("/panorama", upload.single("panorama"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No panorama image file provided" });
    }
    const publicUrl = getPublicUrl(req, req.file.filename);
    res.json({
      success: true,
      url: publicUrl,
      imageUrl: publicUrl,
      fileName: req.file.filename,
    });
  } catch (err) {
    console.error("Panorama upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/v1/upload/audio - Multipart/FormData file upload for Custom MP3 Audio Tracks
router.post("/audio", upload.single("audio"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No audio file provided" });
    }
    const publicUrl = getPublicUrl(req, req.file.filename);
    res.json({
      success: true,
      url: publicUrl,
      audioUrl: publicUrl,
      fileName: req.file.filename,
    });
  } catch (err) {
    console.error("Audio upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/v1/upload - Fallback Base64 payload receiver
router.post("/", (req, res) => {
  try {
    const { imageBase64, fileName, isAudio } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "imageBase64 / audio payload is required" });
    }

    let ext = isAudio ? "mp3" : "jpg";
    let base64Data = imageBase64;

    const matches = imageBase64.match(/^data:(image|audio)\/([a-zA-Z0-9]+);base64,(.+)$/);

    if (matches) {
      const type = matches[1];
      const subtype = matches[2];
      if (type === "audio") {
        ext = subtype === "mpeg" ? "mp3" : subtype;
      } else {
        ext = subtype === "jpeg" ? "jpg" : subtype;
      }
      base64Data = matches[3];
    }

    const prefix = isAudio || imageBase64.startsWith("data:audio") ? "audio" : "panorama_360";
    const uniqueName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    const buffer = Buffer.from(base64Data, "base64");

    fs.writeFileSync(filePath, buffer);

    const publicUrl = getPublicUrl(req, uniqueName);

    res.json({
      success: true,
      url: publicUrl,
      imageUrl: publicUrl,
      audioUrl: publicUrl,
      fileName: uniqueName,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
