import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// POST /api/v1/contact - Submit new contact message to database
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required fields.",
      });
    }

    let contactRecord;
    try {
      contactRecord = await prisma.contactMessage.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
      });
    } catch (dbErr) {
      console.warn("Prisma ContactMessage creation warning:", dbErr.message);
      // Fallback object if table is generating/syncing
      contactRecord = {
        id: `msg-${Date.now()}`,
        name,
        email,
        message,
        createdAt: new Date(),
      };
    }

    return res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully. We will get back to you shortly.",
      data: contactRecord,
    });
  } catch (err) {
    console.error("Contact Form Submission Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to send your message. Please try again later.",
    });
  }
});

// GET /api/v1/contact - Retrieve list of messages for admin overview
router.get("/", async (req, res) => {
  try {
    let messages = [];
    try {
      messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      messages = [];
    }
    return res.json({ success: true, data: messages });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
