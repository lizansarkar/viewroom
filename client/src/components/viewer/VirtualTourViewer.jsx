import React, { useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import PanoramaScene from "./PanoramaScene";
import ViewerControls from "./ViewerControls";
import ViewerError from "./ViewerError";
import { getPropertyById } from "../../data/mockProperties";

function InfoOverlay({ title, propertyId }) {
  const [open, setOpen] = useState(false);
  const prop = propertyId ? getPropertyById(propertyId) : null;

  return (
    <div className="">
      <button
        onClick={() => setOpen((s) => !s)}
        className="m-4 px-3 py-2 rounded-full bg-slate-900/70 text-slate-200 border border-slate-800"
      >
        {open ? "Close" : "Info"}
      </button>

      {open && prop && (
        <div className="absolute left-4 bottom-4 z-40 w-80 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 backdrop-blur-md">
          <h4 className="font-bold text-white text-lg truncate">
            {prop.title}
          </h4>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>{prop.location}</span>
            <span className="text-emerald-400 font-semibold">{prop.price}</span>
          </div>
          <p className="text-slate-300 text-sm mt-3 line-clamp-3">
            {prop.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default function VirtualTourViewer({
  propertyId,
  panoramaUrl,
  title = "360° Virtual Property Tour",
  sceneName = "Living Room",
  scenes = [],
  currentSceneId,
  hotspots = [],
  onSelectScene,
  onBack,
  className = "",
  onAddHotspotRequest,
}) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  // Handle container fullscreen toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen request failed:", err);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] bg-slate-950 overflow-hidden select-none touch-none ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Minimal UI Overlay Controls: keep only essential actions to preserve immersive feel */}
      <div className="absolute top-4 left-4 z-30 pointer-events-auto">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-all shadow-xl backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Exit 360 Viewer"
        >
          Back
        </button>
      </div>

      {/* Info toggle + overlay (minimal, collapsible) */}
      <InfoOverlay
        title={title}
        propertyId={propertyId}
        className="absolute z-30"
      />

      <div className="absolute top-4 right-4 z-30 pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => setEditMode((s) => !s)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            editMode
              ? "bg-amber-500 text-black"
              : "bg-slate-950/80 text-slate-200 border border-slate-800"
          }`}
          title="Toggle Hotspot Add Mode"
        >
          {editMode ? "Adding Hotspot" : "Add Hotspot"}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white transition-all shadow-lg shadow-emerald-500/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {/* Error Overlay */}
      {hasError && (
        <ViewerError
          message={errorMessage}
          onRetry={() => setHasError(false)}
          onBack={onBack}
        />
      )}

      {/* Three.js R3F Canvas */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <PanoramaScene
            panoramaUrl={panoramaUrl}
            sceneName={sceneName}
            currentSceneId={currentSceneId}
            hotspots={hotspots}
            onAddHotspotRequest={onAddHotspotRequest}
            onHotspotClick={(hotspot) => {
              // Navigate to the target scene inside the viewer without changing URL
              if (hotspot?.targetSceneId)
                onSelectScene?.(hotspot.targetSceneId);
            }}
            onError={(err) => {
              console.warn("PanoramaScene texture warning:", err);
              setErrorMessage(String(err));
              setHasError(true);
            }}
            editMode={editMode}
            propertyId={propertyId}
            onAddHotspotSaved={(newHotspot) => {
              // Caller may choose to update scene list; UI currently relies on tourStore persistence
              console.info("Hotspot saved", newHotspot);
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
