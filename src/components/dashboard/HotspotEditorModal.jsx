import React, { useState, useRef } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck, faCompass, faCrosshairs } from "@fortawesome/free-solid-svg-icons";

const createPreviewPuckHtml = (label) => `
  <div class="cursor-pointer group flex flex-col items-center justify-center p-2 select-none">
    <div class="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white text-white text-[10px] font-black uppercase tracking-wider mb-1 shadow-lg">
      ${label || "NEW HOTSPOT"}
    </div>
    <div style="transform: perspective(500px) rotateX(70deg);" class="w-12 h-12 rounded-full border-2 border-white bg-white/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse">
      <div class="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
    </div>
  </div>
`;

export default function HotspotEditorModal({ scene, tour, onClose, onSave }) {
  const [title, setTitle] = useState("NEW ROOM CONNECTOR");
  const [yaw, setYaw] = useState("0deg");
  const [pitch, setPitch] = useState("-25deg");
  const [targetId, setTargetId] = useState(
    tour?.scenes?.find((s) => s.id !== scene?.id)?.id || ""
  );

  const psvRef = useRef(null);

  const panoramaUrl =
    scene?.panoramaUrl ||
    scene?.panorama ||
    "/panoramas/panorama_entrance.jpg";

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
          markersPlugin.clearMarkers();
          markersPlugin.addMarker({
            id: "temp_preview_marker",
            position: { yaw: yawDeg, pitch: pitchDeg },
            html: createPreviewPuckHtml(title),
          });
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onSave({
      title,
      yaw: yaw.includes("deg") ? yaw : `${yaw}deg`,
      pitch: pitch.includes("deg") ? pitch : `${pitch}deg`,
      targetId,
    });
  };

  const plugins = [
    [
      MarkersPlugin,
      {
        markers: [
          {
            id: "temp_preview_marker",
            position: { yaw, pitch },
            html: createPreviewPuckHtml(title),
          },
        ],
      },
    ],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faCrosshairs} className="text-white text-sm" />
            <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white">
              VISUAL 360° HOTSPOT STUDIO • POINT & CLICK EDITOR
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close Editor"
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Content Layout: Left 360 Canvas, Right Configuration Controls */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* 360 Interactive Placement Viewport */}
          <div className="relative w-full lg:w-2/3 h-64 sm:h-80 lg:h-auto bg-black shrink-0">
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

            <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-white/30 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shadow-lg">
              <FontAwesomeIcon icon={faCompass} className="animate-spin text-white" />
              <span>CLICK ANYWHERE ON FLOOR TO PLACE PUCK</span>
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSubmit} className="w-full lg:w-1/3 p-6 bg-zinc-950 space-y-4 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Hotspot Label / Room Title*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2ND FLOOR EXECUTIVE LOUNGE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white font-bold text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner placeholder-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1">
                    Yaw (Horizontal)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={yaw}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1">
                    Pitch (Vertical)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={pitch}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Target Scene Portal Destination
                </label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white font-bold text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all cursor-pointer"
                >
                  <option value="" className="bg-zinc-900 text-white font-bold py-2">
                    None (Info Puck Only)
                  </option>
                  {tour?.scenes?.map((s) => (
                    <option key={s.id} value={s.id} className="bg-zinc-900 text-white font-bold py-2">
                      {s.name} ({s.floorLevel !== undefined ? `FL ${s.floorLevel}` : "Floor"})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                Save Hotspot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
