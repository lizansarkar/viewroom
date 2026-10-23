import React, { useState, useRef, useEffect } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCheck,
  faCompass,
  faTrash,
  faPlus,
  faArrowRight,
  faArrowLeft,
  faCrosshairs,
  faDoorOpen,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import { createFloorPuckMarkerHtml } from "../../utils/tourHotspots";

const ROOM_NAME_PRESETS = [
  "Entrance / Hallway",
  "Living Room",
  "Dining Room",
  "Kitchen",
  "Master Bedroom",
  "Bedroom 2",
  "Bedroom 3",
  "Bathroom",
  "Balcony / Terrace",
  "Backyard / Garden",
  "Study / Office",
  "Basement",
  "Garage",
  "Swimming Pool",
  "Rooftop",
];

const toDeg = (val, fallback = "0deg") => {
  if (val === undefined || val === null || val === "") return fallback;
  if (typeof val === "number") return `${val}deg`;
  const str = String(val).trim();
  return str.endsWith("deg") || str.endsWith("rad") ? str : `${str}deg`;
};

export default function StudioSceneEditor({
  tour,
  initialSceneIndex = 0,
  onSaveTour,
  onClose,
}) {
  const [currentTour, setCurrentTour] = useState(tour);
  const [activeSceneIndex, setActiveSceneIndex] = useState(initialSceneIndex);

  const scenes = currentTour?.scenes || [];
  const activeScene = scenes[activeSceneIndex] || scenes[0];

  // Camera Live Coordinates
  const [liveYaw, setLiveYaw] = useState("0deg");
  const [livePitch, setLivePitch] = useState("0deg");
  const [openingViewSaved, setOpeningViewSaved] = useState(false);

  // Link Hotspot Form State
  const [selectedTargetSceneId, setSelectedTargetSceneId] = useState("");
  const [hotspotYaw, setHotspotYaw] = useState("0deg");
  const [hotspotPitch, setHotspotPitch] = useState("-20deg");
  const [hotspotType, setHotspotType] = useState("arrow");
  const [customHotspotLabel, setCustomHotspotLabel] = useState("");

  const psvRef = useRef(null);

  // Sync state if initialSceneIndex or tour prop changes
  useEffect(() => {
    setCurrentTour(tour);
  }, [tour]);

  // Set default target scene when active scene changes
  useEffect(() => {
    const otherScenes = scenes.filter((s) => s.id !== activeScene?.id);
    if (otherScenes.length > 0) {
      setSelectedTargetSceneId(otherScenes[0].id);
      setCustomHotspotLabel(otherScenes[0].name);
    } else {
      setSelectedTargetSceneId("");
      setCustomHotspotLabel("");
    }
    setOpeningViewSaved(false);
  }, [activeScene?.id, scenes.length]);

  const handlePsvReady = (instance) => {
    psvRef.current = instance;

    // Track camera angle in real time
    instance.addEventListener("position-updated", (e) => {
      const p = e.position.pitch;
      const y = e.position.yaw;
      if (p !== undefined && y !== undefined) {
        setLivePitch(`${Math.round((p * 180) / Math.PI)}deg`);
        setLiveYaw(`${Math.round((y * 180) / Math.PI)}deg`);
      }
    });

    // Click anywhere in 360 viewer to set target coordinates for a link hotspot
    instance.addEventListener("click", (e) => {
      const p = e.data.pitch;
      const y = e.data.yaw;
      if (p !== undefined && y !== undefined) {
        const pitchDeg = `${Math.round((p * 180) / Math.PI)}deg`;
        const yawDeg = `${Math.round((y * 180) / Math.PI)}deg`;
        setHotspotPitch(pitchDeg);
        setHotspotYaw(yawDeg);

        const markersPlugin = instance.getPlugin(MarkersPlugin);
        if (markersPlugin) {
          try {
            markersPlugin.removeMarker("temp_preview_marker");
          } catch (err) {}

          const label = customHotspotLabel || "LINK";
          markersPlugin.addMarker({
            id: "temp_preview_marker",
            position: { yaw: yawDeg, pitch: pitchDeg },
            html: createFloorPuckMarkerHtml(label, hotspotType),
          });
        }
      }
    });
  };

  // 1. Set Opening View (MadeSnappy Step 1)
  const handleSaveOpeningView = () => {
    const updatedScenes = scenes.map((s, idx) => {
      if (idx !== activeSceneIndex) return s;
      return {
        ...s,
        defaultYaw: liveYaw,
        defaultPitch: livePitch,
      };
    });

    const updatedTour = { ...currentTour, scenes: updatedScenes };
    setCurrentTour(updatedTour);
    setOpeningViewSaved(true);
    if (onSaveTour) onSaveTour(updatedTour);
    setTimeout(() => setOpeningViewSaved(false), 2500);
  };

  // 2. Room Title Change (MadeSnappy Step 2)
  const handleRoomNameChange = (newName) => {
    const updatedScenes = scenes.map((s, idx) => {
      if (idx !== activeSceneIndex) return s;
      return { ...s, name: newName };
    });

    const updatedTour = { ...currentTour, scenes: updatedScenes };
    setCurrentTour(updatedTour);
    if (onSaveTour) onSaveTour(updatedTour);
  };

  // 3. Add Hotspot Link (MadeSnappy Step 3)
  const handleAddHotspot = (e) => {
    e.preventDefault();
    if (!selectedTargetSceneId) return;

    const targetScene = scenes.find((s) => s.id === selectedTargetSceneId);
    const finalLabel = customHotspotLabel.trim() || targetScene?.name || "Next Room";

    const newHp = {
      id: `hp_${Date.now()}`,
      title: finalLabel,
      label: finalLabel,
      yaw: hotspotYaw,
      pitch: hotspotPitch,
      targetId: selectedTargetSceneId,
      targetSceneId: selectedTargetSceneId,
      type: hotspotType,
      iconType: hotspotType,
    };

    const updatedScenes = scenes.map((s, idx) => {
      if (idx !== activeSceneIndex) return s;
      return {
        ...s,
        hotspots: [...(s.hotspots || []), newHp],
      };
    });

    const updatedTour = { ...currentTour, scenes: updatedScenes };
    setCurrentTour(updatedTour);
    if (onSaveTour) onSaveTour(updatedTour);

    // Update markers in PSV instance
    if (psvRef.current) {
      const markersPlugin = psvRef.current.getPlugin(MarkersPlugin);
      if (markersPlugin) {
        try {
          markersPlugin.removeMarker("temp_preview_marker");
        } catch (err) {}
        markersPlugin.addMarker({
          id: newHp.id,
          position: { yaw: toDeg(newHp.yaw), pitch: toDeg(newHp.pitch) },
          html: createFloorPuckMarkerHtml(finalLabel, hotspotType),
        });
      }
    }
  };

  // Delete Hotspot Link
  const handleDeleteHotspot = (hpId) => {
    const updatedScenes = scenes.map((s, idx) => {
      if (idx !== activeSceneIndex) return s;
      return {
        ...s,
        hotspots: (s.hotspots || []).filter((h) => h.id !== hpId),
      };
    });

    const updatedTour = { ...currentTour, scenes: updatedScenes };
    setCurrentTour(updatedTour);
    if (onSaveTour) onSaveTour(updatedTour);

    if (psvRef.current) {
      const markersPlugin = psvRef.current.getPlugin(MarkersPlugin);
      if (markersPlugin) {
        try {
          markersPlugin.removeMarker(hpId);
        } catch (err) {}
      }
    }
  };

  const initialMarkers = (activeScene?.hotspots || []).map((hp) => ({
    id: hp.id,
    position: {
      yaw: toDeg(hp.yaw || hp.position?.yaw, "0deg"),
      pitch: toDeg(hp.pitch || hp.position?.pitch, "-20deg"),
    },
    html: createFloorPuckMarkerHtml(hp.title || hp.label || "LINK", hp.iconType || hp.type || "arrow"),
  }));

  const plugins = [[MarkersPlugin, { markers: initialMarkers }]];

  const currentPanorama =
    activeScene?.panoramaUrl ||
    activeScene?.panorama ||
    activeScene?.thumbnailUrl ||
    "/panoramas/panorama_aerial.jpg";

  const otherAvailableScenes = scenes.filter((s) => s.id !== activeScene?.id);

  return (
    <div className="fixed inset-0 z-50 bg-base-300 flex flex-col text-base-content select-none">
      {/* TOP HEADER: Breadcrumbs & Room Selector Strip */}
      <header className="h-16 px-4 sm:px-6 bg-base-100 border-b border-base-content/10 flex items-center justify-between gap-4 shrink-0 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-base-content truncate">
              {currentTour?.title || "360° Studio Editor"}
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-base-200 text-base-content/70">
            {scenes.length} {scenes.length === 1 ? "Room" : "Rooms"}
          </span>
        </div>

        {/* Room Navigation Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-xl">
          {scenes.map((sc, idx) => (
            <button
              key={sc.id || idx}
              type="button"
              onClick={() => setActiveSceneIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                idx === activeSceneIndex
                  ? "bg-primary text-primary-content border-primary shadow-xs"
                  : "bg-base-200 hover:bg-base-300 text-base-content/75 border-base-content/10"
              }`}
            >
              <span>{idx + 1}:</span>
              <span className="truncate max-w-[120px]">{sc.name || `Room ${idx + 1}`}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 sm:px-4 sm:py-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-base-content/10 shrink-0"
          title="Done & Close Studio"
        >
          <FontAwesomeIcon icon={faCheck} className="text-success" />
          <span className="hidden sm:inline">Done & Save</span>
        </button>
      </header>

      {/* MAIN SPLIT VIEW */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT COLUMN: INTERACTIVE 360 PANORAMA VIEWER */}
        <div className="flex-1 relative bg-black min-h-[350px] lg:min-h-0">
          <ReactPhotoSphereViewer
            key={`${activeScene?.id}_${currentPanorama}`}
            src={currentPanorama}
            height="100%"
            width="100%"
            container="studio-psv-container"
            navbar={false}
            mousewheel={true}
            defaultYaw={activeScene?.defaultYaw || "0deg"}
            defaultPitch={activeScene?.defaultPitch || "0deg"}
            defaultZoomLvl={0}
            plugins={plugins}
            onReady={handlePsvReady}
          />

          {/* Top-Left Live Status Badge */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Room {activeSceneIndex + 1}: {activeScene?.name}</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/70 text-[10px] font-mono">
              Live Camera: {liveYaw} yaw • {livePitch} pitch
            </div>
          </div>

          {/* Helper Hint Overlay at Bottom */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-center pointer-events-none">
            <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-lg text-center">
              💡 Drag to rotate 360° • Click anywhere on floor/doorway to position a hotspot link
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MADESNAPPY 3-STEP SETUP PANEL */}
        <div className="w-full lg:w-96 xl:w-[420px] bg-base-100 border-l border-base-content/10 flex flex-col justify-between overflow-y-auto shrink-0 shadow-lg">
          <div className="p-5 sm:p-6 space-y-6">
            
            {/* STEP 1: OPENING VIEW (MadeSnappy Image 2) */}
            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-content/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-content text-[10px] flex items-center justify-center font-black">
                    1
                  </span>
                  Opening View
                </span>
                {activeScene?.defaultYaw && (
                  <span className="text-[10px] font-semibold text-success bg-success/15 px-2 py-0.5 rounded-md">
                    Configured ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-base-content/70 leading-relaxed">
                Rotate the 360° viewer to the best angle. This is what visitors will see first when entering this room.
              </p>
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSaveOpeningView}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-content hover:opacity-90 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <FontAwesomeIcon icon={faEye} />
                  <span>Set Opening View ▶</span>
                </button>
              </div>
              {openingViewSaved && (
                <div className="p-2 rounded-lg bg-success/15 text-success text-center text-xs font-bold animate-in fade-in">
                  ✓ Opening view saved ({liveYaw}, {livePitch})!
                </div>
              )}
            </div>

            {/* STEP 2: ROOM TITLE (MadeSnappy Image 2) */}
            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-content/10 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-content text-[10px] flex items-center justify-center font-black">
                  2
                </span>
                Room Title
              </span>
              
              <div className="space-y-2">
                <select
                  value={ROOM_NAME_PRESETS.includes(activeScene?.name) ? activeScene?.name : "Custom"}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== "Custom") {
                      handleRoomNameChange(val);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                >
                  <option value="Custom">Custom Room Name...</option>
                  {ROOM_NAME_PRESETS.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={activeScene?.name || ""}
                  onChange={(e) => handleRoomNameChange(e.target.value)}
                  placeholder="Enter Room Title"
                  className="w-full px-3.5 py-2 rounded-xl bg-base-100 border border-base-content/15 text-xs font-bold text-base-content focus:outline-none"
                />
              </div>
            </div>

            {/* STEP 3: CONNECT / HOTSPOT LINK TO ANOTHER ROOM */}
            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-content/10 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-content text-[10px] flex items-center justify-center font-black">
                  3
                </span>
                Link to Another Room
              </span>

              {otherAvailableScenes.length === 0 ? (
                <div className="p-3 rounded-xl bg-base-100 text-xs text-base-content/60 text-center">
                  Only 1 room in this tour. Add more scenes to connect rooms with hotspots.
                </div>
              ) : (
                <form onSubmit={handleAddHotspot} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1">
                      Target Room Destination
                    </label>
                    <select
                      value={selectedTargetSceneId}
                      onChange={(e) => {
                        setSelectedTargetSceneId(e.target.value);
                        const targetScene = scenes.find((s) => s.id === e.target.value);
                        if (targetScene) setCustomHotspotLabel(targetScene.name);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                    >
                      {otherAvailableScenes.map((s) => (
                        <option key={s.id} value={s.id}>
                          ➔ {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1">
                        Marker Style
                      </label>
                      <select
                        value={hotspotType}
                        onChange={(e) => setHotspotType(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                      >
                        <option value="arrow">Chevron Arrow ➔</option>
                        <option value="door">Doorway 🚪</option>
                        <option value="stairs">Staircase 🪜</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1">
                        Placed At
                      </label>
                      <div className="px-2.5 py-1.5 rounded-xl bg-base-100 border border-base-content/15 text-[11px] font-mono text-base-content/70 truncate">
                        {hotspotYaw}, {hotspotPitch}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-base-content text-base-100 hover:opacity-90 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Attach Link Hotspot</span>
                  </button>
                </form>
              )}

              {/* LIST OF CURRENT HOTSPOTS */}
              {activeScene?.hotspots && activeScene.hotspots.length > 0 && (
                <div className="pt-2 border-t border-base-content/10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">
                    Active Room Links ({activeScene.hotspots.length})
                  </span>
                  <div className="space-y-1.5">
                    {activeScene.hotspots.map((hp) => {
                      const dest = scenes.find((s) => s.id === hp.targetId || s.id === hp.targetSceneId);
                      return (
                        <div
                          key={hp.id}
                          className="p-2 rounded-xl bg-base-100 border border-base-content/10 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-primary font-bold">➔</span>
                            <span className="font-bold truncate text-base-content">
                              {hp.title || hp.label || dest?.name || "Next Room"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteHotspot(hp.id)}
                            className="p-1.5 rounded-lg hover:bg-error hover:text-white text-base-content/50 transition-colors cursor-pointer"
                            title="Remove Hotspot"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* FOOTER: PREV / NEXT ROOM STEP NAVIGATION */}
          <div className="p-4 bg-base-200/80 border-t border-base-content/10 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={activeSceneIndex === 0}
              onClick={() => setActiveSceneIndex((prev) => Math.max(0, prev - 1))}
              className="py-2 px-3 rounded-xl bg-base-100 hover:bg-base-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 border border-base-content/10 cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Prev Room</span>
            </button>

            <span className="text-xs font-semibold text-base-content/60">
              {activeSceneIndex + 1} of {scenes.length}
            </span>

            <button
              type="button"
              disabled={activeSceneIndex === scenes.length - 1}
              onClick={() => setActiveSceneIndex((prev) => Math.min(scenes.length - 1, prev + 1))}
              className="py-2 px-3 rounded-xl bg-base-100 hover:bg-base-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 border border-base-content/10 cursor-pointer"
            >
              <span>Next Room</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
