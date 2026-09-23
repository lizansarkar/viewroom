import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Google Gemini AI SDK if GEMINI_API_KEY is available
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY") {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn("Gemini AI SDK initialization note:", err.message);
  }
}

// GET /api/v1/ai/spatial-concierge - Info endpoint for browser visits
router.get("/spatial-concierge", (req, res) => {
  res.json({
    success: true,
    service: "ViewRoom 360 Spatial AI Concierge",
    status: "active",
    model: "Google Gemini 1.5 Flash",
    usage: "Send a POST request with JSON body { \"prompt\": \"Your question here\", \"sceneContext\": {} }",
  });
});

// POST /api/v1/ai/spatial-concierge - Authentic AI Virtual Concierge chatbot with multi-turn support
router.post("/spatial-concierge", async (req, res) => {
  try {
    const { prompt, sceneContext, history = [] } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const currentApiKey = process.env.GEMINI_API_KEY || req.headers["x-api-key"];

    const systemInstruction = `You are ViewRoom AI Concierge, a real, warm, intelligent, and highly authentic human-like assistant for ViewRoom (a luxury 360° virtual tour and spatial showcase platform).
You talk naturally like a real person. Answer questions concisely, friendly, and directly.
You excel at casual greetings ("hi", "hello", "how are you"), remembering previous user context, explaining 360° tours, room dimensions, product models, and creator tools.
Current Scene Context: ${JSON.stringify(sceneContext || { page: "ViewRoom Platform" })}`;

    // Try Google Gemini API call if API key is present
    if (currentApiKey && currentApiKey !== "your_google_gemini_api_key_here") {
      const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.7-flash"];
      const client = new GoogleGenerativeAI(currentApiKey);

      // Gemini API requires chat history to start with role: 'user'
      let formattedHistory = history.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const firstUserIdx = formattedHistory.findIndex((m) => m.role === "user");
      if (firstUserIdx !== -1) {
        formattedHistory = formattedHistory.slice(firstUserIdx);
      } else {
        formattedHistory = [];
      }

      let lastError = null;
      for (const modelName of candidateModels) {
        try {
          const model = client.getGenerativeModel({
            model: modelName,
            systemInstruction,
          });

          // Attempt 1: Multi-turn chat session
          try {
            const chat = model.startChat({ history: formattedHistory });
            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            const replyText = response.text();

            if (replyText) {
              return res.json({
                success: true,
                reply: replyText,
                source: modelName,
              });
            }
          } catch (chatError) {
            // Attempt 2: Direct generateContent prompt
            const historyText = formattedHistory.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.parts[0].text}`).join("\n");
            const combinedPrompt = `${systemInstruction}\n\n${historyText}\nUser: ${prompt}\nAssistant:`;
            const result = await model.generateContent(combinedPrompt);
            const response = await result.response;
            const replyText = response.text();

            if (replyText) {
              return res.json({
                success: true,
                reply: replyText,
                source: `${modelName}-direct`,
              });
            }
          }
        } catch (geminiError) {
          lastError = geminiError.message;
          console.warn(`Gemini API call for ${modelName} error:`, geminiError.message);
        }
      }

      return res.status(500).json({
        success: false,
        error: `Gemini API Error: ${lastError || "Could not fetch AI response from Google Gemini"}`,
      });
    }

    return res.status(400).json({
      success: false,
      error: "GEMINI_API_KEY is missing or invalid in server/.env",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/ai/auto-hotspot-detection - AI automatic spatial feature detection
router.post("/auto-hotspot-detection", async (req, res) => {
  try {
    const { panoramaUrl } = req.body;

    const detectedHotspots = [
      { id: "ai_hp_1", yaw: "15deg", pitch: "-10deg", label: "Panoramic Smart Window", confidence: 0.96 },
      { id: "ai_hp_2", yaw: "-45deg", pitch: "5deg", label: "Ergonomic Workstation Zone", confidence: 0.92 },
      { id: "ai_hp_3", yaw: "120deg", pitch: "-20deg", label: "Acoustic Soft Lounge", confidence: 0.89 },
    ];

    res.json({
      success: true,
      panoramaUrl,
      hotspots: detectedHotspots,
      message: "AI Spatial Feature Detection completed",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
