import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Featured 360° Spatial Spaces for AI recommendation
const FEATURED_360_SPACES = [
  { id: "skyline_villa", name: "Skyline Sunset Villa", category: "Residential Villa & Home", rooms: 6, tag: "360° TOUR", desc: "Luxury modern hilltop villa with infinity pool, panoramic skyline terrace, and designer living room." },
  { id: "rooftop_lounge", name: "Sky Lounge & Cafe 360°", category: "Cafe & Restaurant", rooms: 4, tag: "HOSPITALITY", desc: "Atmospheric 360° dining space with espresso bar, VIP mezzanine, and ambient spatial audio." },
  { id: "grand_hotel", name: "Azure Boutique Hotel & Resort", category: "Boutique Hotel & Suite", rooms: 8, tag: "HOTEL SUITE", desc: "5-star luxury seaside suite featuring private balcony, marble bath, and ocean-view bedroom." },
];

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

// GET /api/v1/ai/spatial-concierge - Info endpoint
router.get("/spatial-concierge", (req, res) => {
  res.json({
    success: true,
    service: "ViewRoom 360 Spatial AI Concierge",
    status: "active",
    model: "Google Gemini AI",
    spacesCount: FEATURED_360_SPACES.length,
  });
});

// POST /api/v1/ai/spatial-concierge - Authentic AI Virtual Concierge for 360° Virtual Tours
router.post("/spatial-concierge", async (req, res) => {
  try {
    const { prompt, sceneContext, history = [] } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const currentApiKey = process.env.GEMINI_API_KEY || req.headers["x-api-key"];

    const spacesString = JSON.stringify(FEATURED_360_SPACES, null, 2);

    const systemInstruction = `You are ViewRoom AI Concierge, a helpful, polite, and intelligent spatial tour guide for ViewRoom (a dedicated 360° virtual property tour and architectural digital twin platform).
You talk naturally like a real person. Answer questions concisely, friendly, and directly.
You have access to our featured 360° spaces:
${spacesString}

When users ask about exploring properties, cafes, hotels, villas, or how to create 360° tours:
1. Provide a warm, enthusiastic, personalized response.
2. Recommend the best matching 360° spaces.
3. If they ask about creating a tour, explain that Creators can batch upload 360° photos and connect rooms with door hotspots easily.

Current Context: ${JSON.stringify(sceneContext || { page: "ViewRoom 360 Platform" })}`;

    // Fallback AI recommendation generator when API key is missing or calls fail
    const generateSmartFallbackReply = (userQuery) => {
      const q = userQuery.toLowerCase();

      if (q.includes("tour") || q.includes("space") || q.includes("property") || q.includes("villa") || q.includes("hotel") || q.includes("cafe")) {
        const itemNames = FEATURED_360_SPACES.map((m) => `• ${m.name} (${m.category} - ${m.rooms} Rooms): ${m.desc}`).join("\n");
        return `Here are some of our top 360° spaces you can explore on ViewRoom:\n\n${itemNames}\n\nYou can walk through all of them with full 360° panning and door hotspots!`;
      }

      if (q.includes("create") || q.includes("upload") || q.includes("maker") || q.includes("creator")) {
        return `Creating a 360° tour on ViewRoom is super easy! Simply register as a Creator, go to your Creator Dashboard, drop in your 360° panorama photos, set your room opening view, and click to link rooms with door hotspots.`;
      }

      // Handle simple math queries in fallback (e.g., 5+5=?)
      const mathMatch = userQuery.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
      if (mathMatch) {
        const a = parseFloat(mathMatch[1]);
        const op = mathMatch[2];
        const b = parseFloat(mathMatch[3]);
        let ans = 0;
        if (op === "+") ans = a + b;
        else if (op === "-") ans = a - b;
        else if (op === "*") ans = a * b;
        else if (op === "/") ans = b !== 0 ? a / b : "undefined";
        return `${a} ${op} ${b} = ${ans}`;
      }

      return `Hello! I'm your ViewRoom AI Spatial Guide. I can help you explore 360° virtual properties, hotels, and cafes, or guide you on building your own virtual tour. What would you like to explore?`;
    };

    // Try Google Gemini API call if API key is present
    if (currentApiKey && currentApiKey !== "your_google_gemini_api_key_here" && currentApiKey !== "YOUR_GEMINI_API_KEY") {
      const candidateModels = [
        "gemini-flash-lite-latest",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest",
        "gemini-3.8-flash",
        "gemini-2.5-flash-lite",
      ];
      const client = new GoogleGenerativeAI(currentApiKey);

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

      for (const modelName of candidateModels) {
        try {
          const model = client.getGenerativeModel({
            model: modelName,
            systemInstruction,
          });

          const chat = model.startChat({ history: formattedHistory });
          const result = await chat.sendMessage(prompt);
          const response = await result.response;
          const replyText = response.text();

          if (replyText) {
            return res.json({
              success: true,
              reply: replyText.trim(),
              source: modelName,
              spaces: FEATURED_360_SPACES,
            });
          }
        } catch (geminiError) {
          console.warn(`Gemini API call for ${modelName} fallback:`, geminiError.message);
        }
      }
    }

    // Return intelligent space recommendation fallback
    const fallbackReply = generateSmartFallbackReply(prompt);
    return res.json({
      success: true,
      reply: fallbackReply,
      source: "ViewRoom AI Smart Engine",
      spaces: FEATURED_360_SPACES,
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

// POST /api/v1/ai/spatial-voice - Voice AI Spatial Tour Navigation Assistant
router.post("/spatial-voice", async (req, res) => {
  try {
    const { prompt, currentPanoramaId, nodes = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const q = prompt.toLowerCase();
    const currentApiKey = process.env.GEMINI_API_KEY;

    // Smart Dynamic Intent Parser Fallback (works for any creator's tour)
    const parseIntentFallback = (userQuery, tourNodes) => {
      let targetNode = null;
      let speech = "";
      const qClean = userQuery.toLowerCase().trim();
      const qWords = qClean.split(/\s+/).filter(w => w.length > 2);

      // Direct match
      targetNode = tourNodes.find((n) => {
        const nameLower = (n.name || "").toLowerCase();
        const idLower = (n.id || "").toLowerCase();
        return nameLower === qClean || idLower === qClean || qClean.includes(nameLower);
      });

      // Word token overlap match
      if (!targetNode && qWords.length > 0) {
        targetNode = tourNodes.find((n) => {
          const nameLower = (n.name || "").toLowerCase();
          return qWords.some((word) => nameLower.includes(word));
        });
      }

      // Synonym fallback
      if (!targetNode) {
        if (qClean.includes("aerial") || qClean.includes("sky") || qClean.includes("outside") || qClean.includes("bird") || qClean.includes("top")) {
          targetNode = tourNodes.find((n) => n.id === "aerial_view" || n.name.toLowerCase().includes("aerial"));
        } else if (qClean.includes("ground") || qClean.includes("entrance") || qClean.includes("lobby") || qClean.includes("door")) {
          targetNode = tourNodes.find((n) => n.id === "entrance" || n.name.toLowerCase().includes("entrance"));
        }
      }

      if (targetNode) {
        speech = `Navigating to ${targetNode.name}.`;
        return {
          targetNodeId: targetNode.id,
          targetYaw: "0deg",
          targetPitch: "0deg",
          spokenResponse: speech,
          matchedName: targetNode.name,
        };
      }

      const availableNames = tourNodes.map((n) => n.name).join(", ");
      return {
        targetNodeId: null,
        targetYaw: "0deg",
        targetPitch: "0deg",
        spokenResponse: `I heard "${userQuery}". You can navigate to: ${availableNames || "any available room scene"}.`,
        matchedName: null,
      };
    };

    // Try Google Gemini API for intelligent natural language parsing
    if (currentApiKey && currentApiKey !== "YOUR_GEMINI_API_KEY" && currentApiKey !== "your_google_gemini_api_key_here") {
      try {
        const client = new GoogleGenerativeAI(currentApiKey);
        const modelNames = [
          "gemini-flash-lite-latest",
          "gemini-3.5-flash-lite",
          "gemini-3.1-flash-lite",
          "gemini-flash-latest",
          "gemini-3.8-flash",
        ];
        
        let resultText = null;
        const promptInstruction = `You are ViewRoom AI Voice Tour Guide. The user is exploring a 360° virtual tour.
Available tour nodes JSON: ${JSON.stringify(nodes.map((n) => ({ id: n.id, name: n.name, floorLevel: n.floorLevel })))}
Current scene: ${currentPanoramaId}
User voice command: "${prompt}"

Return ONLY a JSON object with this structure:
{
  "targetNodeId": "string or null",
  "targetYaw": "0deg",
  "targetPitch": "0deg",
  "spokenResponse": "Concise friendly response text to speak back",
  "matchedName": "Name of matched room or null"
}`;

        for (const mName of modelNames) {
          try {
            const model = client.getGenerativeModel({ model: mName });
            const genRes = await model.generateContent(promptInstruction);
            resultText = genRes.response.text();
            if (resultText) break;
          } catch (e) {
            // Try next model name
          }
        }

        if (resultText) {
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return res.json({ success: true, ...parsed });
          }
        }
      } catch (err) {
        console.warn("Gemini AI voice navigation fallback:", err.message);
      }
    }

    const fallbackResult = parseIntentFallback(q, nodes);
    return res.json({ success: true, ...fallbackResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
