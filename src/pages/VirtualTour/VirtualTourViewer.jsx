import React, { useState, useRef, useEffect } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import gsap from "gsap";
import Button from "../../components/reuseable/Button";
import { trackEvent } from "../../services/analyticsService";
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

class SpatialAmbientAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.filter = null;
    this.lfo = null;
    this.lfoGain = null;
    this.oscillators = [];
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    // Warm Analog Lowpass Filter for soft soothing ambient pad
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // LFO for slow organic breathing / swell effect (0.08 Hz)
    this.lfo = this.ctx.createOscillator();
    this.lfoGain = this.ctx.createGain();
    this.lfo.type = "sine";
    this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    this.lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filter.frequency);

    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Deep soothing ambient chord (F2, C3, F3, A3, C4)
    const chord = [87.31, 130.81, 174.61, 220.0, 261.63];
    this.oscillators = chord.map((freq) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      oscGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.filter);
      return osc;
    });
  }

  play() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (!this.isPlaying) {
      try {
        this.oscillators.forEach((osc) => osc.start());
        this.lfo.start();
      } catch (e) {}
      this.isPlaying = true;
    }
    // Set gentle relaxing background volume (15%)
    this.masterGain.gain.setTargetAtTime(0.15, this.ctx.currentTime, 0.5);
  }

  mute() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
  }

  unmute() {
    if (this.masterGain && this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.masterGain.gain.setTargetAtTime(0.15, this.ctx.currentTime, 0.3);
    }
  }
}

const uiSound = new UISoundEngine();
const spatialAudio = new SpatialAmbientAudio();

// ==========================================
// 3D FLOOR PUCK & DRONE HOTSPOT HELPERS
// ==========================================

// Double Concentric Ring Floor Target (Puck) - Clean UI without persistent static text badge
const createFloorPuckMarkerHtml = (label) => `
  <div class="cursor-pointer group relative flex flex-col items-center justify-center p-3 select-none">
    <!-- Hover Pill Badge (Fades in on hover rgba(0,0,0,0.75), white typography, arrow indicator) -->
    <div class="absolute -top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/50 text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-wider whitespace-nowrap shadow-2xl group-hover:-translate-y-1">
      <span>${label}</span>
      <span class="text-xs">➔</span>
    </div>

    <!-- Minimal Circular Floor Target Puck (XZ Floor Plane Perspective Tilt, scales 1.0x to 1.15x) -->
    <div style="transform: perspective(500px) rotateX(70deg);" class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/80 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-115 group-hover:border-white group-hover:bg-white/40 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.95)]">
      <!-- Outer Translucent Ring Ripple -->
      <div class="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-60"></div>
      <!-- Inner Solid Bright White Circle -->
      <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)] transition-transform duration-300 group-hover:scale-110"></div>
    </div>
  </div>
`;

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

function VirtualTourViewer() {
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

  const activeNode = TOUR_NODES.find((s) => s.id === currentPanoramaId) || TOUR_NODES[0];

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
      setAiSpokenResponse("Web Speech API is not supported in this browser. Try Chrome or Edge!");
      speakResponse("Web Speech API is not supported in your browser.");
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

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setAiTranscript(`"${transcript}"`);
        setIsListening(false);
        setIsAiThinking(true);

        try {
          const res = await fetch("/api/v1/ai/spatial-voice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: transcript,
              currentPanoramaId,
              nodes: TOUR_NODES,
            }),
          });
          const data = await res.json();
          setIsAiThinking(false);

          if (data.success) {
            setAiSpokenResponse(data.spokenResponse || "Navigating room view.");
            speakResponse(data.spokenResponse);

            if (data.targetNodeId && data.targetNodeId !== currentPanoramaId) {
              uiSound.playCameraSwoosh();
              changePanoramaWithGsap(data.targetNodeId);
            }
          }
        } catch (err) {
          setIsAiThinking(false);
          const errorMsg = "I couldn't process that voice command. Please try again.";
          setAiSpokenResponse(errorMsg);
          speakResponse(errorMsg);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setAiTranscript("");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition failed:", err);
      setIsListening(false);
    }
  };

  // Dynamic Markers Generation from Connected Node Graph
  const activeMarkers = activeNode.connections.map((conn, idx) => ({
    id: `m_${activeNode.id}_to_${conn.targetNodeId}_${idx}`,
    position: conn.position,
    html:
      conn.type === "drone_badge"
        ? createDroneHotspotHtml(conn.label)
        : createFloorPuckMarkerHtml(conn.label),
    targetId: conn.targetNodeId,
  }));

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
    <div className="w-full flex flex-col items-center select-none">
      {/* 360 VIEWPORT CONTAINER */}
      <div
        ref={viewportRef}
        onClick={() => {
          if (!isMuted) spatialAudio.play();
        }}
        className="relative w-full h-[520px] sm:h-[640px] lg:h-[720px] overflow-hidden shadow-2xl bg-black group"
      >
        {/* Photo Sphere Viewer Renderer */}
        <ReactPhotoSphereViewer
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

        {/* TOP-LEFT MULTI-FLOOR BRANDING & LEVEL BADGE */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2.5 bg-black/75 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg pointer-events-auto">
          <FontAwesomeIcon icon={faLayerGroup} className="text-white text-xs sm:text-sm" />
          <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
            FLOOR {activeNode.floorLevel} • {activeNode.name}
          </span>
        </div>

        {/* TOP CENTER GLASSMORPHIC VOICE AI TOAST & TRANSCRIPT */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 max-w-md w-[90%] sm:w-auto pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-xl border border-white/30 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3 text-white">
            <div className="relative shrink-0 flex items-center justify-center">
              <FontAwesomeIcon icon={faCommentDots} className="text-white text-base animate-pulse" />
              {isAiThinking && (
                <div className="absolute inset-0 rounded-full border border-white animate-spin"></div>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
                VOICE AI SPATIAL ASSISTANT
              </span>
              <p className="text-xs sm:text-sm font-medium leading-tight text-white drop-shadow">
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
              {TOUR_NODES.map((node) => {
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
                      {node.name.split(" ")[0]} FL {node.floorLevel}
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

      {/* METADATA FOOTER BELOW VIEWER */}
      <div className="max-w-7xl w-full mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--app-text-secondary)]">
            CURRENT NODE • {activeNode.category} (FLOOR {activeNode.floorLevel})
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--app-text-primary)]">
            {activeNode.name}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={toggleFullscreen}>
            Launch Fullscreen 360
          </Button>
          <Button variant="secondary" onClick={() => setShowHotspots(!showHotspots)}>
            {showHotspots ? "Hide Hotspots" : "Show Hotspots"}
          </Button>
          <Button variant="secondary" onClick={() => setShowShareModal(true)}>
            Share Tour
          </Button>
        </div>
      </div>

      {/* SHARE & EMBED MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white">
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors text-xl font-bold cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <h3 className="text-2xl font-black uppercase tracking-tight mb-1 text-white">
              Share 360° Virtual Tour
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Share this interactive multi-floor 3D tour link or embed directly on external real estate listings.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-zinc-300">
                  Direct Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/tour/${activeNode.id}`}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-200 focus:outline-none"
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
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-zinc-300">
                  iFrame Embed Code
                </label>
                <textarea
                  readOnly
                  rows={3}
                  value={`<iframe src="${window.location.origin}/tour/${activeNode.id}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 text-[11px] font-mono text-zinc-200 focus:outline-none resize-none"
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
