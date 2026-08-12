import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import PanoramaScene from "./PanoramaScene";
import { getPropertyById } from "../../data/mockProperties";
import scenesData from "../../data/demo-scenes.json";
import * as THREE from "three";

export default function DemoTourViewer({ propertyId, onBack }) {
  const prop = getPropertyById(propertyId);
  const [scenes] = useState(scenesData);
  const [currentId, setCurrentId] = useState(scenes[0].id);
  const fadeRef = useRef();
  const [fading, setFading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // ensure initial fade hidden
    if (fadeRef.current) fadeRef.current.style.opacity = 0;
  }, []);

  const preloadImage = (url) =>
    new Promise((res) => {
      const img = new Image();
      img.src = url;
      img.onload = () => res();
      img.onerror = () => res();
    });

  const changeScene = async (targetId) => {
    if (targetId === currentId) return;
    const target = scenes.find((s) => s.id === targetId);
    if (!target) return;

    // preload
    await preloadImage(target.image);

    // fade out -> switch -> fade in using CSS transition
    setFading(true);
    await new Promise((res) => setTimeout(res, 300));
    setCurrentId(targetId);
    // wait a bit for scene to render, then fade back
    await new Promise((res) => setTimeout(res, 120));
    setFading(false);
  };

  const current = scenes.find((s) => s.id === currentId) || scenes[0];

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div
        className="absolute inset-0 z-40 pointer-events-none"
        ref={fadeRef}
        style={{
          background: "#000",
          opacity: fading ? 1 : 0,
          transition: "opacity 0.32s ease",
        }}
      />

      {/* Top bar */}
      <div className="absolute top-4 left-4 z-50 pointer-events-auto">
        <div className="px-3 py-2 rounded-full bg-black/50 backdrop-blur text-white">
          <div className="text-sm font-semibold">
            {prop?.title || "Property"}
          </div>
          <div className="text-xs text-slate-300">{current?.name}</div>
        </div>
      </div>

      {/* Hamburger / actions */}
      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="px-3 py-2 rounded-full bg-black/50 text-white cursor-pointer"
          aria-label="Menu"
        >
          ≡
        </button>
      </div>

      {/* Slide-out action panel */}
      <div
        className={`fixed right-4 top-20 z-50 flex flex-col gap-3 transition-transform ${menuOpen ? "translate-x-0" : "translate-x-32"}`}
      >
        {/* circular icon buttons */}
        {[
          { id: "close", label: "Close", icon: "✖", onClick: onBack },
          {
            id: "vr",
            label: "VR",
            icon: "🕶️",
            onClick: () => alert("VR placeholder"),
          },
          {
            id: "sound",
            label: "Sound",
            icon: "🔊",
            onClick: () => alert("Sound toggle"),
          },
          {
            id: "hide",
            label: "Hide",
            icon: "🙈",
            onClick: () => alert("Hide markers"),
          },
          {
            id: "fs",
            label: "Fullscreen",
            icon: "⤢",
            onClick: async () => {
              try {
                if (!document.fullscreenElement)
                  await document.documentElement.requestFullscreen();
                else await document.exitFullscreen();
              } catch (e) {}
            },
          },
          {
            id: "snap",
            label: "Snap",
            icon: "📷",
            onClick: () => alert("Snapshot"),
          },
        ].map((b) => (
          <button
            key={b.id}
            onClick={b.onClick}
            className="w-12 h-12 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center cursor-pointer shadow-lg"
            title={b.label}
          >
            <span className="text-lg">{b.icon}</span>
          </button>
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        className="w-full h-full"
      >
        <PanoramaScene
          panoramaUrl={current.image}
          sceneName={current.name}
          hotspots={current.hotspots}
          onHotspotClick={(h) => changeScene(h.target)}
        />
      </Canvas>

      {/* Thumbnail strip */}
      <div className="absolute left-0 right-0 bottom-6 z-50 pointer-events-auto flex justify-center">
        <div className="bg-black/50 backdrop-blur rounded-xl px-4 py-2 flex gap-3 overflow-x-auto max-w-full snap-x">
          {scenes.map((s) => (
            <button
              key={s.id}
              onClick={() => changeScene(s.id)}
              className={`flex flex-col items-center gap-1 snap-center ${s.id === currentId ? "text-amber-400" : "text-white"} cursor-pointer`}
            >
              <img
                src={s.thumbnail}
                alt={s.name}
                className="w-24 h-16 object-cover rounded-md border border-white/10"
              />
              <span
                className={`text-xs font-semibold ${s.id === currentId ? "underline" : ""}`}
              >
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
