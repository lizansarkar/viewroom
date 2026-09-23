import express from "express";

const router = express.Router();

// Real-time event log memory store
let liveEventLogs = [
  {
    id: "evt_1",
    type: "tour_viewed",
    title: "Skyline Innovation Campus 360°",
    detail: "Viewed Aerial Scene",
    device: "Desktop (Chrome)",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: "evt_2",
    type: "hotspot_clicked",
    title: "Main Entrance Pin",
    detail: "Navigated to Lobby",
    device: "Mobile (Safari)",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "evt_3",
    type: "ai_queried",
    title: "Spatial AI Concierge",
    detail: "Asked: 'What are the lobby dimensions?'",
    device: "Desktop (Firefox)",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "evt_4",
    type: "product_spotted",
    title: "Ergonomic Spatial Chair X1",
    detail: "Interactive 360° Spin",
    device: "Desktop (Chrome)",
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
];

// Aggregated Analytics dataset
let analyticsOverview = {
  totalImpressions: 14820,
  uniqueVisitors: 6420,
  avgDwellTime: "4m 18s",
  hotspotCtr: "18.4%",
  aiQueryVolume: 842,
  dailyTrafficTrend: [
    { day: "Mon", impressions: 1840, unique: 920 },
    { day: "Tue", impressions: 2150, unique: 1100 },
    { day: "Wed", impressions: 2480, unique: 1250 },
    { day: "Thu", impressions: 2100, unique: 1040 },
    { day: "Fri", impressions: 2950, unique: 1480 },
    { day: "Sat", impressions: 3200, unique: 1650 },
    { day: "Sun", impressions: 2100, unique: 980 },
  ],
  hotspotRankings: [
    { id: "hp1", label: "Main Entrance", clicks: 1240, ctr: "24.5%", category: "Navigation" },
    { id: "hp2", label: "1ST FLOOR LOBBY", clicks: 980, ctr: "19.2%", category: "Navigation" },
    { id: "hp3", label: "Spatial Chair Specs", clicks: 760, ctr: "15.1%", category: "3D Product" },
    { id: "hp4", label: "Penthouse Balcony", clicks: 540, ctr: "11.8%", category: "Viewpoint" },
  ],
  deviceDistribution: [
    { name: "Desktop", percentage: 58, count: 8595 },
    { name: "Mobile", percentage: 34, count: 5038 },
    { name: "VR Headsets", percentage: 8, count: 1187 },
  ],
};

// GET /api/v1/analytics/overview - Aggregate platform analytics stats
router.get("/overview", (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        ...analyticsOverview,
        recentLogs: liveEventLogs.slice(0, 10),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/analytics/tours/:id - Granular tour-level analytics
router.get("/tours/:id", (req, res) => {
  try {
    const tourId = req.params.id;
    res.json({
      success: true,
      data: {
        tourId,
        totalViews: 2450,
        avgSessionSeconds: 258,
        scenesBreakdown: [
          { sceneId: "aerial_view", name: "AERIAL VIEW", views: 1420, avgSeconds: 45 },
          { sceneId: "entrance", name: "ENTRANCE", views: 980, avgSeconds: 62 },
          { sceneId: "floor_1", name: "1ST FLOOR LOBBY", views: 740, avgSeconds: 151 },
        ],
        topHotspots: [
          { label: "Main Entrance", clicks: 840 },
          { label: "1ST FLOOR LOBBY", clicks: 610 },
        ],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/analytics/track - Real-time event logger endpoint
router.post("/track", (req, res) => {
  try {
    const { type, title, detail, device } = req.body;
    if (!type) {
      return res.status(400).json({ success: false, error: "Event type is required" });
    }

    const newEvent = {
      id: `evt_${Date.now()}`,
      type: type || "interaction",
      title: title || "360° Interaction",
      detail: detail || "User explored spatial elements",
      device: device || "Web Client",
      timestamp: new Date().toISOString(),
    };

    liveEventLogs.unshift(newEvent);
    analyticsOverview.totalImpressions += 1;

    // Keep log max size to 50 items
    if (liveEventLogs.length > 50) {
      liveEventLogs.pop();
    }

    res.status(201).json({ success: true, data: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
