import React, { useRef, useState } from "react";
import { Html, useCursor } from "@react-three/drei";
import { cn } from "../../lib/utils";
import { DoorOpen, ChevronUp } from "lucide-react";

const CLICK_MOVE_THRESHOLD = 10;

export default function HotspotMarker({
  hotspot,
  mode = "view",
  selected = false,
  position,
  sphereRef,
  onClick,
  onSelect,
  onDragStart,
  onDragEnd,
}) {
  const [hovered, setHovered] = useState(false);
  const downRef = useRef(null);
  useCursor(hovered);

  const isEdit = mode === "edit";
  const markerColor = selected
    ? "#fbbf24"
    : hovered
      ? "#ffffff"
      : isEdit
        ? "#38bdf8"
        : "#34d399";
  const labelColor = selected
    ? "border-amber-400/50 text-amber-100"
    : isEdit
      ? "border-sky-400/40 text-sky-100"
      : "border-emerald-400/40 text-emerald-100";

  const handleDown = (e) => {
    e.stopPropagation();
    downRef.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
    if (isEdit) {
      onSelect?.(hotspot.id);
      onDragStart?.(hotspot.id);
    }
  };

  const handleUp = (e) => {
    e.stopPropagation();
    const down = downRef.current;
    downRef.current = null;
    if (!down) return;

    const moved =
      Math.hypot(
        e.nativeEvent.clientX - down.x,
        e.nativeEvent.clientY - down.y,
      ) > CLICK_MOVE_THRESHOLD;

    if (!moved) {
      if (isEdit) onSelect?.(hotspot.id);
      else onClick?.(hotspot);
    }

    if (isEdit) onDragEnd?.();
  };

  return (
    <group
      position={position}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      {/* Render different visual markers depending on hotspot.type */}
      {hotspot.type === "icon" ? (
        <Html
          center
          distanceFactor={240}
          position={[0, 8, 0]}
          occlude={[sphereRef]}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="relative flex items-center justify-center"
            style={{ width: 48, height: 48 }}
          >
            <span className="absolute inline-flex w-12 h-12 rounded-full bg-white/20 animate-ping" />
            <button
              onClick={() => onClick?.(hotspot)}
              className="relative w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/90 bg-black/40 text-white shadow-lg touch-none cursor-pointer"
              aria-label={hotspot.label || "Hotspot"}
            >
              <DoorOpen className="w-5 h-5" />
            </button>
          </div>
        </Html>
      ) : (
        <Html
          center
          distanceFactor={200}
          position={[0, 6, 0]}
          occlude={[sphereRef]}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: "auto" }}
        >
          <button
            onClick={() => onClick?.(hotspot)}
            className="w-14 h-8 rounded-md flex items-center justify-center bg-white/10 border border-white/30 text-white rotate-0 touch-none cursor-pointer"
            aria-label={hotspot.label || "Move"}
            style={{ transform: `rotate(${hotspot.yaw || 0}deg)` }}
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        </Html>
      )}
    </group>
  );
}
