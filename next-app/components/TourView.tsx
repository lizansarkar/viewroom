"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import * as THREE from "three";
import { ChevronRight, Door, Menu } from "lucide-react";
import type { SceneData, SceneHotspot } from "../types/scene";
import { sphericalToDir, positionToSpherical } from "../lib/panorama-math";

const HOTSPOT_RADIUS = 480;
const FADE_DURATION = 0.45;

function iconForType(type: string) {
  if (type === "door") return Door;
  return Door;
}

function convertHotspotPosition(hotspot: SceneHotspot) {
  return sphericalToDir(hotspot.yaw, hotspot.pitch);
}

function loadSceneTextures(scenes: SceneData[]) {
  return scenes.reduce<Record<string, string>>((acc, scene) => {
    acc[scene.id] = scene.image;
    return acc;
  }, {});
}

export default function TourView({
  scenes,
  initialSceneId,
  debug,
}: {
  scenes: SceneData[];
  initialSceneId: string;
  debug?: boolean;
}) {
  const [currentSceneId, setCurrentSceneId] = useState(initialSceneId);
  const [transitioning, setTransitioning] = useState(false);
  const [nextSceneId, setNextSceneId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scene = scenes.find((item) => item.id === currentSceneId) ?? scenes[0];
  const nextScene = nextSceneId
    ? (scenes.find((item) => item.id === nextSceneId) ?? null)
    : null;
  const textures = loadSceneTextures(scenes);
  const texture = useTexture(scene.image);
  const nextTexture = nextScene ? useTexture(nextScene.image) : null;
  const fadeRef = useRef<HTMLDivElement>(null);

  const hotspotElements = useMemo(
    () =>
      scene.hotspots.map((hotspot) => {
        const dir = convertHotspotPosition(hotspot);
        return { ...hotspot, dir };
      }),
    [scene.hotspots],
  );

  useEffect(() => {
    if (debug) {
      const handler = (event: PointerEvent) => {
        const { clientX, clientY } = event;
        console.log("Debug click:", { clientX, clientY });
      };
      window.addEventListener("pointerdown", handler);
      return () => window.removeEventListener("pointerdown", handler);
    }
  }, [debug]);

  const transitionToScene = (targetId: string) => {
    if (transitioning || targetId === currentSceneId) return;
    const targetScene = scenes.find((item) => item.id === targetId);
    if (!targetScene) return;

    setTransitioning(true);
    setNextSceneId(targetId);

    gsap.to(fadeRef.current, {
      duration: FADE_DURATION,
      opacity: 1,
      ease: "power2.out",
      onComplete: () => {
        setCurrentSceneId(targetId);
        setNextSceneId(null);
        gsap.to(fadeRef.current, {
          duration: FADE_DURATION,
          opacity: 0,
          ease: "power2.out",
          onComplete: () => setTransitioning(false),
        });
      },
    });
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 rounded-3xl bg-slate-950/70 px-4 py-3 text-slate-100 shadow-xl shadow-black/30 backdrop-blur-xl">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300">
            V
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
              ViewRoom
            </p>
            <p className="text-sm font-semibold text-white">Demo House</p>
          </div>
        </div>

        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-slate-100 shadow-xl shadow-black/30 backdrop-blur-xl"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 pb-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between space-x-4 overflow-x-auto px-4 sm:px-6 snap-x scroll-smooth">
          {scenes.map((item) => (
            <button
              key={item.id}
              onClick={() => transitionToScene(item.id)}
              className={`snap-center shrink-0 rounded-3xl border border-white/10 bg-slate-950/80 p-2 transition ${item.id === currentSceneId ? "ring-2 ring-emerald-400/70" : "hover:border-slate-300/30"}`}
            >
              <img
                src={item.thumbnail}
                alt={item.name}
                className="h-20 w-32 rounded-2xl object-cover"
              />
              <p
                className={`mt-2 text-xs font-semibold ${item.id === currentSceneId ? "text-emerald-300" : "text-slate-200"}`}
              >
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 0.1], fov: 75 }}
          className="h-full w-full"
        >
          <ambientLight intensity={0.8} />
          <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial
              map={texture}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>

          {hotspotElements.map((hotspot) => {
            const Icon =
              hotspot.type === "icon"
                ? iconForType(hotspot.icon || "door")
                : ChevronRight;
            const position = [
              hotspot.dir.x * HOTSPOT_RADIUS,
              hotspot.dir.y * HOTSPOT_RADIUS,
              hotspot.dir.z * HOTSPOT_RADIUS,
            ] as [number, number, number];
            const rotation =
              hotspot.type === "arrow"
                ? [Math.PI / 2, 0, -hotspot.yaw * (Math.PI / 180)]
                : [0, 0, 0];

            return (
              <Html
                key={hotspot.yaw + "-" + hotspot.pitch + "-" + hotspot.target}
                position={position}
                center
                style={{ pointerEvents: transitioning ? "none" : "auto" }}
              >
                <button
                  onClick={() => transitionToScene(hotspot.target)}
                  className={`flex items-center justify-center rounded-full border border-white/20 bg-slate-950/80 p-3 text-white shadow-xl shadow-black/40 backdrop-blur-xl transition hover:bg-slate-900/95 ${hotspot.type === "icon" ? "animate-pulse min-h-[44px] min-w-[44px]" : "h-14 w-14"}`}
                  style={
                    hotspot.type === "arrow"
                      ? { transform: `rotate(${hotspot.yaw}deg)` }
                      : undefined
                  }
                >
                  <Icon className="h-5 w-5" />
                </button>
                {hotspot.type === "icon" && hotspot.label ? (
                  <div className="mt-2 rounded-full bg-slate-950/90 px-3 py-1 text-[11px] font-semibold text-slate-100 shadow-lg shadow-black/30">
                    {hotspot.label}
                  </div>
                ) : null}
              </Html>
            );
          })}

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={-0.25}
            zoomSpeed={0.6}
            minPolarAngle={Math.PI * 0.15}
            maxPolarAngle={Math.PI * 0.85}
          />
        </Canvas>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "power3.out" }}
            className="fixed inset-y-0 right-0 z-40 w-[320px] bg-slate-950/95 border-l border-white/10 backdrop-blur-2xl"
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
                  Menu
                </p>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-300"
                >
                  Close
                </button>
              </div>
              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <p>Placeholder panel content for the demo.</p>
                <p className="rounded-3xl bg-slate-900/70 p-4">
                  No action items required.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        ref={fadeRef}
        className="pointer-events-none absolute inset-0 z-20 bg-slate-950 opacity-0"
      />
    </div>
  );
}
