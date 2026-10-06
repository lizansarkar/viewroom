import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Initialize Cloudinary Cloud Object Storage
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

// Memory Storage: Files are streamed directly to Cloudinary without touching local hard disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for ultra-high-res 8K panoramas & audio
});

// Helper: Stream memory buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "viewroom_360",
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// 1. POST /api/v1/upload/panorama - Multipart/FormData 360° Equirectangular Images
router.post("/panorama", upload.single("panorama"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No panorama image file provided" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "viewroom_360/panoramas",
      resource_type: "image",
    });

    res.json({
      success: true,
      url: result.secure_url,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (err) {
    console.error("Cloudinary Panorama upload error:", err);
    res.status(500).json({ success: false, error: err.message || "Cloud upload failed" });
  }
});

// 2. POST /api/v1/upload/audio - Multipart/FormData Custom MP3 Ambient Tracks
router.post("/audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No audio file provided" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "viewroom_360/audio",
      resource_type: "video", // Cloudinary treats audio files under the video resource_type
    });

    res.json({
      success: true,
      url: result.secure_url,
      audioUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    });
  } catch (err) {
    console.error("Cloudinary Audio upload error:", err);
    res.status(500).json({ success: false, error: err.message || "Audio upload failed" });
  }
});

// 3. POST /api/v1/upload - Base64 Payload Uploader
router.post("/", async (req, res) => {
  try {
    const { imageBase64, isAudio } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "imageBase64 / audio payload is required" });
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: isAudio ? "viewroom_360/audio" : "viewroom_360/panoramas",
      resource_type: isAudio ? "video" : "image",
    });

    res.json({
      success: true,
      url: result.secure_url,
      imageUrl: result.secure_url,
      audioUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    });
  } catch (err) {
    console.error("Cloudinary Base64 upload error:", err);
    res.status(500).json({ success: false, error: err.message || "Cloud upload failed" });
  }
});

export default router;
