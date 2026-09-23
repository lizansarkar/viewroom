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
  faEye,
  faEyeSlash,
  faCamera,
  faChevronLeft,
  faChevronRight,
  faVrCardboard,
} from "@fortawesome/free-solid-svg-icons";

// 360 Scenes dataset (AERIAL VIEW, ENTRANCE, 1ST FLOOR - 6TH FLOOR)
const PANORAMA_DATA = [
  {
    id: "aerial_view",
    name: "AERIAL VIEW",
    category: "Campus Aerial",
    thumbnail: "/panoramas/panorama_aerial.jpg",
    panorama: "/panoramas/panorama_aerial.jpg",
    markers: [
      {
        id: "m_entrance",
        position: { yaw: "0deg", pitch: "-15deg" },
        html: `<div class="cursor-pointer group flex flex-col items-center p-5 sm:p-7">
                <div class="px-6 py-3 rounded-full bg-white/25 hover:bg-cyan-400 backdrop-blur-md border-2 border-white text-white hover:text-black shadow-2xl flex items-center gap-2 transition-transform group-hover:scale-110">
                  <span class="text-xs font-black">▲ ENTRANCE</span>
                </div>
              </div>`,
        targetId: "entrance",
      },
    ],
  },
  {
    id: "entrance",
    name: "ENTRANCE",
    category: "Main Building",
    thumbnail: "/panoramas/panorama_entrance.jpg",
    panorama: "/panoramas/panorama_entrance.jpg",
    markers: [
      {
        id: "m_floor1",
        position: { yaw: "30deg", pitch: "-5deg" },
        html: `<div class="cursor-pointer group flex flex-col items-center p-5 sm:p-7">
                <div class="w-14 h-14 rounded-full bg-black/80 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  🚪
                </div>
                <span class="mt-1 bg-black/80 text-cyan-300 px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase">1ST FLOOR LOBBY</span>
              </div>`,
        targetId: "floor_1",
      },
    ],
  },
  {
    id: "floor_1",
    name: "1ST FLOOR",
    category: "Reception Lobby",
    thumbnail: "/panoramas/panorama_floor1.jpg",
    panorama: "/panoramas/panorama_floor1.jpg",
    markers: [
      {
        id: "m_floor2",
        position: { yaw: "-45deg", pitch: "0deg" },
        html: `<div class="cursor-pointer group flex flex-col items-center p-5 sm:p-7">
                <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <span class="w-4 h-4 rounded-full bg-white"></span>
                </div>
                <span class="mt-1 bg-black/80 text-white px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase">2ND FLOOR WORKSPACE</span>
              </div>`,
        targetId: "floor_2",
      },
    ],
  },
  {
    id: "floor_2",
    name: "2ND FLOOR",
    category: "Open Office",
    thumbnail: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000",
    markers: [
      {
        id: "m_floor3",
        position: { yaw: "60deg", pitch: "0deg" },
        html: `<div class="cursor-pointer group flex flex-col items-center p-5 sm:p-7">
                <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <span class="w-4 h-4 rounded-full bg-white"></span>
                </div>
                <span class="mt-1 bg-black/80 text-white px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase">3RD FLOOR LAB</span>
              </div>`,
        targetId: "floor_3",
      },
    ],
  },
  {
    id: "floor_3",
    name: "3RD FLOOR",
    category: "R&D Workstations",
    thumbnail: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=2000",
    markers: [
      {
        id: "m_floor4",
        position: { yaw: "-30deg", pitch: "-5deg" },
        html: `<div class="cursor-pointer group flex flex-col items-center p-5 sm:p-7">
                <div class="w-14 h-14 rounded-full bg-black/80 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  🚪
                </div>
                <span class="mt-1 bg-black/80 text-cyan-300 px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase">4TH FLOOR GALLERY</span>
              </div>`,
        targetId: "floor_4",
      },
    ],
  },
  {
    id: "floor_4",
    name: "4TH FLOOR",
    category: "Fashion Gallery",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
    markers: [
      {
        id: "m_floor5",
        position: { yaw: "90deg", pitch: "-10deg" },
        html: `<div class="cursor-pointer group flex flex-col items-center p-5 sm:p-7">
                <div class="px-6 py-3 rounded-full bg-white/25 hover:bg-cyan-400 backdrop-blur-md border-2 border-white text-white hover:text-black shadow-2xl flex items-center gap-2 transition-transform group-hover:scale-110">
                  <span class="text-xs font-black">▲ 5TH FLOOR CAFETERIA</span>
                </div>
              </div>`,
        targetId: "floor_5",
      },
    ],
  },
  {
    id: "floor_5",
    name: "5TH FLOOR",
    category: "Dining & Lounge",
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000",
    markers: [
      {
        id: "m_floor6",
        position: { yaw: "-80deg", pitch: "0deg" },
        html: `<div class="cursor-pointer group flex flex-col items-center p-5 sm:p-7">
                <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <span class="w-4 h-4 rounded-full bg-white"></span>
                </div>
                <span class="mt-1 bg-black/80 text-white px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase">6TH FLOOR SUITE</span>
              </div>`,
        targetId: "floor_6",
      },
    ],
  },
  {
    id: "floor_6",
    name: "6TH FLOOR",
    category: "Executive Workshop",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
    panorama: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000",
    markers: [
      {
        id: "m_aerial",
        position: { yaw: "180deg", pitch: "-15deg" },
        html: `<div class="cursor-pointer group flex flex-col items-center p-5 sm:p-7">
                <div class="px-6 py-3 rounded-full bg-white/25 hover:bg-cyan-400 backdrop-blur-md border-2 border-white text-white hover:text-black shadow-2xl flex items-center gap-2 transition-transform group-hover:scale-110">
                  <span class="text-xs font-black">▲ AERIAL CAMPUS</span>
                </div>
              </div>`,
        targetId: "aerial_view",
      },
    ],
  },
];

