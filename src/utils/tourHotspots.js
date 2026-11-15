// ==========================================
// 3D FLOOR PUCK & DRONE HOTSPOT HELPERS
// ==========================================

export const getHotspotIcon = (type) => {
  switch (type) {
    case "arrow": return "∧";
    case "door": return "🚪";
    case "puck": return "⭕";
    case "bathroom": return "🛁";
    case "kitchen": return "🍳";
    case "dining": return "🍽️";
    case "stairs": return "🪜";
    case "bedroom": return "🛏️";
    case "info": return "ℹ️";
    default: return "➔";
  }
};

// Helper for Pure White Bold Label with Drop Shadow (Matching Reference Image)
const makeLabelHtml = (text) => `
  <div class="mt-2 flex items-center justify-center pointer-events-none select-none">
    <span style="color: #ffffff !important; text-shadow: 0 2px 4px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.85);" class="!text-white text-xs sm:text-sm font-extrabold tracking-wide uppercase whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
      ${text}
    </span>
  </div>
`;

export const createFloorPuckMarkerHtml = (label, rawIconType = "arrow") => {
  const displayLabel = label || "NAVIGATE";
  let iconType = String(rawIconType || "").toLowerCase().trim();

  // Normalize synonyms
  if (iconType === "chevron") iconType = "arrow";
  else if (iconType === "target" || iconType === "ring" || iconType === "circle") iconType = "puck";
  else if (iconType === "information") iconType = "info";
  else if (iconType === "bath" || iconType === "washroom" || iconType === "toilet") iconType = "bathroom";
  else if (iconType === "cook" || iconType === "cooking" || iconType === "stove") iconType = "kitchen";
  else if (iconType === "dine" || iconType === "food") iconType = "dining";
  else if (iconType === "stair" || iconType === "step") iconType = "stairs";
  else if (iconType === "bed") iconType = "bedroom";

  // Fallback check against label text ONLY if iconType is generic or missing
  if (!iconType || iconType === "floor_puck" || iconType === "arrow") {
    const lbl = displayLabel.toLowerCase();
    if (lbl.includes("bath") || lbl.includes("washroom") || lbl.includes("toilet")) iconType = "bathroom";
    else if (lbl.includes("kitchen") || lbl.includes("cook") || lbl.includes("stove")) iconType = "kitchen";
    else if (lbl.includes("dining") || lbl.includes("cafe") || lbl.includes("food")) iconType = "dining";
    else if (lbl.includes("door") || lbl.includes("enter") || lbl.includes("entry") || lbl.includes("suite")) iconType = "door";
    else if (lbl.includes("stair") || lbl.includes("step") || lbl.includes("level")) iconType = "stairs";
    else if (lbl.includes("bedroom")) iconType = "bedroom";
  }

  // 1. CHEVRON ARROW (তীর)
  if (iconType === "arrow") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div style="transform: perspective(300px) rotateX(58deg);" class="relative flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-125">
          <div class="w-16 h-8 bg-black/40 rounded-full blur-md absolute top-4 -z-10"></div>
          <svg class="w-16 h-10 text-white/70 animate-ping opacity-75 absolute -top-2" viewBox="0 0 64 36" fill="none">
            <path d="M8 28L32 10L56 28" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg class="w-16 h-10 text-white filter drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]" viewBox="0 0 64 36" fill="none">
            <path d="M8 28L32 10L56 28" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        ${makeLabelHtml(displayLabel)}
      </div>
    `;
  }

  // 2. DOORWAY / PORTAL (অ্যানিমেটেড দরজা - দ্রুত, লাইটওয়েট ও স্মুথ ২D অ্যাক্সিলারেশন)
  if (iconType === "door") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <!-- Circular White Ring Puck (No blur, crystal clear matching reference) -->
        <div class="vr-door-ring relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3.5px] border-white bg-black/25 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-110">
          <div class="relative w-7 h-8 flex items-center justify-center pointer-events-none">
            <!-- Hollow White Door Frame on Left (Revealed on Open) -->
            <div class="absolute left-[3px] top-[1px] w-[19px] h-[30px] border-[2.2px] border-white rounded-[1.5px] box-border"></div>
            <!-- Solid White Door Leaf (Snappy Smooth Swing) -->
            <div class="vr-door-leaf absolute left-[3px] top-[1px] w-[19px] h-[30px] bg-white rounded-[1.5px] box-border shadow-xs">
              <!-- Dark Doorknob Dot -->
              <div class="absolute left-[3px] top-1/2 -translate-y-1/2 w-[2.8px] h-[2.8px] bg-neutral-900 rounded-full"></div>
            </div>
          </div>
        </div>
        ${makeLabelHtml(displayLabel)}
      </div>
    `;
  }

  // 3. BATHROOM (বাথরুম)
  if (iconType === "bathroom") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-white bg-black/25 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 text-white">
          <svg class="w-8 h-8 text-white fill-none stroke-current filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 11h16a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a1 1 0 0 1 1-1z"/>
            <path d="M6 11V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1"/>
            <circle cx="11" cy="6" r="0.8" fill="white"/>
            <path d="M5 18l-1 2m16-2l1 2"/>
          </svg>
        </div>
        ${makeLabelHtml(displayLabel)}
      </div>
    `;
  }

  // 4. KITCHEN / COOKING (কিচেন)
  if (iconType === "kitchen") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-white bg-black/25 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 text-white">
          <svg class="w-8 h-8 text-white fill-none stroke-current filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="6" width="18" height="12" rx="3"/>
            <circle cx="8" cy="11" r="2.2" fill="white"/>
            <circle cx="16" cy="11" r="2.2" fill="white"/>
            <path d="M4 15h16"/>
          </svg>
        </div>
        ${makeLabelHtml(displayLabel)}
      </div>
    `;
  }

  // 5. DINING & TABLE (ডাইনিং)
  if (iconType === "dining") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-white bg-black/25 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 text-white">
          <svg class="w-8 h-8 text-white fill-none stroke-current filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 2v20M18 2a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3M6 2v7a3 3 0 0 0 6 0V2M9 12v10"/>
          </svg>
        </div>
        ${makeLabelHtml(displayLabel)}
      </div>
    `;
  }

  // 6. STAIRS (সিঁড়ি)
  if (iconType === "stairs") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-white bg-black/25 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 text-white">
          <svg class="w-8 h-8 text-white fill-none stroke-current filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 20h4v-4h4v-4h4V8h4V4"/>
            <path d="M6 10l8-8m0 0h-5m5 0v5"/>
          </svg>
        </div>
        ${makeLabelHtml(displayLabel)}
      </div>
    `;
  }

  // 7. BEDROOM (বেডরুম)
  if (iconType === "bedroom") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-white bg-black/25 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 text-white">
          <svg class="w-8 h-8 text-white fill-none stroke-current filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 19h20M2 17v2m20-2v2M2 8v9h20V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
            <circle cx="7" cy="11" r="2" fill="white"/>
            <circle cx="17" cy="11" r="2" fill="white"/>
          </svg>
        </div>
        ${makeLabelHtml(displayLabel)}
      </div>
    `;
  }

  // 8. INFO BEACON (ইনফো)
  if (iconType === "info") {
    return `
      <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
        <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-white bg-black/25 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 text-white">
          <svg class="w-8 h-8 text-white fill-none stroke-current filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="8" x2="12.01" y2="8" stroke-width="3"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
          </svg>
        </div>
        ${makeLabelHtml(displayLabel)}
      </div>
    `;
  }

  // 9. ANIMATED CONCENTRIC ROUND BEACON (অ্যানিমেটেড গোল আইকন - ইমেজ ৪ অনুযায়ী)
  return `
    <div class="cursor-pointer group relative flex flex-col items-center justify-center p-2 select-none">
      <!-- Animated Round Beacon Puck -->
      <div class="vr-beacon-ring relative w-13 h-13 sm:w-15 sm:h-15 rounded-full border-[3.5px] border-white bg-black/30 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-115">
        <!-- Expanding Radar Ripple Wave -->
        <div class="vr-beacon-wave absolute inset-0 rounded-full border-2 border-white/80 pointer-events-none"></div>
        <!-- Center Solid White Dot -->
        <div class="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)]"></div>
      </div>
      ${makeLabelHtml(displayLabel)}
    </div>
  `;
};

// Floating Drone / Aerial Action Hotspot
export const createDroneHotspotHtml = (label, icon = "🛸") => `
  <div class="cursor-pointer group flex flex-col items-center p-3 select-none">
    <div class="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/25 hover:bg-white hover:text-black backdrop-blur-md border-2 border-white text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-2.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.9)]">
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
    defaultYaw: "0deg",
    defaultPitch: "-10deg",
    connections: [
      {
        targetNodeId: "entrance",
        label: "Enter Main Building",
        type: "floor_puck",
        iconType: "door",
        position: { yaw: "0deg", pitch: "-25deg" },
      },
      {
        targetNodeId: "floor_1",
        label: "Direct to 1st Floor Lounge",
        type: "floor_puck",
        iconType: "arrow",
        position: { yaw: "65deg", pitch: "-30deg" },
      },
    ],
  },
  {
    id: "entrance",
    name: "Grand Entrance & Reception",
    category: "Main Building",
    floorLevel: 0,
    thumbnail: "/panoramas/panorama_entrance.jpg",
    panorama: "/panoramas/panorama_entrance.jpg",
    defaultYaw: "35deg",
    defaultPitch: "-5deg",
    connections: [
      {
        targetNodeId: "floor_1",
        label: "Stairs to 1st Floor Gallery",
        type: "floor_puck",
        iconType: "stairs",
        position: { yaw: "35deg", pitch: "-25deg" },
      },
      {
        targetNodeId: "aerial_view",
        label: "Fly Above • Aerial View",
        type: "drone_badge",
        iconType: "arrow",
        position: { yaw: "-120deg", pitch: "25deg" },
      },
    ],
  },
  {
    id: "floor_1",
    name: "1st Floor Executive Suite & Lounge",
    category: "Executive Workshop",
    floorLevel: 1,
    thumbnail: "/panoramas/panorama_floor1.jpg",
    panorama: "/panoramas/panorama_floor1.jpg",
    defaultYaw: "45deg",
    defaultPitch: "0deg",
    connections: [
      {
        targetNodeId: "entrance",
        label: "Return to Reception Lobby",
        type: "floor_puck",
        iconType: "door",
        position: { yaw: "-135deg", pitch: "-25deg" },
      },
      {
        targetNodeId: "aerial_view",
        label: "Fly Above • Campus Aerial",
        type: "drone_badge",
        iconType: "arrow",
        position: { yaw: "90deg", pitch: "25deg" },
      },
    ],
  },
];
