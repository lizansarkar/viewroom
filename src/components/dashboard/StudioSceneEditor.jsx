import React, { useState, useRef, useEffect, useMemo } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrash,
  faPlus,
  faArrowRight,
  faArrowLeft,
  faEye,
  faCloudArrowUp,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import { createFloorPuckMarkerHtml } from "../../utils/tourHotspots";
import { apiUpdateOwnerScene, apiAddOwnerHotspot, apiUploadImage } from "../../services/api";

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

  const scenes = useMemo(() => currentTour?.scenes || [], [currentTour?.scenes]);
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
  const [hotspotRotation, setHotspotRotation] = useState(0);
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
  }, [activeScene?.id, scenes]);

  // Helper to re-render temporary preview marker in real time
  const updateStudioPreviewMarker = (label, type, rot, y = hotspotYaw, p = hotspotPitch) => {
    if (psvRef.current) {
      const markersPlugin = psvRef.current.getPlugin(MarkersPlugin);
      if (markersPlugin) {
        try {
          markersPlugin.removeMarker("temp_preview_marker");
        } catch (err) {}
        markersPlugin.addMarker({
          id: "temp_preview_marker",
          position: { yaw: toDeg(y), pitch: toDeg(p) },
          html: createFloorPuckMarkerHtml(label || "LINK", type, rot),
        });
      }
    }
  };

  const handleRotationChange = (newRot) => {
    const rotVal = Number(newRot);
    setHotspotRotation(rotVal);
    updateStudioPreviewMarker(customHotspotLabel, hotspotType, rotVal);
  };

  const handleTypeChange = (newType) => {
    setHotspotType(newType);
    updateStudioPreviewMarker(customHotspotLabel, newType, hotspotRotation);
  };

  const handleLabelChange = (newLabel) => {
    setCustomHotspotLabel(newLabel);
    updateStudioPreviewMarker(newLabel, hotspotType, hotspotRotation);
  };

  // Unmount WebGL cleanup
  useEffect(() => {
    return () => {
      if (psvRef.current) {
        try {
          psvRef.current.destroy();
        } catch (e) {}
      }
    };
  }, []);

  const handlePsvReady = (instance) => {
    if (psvRef.current && psvRef.current !== instance) {
      try {
        psvRef.current.destroy();
      } catch (e) {}
    }
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

        updateStudioPreviewMarker(customHotspotLabel || "LINK", hotspotType, hotspotRotation, yawDeg, pitchDeg);
      }
    });
  };

  // 1. Set Opening View (MadeSnappy Step 1)
  const handleSaveOpeningView = async () => {
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

    if (activeScene?.id && currentTour?.id) {
      apiUpdateOwnerScene(currentTour.id, activeScene.id, {
        defaultYaw: liveYaw,
        defaultPitch: livePitch,
      }).catch(() => {});
    }
    setTimeout(() => setOpeningViewSaved(false), 2500);
  };

  const [coverCapturedSaved, setCoverCapturedSaved] = useState(false);

  const handleCapture2DCover = () => {
    try {
      const canvas = document.querySelector("#studio-psv-container canvas") || document.querySelector(".psv-container canvas");
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        const updatedTour = { ...currentTour, coverImage: dataUrl };
        setCurrentTour(updatedTour);
        if (onSaveTour) onSaveTour(updatedTour);
        setCoverCapturedSaved(true);
        setTimeout(() => setCoverCapturedSaved(false), 3000);
      }
    } catch (err) {
      console.warn("Could not capture 2D view snapshot:", err);
    }
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

    if (activeScene?.id && currentTour?.id) {
      apiUpdateOwnerScene(currentTour.id, activeScene.id, {
        name: newName,
      }).catch(() => {});
    }
  };

  // 3. Add Hotspot Link (MadeSnappy Step 3)
  const handleAddHotspot = async (e) => {
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
      rotation: Number(hotspotRotation) || 0,
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

    if (activeScene?.id && currentTour?.id) {
      apiAddOwnerHotspot(currentTour.id, activeScene.id, newHp).catch(() => {});
    }

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
          html: createFloorPuckMarkerHtml(finalLabel, hotspotType, hotspotRotation),
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

  // Upload or update Brand Logo in Studio Editor
  const handleUploadStudioLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let uploadedUrl = await apiUploadImage(file);
      if (!uploadedUrl) uploadedUrl = URL.createObjectURL(file);
      const updatedTour = { ...currentTour, brandLogo: uploadedUrl };
      setCurrentTour(updatedTour);
      if (onSaveTour) onSaveTour(updatedTour);
    } catch (err) {
      console.warn("Studio logo upload error:", err);
    }
  };

  const initialMarkers = (activeScene?.hotspots || []).map((hp) => ({
    id: hp.id,
    position: {
      yaw: toDeg(hp.yaw || hp.position?.yaw, "0deg"),
      pitch: toDeg(hp.pitch || hp.position?.pitch, "-20deg"),
    },
    html: createFloorPuckMarkerHtml(
      hp.title || hp.label || "LINK",
      hp.iconType || hp.type || "arrow",
      hp.rotation || 0
    ),
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
          {/* Creator Brand / Space Logo (Cafe, Hotel, Home, Restaurant) */}
          <div className="relative group shrink-0">
            <input
              type="file"
              accept="image/*"
              id="studio_brand_logo_input"
              className="hidden"
              onChange={handleUploadStudioLogo}
            />
            {currentTour?.brandLogo ? (
              <label
                htmlFor="studio_brand_logo_input"
                className="block cursor-pointer relative"
                title="Click to change space/brand logo"
              >
                <img
                  src={currentTour.brandLogo}
                  alt="Space Logo"
                  className="w-9 h-9 rounded-sm object-cover bg-base-200 border border-base-content/20 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 bg-black/80 text-[8px] text-white px-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit
                </span>
              </label>
            ) : (
              <label
                htmlFor="studio_brand_logo_input"
                className="w-9 h-9 rounded-sm border border-dashed border-base-content/30 hover:border-primary bg-base-200/50 hover:bg-base-200 flex items-center justify-center text-base-content/60 hover:text-primary text-xs cursor-pointer transition-all shadow-xs"
                title="Upload Brand/Space Logo (Cafe, Hotel, Home)"
              >
                <FontAwesomeIcon icon={faCloudArrowUp} />
              </label>
            )}
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-base-content truncate">
              {currentTour?.title || "360° Studio Editor"}
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-sm bg-base-200 text-base-content/70 border border-base-content/10 shrink-0">
            {scenes.length} {scenes.length === 1 ? "Room" : "Rooms"}
          </span>
        </div>

        {/* Room Navigation Pills Strip using Reusable Button Component */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-xl">
          {scenes.map((sc, idx) => (
            <Button
              key={sc.id || idx}
              variant={idx === activeSceneIndex ? "primary" : "secondary"}
              onClick={() => setActiveSceneIndex(idx)}
              className={`!py-1.5 !px-3 !rounded-sm !text-xs !border font-bold gap-1.5 shrink-0 cursor-pointer whitespace-nowrap transition-all ${
                idx === activeSceneIndex
                  ? "!bg-black !text-white !border-black shadow-xs"
                  : "!bg-base-200 hover:!bg-base-300 !text-base-content/75 !border-base-content/15"
              }`}
            >
              <span>{idx + 1}:</span>
              <span className="truncate max-w-[120px]">{sc.name || `Room ${idx + 1}`}</span>
            </Button>
          ))}
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            if (onSaveTour) onSaveTour(currentTour);
            if (onClose) onClose();
          }}
          className="!text-xs !py-1.5 !px-4 !rounded-sm shrink-0 gap-1.5 cursor-pointer"
          title="Done & Save Tour"
        >
          <FontAwesomeIcon icon={faCheck} className="text-success" />
          <span>Done & Save Tour</span>
        </Button>
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

          {/* Top-Left Live Brand Logo & Room Name (Matching Visitor View & Commercial 360 Style) */}
          <div className="absolute top-5 left-5 z-20 flex flex-col items-start select-none pointer-events-auto">
            {/* Hidden file input for canvas logo click */}
            <input
              type="file"
              accept="image/*"
              id="studio_canvas_brand_logo_input"
              className="hidden"
              onChange={handleUploadStudioLogo}
            />

            {/* Brand Logo or Quick Upload Button */}
            {currentTour?.brandLogo ? (
              <label
                htmlFor="studio_canvas_brand_logo_input"
                className="max-w-[170px] sm:max-w-[210px] max-h-16 sm:max-h-20 flex items-center mb-1 group relative cursor-pointer"
                title="Click to change brand logo"
              >
                <img
                  src={currentTour.brandLogo}
                  alt="Space Logo"
                  className="max-h-16 sm:max-h-20 w-auto object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)] filter transition-transform group-hover:scale-105"
                />
                <span className="absolute -bottom-2 left-0 bg-black/85 text-[9px] text-white/90 px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                  Click to change logo
                </span>
              </label>
            ) : (
              <label
                htmlFor="studio_canvas_brand_logo_input"
                className="cursor-pointer mb-2 px-3 py-1.5 rounded-sm bg-black/55 hover:bg-black/80 border border-dashed border-white/40 hover:border-white text-white/90 hover:text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-2 shadow-lg hover:scale-105"
                title="Upload Brand Logo for this tour"
              >
                <FontAwesomeIcon icon={faCloudArrowUp} className="text-xs" />
                <span>+ Upload Brand Logo</span>
              </label>
            )}

            {/* Current Room Title directly below the logo (Matching Reference Image: Aerial View) */}
            <h2
              style={{ color: "#ffffff", textShadow: "0 2px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)" }}
              className="!text-white font-extrabold text-base sm:text-lg tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight select-none"
            >
              {activeScene?.name || `Room ${activeSceneIndex + 1}`}
            </h2>

            {/* Live Camera yaw & pitch coordinates */}
            <div className="mt-1.5 px-2 py-0.5 rounded-sm bg-black/60 backdrop-blur-md text-white/70 text-[10px] font-mono border border-white/10 pointer-events-none shadow-xs">
              Live Camera: {liveYaw} yaw • {livePitch} pitch
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MADESNAPPY 3-STEP SETUP PANEL */}
        <div className="w-full lg:w-96 xl:w-[420px] bg-base-100 border-l border-base-content/10 flex flex-col justify-between overflow-y-auto shrink-0 shadow-lg">
          <div className="p-5 sm:p-6 space-y-5">
            
            {/* STEP 1: OPENING VIEW (MadeSnappy Image 2) */}
            <div className="p-4 rounded-sm bg-base-200/50 border border-base-content/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-sm bg-base-content/10 text-base-content text-[11px] flex items-center justify-center font-black">
                    1
                  </span>
                  Opening View
                </span>
                {activeScene?.defaultYaw && (
                  <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-sm border border-success/20">
                    Configured ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-base-content/70 leading-relaxed">
                Rotate the 360° viewer to the best angle. This is what visitors will see first when entering this room.
              </p>
              <div className="pt-1 flex flex-col gap-2">
                <Button
                  variant="primary"
                  onClick={handleSaveOpeningView}
                  className="w-full !rounded-sm !text-xs !py-2.5 gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faEye} />
                  <span>Set Opening View ▶</span>
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleCapture2DCover}
                  className="w-full !rounded-sm !text-xs !py-2 gap-2 cursor-pointer border border-base-content/20 hover:border-base-content/40 !bg-base-100"
                  title="Capture current view as clean 2D thumbnail for tour cards"
                >
                  <FontAwesomeIcon icon={faCamera} className="text-primary" />
                  <span>📸 Set Current View as Tour 2D Cover</span>
                </Button>
              </div>
              {openingViewSaved && (
                <div className="p-2 rounded-sm bg-success/15 text-success text-center text-xs font-bold border border-success/20 animate-in fade-in">
                  ✓ Opening view saved ({liveYaw}, {livePitch})!
                </div>
              )}
              {coverCapturedSaved && (
                <div className="p-2 rounded-sm bg-primary/15 text-primary text-center text-xs font-bold border border-primary/20 animate-in fade-in">
                  ✓ Clean 2D snapshot saved as Tour Card Cover!
                </div>
              )}
            </div>

            {/* STEP 2: ROOM TITLE (MadeSnappy Image 2) */}
            <div className="p-4 rounded-sm bg-base-200/50 border border-base-content/10 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-sm bg-base-content/10 text-base-content text-[11px] flex items-center justify-center font-black">
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
                  className="w-full px-3 py-2 rounded-sm bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
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
                  className="w-full px-3.5 py-2 rounded-sm bg-base-100 border border-base-content/15 text-xs font-bold text-base-content focus:outline-none"
                />
              </div>
            </div>



            {/* STEP 3: CONNECT / HOTSPOT LINK TO ANOTHER ROOM */}
            <div className="p-4 rounded-sm bg-base-200/50 border border-base-content/10 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-sm bg-base-content/10 text-base-content text-[11px] flex items-center justify-center font-black">
                  3
                </span>
                Link to Another Room
              </span>

              {otherAvailableScenes.length === 0 ? (
                <div className="p-3 rounded-sm bg-base-100 border border-base-content/10 text-xs text-base-content/60 text-center">
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
                      className="w-full px-3 py-2 rounded-sm bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                    >
                      {otherAvailableScenes.map((s) => (
                        <option key={s.id} value={s.id}>
                          ➔ {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1">
                      Button / Hotspot Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Master Bedroom"
                      value={customHotspotLabel}
                      onChange={(e) => handleLabelChange(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-sm bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1">
                        Marker Style
                      </label>
                      <select
                        value={hotspotType}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-sm bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                      >
                        <option value="arrow">Chevron Arrow ➔</option>
                        <option value="door">Doorway 🚪</option>
                        <option value="puck">Animated Round Beacon ⭕</option>
                        <option value="stairs">Staircase 🪜</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1">
                        Placed At
                      </label>
                      <div className="px-2.5 py-1.5 rounded-sm bg-base-100 border border-base-content/15 text-[11px] font-mono text-base-content/70 truncate">
                        {hotspotYaw}, {hotspotPitch}
                      </div>
                    </div>
                  </div>

                  {/* Arrow Direction Angle Slider & Compass Presets */}
                  {hotspotType === "arrow" && (
                    <div className="p-3 rounded-sm bg-base-100 border border-base-content/10 space-y-2.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/70">
                          Arrow Direction (Angle)
                        </label>
                        <span className="px-2 py-0.5 rounded-xs bg-base-content text-base-100 text-[10px] font-black font-mono">
                          {hotspotRotation}°
                        </span>
                      </div>

                      {/* Visual Compass Dial & Slider */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-full border border-base-content/20 bg-base-200/50 flex items-center justify-center shrink-0 shadow-xs cursor-pointer hover:border-primary transition-colors"
                          title="Click to rotate +45°"
                          onClick={() => handleRotationChange((hotspotRotation + 45) % 360)}
                        >
                          <span
                            className="text-base text-primary transition-transform duration-200 pointer-events-none inline-block font-black"
                            style={{ transform: `rotate(${hotspotRotation}deg)` }}
                          >
                            ⬆
                          </span>
                        </div>

                        <div className="flex-1 space-y-0.5">
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="5"
                            value={hotspotRotation}
                            onChange={(e) => handleRotationChange(Number(e.target.value))}
                            className="w-full accent-primary cursor-pointer h-2 bg-base-200 rounded-lg appearance-none"
                          />
                          <div className="flex justify-between text-[8px] text-base-content/40 font-mono">
                            <span>0° (N)</span>
                            <span>90° (E)</span>
                            <span>180° (S)</span>
                            <span>270° (W)</span>
                            <span>360°</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick 1-Click Direction Presets */}
                      <div className="grid grid-cols-4 gap-1 pt-0.5">
                        {[
                          { label: "↑ 0°", deg: 0, title: "Straight Ahead" },
                          { label: "↗ 45°", deg: 45, title: "Front-Right" },
                          { label: "➔ 90°", deg: 90, title: "Right / East" },
                          { label: "↘ 135°", deg: 135, title: "Back-Right" },
                          { label: "↓ 180°", deg: 180, title: "Backward / South" },
                          { label: "↙ 225°", deg: 225, title: "Back-Left" },
                          { label: "⬅ 270°", deg: 270, title: "Left / West" },
                          { label: "↖ 315°", deg: 315, title: "Front-Left" },
                        ].map((preset) => (
                          <button
                            key={preset.deg}
                            type="button"
                            onClick={() => handleRotationChange(preset.deg)}
                            title={preset.title}
                            className={`py-1 px-0.5 rounded-xs text-[9px] font-bold transition-all cursor-pointer text-center ${
                              hotspotRotation === preset.deg
                                ? "bg-primary text-primary-content font-black shadow-xs"
                                : "bg-base-200/60 hover:bg-base-200 text-base-content/70 border border-base-content/10"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full !rounded-sm !text-xs !py-2.5 gap-2 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Attach Link Hotspot</span>
                  </Button>
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
                          className="p-2 rounded-sm bg-base-100 border border-base-content/10 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="text-primary font-black inline-block text-sm shrink-0"
                              style={{ transform: `rotate(${hp.rotation || 0}deg)` }}
                              title={`Direction: ${hp.rotation || 0}°`}
                            >
                              ⬆
                            </span>
                            <span className="font-bold truncate text-base-content">
                              {hp.title || hp.label || dest?.name || "Next Room"}
                            </span>
                            {hp.rotation !== undefined && hp.rotation !== null && (
                              <span className="text-[10px] text-base-content/40 font-mono shrink-0">
                                {hp.rotation}°
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteHotspot(hp.id)}
                            className="p-1.5 rounded-sm hover:bg-error hover:text-white text-base-content/50 transition-colors cursor-pointer shrink-0"
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
            <Button
              variant="secondary"
              disabled={activeSceneIndex === 0}
              onClick={() => setActiveSceneIndex((prev) => Math.max(0, prev - 1))}
              className="!py-1.5 !px-3 !rounded-sm !text-xs gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Prev Room</span>
            </Button>

            <span className="text-xs font-semibold text-base-content/60">
              {activeSceneIndex + 1} of {scenes.length}
            </span>

            <Button
              variant="secondary"
              disabled={activeSceneIndex === scenes.length - 1}
              onClick={() => setActiveSceneIndex((prev) => Math.min(scenes.length - 1, prev + 1))}
              className="!py-1.5 !px-3 !rounded-sm !text-xs gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Next Room</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

