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
  faCrosshairs,
  faTrash,
  faLocationDot,
  faPlus,
  faCloudArrowUp,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import { apiUploadImage } from "../../services/api";

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

const createPreviewPuckHtml = (label, type = "arrow") => {
  const displayLabel = label || "HOTSPOT";
  if (type === "arrow") {
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

  if (type === "door") {
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
        <span class="text-xs">${getHotspotIcon(type)}</span>
        <span>${displayLabel}</span>
      </div>
      <div style="transform: perspective(400px) rotateX(65deg);" class="relative w-13 h-13 sm:w-15 sm:h-15 rounded-full border-2 border-white bg-white/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-120">
        <div class="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-70"></div>
        <div class="w-5 h-5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
      </div>
    </div>
  `;
};

export default function HotspotEditorModal({
  scene,
  tour,
  onClose,
  onSave,
  onDeleteHotspot,
  onAddNewScene,
  onSwitchEditingScene,
}) {
  const [title, setTitle] = useState("");
  const [yaw, setYaw] = useState("0deg");
  const [pitch, setPitch] = useState("-25deg");
  const [targetId, setTargetId] = useState(
    tour?.scenes?.find((s) => s.id !== scene?.id)?.id || ""
  );
  const [hotspotType, setHotspotType] = useState("arrow");

  // Inline New Linked Room Creator State
  const [showNewSceneForm, setShowNewSceneForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomImageUrl, setNewRoomImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Local list of existing scene hotspots for interactive management
  const [existingHotspots, setExistingHotspots] = useState(scene?.hotspots || []);

  const psvRef = useRef(null);

  const panoramaUrl =
    scene?.panoramaUrl ||
    scene?.panorama ||
    "/panoramas/panorama_entrance.jpg";

  useEffect(() => {
    if (scene?.hotspots) {
      setExistingHotspots(scene.hotspots);
    }
  }, [scene]);

  // Set default title when target scene changes if title is empty
  useEffect(() => {
    if (targetId && !title) {
      const targetScene = tour?.scenes?.find((s) => s.id === targetId);
      if (targetScene) {
        setTitle(targetScene.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId]);

  const handlePsvReady = (instance) => {
    psvRef.current = instance;

    instance.addEventListener("click", (e) => {
      const p = e.data.pitch;
      const y = e.data.yaw;
      if (p !== undefined && y !== undefined) {
        const pitchDeg = `${Math.round((p * 180) / Math.PI)}deg`;
        const yawDeg = `${Math.round((y * 180) / Math.PI)}deg`;
        setPitch(pitchDeg);
        setYaw(yawDeg);

        const markersPlugin = instance.getPlugin(MarkersPlugin);
        if (markersPlugin) {
          try {
            markersPlugin.removeMarker("temp_preview_marker");
          } catch (err) {}

          markersPlugin.addMarker({
            id: "temp_preview_marker",
            position: { yaw: yawDeg, pitch: pitchDeg },
            html: createPreviewPuckHtml(title || "HOTSPOT", hotspotType),
          });
        }
      }
    });
  };

  const handleTitleChange = (newTitle, newType = hotspotType) => {
    setTitle(newTitle);
    if (psvRef.current) {
      const markersPlugin = psvRef.current.getPlugin(MarkersPlugin);
      if (markersPlugin) {
        try {
          markersPlugin.removeMarker("temp_preview_marker");
        } catch (err) {}
        markersPlugin.addMarker({
          id: "temp_preview_marker",
          position: { yaw, pitch },
          html: createPreviewPuckHtml(newTitle || "HOTSPOT", newType),
        });
      }
    }
  };

  const handleTypeChange = (newType) => {
    setHotspotType(newType);
    handleTitleChange(title, newType);
  };

  const handleFileUploadForNewScene = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result;
        if (base64) {
          const uploadedUrl = await apiUploadImage(base64, file.name);
          setNewRoomImageUrl(uploadedUrl || base64);
        }
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploadingImage(false);
    }
  };

  const handleCreateAndLinkNewScene = async () => {
    if (!newRoomName) return;
    const finalPanorama = newRoomImageUrl || "/panoramas/panorama_floor1.jpg";
    const newSceneObj = {
      id: `scene_${Date.now()}`,
      name: newRoomName,
      panoramaUrl: finalPanorama,
      thumbnailUrl: finalPanorama,
      hotspots: [],
    };

    if (onAddNewScene) {
      const created = await onAddNewScene(newSceneObj);
      const targetSceneId = created?.id || newSceneObj.id;
      setTargetId(targetSceneId);
      if (!title) {
        handleTitleChange(newRoomName);
      }
      setShowNewSceneForm(false);
      setNewRoomName("");
      setNewRoomImageUrl("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTitle = title.trim() || (tour?.scenes?.find((s) => s.id === targetId)?.name) || "LINK";
    const newHotspot = {
      id: `hp_${Date.now()}`,
      title: finalTitle,
      yaw: yaw.includes("deg") ? yaw : `${yaw}deg`,
      pitch: pitch.includes("deg") ? pitch : `${pitch}deg`,
      targetId,
      type: hotspotType,
    };
    onSave(newHotspot);
  };

  const handleDeleteLocalHotspot = (hpId) => {
    setExistingHotspots((prev) => prev.filter((h) => h.id !== hpId));
    if (psvRef.current) {
      const markersPlugin = psvRef.current.getPlugin(MarkersPlugin);
      if (markersPlugin) {
        try {
          markersPlugin.removeMarker(hpId);
        } catch (err) {}
      }
    }
    if (onDeleteHotspot) {
      onDeleteHotspot(hpId);
    }
  };

  const initialMarkers = [
    {
      id: "temp_preview_marker",
      position: { yaw, pitch },
      html: createPreviewPuckHtml(title || "HOTSPOT", hotspotType),
    },
    ...existingHotspots.map((hp) => ({
      id: hp.id,
      position: { yaw: hp.yaw || "0deg", pitch: hp.pitch || "-20deg" },
      html: createPreviewPuckHtml(hp.title || "SAVED HOTSPOT", hp.type || "arrow"),
    })),
  ];

  const plugins = [
    [
      MarkersPlugin,
      {
        markers: initialMarkers,
      },
    ],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 md:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full h-full sm:w-[98vw] sm:h-[96vh] sm:max-w-[1600px] rounded-none sm:rounded-[28px] bg-base-100 border-0 sm:border border-base-content/10 shadow-2xl overflow-hidden text-base-content flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-base-200/80 border-b border-base-content/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-base-100 border border-base-content/10 text-base-content flex items-center justify-center text-sm shadow-xs shrink-0">
              <FontAwesomeIcon icon={faCrosshairs} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block truncate">
                Visual 360° Hotspot Studio
              </span>
              <h3 className="font-bold text-xs sm:text-sm md:text-base text-base-content flex items-center gap-2 truncate">
                <span className="truncate">Editing Hotspots for:</span>
                <span className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-base-content text-base-100 shrink-0">
                  {scene?.name || "Panorama Scene"}
                </span>
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close Editor"
            className="w-9 h-9 rounded-2xl bg-base-100 hover:bg-base-200 border border-base-content/10 text-base-content flex items-center justify-center text-xs transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full min-h-0">
          {/* 360 Viewport */}
          <div className="relative w-full lg:w-3/4 xl:w-4/5 h-[50vh] sm:h-[60vh] lg:h-full bg-black shrink-0 border-b lg:border-b-0 lg:border-r border-base-content/10 flex-1">
            <ReactPhotoSphereViewer
              key={`${scene?.id}_${panoramaUrl}`}
              src={panoramaUrl}
              height="100%"
              width="100%"
              container="psv-editor-container"
              navbar={false}
              mousewheel={true}
              defaultYaw={yaw}
              defaultPitch={pitch}
              plugins={plugins}
              onReady={handlePsvReady}
            />

            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl text-[10px] sm:text-xs font-bold text-white flex items-center gap-2 shadow-md max-w-[90%]">
              <FontAwesomeIcon icon={faCompass} className="text-white shrink-0 animate-spin" />
              <span className="truncate font-semibold">Click panorama to position hotspot</span>
            </div>

            {/* Quick Switch Scene Bar inside Viewport Header */}
            {tour?.scenes && tour.scenes.length > 1 && (
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 max-w-[90%] overflow-x-auto py-1.5 px-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20">
                <span className="text-[10px] font-bold text-white/70 uppercase px-1">Switch Room:</span>
                {tour.scenes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSwitchEditingScene && onSwitchEditingScene(s)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      s.id === scene?.id
                        ? "bg-white text-black font-extrabold shadow-md"
                        : "bg-white/10 hover:bg-white/25 text-white"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Studio Form Panel */}
          <form onSubmit={handleSubmit} className="w-full lg:w-1/4 xl:w-1/5 p-4 sm:p-6 bg-base-100 space-y-4 overflow-y-auto flex flex-col justify-between shrink-0">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-content/10">
                <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider block mb-0.5">
                  Current Room Scene
                </span>
                <p className="font-extrabold text-sm text-base-content">{scene?.name || "Main Scene"}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                  Hotspot Label / Button Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dining Room or Bedroom"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1">
                    Yaw (Horizontal)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={yaw}
                    className="w-full px-3 py-2 rounded-xl bg-base-200/60 border border-base-content/10 text-base-content font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1">
                    Pitch (Vertical)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={pitch}
                    className="w-full px-3 py-2 rounded-xl bg-base-200/60 border border-base-content/10 text-base-content font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                  Hotspot Icon & Design
                </label>
                <select
                  value={hotspotType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                >
                  <option value="arrow">∧ 3D Floor Animated Chevron Arrow</option>
                  <option value="door">🚪 Circular Doorway Ring</option>
                  <option value="puck">⭕ Concentric Floor Target Puck</option>
                  <option value="bathroom">🛁 Bathroom Puck</option>
                  <option value="stairs">🪜 Stairs / Upper Level</option>
                  <option value="dining">🍽️ Dining & Kitchen</option>
                  <option value="bedroom">🛏️ Bedroom / Suite</option>
                  <option value="info">ℹ️ Spatial Info Badge</option>
                </select>
              </div>

              {/* Target Scene Portal Destination Selector & Inline Creator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-base-content/70">
                    Target Scene Destination
                  </label>
                  <Button
                    variant="secondary"
                    onClick={() => setShowNewSceneForm(!showNewSceneForm)}
                    className="!text-[10px] !py-1 !px-2.5 !h-auto font-bold flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>+ New Room Scene</span>
                  </Button>
                </div>

                <select
                  value={targetId}
                  onChange={(e) => {
                    const newTargetId = e.target.value;
                    setTargetId(newTargetId);
                    const targetObj = tour?.scenes?.find((s) => s.id === newTargetId);
                    if (targetObj && !title) {
                      handleTitleChange(targetObj.name);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                >
                  <option value="">None (Info Puck)</option>
                  {tour?.scenes?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* Inline New Linked Scene Creator Card */}
                {showNewSceneForm && (
                  <div className="p-3.5 rounded-2xl bg-base-200/60 border border-base-content/15 space-y-3 animate-in fade-in duration-200 mt-2 shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/70 block">
                      Add & Link New 360° Room Scene
                    </span>
                    <div>
                      <input
                        type="text"
                        placeholder="e.g. Dining Room or Kitchen"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="inline_scene_image_input"
                        className="hidden"
                        onChange={handleFileUploadForNewScene}
                      />
                      <label
                        htmlFor="inline_scene_image_input"
                        className={`flex-1 px-3 py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          newRoomImageUrl
                            ? "bg-base-300 text-base-content border-base-content/30"
                            : "bg-base-100 hover:bg-base-200 border-base-content/15 text-base-content"
                        }`}
                      >
                        <FontAwesomeIcon icon={newRoomImageUrl ? faCheckCircle : faCloudArrowUp} />
                        <span>{isUploadingImage ? "Uploading..." : newRoomImageUrl ? "360 Image Uploaded ✓" : "Upload 360 Image"}</span>
                      </label>
                    </div>

                    <Button
                      variant="primary"
                      onClick={handleCreateAndLinkNewScene}
                      disabled={!newRoomName}
                      className="w-full !text-xs !py-2.5"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
                      Create Scene & Select Destination
                    </Button>
                  </div>
                )}
              </div>

              {/* Existing Hotspots Manager */}
              {existingHotspots.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-base-content/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                    Existing Hotspots in this Room ({existingHotspots.length})
                  </span>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {existingHotspots.map((hp) => {
                      const linkedScene = tour?.scenes?.find((s) => s.id === hp.targetId);
                      return (
                        <div
                          key={hp.id}
                          className="p-2.5 rounded-xl bg-base-200/50 border border-base-content/10 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FontAwesomeIcon icon={faLocationDot} className="text-base-content/60 text-xs shrink-0" />
                            <div className="min-w-0">
                              <p className="font-bold text-base-content truncate">{hp.title}</p>
                              {linkedScene && (
                                <p className="text-[9px] text-base-content/70 font-semibold truncate">➔ Links to {linkedScene.name}</p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteLocalHotspot(hp.id)}
                            className="p-1 rounded-lg text-base-content/60 hover:text-error hover:bg-error/10 cursor-pointer text-xs shrink-0"
                            title="Delete Hotspot"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons using Reusable App Button Component */}
            <div className="pt-4 flex items-center justify-end gap-2 border-t border-base-content/10">
              <Button
                variant="secondary"
                onClick={onClose}
                className="!text-xs !py-2.5 !px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="!text-xs !py-2.5 !px-5"
              >
                <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
                Save Hotspot
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
