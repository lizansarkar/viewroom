// ==========================================
// 3D FLOOR PUCK & DRONE HOTSPOT HELPERS
// ==========================================

export const getHotspotIcon = (type) => {
  switch (type) {
    case "arrow": return "∧";
    case "door": return "🚪";
    case "puck": return "⭕";
    case "bathroom": return "🛁";
    case "stairs": return "🪜";
    case "dining": return "🍽️";
    case "bedroom": return "🛏️";
    case "info": return "ℹ️";
    default: return "➔";
  }
};

export const createFloorPuckMarkerHtml = (label, iconType = "arrow") => {
  const displayLabel = label || "NAVIGATE";

  if (iconType === "arrow") {
    // Ultra-crisp 3D Perspective SVG Road Chevron Arrow with Floor Shadow & Pulse Animation
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="mb-2.5 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-[0_4px_15px_rgba(0,0,0,0.35)] border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          <span class="text-xs font-black">➔</span>
          <span>${displayLabel}</span>
        </div>
        <div style="transform: perspective(300px) rotateX(58deg);" class="relative flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-125">
          <div class="w-16 h-8 bg-black/40 rounded-full blur-md absolute top-4 -z-10"></div>
          <svg class="w-16 h-10 text-white/70 animate-ping opacity-75 absolute -top-2" viewBox="0 0 64 36" fill="none">
            <path d="M8 28L32 10L56 28" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg class="w-16 h-10 text-white filter drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]" viewBox="0 0 64 36" fill="none">
            <path d="M8 28L32 10L56 28" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `;
  }

  if (iconType === "door") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="mb-2.5 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-2xl border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          <span class="text-xs">🚪</span>
          <span>${displayLabel}</span>
        </div>
        <div class="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-115 text-white">
          <div class="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-50"></div>
          <svg class="w-6 h-6 fill-current transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M19 19V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14H3v2h18v-2h-2zm-8-6h-2v-2h2v2z"/>
          </svg>
        </div>
      </div>
    `;
  }

  return `
    <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
      <div class="mb-2.5 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-2xl border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
        <span class="text-xs">${getHotspotIcon(iconType)}</span>
        <span>${displayLabel}</span>
      </div>
      <div style="transform: perspective(400px) rotateX(65deg);" class="relative w-13 h-13 sm:w-15 sm:h-15 rounded-full border-2 border-white bg-white/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-120">
        <div class="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-70"></div>
        <div class="w-5 h-5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
      </div>
    </div>
  `;
};

// Floating Drone / Aerial Action Hotspot
export const createDroneHotspotHtml = (label, icon = "🛸") => `
  <div class="cursor-pointer group flex flex-col items-center p-3 select-none">
    <div class="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-black/85 hover:bg-white hover:text-black backdrop-blur-md border-2 border-white text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.9)]">
      <span class="text-base sm:text-lg animate-bounce">${icon}</span>
      <span class="text-xs sm:text-sm font-black uppercase tracking-wider">${label}</span>
    </div>
  </div>
`;

