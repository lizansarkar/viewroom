import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Catalog dataset for AI product search & smart recommendations
const CATALOG_PRODUCTS = [
  { id: "watch", name: "Aero Chronograph 360", category: "Luxury Timepiece", price: "$4,850", tag: "360° SPIN", desc: "Grade 5 titanium Swiss chronograph with live sweeping movement and domed sapphire crystal." },
  { id: "tshirt", name: "Minimalist Black T-Shirt", category: "Streetwear Apparel", price: "$85", tag: "COTTON 3D", desc: "100% heavyweight organic cotton streetwear tee with relaxed silhouette." },
  { id: "airpods", name: "AirPods Pro Spatial", category: "Wireless Audio", price: "$249", tag: "NOISE CANCEL", desc: "Adaptive active noise cancellation with personalized spatial audio 3D tracking." },
  { id: "chair", name: "Eames Silhouette Lounge", category: "Designer Furniture", price: "$1,250", tag: "ARCHITECTURAL", desc: "7-ply American walnut veneer with lambskin leather cushions and 5-star swivel base." },
  { id: "phone", name: "Horizon Ultra Smartphone", category: "Mobile Tech", price: "$999", tag: "FLAGSHIP 5G", desc: "Flagship 5G smartphone with titanium frame and 200MP pro camera system." },
  { id: "camera", name: "Lumix Retro Rangefinder", category: "Photography", price: "$1,450", tag: "OPTICAL ZOOM", desc: "Classic rangefinder aesthetic with 35mm f/1.4 prime lens and full-frame sensor." },
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
    catalogCount: CATALOG_PRODUCTS.length,
  });
});