function VirtualTourViewer() {
  const [currentPanoramaId, setCurrentPanoramaId] = useState("aerial_view");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [snapshotEffect, setSnapshotEffect] = useState(false);

  const psvRef = useRef(null);
  const viewportRef = useRef(null);
  const thumbnailScrollRef = useRef(null);

  const activeScene = PANORAMA_DATA.find((s) => s.id === currentPanoramaId) || PANORAMA_DATA[0];

  // GSAP Smooth Fade Transition on Panorama Change
  const changePanoramaWithGsap = (targetId) => {
    if (targetId === currentPanoramaId) return;

    trackEvent("tour_viewed", "Skyline Campus 360°", `Switched to scene ${targetId}`);

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

  // Background Preload Adjacent Scene Textures into Browser Cache for 0ms transitions
  useEffect(() => {
    PANORAMA_DATA.forEach((scene) => {
      if (scene.panorama && scene.panorama.startsWith("/")) {
        const img = new Image();
        img.src = scene.panorama;
      }
    });

    // Cleanup WebGL PhotoSphereViewer instance on unmount
    return () => {
      if (psvRef.current) {
        try {
          psvRef.current.destroy();
        } catch (err) {
          // Ignore unmount cleanup warning
        }
      }
    };
  }, []);

  // Photo Sphere Viewer Instance Callback
  const handleReady = (instance) => {
    psvRef.current = instance;

    // Handle marker click events
    const markersPlugin = instance.getPlugin(MarkersPlugin);
    if (markersPlugin) {
      markersPlugin.addEventListener("select-marker", (e) => {
        const targetId = e.marker.config.targetId;
        if (targetId) {
          changePanoramaWithGsap(targetId);
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

  // Snapshot Flash Effect
  const takeSnapshot = () => {
    setSnapshotEffect(true);
    setTimeout(() => setSnapshotEffect(false), 400);
  };

  // Plugin configuration for ReactPhotoSphereViewer
  const plugins = [
    [
      MarkersPlugin,
      {
        markers: showHotspots ? activeScene.markers : [],
      },
    ],
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center select-none">
      
      {/* 360 VIEWPORT CONTAINER */}
      <div
        ref={viewportRef}
        className="relative w-full h-[520px] sm:h-[640px] lg:h-[720px] rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-black group"
      >
        {/* Photo Sphere Viewer Renderer */}
        <ReactPhotoSphereViewer
          src={activeScene.panorama}
          height="100%"
          width="100%"
          container="psv-container"
          navbar={false}
          mousewheel={true}
          defaultYaw="0deg"
          defaultPitch="0deg"
          plugins={plugins}
          onReady={handleReady}
        />

        {/* Snapshot Flash Overlay */}
        {snapshotEffect && (
          <div className="absolute inset-0 bg-white animate-in fade-in fade-out duration-300 pointer-events-none z-50" />
        )}

        {/* TOP-LEFT BRANDING HEADLINE */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg pointer-events-auto">
          <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
            360° TOUR • {activeScene.name}
          </span>
        </div>

        {/* VERTICAL TOGGLE ACTION MENU (Exact Match to Image 1) */}
        <div className="absolute top-5 right-5 z-30 flex flex-col items-center gap-3 pointer-events-auto">
          {isMenuOpen ? (
            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
              {/* 1. CLOSE BUTTON (✕ Circle with white border) */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                title="Close Action Menu"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border-2 border-white/80 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>

              {/* 2. VR HEADSET MODE BUTTON */}
              <button
                type="button"
                onClick={toggleFullscreen}
                title="VR Mode / Headset"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
              >
                <FontAwesomeIcon icon={faVrCardboard} className="text-base" />
              </button>

              {/* 3. AUDIO MUTE / UNMUTE BUTTON */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
              >
                <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeHigh} className="text-base" />
              </button>

              {/* 5. FULLSCREEN BUTTON */}
              <button
                type="button"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
              >
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="text-base" />
              </button>
            </div>
          ) : (
            /* COLLAPSED SINGLE MENU BUTTON (☰) */
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              title="Open Action Menu"
              className="w-12 h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border-2 border-white/80 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
            >
              <FontAwesomeIcon icon={faBars} className="text-lg" />
            </button>
          )}
        </div>

        {/* BOTTOM THUMBNAIL GALLERY CAROUSEL (Exact Match to Image 2) */}
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-5xl flex items-center justify-between pointer-events-auto">
            
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollThumbnails("left")}
              className="w-9 h-9 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 flex items-center justify-center text-sm shrink-0 mr-2 cursor-pointer shadow-xl transition-colors backdrop-blur-md"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {/* Scrollable Thumbnail Strip (Matching Image 2) */}
            <div
              ref={thumbnailScrollRef}
              className="flex items-center gap-3.5 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth w-full justify-start sm:justify-center"
            >
              {PANORAMA_DATA.map((scene) => {
                const isActive = scene.id === currentPanoramaId;
                return (
                  <button
                    type="button"
                    key={scene.id}
                    onClick={() => changePanoramaWithGsap(scene.id)}
                    className="flex flex-col items-center shrink-0 group cursor-pointer"
                  >
                    {/* Rounded Thumbnail Image Box */}
                    <div
                      className={`relative w-28 sm:w-36 h-16 sm:h-20 rounded-2xl overflow-hidden transition-all duration-200 ${
                        isActive
                          ? "border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.7)] scale-105"
                          : "border border-white/30 opacity-75 group-hover:opacity-100 group-hover:border-white/70"
                      }`}
                    >
                      <img
                        src={scene.thumbnail}
                        alt={scene.name}
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                      )}
                    </div>

                    {/* Thumbnail Label Text Directly Below */}
                    <span
                      className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mt-2 transition-colors ${
                        isActive ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : "text-white/75 group-hover:text-white"
                      }`}
                    >
                      {scene.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollThumbnails("right")}
              className="w-9 h-9 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 flex items-center justify-center text-sm shrink-0 ml-2 cursor-pointer shadow-xl transition-colors backdrop-blur-md"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>

          </div>
        </div>

      </div>

      {/* METADATA FOOTER BELOW VIEWER */}
      <div className="w-full mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--app-text-secondary)]">
            CURRENT SCENE • {activeScene.category}
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--app-text-primary)]">
            {activeScene.name}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={toggleFullscreen}>
            Launch Fullscreen 360
          </Button>
          <Button variant="secondary" onClick={() => setShowHotspots(!showHotspots)}>
            {showHotspots ? "Hide Hotspots" : "Show Hotspots"}
          </Button>
        </div>
      </div>

    </div>
  );
}

export default VirtualTourViewer;