// ==========================================
// MULTI-FLOOR CONNECTED NODE GRAPH DATASET
// ==========================================
export const DEFAULT_TOUR_NODES = [
  {
    id: "aerial_view",
    name: "Ground Floor Exterior & Aerial",
    category: "Campus Aerial",
    floorLevel: 0,
    thumbnail: "/panoramas/panorama_aerial.jpg",
    panorama: "/panoramas/panorama_aerial.jpg",
    connections: [
      {
        targetNodeId: "entrance",
        label: "Enter Main Building",
        type: "floor_puck",
        position: { yaw: "0deg", pitch: "-35deg" },
      },
    ],
  },
  {
    id: "entrance",
    name: "Ground Floor Lobby",
    category: "Main Building",
    floorLevel: 0,
    thumbnail: "/panoramas/panorama_entrance.jpg",
    panorama: "/panoramas/panorama_entrance.jpg",
    connections: [
      {
        targetNodeId: "floor_1",
        label: "Stairs to 1st Floor Lobby",
        type: "floor_puck",
        position: { yaw: "35deg", pitch: "-35deg" },
      },
      {
        targetNodeId: "aerial_view",
        label: "Fly Above • Aerial View",
        type: "drone_badge",
        position: { yaw: "-120deg", pitch: "30deg" },
      },
    ],
  },
  {
    id: "floor_1",
    name: "1st Floor Lobby",
    category: "Reception Lobby",
    floorLevel: 1,
    thumbnail: "/panoramas/panorama_floor1.jpg",
    panorama: "/panoramas/panorama_floor1.jpg",
    connections: [
      {
        targetNodeId: "floor_2",
        label: "Stairs to 2nd Floor Workspace",
        type: "floor_puck",
        position: { yaw: "45deg", pitch: "-35deg" },
      },
      {
        targetNodeId: "entrance",
        label: "Return to Ground Floor",
        type: "floor_puck",
        position: { yaw: "-135deg", pitch: "-35deg" },
      },
    ],
  },
  {
    id: "floor_2",
    name: "2nd Floor Lounge & Workspace",
    category: "Open Office",
    floorLevel: 2,
    thumbnail: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000",
    connections: [
      {
        targetNodeId: "floor_3",
        label: "Stairs to 3rd Floor R&D Lab",
        type: "floor_puck",
        position: { yaw: "60deg", pitch: "-30deg" },
      },
      {
        targetNodeId: "floor_1",
        label: "Go Down to 1st Floor Lobby",
        type: "floor_puck",
        position: { yaw: "-120deg", pitch: "-35deg" },
      },
    ],
  },
  {
    id: "floor_3",
    name: "3rd Floor R&D Workstations",
    category: "R&D Workstations",
    floorLevel: 3,
    thumbnail: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=2000",
    connections: [
      {
        targetNodeId: "floor_4",
        label: "Stairs to 4th Floor Gallery",
        type: "floor_puck",
        position: { yaw: "45deg", pitch: "-30deg" },
      },
      {
        targetNodeId: "floor_2",
        label: "Go Down to 2nd Floor Lounge",
        type: "floor_puck",
        position: { yaw: "-135deg", pitch: "-35deg" },
      },
    ],
  },
  {
    id: "floor_4",
    name: "4th Floor Fashion Gallery",
    category: "Fashion Gallery",
    floorLevel: 4,
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
    connections: [
      {
        targetNodeId: "floor_5",
        label: "Elevator to 5th Floor Cafeteria",
        type: "floor_puck",
        position: { yaw: "90deg", pitch: "-30deg" },
      },
      {
        targetNodeId: "floor_3",
        label: "Go Down to 3rd Floor Lab",
        type: "floor_puck",
        position: { yaw: "-90deg", pitch: "-35deg" },
      },
    ],
  },
  {
    id: "floor_5",
    name: "5th Floor Dining & Cafeteria",
    category: "Dining & Lounge",
    floorLevel: 5,
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000",
    connections: [
      {
        targetNodeId: "floor_6",
        label: "Elevator to 6th Floor Suite",
        type: "floor_puck",
        position: { yaw: "75deg", pitch: "-30deg" },
      },
      {
        targetNodeId: "floor_4",
        label: "Go Down to 4th Floor Gallery",
        type: "floor_puck",
        position: { yaw: "-105deg", pitch: "-35deg" },
      },
    ],
  },
  {
    id: "floor_6",
    name: "6th Floor Executive Suite",
    category: "Executive Workshop",
    floorLevel: 6,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000",
    connections: [
      {
        targetNodeId: "floor_5",
        label: "Go Down to 5th Floor Cafeteria",
        type: "floor_puck",
        position: { yaw: "-150deg", pitch: "-35deg" },
      },
      {
        targetNodeId: "aerial_view",
        label: "Fly Above • Campus Aerial",
        type: "drone_badge",
        position: { yaw: "180deg", pitch: "25deg" },
      },
    ],
  },
];
