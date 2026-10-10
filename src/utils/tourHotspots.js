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

  // 1. CHEVRON ARROW (তীর)
  if (iconType === "arrow") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="mb-2 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-[0_4px_15px_rgba(0,0,0,0.35)] border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
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

  // 2. DOORWAY / PORTAL (দরজা)
  if (iconType === "door") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="mb-2 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-2xl border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          <span class="text-xs">🚪</span>
          <span>${displayLabel}</span>
        </div>
        <div class="relative w-14 h-18 sm:w-16 sm:h-20 rounded-t-2xl rounded-b-sm border-2 border-white bg-black/70 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-115 text-white">
          <div class="absolute -inset-1 rounded-t-2xl rounded-b-sm border border-white/60 animate-ping opacity-40 pointer-events-none"></div>
          <svg class="w-8 h-10 text-white fill-none stroke-current" viewBox="0 0 32 40" stroke-width="2.5">
            <path d="M4 38V4a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v34" stroke-linecap="round"/>
            <path d="M6 36L24 30V8L6 4v32z" fill="rgba(255,255,255,0.3)"/>
            <circle cx="20" cy="20" r="1.5" fill="white"/>
            <line x1="2" y1="38" x2="30" y2="38" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <div class="w-10 h-1 bg-white rounded-full blur-[1px] shadow-[0_0_8px_rgba(255,255,255,1)] animate-pulse mt-1"></div>
        </div>
      </div>
    `;
  }

  // 3. STAIRS (সিঁড়ি)
  if (iconType === "stairs") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="mb-2 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-2xl border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          <span class="text-xs">🪜</span>
          <span>${displayLabel}</span>
        </div>
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white bg-black/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-115 text-white">
          <div class="absolute -inset-1 rounded-2xl border border-white/60 animate-ping opacity-40 pointer-events-none"></div>
          <svg class="w-8 h-8 text-white fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 20h4v-4h4v-4h4V8h4V4"/>
            <path d="M6 10l8-8m0 0h-5m5 0v5"/>
          </svg>
        </div>
      </div>
    `;
  }

  // 4. BEDROOM (বেডরুম)
  if (iconType === "bedroom") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="mb-2 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-2xl border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          <span class="text-xs">🛏️</span>
          <span>${displayLabel}</span>
        </div>
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white bg-black/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-115 text-white">
          <div class="absolute -inset-1 rounded-2xl border border-white/60 animate-ping opacity-40 pointer-events-none"></div>
          <svg class="w-8 h-8 text-white fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 19h20M2 17v2m20-2v2M2 8v9h20V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
            <circle cx="7" cy="11" r="2" fill="white"/>
            <circle cx="17" cy="11" r="2" fill="white"/>
          </svg>
        </div>
      </div>
    `;
  }

  // 5. BATHROOM (বাথরুম)
  if (iconType === "bathroom") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="mb-2 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-2xl border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          <span class="text-xs">🛁</span>
          <span>${displayLabel}</span>
        </div>
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white bg-black/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-115 text-white">
          <div class="absolute -inset-1 rounded-2xl border border-white/60 animate-ping opacity-40 pointer-events-none"></div>
          <svg class="w-8 h-8 text-white fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/>
            <path d="M6 12V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2"/>
            <circle cx="11" cy="7" r="1" fill="white"/>
            <path d="M5 20l-1 2m16-2l1 2"/>
          </svg>
        </div>
      </div>
    `;
  }

  // 6. DINING / KITCHEN (ডাইনিং)
  if (iconType === "dining") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="mb-2 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-2xl border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          <span class="text-xs">🍽️</span>
          <span>${displayLabel}</span>
        </div>
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white bg-black/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-115 text-white">
          <div class="absolute -inset-1 rounded-2xl border border-white/60 animate-ping opacity-40 pointer-events-none"></div>
          <svg class="w-8 h-8 text-white fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 2v20M18 2a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3M6 2v7a3 3 0 0 0 6 0V2M9 12v10"/>
          </svg>
        </div>
      </div>
    `;
  }

  // 7. INFO BEACON (ইনফো)
  if (iconType === "info") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="mb-2 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-2xl border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          <span class="text-xs">ℹ️</span>
          <span>${displayLabel}</span>
        </div>
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-black/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-115 text-white">
          <div class="absolute -inset-1 rounded-full border border-white/60 animate-ping opacity-40 pointer-events-none"></div>
          <svg class="w-7 h-7 text-white fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="8" x2="12.01" y2="8" stroke-width="3"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
          </svg>
        </div>
      </div>
    `;
  }

  // 8. CONCENTRIC TARGET FLOOR PUCK (গোল / টার্গেট রিং)
  return `
    <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
      <div class="mb-2 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-2xl border border-black/20 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
        <span class="text-xs font-black">⭕</span>
        <span>${displayLabel}</span>
      </div>
      <div style="transform: perspective(400px) rotateX(65deg);" class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-white/25 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-120">
        <div class="absolute -inset-1 rounded-full border-2 border-white animate-ping opacity-60"></div>
        <div class="w-6 h-6 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
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
        iconType: "door",
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
        iconType: "stairs",
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
        iconType: "stairs",
        position: { yaw: "45deg", pitch: "-35deg" },
      },
      {
        targetNodeId: "entrance",
        label: "Return to Ground Floor",
        type: "floor_puck",
        iconType: "arrow",
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
        iconType: "stairs",
        position: { yaw: "60deg", pitch: "-30deg" },
      },
      {
        targetNodeId: "floor_1",
        label: "Go Down to 1st Floor Lobby",
        type: "floor_puck",
        iconType: "arrow",
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
        iconType: "stairs",
        position: { yaw: "45deg", pitch: "-30deg" },
      },
      {
        targetNodeId: "floor_2",
        label: "Go Down to 2nd Floor Lounge",
        type: "floor_puck",
        iconType: "arrow",
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
        label: "5th Floor Cafeteria",
        type: "floor_puck",
        iconType: "dining",
        position: { yaw: "90deg", pitch: "-30deg" },
      },
      {
        targetNodeId: "floor_3",
        label: "Go Down to 3rd Floor Lab",
        type: "floor_puck",
        iconType: "arrow",
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
        label: "6th Floor Executive Suite",
        type: "floor_puck",
        iconType: "door",
        position: { yaw: "75deg", pitch: "-30deg" },
      },
      {
        targetNodeId: "floor_4",
        label: "Go Down to 4th Floor Gallery",
        type: "floor_puck",
        iconType: "arrow",
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
        iconType: "dining",
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
