import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import gsap from "gsap";
import Button from "../../components/reuseable/Button";
import { trackEvent } from "../../services/analyticsService";
import { apiGetTourById, apiGetOwnerTours } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faExpand,
  faCompress,
  faVolumeHigh,
  faVolumeMute,
  faChevronLeft,
  faChevronRight,
  faVrCardboard,
  faLayerGroup,
  faMicrophone,
  faMicrophoneSlash,
  faCommentDots,
  faShareNodes,
  faCopy,
  faCheck,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

// ==========================================
// CINEMATIC LUXURY SOUND & SPATIAL AUDIO SYNTHESIZERS
// ==========================================
class UISoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
  }

  // Soft subtle glass tap on hover (Volume: 0.08)
  playHoverClick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      // Glassy double overtone (1200Hz & 2400Hz)
      osc1.frequency.setValueAtTime(1200, now);
      osc1.frequency.exponentialRampToValueAtTime(800, now + 0.03);

      osc2.frequency.setValueAtTime(2400, now);
      osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.03);
      osc2.stop(now + 0.03);
    } catch (e) {}
  }

  // Luxurious smooth camera transition glide (Volume: 0.18)
  playCameraSwoosh() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;

      // Pitch glide chord (C5 to E5 to G5 pitch swell)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * 0.7, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.1, now + 0.22);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.35);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06 - idx * 0.015, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch (e) {}
  }
}

class MultiTrackAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.filter = null;
    this.lfo = null;
    this.lfoGain = null;
    this.oscillators = [];
    this.audioElement = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.currentConfig = null;
  }

  configure(config) {
    this.currentConfig = config;
    if (this.isPlaying && !this.isMuted) {
      this.play(config);
    }
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.lfo = this.ctx.createOscillator();
    this.lfoGain = this.ctx.createGain();
    this.lfo.type = "sine";
    this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    this.lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filter.frequency);

    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  play(config = this.currentConfig) {
    if (config) this.currentConfig = config;
    const activeConfig = this.currentConfig || {};

    if (activeConfig.enabled === false) {
      this.mute();
      return;
    }

    const vol = activeConfig.volume !== undefined ? activeConfig.volume : 0.3;

    // Custom MP3 Audio File
    if (activeConfig.sourceType === "custom" && activeConfig.customAudioUrl) {
      if (!this.audioElement || this.audioElement.src !== activeConfig.customAudioUrl) {
        if (this.audioElement) {
          try { this.audioElement.pause(); } catch (e) {}
        }
        this.audioElement = new Audio(activeConfig.customAudioUrl);
        this.audioElement.loop = true;
      }
      this.audioElement.volume = this.isMuted ? 0 : vol;
      this.audioElement.play().catch(() => {});
      this.isPlaying = true;
      return;
    }

    // Preset Audio Synthesizer
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const presetId = activeConfig.presetId || "luxury_piano";
    let freqs = [174.61, 220.0, 261.63, 329.63];
    if (presetId === "hotel_lounge") freqs = [138.59, 174.61, 207.65, 261.63];
    if (presetId === "ocean_breeze") freqs = [110.0, 164.81, 220.0, 246.94];
    if (presetId === "nature_birds") freqs = [220.0, 277.18, 329.63, 440.0];
    if (presetId === "lofi_chill") freqs = [146.83, 174.61, 220.0, 261.63];

    if (!this.isPlaying) {
      try {
        this.oscillators = freqs.map((freq) => {
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          oscGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(this.filter);
          osc.start();
          return osc;
        });
        this.lfo.start();
      } catch (e) {}
      this.isPlaying = true;
    }

    if (!this.isMuted) {
      this.masterGain.gain.setTargetAtTime(vol * 0.4, this.ctx.currentTime, 0.3);
    }
  }

  mute() {
    this.isMuted = true;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
    if (this.audioElement) {
      try { this.audioElement.pause(); } catch (e) {}
    }
  }

  unmute() {
    this.isMuted = false;
    this.play();
  }
}

