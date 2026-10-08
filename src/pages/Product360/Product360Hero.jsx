import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faPause,
  faDownload,
  faWandMagicSparkles,
  faArrowRotateLeft,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";

// =========================================================
// 1. CHASSIS / FRAME ALUMINIUM FINISH PRESETS
// =========================================================
const FRAME_FINISHES = [
  {
    id: "silver",
    name: "Silver Aluminium",
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.2,
    preview: "linear-gradient(135deg, #f8fafc, #94a3b8)",
  },
  {
    id: "spacegray",
    name: "Space Gray",
    color: 0x3f3f46,
    metalness: 0.85,
    roughness: 0.25,
    preview: "linear-gradient(135deg, #71717a, #27272a)",
  },
  {
    id: "starlight",
    name: "Starlight Gold",
    color: 0xfef08a,
    metalness: 0.85,
    roughness: 0.25,
    preview: "linear-gradient(135deg, #fef08a, #d97706)",
  },
  {
    id: "midnight",
    name: "Midnight Indigo",
    color: 0x1e293b,
    metalness: 0.8,
    roughness: 0.3,
    preview: "linear-gradient(135deg, #3b82f6, #0f172a)",
  },
  {
    id: "rose",
    name: "Blush Rose",
    color: 0xfecdd3,
    metalness: 0.8,
    roughness: 0.25,
    preview: "linear-gradient(135deg, #fecdd3, #e11d48)",
  },
  {
    id: "black",
    name: "Matte Stealth Black",
    color: 0x18181b,
    metalness: 0.5,
    roughness: 0.6,
    preview: "linear-gradient(135deg, #27272a, #09090b)",
  },
];

// =========================================================
// 2. DISPLAY SCREEN THEME / WALLPAPER PRESETS
// =========================================================
const DISPLAY_THEMES = [
  {
    id: "retina-white",
    name: "Studio Clean White",
    color: 0xf8fafc,
    emissive: 0x1e293b,
    preview: "linear-gradient(135deg, #ffffff, #e2e8f0)",
  },
  {
    id: "oled-black",
    name: "Obsidian OLED Black",
    color: 0x09090b,
    emissive: 0x000000,
    preview: "linear-gradient(135deg, #18181b, #000000)",
  },
  {
    id: "neon-cyan",
    name: "Cyber Neon Cyan",
    color: 0x06b6d4,
    emissive: 0x083344,
    preview: "linear-gradient(135deg, #22d3ee, #0e7490)",
  },
  {
    id: "sunset-amber",
    name: "Sunset Horizon Amber",
    color: 0xf97316,
    emissive: 0x451a03,
    preview: "linear-gradient(135deg, #fb923c, #c2410c)",
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean Royal Blue",
    color: 0x2563eb,
    emissive: 0x172554,
    preview: "linear-gradient(135deg, #60a5fa, #1d4ed8)",
  },
  {
    id: "emerald-aurora",
    name: "Emerald Aurora Green",
    color: 0x10b981,
    emissive: 0x064e3b,
    preview: "linear-gradient(135deg, #34d399, #047857)",
  },
];

