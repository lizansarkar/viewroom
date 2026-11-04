import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");
const panoramasDir = path.join(uploadsDir, "panoramas");
const audioDir = path.join(uploadsDir, "audio");

[uploadsDir, panoramasDir, audioDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Initialize Cloudinary Cloud Object Storage (optional/resilient)
const isCloudinaryConfigured = Boolean(
  (process.env.CLOUDINARY_CLOUD_NAME || "qm6jykgj") &&
  (process.env.CLOUDINARY_API_KEY || "193988474583824") &&
  (process.env.CLOUDINARY_API_SECRET || "cNiXK8EkhASmisAHMZwepwhac2o")
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "qm6jykgj",
    api_key: process.env.CLOUDINARY_API_KEY || "193988474583824",
    api_secret: process.env.CLOUDINARY_API_SECRET || "cNiXK8EkhASmisAHMZwepwhac2o",
    secure: true,
  });
}

// Multer Disk Storage: Streams files directly to local disk for ultra-high-res 8K panoramas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAudio =
      file.fieldname === "audio" ||
      (file.mimetype && file.mimetype.startsWith("audio/"));
    cb(null, isAudio ? audioDir : panoramasDir);
  },
  filename: (req, file, cb) => {
    const cleanOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${uniqueSuffix}_${cleanOriginal}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for ultra-high-res 8K panoramas & audio
});

// 1. POST /api/v1/upload/panorama - Multipart/FormData 360° Equirectangular Images
router.post("/panorama", upload.single("panorama"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No panorama image file provided" });
    }

    const localUrl = `/uploads/panoramas/${req.file.filename}`;
    let cloudResult = null;

    if (isCloudinaryConfigured) {
      try {
        cloudResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "viewroom_360/panoramas",
          resource_type: "image",
        });
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to local static URL:", cloudErr.message);
      }
    }

    const finalUrl = cloudResult?.secure_url || localUrl;

    res.json({
      success: true,
      url: finalUrl,
      imageUrl: finalUrl,
      localUrl,
      publicId: cloudResult?.public_id || req.file.filename,
      format: cloudResult?.format || path.extname(req.file.filename).replace(".", ""),
      bytes: req.file.size,
    });
  } catch (err) {
    console.error("Panorama upload error:", err);
    res.status(500).json({ success: false, error: err.message || "Panorama upload failed" });
  }
});

// 2. POST /api/v1/upload/audio - Multipart/FormData Custom MP3 Ambient Tracks
router.post("/audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No audio file provided" });
    }

    const localUrl = `/uploads/audio/${req.file.filename}`;
    let cloudResult = null;

    if (isCloudinaryConfigured) {
      try {
        cloudResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "viewroom_360/audio",
          resource_type: "video", // Cloudinary treats audio under video resource_type
        });
      } catch (cloudErr) {
        console.warn("Cloudinary audio upload failed, falling back to local static URL:", cloudErr.message);
      }
    }

    const finalUrl = cloudResult?.secure_url || localUrl;

    res.json({
      success: true,
      url: finalUrl,
      audioUrl: finalUrl,
      localUrl,
      publicId: cloudResult?.public_id || req.file.filename,
      format: cloudResult?.format || "mp3",
    });
  } catch (err) {
    console.error("Audio upload error:", err);
    res.status(500).json({ success: false, error: err.message || "Audio upload failed" });
  }
});

// 3. POST /api/v1/upload - Base64 Payload Uploader with disk fallback
router.post("/", async (req, res) => {
  try {
    const { imageBase64, isAudio, fileName } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "imageBase64 / audio payload is required" });
    }

    let cloudResult = null;
    if (isCloudinaryConfigured) {
      try {
        cloudResult = await cloudinary.uploader.upload(imageBase64, {
          folder: isAudio ? "viewroom_360/audio" : "viewroom_360/panoramas",
          resource_type: isAudio ? "video" : "image",
        });
      } catch (cloudErr) {
        console.warn("Cloudinary Base64 upload failed, falling back to local disk storage:", cloudErr.message);
      }
    }

    if (cloudResult && cloudResult.secure_url) {
      return res.json({
        success: true,
        url: cloudResult.secure_url,
        imageUrl: cloudResult.secure_url,
        audioUrl: cloudResult.secure_url,
        publicId: cloudResult.public_id,
        format: cloudResult.format,
      });
    }

    // Local disk fallback for Base64 payloads
    const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const ext = isAudio ? "mp3" : "jpg";
    const buffer = matches ? Buffer.from(matches[2], "base64") : Buffer.from(imageBase64, "base64");
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    const cleanName = (fileName || `upload_${uniqueSuffix}`).replace(/[^a-zA-Z0-9._-]/g, "_");
    const savedFilename = cleanName.endsWith(`.${ext}`) ? cleanName : `${cleanName}.${ext}`;
    const targetDir = isAudio ? audioDir : panoramasDir;
    const destPath = path.join(targetDir, savedFilename);

    fs.writeFileSync(destPath, buffer);
    const localUrl = `/uploads/${isAudio ? "audio" : "panoramas"}/${savedFilename}`;

    res.json({
      success: true,
      url: localUrl,
      imageUrl: localUrl,
      audioUrl: localUrl,
      localUrl,
      publicId: savedFilename,
      format: ext,
    });
  } catch (err) {
    console.error("Base64 upload error:", err);
    res.status(500).json({ success: false, error: err.message || "Upload failed" });
  }
});

export default router;