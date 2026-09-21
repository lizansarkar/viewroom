import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck, faCompass, faTag } from "@fortawesome/free-solid-svg-icons";

export default function HotspotEditorModal({ scene, tour, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [yaw, setYaw] = useState("0deg");
  const [pitch, setPitch] = useState("-10deg");
  const [targetId, setTargetId] = useState(
    tour?.scenes?.find((s) => s.id !== scene?.id)?.id || ""
  );

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-base-100 border border-[var(--app-border)]/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[var(--app-text-primary)]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-base-200 border-b border-[var(--app-border)]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCompass} className="text-cyan-500" />
            <h3 className="font-heading font-black text-xs uppercase tracking-wider">
              ADD SPHERICAL HOTSPOT (360° MARKER)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-base-300 flex items-center justify-center text-xs transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1.5">
              Marker Label / Title*
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1ST FLOOR LOBBY"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-xs font-bold text-[var(--app-text-primary)] placeholder-[var(--app-text-secondary)] focus:outline-none focus:border-[var(--app-text-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1.5">
                Horizontal Yaw Angle
              </label>
              <input
                type="text"
                placeholder="e.g. 30deg or -45deg"
                value={yaw}
                onChange={(e) => setYaw(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-xs font-bold text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1.5">
                Vertical Pitch Angle
              </label>
              <input
                type="text"
                placeholder="e.g. -15deg or 10deg"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-xs font-bold text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1.5">
              Target Scene (Teleport Portal Destination)
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-xs font-bold text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)]"
            >
              <option value="">None (Info Badge Only)</option>
              {tour?.scenes?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.floorLevel || "Floor"})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--app-border)]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-[var(--app-border)]/40 text-xs font-bold uppercase tracking-wider hover:bg-base-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
            >
              <FontAwesomeIcon icon={faCheck} className="text-xs" />
              Save Hotspot Marker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