export default function Product360Hero() {
  const [activeTab, setActiveTab] = useState("frame"); // 'frame' | 'display'
  const [selectedFrame, setSelectedFrame] = useState(FRAME_FINISHES[0]);
  const [selectedDisplay, setSelectedDisplay] = useState(DISPLAY_THEMES[0]);
  const [loading, setLoading] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const autoRotateRef = useRef(isAutoRotate);
  const modelGroupRef = useRef(null);
  const frameMaterialRef = useRef(null);
  const screenMaterialRef = useRef(null);

  useEffect(() => {
    autoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update Frame Material in Real-time
  useEffect(() => {
    if (frameMaterialRef.current) {
      frameMaterialRef.current.color.setHex(selectedFrame.color);
      frameMaterialRef.current.metalness = selectedFrame.metalness;
      frameMaterialRef.current.roughness = selectedFrame.roughness;
      frameMaterialRef.current.needsUpdate = true;
    }
  }, [selectedFrame]);

  // Update Screen Display Material in Real-time
  useEffect(() => {
    if (screenMaterialRef.current) {
      screenMaterialRef.current.color.setHex(selectedDisplay.color);
      screenMaterialRef.current.emissive.setHex(selectedDisplay.emissive);
      screenMaterialRef.current.needsUpdate = true;
    }
  }, [selectedDisplay]);

  // Three.js Scene Setup (No Ground Shadow, No Canvas Background)
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.2, 6.8);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // High Dynamic Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 2.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.8);
    fillLight.position.set(-6, -2, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.5);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Model Container
    const modelGroup = new THREE.Group();
    // Default angle: front screen directly facing user (+Z)
    modelGroup.rotation.y = -Math.PI / 2;
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Materials: Separate Frame & Display Screen
    const frameMat = new THREE.MeshStandardMaterial({
      color: selectedFrame.color,
      metalness: selectedFrame.metalness,
      roughness: selectedFrame.roughness,
    });
    const screenMat = new THREE.MeshStandardMaterial({
      color: selectedDisplay.color,
      emissive: selectedDisplay.emissive,
      roughness: 0.15,
      metalness: 0.1,
    });

    frameMaterialRef.current = frameMat;
    screenMaterialRef.current = screenMat;

    // Load Real .glb Monitor Model
    let isDisposed = false;
    const loader = new GLTFLoader();
    loader.load(
      "/models/monitor.glb",
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;

        root.traverse((child) => {
          if (child.isMesh && child.geometry) {
            const geometry = child.geometry;
            const pos = geometry.attributes.position.array;
            const oldIndex = geometry.index ? geometry.index.array : null;

            if (oldIndex) {
              const frameIndices = [];
              const screenIndices = [];

              for (let i = 0; i < oldIndex.length; i += 3) {
                const i0 = oldIndex[i], i1 = oldIndex[i + 1], i2 = oldIndex[i + 2];
                const y0 = pos[i0 * 3 + 1], y1 = pos[i1 * 3 + 1], y2 = pos[i2 * 3 + 1];
                const z0 = pos[i0 * 3 + 2], z1 = pos[i1 * 3 + 2], z2 = pos[i2 * 3 + 2];
                const x0 = pos[i0 * 3], x1 = pos[i1 * 3], x2 = pos[i2 * 3];

                const minY = Math.min(y0, y1, y2);
                const maxY = Math.max(y0, y1, y2);
                const maxZ = Math.max(Math.abs(z0), Math.abs(z1), Math.abs(z2));

                // Normal vector calculation
                const ux = x1 - x0, uy = y1 - y0, uz = z1 - z0;
                const vx = x2 - x0, vy = y2 - y0, vz = z2 - z0;
                const nx = uy * vz - uz * vy;
                const ny = uz * vx - ux * vz;
                const nz = ux * vy - uy * vx;
                const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
                const dotX = nx / len;

                // Screen quad detection (front-facing, mid height, within screen bounds)
                if (dotX > 0.85 && minY >= 21.0 && maxY <= 53.0 && maxZ <= 28.0) {
                  screenIndices.push(i0, i1, i2);
                } else {
                  frameIndices.push(i0, i1, i2);
                }
              }

              // Re-group geometry with separate materials for frame and screen
              const newIndex = new Uint16Array([...frameIndices, ...screenIndices]);
              geometry.setIndex(new THREE.BufferAttribute(newIndex, 1));
              geometry.clearGroups();
              geometry.addGroup(0, frameIndices.length, 0); // Frame
              geometry.addGroup(frameIndices.length, screenIndices.length, 1); // Display Screen

              child.material = [frameMat, screenMat];
            } else {
              child.material = frameMat;
            }
          }
        });

        // Auto-center and fit to camera view
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 3.6;
        const scale = maxDim > 0 ? targetSize / maxDim : 1;

        root.scale.setScalar(scale);
        root.position.x = -center.x * scale;
        root.position.y = -center.y * scale;
        root.position.z = -center.z * scale;

        modelGroup.add(root);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Failed to load hero monitor model:", err);
        setLoading(false);
      }
    );

    // Animation Loop
    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);
      if (autoRotateRef.current) {
        modelGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    render();

    // Mouse & Touch 360 Drag Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      setIsAutoRotate(false);
      prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const dx = clientX - prevX;
      const dy = clientY - prevY;

      modelGroup.rotation.y += dx * 0.01;
      modelGroup.rotation.x += dy * 0.01;

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      canvas.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // Action Helpers
  const handleReset = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, -Math.PI / 2, 0);
      setIsAutoRotate(true);
      showToast("Front view restored.");
    }
  };

  const handleCapture = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `viewroom-studio-display-${selectedFrame.id}-${selectedDisplay.id}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    showToast("360° Snapshot downloaded!");
  };

  return (
    <section className="relative w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-10 sm:py-16 select-none overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-black/90 text-amber-400 border border-amber-500/40 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* 3D MONITOR VIEWPORT - ZERO CARD BACKGROUND, ZERO SHADOW (Columns 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              ref={containerRef}
              className="relative w-full h-[450px] sm:h-[540px] lg:h-[600px] overflow-visible bg-transparent cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              {loading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--app-text-secondary)]/30 border-t-[var(--app-text-primary)] animate-spin" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--app-text-secondary)]">
                    Loading 3D Studio Display...
                  </span>
                </div>
              )}

              {/* WebGL Canvas with transparent background and no shadow */}
              <canvas ref={canvasRef} className="relative z-10 w-full h-full block bg-transparent" />

              {/* Viewport Floating Action Bar */}
              <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between pointer-events-none">
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--app-text-secondary)] bg-base-100/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[var(--app-text-secondary)]/20 pointer-events-auto">
                  Drag 360° to rotate
                </span>

                <div className="flex items-center gap-2 pointer-events-auto bg-base-100/80 backdrop-blur-md p-1.5 rounded-full border border-[var(--app-text-secondary)]/20">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isAutoRotate;
                      setIsAutoRotate(next);
                      showToast(next ? "Auto-spin active" : "Auto-spin paused");
                    }}
                    title={isAutoRotate ? "Pause Spin" : "Auto Spin"}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-[var(--app-text-primary)] hover:bg-[var(--app-text-secondary)]/15 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={isAutoRotate ? faPause : faRotate} />
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset Front View"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-[var(--app-text-primary)] hover:bg-[var(--app-text-secondary)]/15 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                  </button>

                  <button
                    type="button"
                    onClick={handleCapture}
                    title="Download 360 Snapshot"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-[var(--app-text-primary)] hover:bg-[var(--app-text-secondary)]/15 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MONITOR CUSTOMIZATION & DETAILS DOCK (Columns 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--app-text-primary)] leading-tight">
                STUDIO DISPLAY 5K 360°
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[var(--app-text-secondary)] mt-2 leading-relaxed">
                Seamless all-aluminum design. Rotate in 360° and customize frame aluminum finishes and display screen themes in real-time.
              </p>
            </div>

            {/* SEPARATE CUSTOMIZATION TABS: FRAME vs DISPLAY SCREEN */}
            <div className="grid grid-cols-2 gap-2 border-b border-[var(--app-text-secondary)]/15 pb-4">
              <Button
                variant={activeTab === "frame" ? "primary" : "secondary"}
                onClick={() => setActiveTab("frame")}
                className={`w-full !py-2.5 !text-xs font-heading font-extrabold uppercase tracking-wider justify-center cursor-pointer ${
                  activeTab === "frame" ? "scale-102" : "opacity-85 hover:opacity-100"
                }`}
              >
                FRAME COLOR
              </Button>
              <Button
                variant={activeTab === "display" ? "primary" : "secondary"}
                onClick={() => setActiveTab("display")}
                className={`w-full !py-2.5 !text-xs font-heading font-extrabold uppercase tracking-wider justify-center cursor-pointer ${
                  activeTab === "display" ? "scale-102" : "opacity-85 hover:opacity-100"
                }`}
              >
                DISPLAY SCREEN
              </Button>
            </div>

            {/* TAB 1: FRAME COLORWAY SWATCHES */}
            {activeTab === "frame" && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                    FRAME & STAND FINISH
                  </span>
                  <span className="text-xs font-black uppercase text-[var(--app-text-primary)]">
                    {selectedFrame.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {FRAME_FINISHES.map((finish) => {
                    const isSelected = selectedFrame.id === finish.id;
                    return (
                      <button
                        type="button"
                        key={finish.id}
                        onClick={() => {
                          setSelectedFrame(finish);
                          showToast(`Applied ${finish.name}`);
                        }}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group bg-base-100/60 ${
                          isSelected
                            ? "border-[var(--app-text-primary)] ring-2 ring-[var(--app-text-primary)]/20 scale-102 shadow-md"
                            : "border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/40 hover:-translate-y-0.5"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full mb-2 border border-white/20 shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center"
                          style={{ background: finish.preview }}
                        >
                          {isSelected && (
                            <FontAwesomeIcon icon={faCheck} className="text-xs text-white drop-shadow-md" />
                          )}
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-tight text-center leading-tight text-[var(--app-text-primary)] line-clamp-1">
                          {finish.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: DISPLAY SCREEN COLOR SWATCHES */}
            {activeTab === "display" && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                    ACTIVE SCREEN THEME
                  </span>
                  <span className="text-xs font-black uppercase text-[var(--app-text-primary)]">
                    {selectedDisplay.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {DISPLAY_THEMES.map((theme) => {
                    const isSelected = selectedDisplay.id === theme.id;
                    return (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={() => {
                          setSelectedDisplay(theme);
                          showToast(`Applied ${theme.name}`);
                        }}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group bg-base-100/60 ${
                          isSelected
                            ? "border-[var(--app-text-primary)] ring-2 ring-[var(--app-text-primary)]/20 scale-102 shadow-md"
                            : "border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/40 hover:-translate-y-0.5"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full mb-2 border border-white/20 shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center"
                          style={{ background: theme.preview }}
                        >
                          {isSelected && (
                            <FontAwesomeIcon icon={faCheck} className="text-xs text-white drop-shadow-md" />
                          )}
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-tight text-center leading-tight text-[var(--app-text-primary)] line-clamp-1">
                          {theme.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA Action Button */}
            <div className="pt-2 border-t border-[var(--app-text-secondary)]/15 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  const gridEl = document.querySelector("section:nth-of-type(2)");
                  if (gridEl) gridEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full !py-3 font-heading font-extrabold uppercase tracking-wider justify-center cursor-pointer text-xs sm:text-sm"
              >
                EXPLORE CATALOG BELOW
              </Button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}