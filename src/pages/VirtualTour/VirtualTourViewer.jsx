import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";

import { trackEvent } from "../../services/analyticsService";
import { apiGetTourById, apiGetOwnerTours } from "../../services/api";
import { tourSocket } from "../../services/tourSocketService";
import MetaSEO from "../../components/seo/MetaSEO";
import LiveGuidedTourModal from "../../components/spatial/LiveGuidedTourModal";
import InRoomLeadForm from "../../components/tour/InRoomLeadForm";
import TourShareModal from "../../components/tour/TourShareModal";
import TourThumbnailCarousel from "../../components/tour/TourThumbnailCarousel";
import TourActionMenu from "../../components/tour/TourActionMenu";
import TourVoiceToast from "../../components/tour/TourVoiceToast";

import { uiSound, spatialAudio } from "../../utils/tourSoundEngine";
import {
  DEFAULT_TOUR_NODES,
  createFloorPuckMarkerHtml,
  createDroneHotspotHtml,
} from "../../utils/tourHotspots";
import { useTourVoiceGuide } from "../../hooks/useTourVoiceGuide";

export default function VirtualTourViewer({ _fullScreenMode = false, overrideTourId }) {
  const [searchParams] = useSearchParams();
  const { tourId } = useParams();
  const targetTourId = overrideTourId || searchParams.get("id") || tourId;

  const [tourNodes, setTourNodes] = useState(DEFAULT_TOUR_NODES);
  const [currentPanoramaId, setCurrentPanoramaId] = useState("aerial_view");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [snapshotEffect, _setSnapshotEffect] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showLiveTourModal, setShowLiveTourModal] = useState(() => {
    return !!searchParams.get("sessionId");
  });

  const psvRef = useRef(null);
  const viewportRef = useRef(null);

  // GSAP Smooth Fade Transition on Panorama Node Change
  const changePanoramaWithGsap = (targetId) => {
    if (targetId === currentPanoramaId) return;

    trackEvent("tour_viewed", "Skyline Campus 360°", `Switched to node ${targetId}`);
    try {
      tourSocket.syncScene({ sceneId: targetId });
    } catch (e) {}

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

  // Voice AI Spatial Tour Guide Hook
  const {
    isListening,
    isAiThinking,
    aiTranscript,
    aiSpokenResponse,
    toggleVoiceAssistant,
  } = useTourVoiceGuide({
    tourNodes,
    currentPanoramaId,
    onNavigateRoom: changePanoramaWithGsap,
    isMuted,
    setIsMuted,
    toggleFullscreen,
    setShowHotspots,
    setIsMenuOpen,
    setShowShareModal,
  });

  // Load custom tour from backend API or localStorage fallback
  useEffect(() => {
    let isMounted = true;

    const loadTourData = async () => {
      try {
        let matchedTour = null;

        // 1. If targetTourId is specified, search localStorage first then backend
        if (targetTourId) {
          const savedLocalTours = localStorage.getItem("viewroom_custom_tours");
          if (savedLocalTours) {
            try {
              const parsedTours = JSON.parse(savedLocalTours);
              if (Array.isArray(parsedTours)) {
                matchedTour = parsedTours.find((t) => t.id === targetTourId);
              }
            } catch (e) {}
          }

          if (!matchedTour) {
            try {
              const fetched = await apiGetTourById(targetTourId);
              const tourData = fetched && (fetched.data || fetched);
              if (tourData && tourData.id === targetTourId) {
                matchedTour = tourData;
              }
            } catch (e) {}
          }

          if (!matchedTour) {
            try {
              const ownerRes = await apiGetOwnerTours();
              const ownerTours = ownerRes && (ownerRes.data || ownerRes);
              if (Array.isArray(ownerTours)) {
                matchedTour = ownerTours.find((t) => t.id === targetTourId);
              }
            } catch (e) {}
          }
        }

        // 2. If NO targetTourId was specified in URL, fallback to first available tour
        if (!matchedTour && !targetTourId) {
          const savedLocalTours = localStorage.getItem("viewroom_custom_tours");
          if (savedLocalTours) {
            try {
              const parsedTours = JSON.parse(savedLocalTours);
              if (Array.isArray(parsedTours) && parsedTours.length > 0) {
                matchedTour = parsedTours[0];
              }
            } catch (e) {}
          }
          if (!matchedTour) {
            try {
              const ownerRes = await apiGetOwnerTours();
              const ownerTours = ownerRes && (ownerRes.data || ownerRes);
              if (Array.isArray(ownerTours) && ownerTours.length > 0) {
                matchedTour = ownerTours[0];
              }
            } catch (e) {}
          }
        }

        // 3. Map matchedTour scenes into tourNodes (auto-generating scene from coverImage if empty)
        if (isMounted && matchedTour) {
          let scenesList = matchedTour.scenes;
          if (!Array.isArray(scenesList) || scenesList.length === 0) {
            const fallbackImg = matchedTour.coverImage || "/panoramas/panorama_aerial.jpg";
            scenesList = [
              {
                id: `scene_${matchedTour.id}_main`,
                name: matchedTour.title ? `${matchedTour.title} - Main Scene` : "Main Scene",
                floorLevel: "Ground Floor",
                thumbnailUrl: fallbackImg,
                panoramaUrl: fallbackImg,
                hotspots: [],
              },
            ];
          }

          const mappedNodes = scenesList.map((s, idx) => ({
            id: s.id,
            name: s.name || `Room Scene ${idx + 1}`,
            category: matchedTour.category || "Virtual Tour",
            floorLevel: s.floorLevel || idx,
            thumbnail:
              s.thumbnailUrl ||
              s.panoramaUrl ||
              s.thumbnail ||
              s.panorama ||
              matchedTour.coverImage ||
              "/panoramas/panorama_aerial.jpg",
            panorama:
              s.panoramaUrl ||
              s.panorama ||
              matchedTour.coverImage ||
              "/panoramas/panorama_aerial.jpg",
            connections: (s.hotspots || s.markers || []).map((hp) => ({
              targetNodeId: hp.targetSceneId || hp.targetId,
              label: hp.label || hp.title,
              type: hp.type === "drone" ? "drone_badge" : "floor_puck",
              iconType: hp.type || "arrow",
              position: {
                yaw: hp.yaw || hp.position?.yaw || "0deg",
                pitch: hp.pitch || hp.position?.pitch || "-25deg",
              },
            })),
          }));
          setTourNodes(mappedNodes);
          setCurrentPanoramaId(mappedNodes[0].id);

          if (matchedTour.audioConfig) {
            try {
              const cfg =
                typeof matchedTour.audioConfig === "string"
                  ? JSON.parse(matchedTour.audioConfig)
                  : matchedTour.audioConfig;
              spatialAudio.configure(cfg);
            } catch (cfgErr) {
              console.warn("Failed to parse audioConfig:", cfgErr);
            }
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

  // Preload Panoramas for Smooth Transitions
  useEffect(() => {
    DEFAULT_TOUR_NODES.forEach((node) => {
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

  // Global gesture listener to unlock Web Audio context
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

  // Autoplay ambient sound when viewer intersects viewport
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

  // Photo Sphere Viewer Instance Callback
  const handleReady = (instance) => {
    psvRef.current = instance;

    let lastEmit = 0;
    instance.addEventListener("position-updated", (e) => {
      const now = Date.now();
      if (now - lastEmit > 120) {
        lastEmit = now;
        try {
          tourSocket.syncViewport({
            pitch: e.position.pitch,
            yaw: e.position.yaw,
            zoom: instance.getZoomLevel(),
          });
        } catch (err) {}
      }
    });

    const markersPlugin = instance.getPlugin(MarkersPlugin);
    if (markersPlugin) {
      markersPlugin.addEventListener("over-marker", () => {
        uiSound.playHoverClick();
      });

      markersPlugin.addEventListener("select-marker", (e) => {
        const marker = e.marker;
        const targetId = marker?.config?.targetId;
        if (targetId) {
          uiSound.playCameraSwoosh();

          instance
            .animate({
              yaw: marker.config.position.yaw,
              pitch: marker.config.position.pitch,
              zoom: 60,
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
      {/* SEO Meta Tags */}
      <MetaSEO
        title={
          activeNode?.name
            ? `${activeNode.name} - 360° Virtual Tour`
            : "ViewRoom 360° Virtual Tour"
        }
        description={`Take an interactive 360° spatial walkthrough of ${
          activeNode?.name || "this virtual property"
        }.`}
        image={activeNode?.thumbnail || activeNode?.panorama}
      />

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

        {/* TOP CENTER GLASSMORPHIC VOICE AI TOAST */}
        <TourVoiceToast
          isListening={isListening}
          isAiThinking={isAiThinking}
          aiTranscript={aiTranscript}
          aiSpokenResponse={aiSpokenResponse}
        />

        {/* VERTICAL TOGGLE ACTION MENU */}
        <TourActionMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isListening={isListening}
          onToggleVoiceAssistant={toggleVoiceAssistant}
          showHotspots={showHotspots}
          onToggleHotspots={() => setShowHotspots(!showHotspots)}
          onOpenLiveTour={() => setShowLiveTourModal(true)}
          onOpenLeadForm={() => setShowLeadForm(true)}
          onOpenShareModal={() => setShowShareModal(true)}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          isMuted={isMuted}
          onToggleMute={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            if (!nextMuted) spatialAudio.play();
          }}
        />

        {/* BOTTOM THUMBNAIL GALLERY CAROUSEL */}
        <TourThumbnailCarousel
          tourNodes={tourNodes}
          currentPanoramaId={currentPanoramaId}
          onSelectNode={changePanoramaWithGsap}
        />
      </div>

      {/* SHARE & EMBED MODAL */}
      <TourShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        activeNode={activeNode}
        onOpenLiveTour={() => setShowLiveTourModal(true)}
      />

      {/* IN-ROOM LEAD CAPTURE MODAL */}
      <InRoomLeadForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        tourTitle={activeNode?.name}
        sceneName={activeNode?.name}
      />

      {/* LIVE GUIDED CO-PRESENCE TOUR MODAL */}
      <LiveGuidedTourModal
        isOpen={showLiveTourModal}
        onClose={() => setShowLiveTourModal(false)}
        tourId={targetTourId}
        currentSceneId={currentPanoramaId}
        onSceneChange={(targetSceneId) => {
          changePanoramaWithGsap(targetSceneId);
        }}
        onViewportSync={(pitch, yaw, zoom) => {
          if (psvRef.current) {
            try {
              psvRef.current.animate({ pitch, yaw, zoom, speed: "5rpm" });
            } catch (err) {}
          }
        }}
      />
    </div>
  );
}