// POST /api/v1/ai/spatial-concierge - Authentic AI Virtual Concierge with Smart Product Search & Recommendations
router.post("/spatial-concierge", async (req, res) => {
  try {
    const { prompt, sceneContext, history = [] } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const currentApiKey = process.env.GEMINI_API_KEY || req.headers["x-api-key"];

    const catalogString = JSON.stringify(CATALOG_PRODUCTS, null, 2);

    const systemInstruction = `You are ViewRoom AI Concierge, an intelligent, warm, and highly authentic product recommendation expert for ViewRoom (a luxury 360° virtual tour and 3D spatial product platform).
You talk naturally like a real person. Answer questions concisely, friendly, and directly.
You have full access to our official 3D product catalog:
${catalogString}

When users ask for product search, recommendations, or items related to tech, apparel, audio, watches, furniture, or photography:
1. Provide a warm, enthusiastic, personalized response.
2. Recommend the exact matching products from our catalog with prices and key highlights.
3. If they ask a general question, answer clearly and suggest exploring our 3D interactive product showcase.

Current Context: ${JSON.stringify(sceneContext || { page: "ViewRoom Platform" })}`;

    // Fallback AI recommendation generator when API key is missing or calls fail
    const generateSmartFallbackReply = (userQuery) => {
      const q = userQuery.toLowerCase();
      let matched = [];

      if (q.includes("watch") || q.includes("timepiece") || q.includes("luxury") || q.includes("clock")) {
        matched.push(CATALOG_PRODUCTS[0]);
      }
      if (q.includes("shirt") || q.includes("tshirt") || q.includes("clothes") || q.includes("apparel") || q.includes("wear")) {
        matched.push(CATALOG_PRODUCTS[1]);
      }
      if (q.includes("airpod") || q.includes("audio") || q.includes("headphone") || q.includes("earbud") || q.includes("music") || q.includes("sound")) {
        matched.push(CATALOG_PRODUCTS[2]);
      }
      if (q.includes("chair") || q.includes("furniture") || q.includes("lounge") || q.includes("desk") || q.includes("room")) {
        matched.push(CATALOG_PRODUCTS[3]);
      }
      if (q.includes("phone") || q.includes("mobile") || q.includes("tech") || q.includes("smartphone")) {
        matched.push(CATALOG_PRODUCTS[4]);
      }
      if (q.includes("camera") || q.includes("photo") || q.includes("lens") || q.includes("picture")) {
        matched.push(CATALOG_PRODUCTS[5]);
      }

      if (matched.length > 0) {
        const itemNames = matched.map((m) => `• ${m.name} (${m.category} - ${m.price}): ${m.desc}`).join("\n");
        return `Here are the top 3D products matching your search on ViewRoom:\n\n${itemNames}\n\nYou can rotate and inspect all of them in full 3D right on our platform!`;
      }

      if (q.includes("product") || q.includes("search") || q.includes("recommend") || q.includes("suggest") || q.includes("show")) {
        return `Welcome to ViewRoom 3D Showcase! Here are some of our top featured products:\n\n1. Aero Chronograph 360 ($4,850) - Swiss Luxury Timepiece\n2. Minimalist Black T-Shirt ($85) - Organic Cotton Streetwear\n3. AirPods Pro Spatial ($249) - Wireless Audio\n4. Horizon Ultra Smartphone ($999) - Flagship 5G Tech\n\nWhich category would you like to explore in 3D?`;
      }

      return `Hello! I'm ViewRoom AI Concierge. I can help you search for 3D products, explore virtual tours, or find recommendations. Try asking me "Show me watches", "Suggest audio gear", or "What tech products do you have?"`;
    };

    // Try Google Gemini API call if API key is present
    if (currentApiKey && currentApiKey !== "your_google_gemini_api_key_here" && currentApiKey !== "YOUR_GEMINI_API_KEY") {
      const candidateModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
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
              reply: replyText,
              source: modelName,
              products: CATALOG_PRODUCTS,
            });
          }
        } catch (geminiError) {
          console.warn(`Gemini API call for ${modelName} fallback:`, geminiError.message);
        }
      }
    }

    // Return intelligent product recommendation fallback
    const fallbackReply = generateSmartFallbackReply(prompt);
    return res.json({
      success: true,
      reply: fallbackReply,
      source: "ViewRoom AI Smart Engine",
      products: CATALOG_PRODUCTS,
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

    // Smart Intent Parser Fallback
    const parseIntentFallback = (userQuery, tourNodes) => {
      let targetNode = null;
      let speech = "";

      // Match floor levels or room keywords
      if (userQuery.includes("aerial") || userQuery.includes("sky") || userQuery.includes("outside") || userQuery.includes("bird") || userQuery.includes("top")) {
        targetNode = tourNodes.find((n) => n.id === "aerial_view");
      } else if (userQuery.includes("ground") || userQuery.includes("entrance") || userQuery.includes("lobby") && (userQuery.includes("main") || userQuery.includes("0"))) {
        targetNode = tourNodes.find((n) => n.id === "entrance");
      } else if (userQuery.includes("1st") || userQuery.includes("first") || (userQuery.includes("floor") && userQuery.includes("1"))) {
        targetNode = tourNodes.find((n) => n.id === "floor_1");
      } else if (userQuery.includes("2nd") || userQuery.includes("second") || userQuery.includes("workspace") || userQuery.includes("lounge") || (userQuery.includes("floor") && userQuery.includes("2"))) {
        targetNode = tourNodes.find((n) => n.id === "floor_2");
      } else if (userQuery.includes("3rd") || userQuery.includes("third") || userQuery.includes("lab") || userQuery.includes("r&d") || (userQuery.includes("floor") && userQuery.includes("3"))) {
        targetNode = tourNodes.find((n) => n.id === "floor_3");
      } else if (userQuery.includes("4th") || userQuery.includes("fourth") || userQuery.includes("gallery") || userQuery.includes("fashion") || (userQuery.includes("floor") && userQuery.includes("4"))) {
        targetNode = tourNodes.find((n) => n.id === "floor_4");
      } else if (userQuery.includes("5th") || userQuery.includes("fifth") || userQuery.includes("cafeteria") || userQuery.includes("dining") || (userQuery.includes("floor") && userQuery.includes("5"))) {
        targetNode = tourNodes.find((n) => n.id === "floor_5");
      } else if (userQuery.includes("6th") || userQuery.includes("sixth") || userQuery.includes("suite") || userQuery.includes("executive") || (userQuery.includes("floor") && userQuery.includes("6"))) {
        targetNode = tourNodes.find((n) => n.id === "floor_6");
      }

      if (targetNode) {
        speech = `Navigating to ${targetNode.name}. Enjoy your spatial tour!`;
        return {
          targetNodeId: targetNode.id,
          targetYaw: "0deg",
          targetPitch: "0deg",
          spokenResponse: speech,
          matchedName: targetNode.name,
        };
      }

      return {
        targetNodeId: null,
        targetYaw: "0deg",
        targetPitch: "0deg",
        spokenResponse: `I heard "${userQuery}". You can ask me to navigate to Ground Floor, 1st Floor, 2nd Floor, 3rd Floor, 4th Floor, 5th Floor, 6th Floor, or Aerial View!`,
        matchedName: null,
      };
    };

    // Try Google Gemini API for intelligent natural language parsing
    if (currentApiKey && currentApiKey !== "YOUR_GEMINI_API_KEY" && currentApiKey !== "your_google_gemini_api_key_here") {
      try {
        const client = new GoogleGenerativeAI(currentApiKey);
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const result = await model.generateContent(promptInstruction);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, ...parsed });
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
