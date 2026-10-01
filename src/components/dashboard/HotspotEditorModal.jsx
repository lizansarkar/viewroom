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
  faRoute,
  faSliders,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";

const getHotspotIcon = (type) => {
  switch (type) {
    case "arrow": return "⬆️";
    case "bathroom": return "🛁";
    case "stairs": return "🪜";
    case "dining": return "🍽️";
    case "bedroom": return "🛏️";
    case "info": return "ℹ️";
    default: return "➔";
  }
};

const createPreviewPuckHtml = (label, type = "arrow") => `
  <div class="cursor-pointer group flex flex-col items-center justify-center select-none">
    <div class="px-3 py-1 rounded-full bg-black/90 backdrop-blur-md border border-white text-white text-[11px] font-extrabold uppercase tracking-wider mb-1.5 shadow-2xl flex items-center gap-1.5">
      <span>${getHotspotIcon(type)}</span>
      <span>${label || "NEW HOTSPOT"}</span>
    </div>
    <div style="transform: perspective(500px) rotateX(65deg);" class="w-14 h-14 rounded-full border-2 border-white bg-white/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.9)] animate-pulse">
      <div class="w-5 h-5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)]"></div>
    </div>
  </div>
`;

export default function HotspotEditorModal({ scene, tour, onClose, onSave, onDeleteHotspot }) {
  const [title, setTitle] = useState("NEW ROOM CONNECTOR");
  const [yaw, setYaw] = useState("0deg");
  const [pitch, setPitch] = useState("-25deg");
  const [targetId, setTargetId] = useState(
    tour?.scenes?.find((s) => s.id !== scene?.id)?.id || ""
  );
  const [hotspotType, setHotspotType] = useState("arrow");

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
            html: createPreviewPuckHtml(title, hotspotType),
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
          html: createPreviewPuckHtml(newTitle, newType),
        });
      }
    }
  };

  const handleTypeChange = (newType) => {
    setHotspotType(newType);
    handleTitleChange(title, newType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    const newHotspot = {
      id: `hp_${Date.now()}`,
      title,
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
      html: createPreviewPuckHtml(title, hotspotType),
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
                <span className="truncate">Point & Click Room Hotspot Editor</span>
                <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-base-content text-base-100 shrink-0">
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

        {/* Content Layout: Left 360 Viewport (75-80% Width), Right Studio Controls (20-25% Width) */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full min-h-0">
          {/* 360 Interactive Viewport (Expanded to Full Width / 80% Screen Real Estate) */}
          <div className="relative w-full lg:w-3/4 xl:w-4/5 h-[50vh] sm:h-[60vh] lg:h-full bg-black shrink-0 border-b lg:border-b-0 lg:border-r border-base-content/10 flex-1">
            <ReactPhotoSphereViewer
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

            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-base-100/90 backdrop-blur-md border border-base-content/15 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-[10px] sm:text-xs font-bold text-base-content uppercase tracking-wider flex items-center gap-2 sm:gap-2.5 shadow-md max-w-[90%]">
              <FontAwesomeIcon icon={faCompass} className="animate-spin text-base-content shrink-0" />
              <span className="truncate">CLICK ANYWHERE ON PANORAMA TO PLACE PUCK</span>
            </div>
          </div>

          {/* Right Studio Form Panel */}
          <form onSubmit={handleSubmit} className="w-full lg:w-1/4 xl:w-1/5 p-4 sm:p-6 bg-base-100 space-y-4 overflow-y-auto flex flex-col justify-between shrink-0">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-content/10">
                <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider block mb-1">
                  Active Scene Metadata
                </span>
                <p className="font-bold text-xs text-base-content">{scene?.name || "Ground Floor Lobby"}</p>
                <p className="text-[10px] text-base-content/60">{tour?.title || "360° Virtual Tour"}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                  Hotspot Label / Room Title*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2ND FLOOR EXECUTIVE LOUNGE"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-base-200/60 border border-base-content/10 text-base-content font-mono font-bold text-xs"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-base-200/60 border border-base-content/10 text-base-content font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                  Hotspot Icon & Style
                </label>
                <select
                  value={hotspotType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                >
                  <option value="arrow">⬆️ Directional Arrow (Walk Forward)</option>
                  <option value="bathroom">🛁 Master Bathroom Puck</option>
                  <option value="stairs">🪜 Stairs / Upper Floor Puck</option>
                  <option value="dining">🍽️ Dining & Kitchen Puck</option>
                  <option value="bedroom">🛏️ Bedroom / Suite Puck</option>
                  <option value="info">ℹ️ Spatial Info Badge</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                  Target Scene Portal Destination
                </label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                >
                  <option value="">None (Information Puck Only)</option>
                  {tour?.scenes?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.floorLevel !== undefined ? `FL ${s.floorLevel}` : "Floor"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Existing Hotspots Manager in Current Scene */}
              {existingHotspots.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-base-content/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 flex items-center justify-between">
                    <span>Existing Scene Hotspots ({existingHotspots.length})</span>
                  </span>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {existingHotspots.map((hp) => (
                      <div
                        key={hp.id}
                        className="p-2.5 rounded-xl bg-base-200/50 border border-base-content/10 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faLocationDot} className="text-base-content/60 text-xs" />
                          <span className="font-bold text-base-content truncate max-w-[140px]">{hp.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteLocalHotspot(hp.id)}
                          className="p-1 rounded-lg text-base-content/60 hover:text-error hover:bg-error/10 cursor-pointer text-xs"
                          title="Delete Hotspot"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-base-content/10">
              <Button
                variant="secondary"
                onClick={onClose}
                className="!text-xs !py-2.5 !px-5 !rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="!text-xs !py-2.5 !px-6 !rounded-xl"
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