const uiSound = new UISoundEngine();
const spatialAudio = new MultiTrackAudioEngine();

// ==========================================
// 3D FLOOR PUCK & DRONE HOTSPOT HELPERS
// ==========================================

const getHotspotIcon = (type) => {
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

const createFloorPuckMarkerHtml = (label, iconType = "arrow") => {
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
const createDroneHotspotHtml = (label, icon = "🛸") => `
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
const TOUR_NODES = [
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

function VirtualTourViewer({ fullScreenMode = false, overrideTourId }) {
  const [searchParams] = useSearchParams();
  const { tourId } = useParams();
  const targetTourId = overrideTourId || searchParams.get("id") || tourId;

  const [tourNodes, setTourNodes] = useState(TOUR_NODES);
  const [currentPanoramaId, setCurrentPanoramaId] = useState("aerial_view");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [snapshotEffect, setSnapshotEffect] = useState(false);

  // Voice AI Spatial Tour Guide State
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiTranscript, setAiTranscript] = useState("");
  const [aiSpokenResponse, setAiSpokenResponse] = useState("Hi! I'm your Voice AI Spatial Guide. Click the mic icon and speak!");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const psvRef = useRef(null);
  const viewportRef = useRef(null);
  const thumbnailScrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load dynamic custom tour uploaded by creator from backend API or localStorage
  useEffect(() => {
    let isMounted = true;

    const loadTourData = async () => {
      try {
        let matchedTour = null;

        // 1. Check localStorage first
        const savedLocalTours = localStorage.getItem("viewroom_custom_tours");
        if (savedLocalTours) {
          const parsedTours = JSON.parse(savedLocalTours);
          if (Array.isArray(parsedTours) && parsedTours.length > 0) {
            matchedTour = targetTourId
              ? parsedTours.find((t) => t.id === targetTourId)
              : parsedTours[0];
          }
        }

        // 2. Fetch specific tour by ID from backend API if missing from localStorage
        if (!matchedTour && targetTourId) {
          try {
            const fetched = await apiGetTourById(targetTourId);
            if (fetched && fetched.scenes && fetched.scenes.length > 0) {
              matchedTour = fetched;
            }
          } catch (e) {}
        }

        // 3. Fallback to owner tours list from backend API
        if (!matchedTour) {
          try {
            const ownerTours = await apiGetOwnerTours();
            if (ownerTours && ownerTours.length > 0) {
              matchedTour = targetTourId
                ? ownerTours.find((t) => t.id === targetTourId) || ownerTours[0]
                : ownerTours[0];
            }
          } catch (e) {}
        }

        if (isMounted && matchedTour && matchedTour.scenes && matchedTour.scenes.length > 0) {
          const mappedNodes = matchedTour.scenes.map((s, idx) => ({
            id: s.id,
            name: s.name || `Room Scene ${idx + 1}`,
            category: matchedTour.category || "Virtual Tour",
            floorLevel: s.floorLevel || idx,
            thumbnail: s.thumbnailUrl || s.panoramaUrl || s.thumbnail || s.panorama || "/panoramas/panorama_aerial.jpg",
            panorama: s.panoramaUrl || s.panorama || "/panoramas/panorama_aerial.jpg",
            connections: (s.hotspots || s.markers || []).map((hp) => ({
              targetNodeId: hp.targetId,
              label: hp.title,
              type: hp.type === "drone" ? "drone_badge" : "floor_puck",
              iconType: hp.type || "arrow",
              position: { yaw: hp.yaw || hp.position?.yaw || "0deg", pitch: hp.pitch || hp.position?.pitch || "-25deg" },
            })),
          }));
          setTourNodes(mappedNodes);
          setCurrentPanoramaId(mappedNodes[0].id);
          if (matchedTour.audioConfig) {
            spatialAudio.configure(matchedTour.audioConfig);
          }
        }
      } catch (err) {
        console.warn("Error loading custom tour nodes:", err);
      }
    };

    loadTourData();

    return () => {
      isMounted = false;
    };
  }, [targetTourId]);

  const activeNode = tourNodes.find((s) => s.id === currentPanoramaId) || tourNodes[0];

  // Dynamic Markers Generation from Connected Node Graph
  const activeMarkers = (activeNode.connections || []).map((conn, idx) => ({
    id: `m_${activeNode.id}_to_${conn.targetNodeId}_${idx}`,
    position: conn.position,
    html:
      conn.type === "drone_badge"
        ? createDroneHotspotHtml(conn.label)
        : createFloorPuckMarkerHtml(conn.label, conn.iconType || "arrow"),
    targetId: conn.targetNodeId,
  }));

  // Speech Synthesis Helper
  const speakResponse = (text) => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Client-Side Ultra-Fast 50ms Fuzzy Intent Matcher & Action Dispatcher
  const processVoiceCommand = async (rawTranscript) => {
    const q = rawTranscript.toLowerCase().trim();
    setIsAiThinking(true);

    // 1. Check Tour Action Controls
    if (q.includes("mute") && !q.includes("unmute")) {
      setIsMuted(true);
      spatialAudio.pause();
      const msg = "Audio muted.";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      setIsAiThinking(false);
      return;
    }

    if (q.includes("unmute") || q.includes("play music") || q.includes("sound on")) {
      setIsMuted(false);
      spatialAudio.play();
      const msg = "Audio unmuted.";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      setIsAiThinking(false);
      return;
    }

    if (q.includes("fullscreen") || q.includes("full screen")) {
      if (q.includes("exit") || q.includes("close") || q.includes("off")) {
        if (document.fullscreenElement) toggleFullscreen();
        const msg = "Exited fullscreen.";
        setAiSpokenResponse(msg);
        speakResponse(msg);
      } else {
        if (!document.fullscreenElement) toggleFullscreen();
        const msg = "Entered fullscreen.";
        setAiSpokenResponse(msg);
        speakResponse(msg);
      }
      setIsAiThinking(false);
      return;
    }

    if (q.includes("hotspot") || q.includes("portal") || q.includes("icon")) {
      if (q.includes("hide") || q.includes("disable") || q.includes("turn off")) {
        setShowHotspots(false);
        const msg = "Hotspots hidden.";
        setAiSpokenResponse(msg);
        speakResponse(msg);
      } else {
        setShowHotspots(true);
        const msg = "Hotspots displayed.";
        setAiSpokenResponse(msg);
        speakResponse(msg);
      }
      setIsAiThinking(false);
      return;
    }

    if (q.includes("menu")) {
      if (q.includes("close") || q.includes("hide")) {
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(true);
      }
      const msg = "Toggled action menu.";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      setIsAiThinking(false);
      return;
    }

    if (q.includes("share") || q.includes("embed")) {
      setShowShareModal(true);
      const msg = "Opened share and embed modal.";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      setIsAiThinking(false);
      return;
    }

    // 2. Check Room / Floor Navigation Matches (50ms Client-Side Instant Intent)
    let targetNode = null;
    if (q.includes("aerial") || q.includes("sky") || q.includes("bird") || q.includes("top") || q.includes("outside")) {
      targetNode = TOUR_NODES.find((n) => n.id === "aerial_view");
    } else if (q.includes("entrance") || q.includes("ground") || q.includes("lobby") || q.includes("door") || q.includes("floor 0")) {
      targetNode = TOUR_NODES.find((n) => n.id === "entrance");
    } else if (q.includes("1st") || q.includes("first") || q.includes("showroom 1") || (q.includes("floor") && q.includes("1"))) {
      targetNode = TOUR_NODES.find((n) => n.id === "floor_1");
    } else if (q.includes("2nd") || q.includes("second") || q.includes("workspace") || q.includes("office") || q.includes("lounge") || (q.includes("floor") && q.includes("2"))) {
      targetNode = TOUR_NODES.find((n) => n.id === "floor_2");
    } else if (q.includes("3rd") || q.includes("third") || q.includes("lab") || q.includes("r&d") || (q.includes("floor") && q.includes("3"))) {
      targetNode = TOUR_NODES.find((n) => n.id === "floor_3");
    } else if (q.includes("4th") || q.includes("fourth") || q.includes("gallery") || q.includes("fashion") || (q.includes("floor") && q.includes("4"))) {
      targetNode = TOUR_NODES.find((n) => n.id === "floor_4");
    } else if (q.includes("5th") || q.includes("fifth") || q.includes("cafeteria") || q.includes("dining") || q.includes("restaurant") || (q.includes("floor") && q.includes("5"))) {
      targetNode = TOUR_NODES.find((n) => n.id === "floor_5");
    } else if (q.includes("6th") || q.includes("sixth") || q.includes("penthouse") || q.includes("suite") || q.includes("executive") || (q.includes("floor") && q.includes("6"))) {
      targetNode = TOUR_NODES.find((n) => n.id === "floor_6");
    }

    if (targetNode) {
      setIsAiThinking(false);
      const msg = `Navigating to ${targetNode.name}.`;
      setAiSpokenResponse(msg);
      speakResponse(msg);
      if (targetNode.id !== currentPanoramaId) {
        uiSound.playCameraSwoosh();
        changePanoramaWithGsap(targetNode.id);
      }
      return;
    }

    // 3. Fallback to Server Gemini AI Agent (/api/v1/ai/spatial-voice)
    try {
      let res;
      try {
        res = await fetch("/api/v1/ai/spatial-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: rawTranscript, currentPanoramaId, nodes: TOUR_NODES }),
        });
      } catch (netErr) {
        res = await fetch("http://localhost:5000/api/v1/ai/spatial-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: rawTranscript, currentPanoramaId, nodes: TOUR_NODES }),
        });
      }

      if (res && res.ok) {
        const data = await res.json();
        setIsAiThinking(false);
        if (data.success && data.spokenResponse) {
          setAiSpokenResponse(data.spokenResponse);
          speakResponse(data.spokenResponse);
          if (data.targetNodeId && data.targetNodeId !== currentPanoramaId) {
            uiSound.playCameraSwoosh();
            changePanoramaWithGsap(data.targetNodeId);
          }
          return;
        }
      }
    } catch (apiErr) {
      console.warn("Backend Gemini AI Voice Assistant fallback:", apiErr);
    }

    // 4. Intelligent Fallback if query wasn't matched and API couldn't be reached
    setIsAiThinking(false);
    const fallbackMsg = `I heard "${rawTranscript}". You can ask me to navigate to Ground Floor, 1st Floor, 2nd Floor, 3rd Floor, 4th Floor, 5th Floor, 6th Floor, or Aerial View!`;
    setAiSpokenResponse(fallbackMsg);
    speakResponse(fallbackMsg);
  };

  // Web Speech API Microphone Handler
  const toggleVoiceAssistant = () => {
    uiSound.playHoverClick();
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const msg = "Web Speech API is not supported in this browser. Please use Google Chrome or Microsoft Edge!";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setAiTranscript("Listening for your voice command...");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAiTranscript(`"${transcript}"`);
        setIsListening(false);
        processVoiceCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          const msg = "Microphone permission is blocked in your browser. Please allow microphone access in your browser settings!";
          setAiSpokenResponse(msg);
          speakResponse(msg);
        } else if (event.error === "no-speech") {
          const msg = "I didn't hear anything. Please click the microphone icon and speak again!";
          setAiSpokenResponse(msg);
          speakResponse(msg);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };



  // GSAP Smooth Fade Transition on Panorama Node Change
  const changePanoramaWithGsap = (targetId) => {
    if (targetId === currentPanoramaId) return;

    trackEvent("tour_viewed", "Skyline Campus 360°", `Switched to node ${targetId}`);

    if (viewportRef.current) {
      gsap.to(viewportRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentPanoramaId(targetId);
          gsap.to(viewportRef.current, {
            opacity: 1,
            duration: 0.25,
            ease: "power2.inOut",
          });
        },
      });
    } else {
      setCurrentPanoramaId(targetId);
    }
  };

  // Preload Panoramas for Smooth 0ms Transitions
  useEffect(() => {
    TOUR_NODES.forEach((node) => {
      if (node.panorama && node.panorama.startsWith("/")) {
        const img = new Image();
        img.src = node.panorama;
      }
    });

    return () => {
      if (psvRef.current) {
        try {
          psvRef.current.destroy();
        } catch (err) {}
      }
      spatialAudio.mute();
    };
  }, []);

  // Global browser gesture listener to unlock Web Audio context
  useEffect(() => {
    const handleGesture = () => {
      if (!isMuted) {
        spatialAudio.play();
      }
    };

    window.addEventListener("click", handleGesture, { once: true });
    window.addEventListener("touchstart", handleGesture, { once: true });
    window.addEventListener("scroll", handleGesture, { once: true });

    return () => {
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("scroll", handleGesture);
    };
  }, [isMuted]);

  // Autoplay ambient spatial sound when viewer intersects viewport
  useEffect(() => {
    if (!viewportRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isMuted) spatialAudio.play();
          } else {
            spatialAudio.mute();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [isMuted]);

  // Sync Audio Mute State
  useEffect(() => {
    if (isMuted) {
      spatialAudio.mute();
    } else {
      spatialAudio.unmute();
    }
  }, [isMuted]);

  // Photo Sphere Viewer Instance Callback with Raycast & SFX Handling
  const handleReady = (instance) => {
    psvRef.current = instance;

    const markersPlugin = instance.getPlugin(MarkersPlugin);
    if (markersPlugin) {
      // Hover SFX on pointerenter
      markersPlugin.addEventListener("over-marker", () => {
        uiSound.playHoverClick();
      });

      // Select Marker: Camera Dolly Interpolation + Soft Swoosh SFX
      markersPlugin.addEventListener("select-marker", (e) => {
        const marker = e.marker;
        const targetId = marker?.config?.targetId;
        if (targetId) {
          uiSound.playCameraSwoosh();

          instance
            .animate({
              yaw: marker.config.position.yaw,
              pitch: marker.config.position.pitch,
              zoom: 60, // Camera dolly zoom toward floor node
              speed: "3rpm",
            })
            .then(() => {
              changePanoramaWithGsap(targetId);
            })
            .catch(() => {
              changePanoramaWithGsap(targetId);
            });
        }
      });
    }
  };

  // Scroll Thumbnails Helper
  const scrollThumbnails = (direction) => {
    if (thumbnailScrollRef.current) {
      const amount = direction === "left" ? -280 : 280;
      thumbnailScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!viewportRef.current) return;
    if (!document.fullscreenElement) {
      viewportRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  // Plugin configuration for PhotoSphereViewer
  const plugins = [
    [
      MarkersPlugin,
      {
        markers: showHotspots ? activeMarkers : [],
      },
    ],
  ];

  return (
    <div className="w-full h-screen relative bg-black select-none overflow-hidden">
      {/* 360 VIEWPORT CONTAINER */}
      <div
        ref={viewportRef}
        onClick={() => {
          if (!isMuted) spatialAudio.play();
        }}
        className="relative w-full h-full bg-black group overflow-hidden"
      >
        {/* Photo Sphere Viewer Renderer */}
        <ReactPhotoSphereViewer
          key={`${activeNode.id}_${activeNode.panorama}`}
          src={activeNode.panorama}
          height="100%"
          width="100%"
          container="psv-container"
          navbar={false}
          mousewheel={true}
          defaultYaw="0deg"
          defaultPitch="0deg"
          defaultZoomLvl={0}
          plugins={plugins}
          onReady={handleReady}
        />

        {/* Snapshot Flash Overlay */}
        {snapshotEffect && (
          <div className="absolute inset-0 bg-white animate-in fade-in fade-out duration-300 pointer-events-none z-50" />
        )}

        {/* TOP-LEFT BRANDING & SCENE BADGE */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2.5 bg-black/75 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg pointer-events-auto">
          <FontAwesomeIcon icon={faLayerGroup} className="text-white text-xs sm:text-sm" />
          <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
            {activeNode.name}
          </span>
        </div>

        {/* TOP CENTER GLASSMORPHIC VOICE AI TOAST & TRANSCRIPT */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 max-w-md w-[90%] sm:w-auto pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md border border-black/15 rounded-2xl px-4.5 py-2.5 shadow-xl flex items-center gap-3 text-black">
            <div className="relative shrink-0 flex items-center justify-center">
              <FontAwesomeIcon icon={faCommentDots} className="text-black text-base animate-pulse" />
              {isAiThinking && (
                <div className="absolute inset-0 rounded-full border border-black animate-spin"></div>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
                VOICE AI SPATIAL ASSISTANT
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-tight text-black">
                {isListening ? aiTranscript : isAiThinking ? "Analyzing spatial intent..." : aiSpokenResponse}
              </p>
            </div>
          </div>
        </div>

        {/* VERTICAL TOGGLE ACTION MENU */}
        <div className="absolute top-5 right-5 z-30 flex flex-col items-center gap-3 pointer-events-auto">
          {isMenuOpen ? (
            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => {
                  uiSound.playHoverClick();
                  setIsMenuOpen(false);
                }}
                onMouseEnter={() => uiSound.playHoverClick()}
                title="Close Action Menu"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border-2 border-white/80 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>

              {/* VOICE AI MICROPHONE TRIGGER BUTTON */}
              <button
                type="button"
                onClick={toggleVoiceAssistant}
                onMouseEnter={() => uiSound.playHoverClick()}
                title={isListening ? "Stop Listening" : "Voice AI Spatial Guide"}
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md border flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer ${
                  isListening
                    ? "bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,1)] animate-bounce"
                    : "bg-white/25 hover:bg-white/40 border-white/40 text-white"
                }`}
              >
                <FontAwesomeIcon icon={isListening ? faMicrophone : faMicrophone} className="text-base" />
                {isListening && (
                  <span className="absolute -inset-1 rounded-full border-2 border-white animate-ping"></span>
                )}
              </button>

              {/* TOGGLE HOTSPOTS VISIBILITY BUTTON */}
              <button
                type="button"
                onClick={() => {
                  uiSound.playHoverClick();
                  setShowHotspots(!showHotspots);
                }}
                onMouseEnter={() => uiSound.playHoverClick()}
                title={showHotspots ? "Hide Hotspots" : "Show Hotspots"}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md border flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer ${
                  showHotspots
                    ? "bg-white/25 hover:bg-white/40 border-white/40 text-white"
                    : "bg-amber-500/80 text-white border-amber-400 font-bold"
                }`}
              >
                <FontAwesomeIcon icon={showHotspots ? faEye : faEyeSlash} className="text-base" />
              </button>

              {/* SHARE & EMBED BUTTON */}
              <button
                type="button"
                onClick={() => {
                  uiSound.playHoverClick();
                  setShowShareModal(true);
                }}
                onMouseEnter={() => uiSound.playHoverClick()}
                title="Share Tour Link & Embed"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
              >
                <FontAwesomeIcon icon={faShareNodes} className="text-base" />
              </button>

              <button
                type="button"
                onClick={() => {
                  uiSound.playHoverClick();
                  toggleFullscreen();
                }}
                onMouseEnter={() => uiSound.playHoverClick()}
                title="VR Mode / Headset"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
              >
                <FontAwesomeIcon icon={faVrCardboard} className="text-base" />
              </button>

              <button
                type="button"
                onClick={() => {
                  uiSound.playHoverClick();
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (!nextMuted) spatialAudio.play();
                }}
                onMouseEnter={() => uiSound.playHoverClick()}
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md border flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer ${
                  !isMuted
                    ? "bg-white text-black border-white font-bold"
                    : "bg-white/25 hover:bg-white/40 border-white/40 text-white"
                }`}
              >
                <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeHigh} className="text-base" />
              </button>

              <button
                type="button"
                onClick={() => {
                  uiSound.playHoverClick();
                  toggleFullscreen();
                }}
                onMouseEnter={() => uiSound.playHoverClick()}
                title="Toggle Fullscreen"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
              >
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="text-base" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                uiSound.playHoverClick();
                setIsMenuOpen(true);
              }}
              onMouseEnter={() => uiSound.playHoverClick()}
              title="Open Action Menu"
              className="w-12 h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border-2 border-white/80 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
            >
              <FontAwesomeIcon icon={faBars} className="text-lg" />
            </button>
          )}
        </div>

        {/* BOTTOM THUMBNAIL GALLERY CAROUSEL */}
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-5xl flex items-center justify-between pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                uiSound.playHoverClick();
                scrollThumbnails("left");
              }}
              onMouseEnter={() => uiSound.playHoverClick()}
              className="w-9 h-9 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 flex items-center justify-center text-sm shrink-0 mr-2 cursor-pointer shadow-xl transition-colors backdrop-blur-md"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <div
              ref={thumbnailScrollRef}
              className="flex items-center gap-3.5 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth w-full justify-start sm:justify-center"
            >
              {tourNodes.map((node) => {
                const isActive = node.id === currentPanoramaId;
                return (
                  <button
                    type="button"
                    key={node.id}
                    onClick={() => {
                      uiSound.playCameraSwoosh();
                      changePanoramaWithGsap(node.id);
                    }}
                    onMouseEnter={() => uiSound.playHoverClick()}
                    className="flex flex-col items-center shrink-0 group cursor-pointer"
                  >
                    <div
                      className={`relative w-28 sm:w-36 h-16 sm:h-20 rounded-2xl overflow-hidden transition-all duration-200 ${
                        isActive
                          ? "border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.7)] scale-105"
                          : "border border-white/30 opacity-75 group-hover:opacity-100 group-hover:border-white/70"
                      }`}
                    >
                      <img
                        src={node.thumbnail}
                        alt={node.name}
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                      )}
                    </div>

                    <span
                      className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mt-2 transition-colors ${
                        isActive ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : "text-white/75 group-hover:text-white"
                      }`}
                    >
                      {node.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                uiSound.playHoverClick();
                scrollThumbnails("right");
              }}
              onMouseEnter={() => uiSound.playHoverClick()}
              className="w-9 h-9 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 flex items-center justify-center text-sm shrink-0 ml-2 cursor-pointer shadow-xl transition-colors backdrop-blur-md"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {/* SHARE & EMBED MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-black/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-black">
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-black transition-colors text-xl font-bold cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <h3 className="text-2xl font-black uppercase tracking-tight mb-1 text-black">
              Share 360° Virtual Tour
            </h3>
            <p className="text-xs text-zinc-600 mb-6 font-medium">
              Share this interactive multi-floor 3D tour link or embed directly on external real estate listings.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-zinc-700">
                  Direct Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/tour/${activeNode.id}`}
                    className="w-full bg-zinc-100 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-800 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/tour/${activeNode.id}`);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                  >
                    <FontAwesomeIcon icon={copiedLink ? faCheck : faCopy} className="mr-2" />
                    {copiedLink ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-zinc-700">
                  iFrame Embed Code
                </label>
                <textarea
                  readOnly
                  rows={3}
                  value={`<iframe src="${window.location.origin}/tour/${activeNode.id}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`}
                  className="w-full bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-[11px] font-mono text-zinc-800 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setShowShareModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VirtualTourViewer;
