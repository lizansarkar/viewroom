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
// STUDIO DISPLAY FINISH & COLORWAY PRESETS
// =========================================================
const MONITOR_FINISHES = [
  {
    id: "silver",
    name: "Silver Aluminium",
    tag: "SIGNATURE",
    color: 0xffffff,
    metalness: 0.65,
    roughness: 0.35,
    preview: "linear-gradient(135deg, #f8fafc, #94a3b8)",
    desc: "Pure anodized silver aluminum chassis with anti-reflective nano-texture front glass.",
  },
  {
    id: "spacegray",
    name: "Space Gray",
    tag: "PRO",
    color: 0x8a929e,
    metalness: 0.8,
    roughness: 0.3,
    preview: "linear-gradient(135deg, #64748b, #334155)",
    desc: "Deep space gray matte anodized finish engineered for professional creator studios.",
  },
  {
    id: "starlight",
    name: "Starlight Gold",
    tag: "LUXURY",
    color: 0xfef08a,
    metalness: 0.75,
    roughness: 0.28,
    preview: "linear-gradient(135deg, #fef08a, #d97706)",
    desc: "Subtle warm champagne metallic tone with luminous specular bevel reflections.",
  },
  {
    id: "midnight",
    name: "Midnight Blue",
    tag: "CREATIVE",
    color: 0x93c5fd,
    metalness: 0.75,
    roughness: 0.3,
    preview: "linear-gradient(135deg, #93c5fd, #1e3a8a)",
    desc: "Deep atmospheric oceanic indigo anodized casing for modern architectural desks.",
  },
  {
    id: "rose",
    name: "Blush Rose",
    tag: "STUDIO",
    color: 0xfecdd3,
    metalness: 0.7,
    roughness: 0.35,
    preview: "linear-gradient(135deg, #fecdd3, #e11d48)",
    desc: "Contemporary rose gold brushed finish with precision laser-cut stand geometry.",
  },
  {
    id: "sage",
    name: "Forest Sage",
    tag: "EDITION",
    color: 0xa7f3d0,
    metalness: 0.65,
    roughness: 0.4,
    preview: "linear-gradient(135deg, #a7f3d0, #047857)",
    desc: "Nordic serene sage metallic hue designed for clean minimalist setups.",
  },
];

// Single Reusable Ground Shadow
let cachedHeroShadowTexture = null;
function getHeroShadowTexture() {
  if (cachedHeroShadowTexture) return cachedHeroShadowTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.5)");
  grad.addColorStop(0.35, "rgba(0, 0, 0, 0.22)");
  grad.addColorStop(0.7, "rgba(0, 0, 0, 0.05)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  cachedHeroShadowTexture = new THREE.CanvasTexture(canvas);
  return cachedHeroShadowTexture;
}

export default function Product360Hero() {
  const [selectedFinish, setSelectedFinish] = useState(MONITOR_FINISHES[0]);
  const [loading, setLoading] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const autoRotateRef = useRef(isAutoRotate);
  const modelGroupRef = useRef(null);
  const monitorMaterialRef = useRef(null);

  useEffect(() => {
    autoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update material dynamically when finish preset changes
  useEffect(() => {
    if (monitorMaterialRef.current) {
      monitorMaterialRef.current.color.setHex(selectedFinish.color);
      monitorMaterialRef.current.metalness = selectedFinish.metalness;
      monitorMaterialRef.current.roughness = selectedFinish.roughness;
      monitorMaterialRef.current.needsUpdate = true;
    }
  }, [selectedFinish]);

  // Three.js Scene Setup & Real .glb Monitor Loading
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
    renderer.toneMappingExposure = 1.25;

    // High Dynamic Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 2.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.6);
    fillLight.position.set(-6, -2, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(4.8, 4.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: getHeroShadowTexture(),
      transparent: true,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.55;
    scene.add(shadow);

    // Model Container
    const modelGroup = new THREE.Group();
    // Default angle facing the front screen towards the user (+Z)
    modelGroup.rotation.y = -Math.PI / 2;
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Load Real .glb Monitor Model
    let isDisposed = false;
    const loader = new GLTFLoader();
    loader.load(
      "/models/monitor.glb",
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;

        root.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.metalness = selectedFinish.metalness;
            child.material.roughness = selectedFinish.roughness;
            child.material.color.setHex(selectedFinish.color);
            child.material.needsUpdate = true;
            monitorMaterialRef.current = child.material;
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

  // Actions
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
    link.download = `viewroom-${selectedFinish.id}-studio-display-360.png`;
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
          
          {/* 3D MONITOR VIEWPORT (Columns 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              ref={containerRef}
              className="relative w-full h-[450px] sm:h-[540px] lg:h-[600px] rounded-3xl overflow-hidden bg-base-100/40 backdrop-blur-md border border-[var(--app-text-secondary)]/15 shadow-xl group cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              {loading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-base-100/60 backdrop-blur-sm gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--app-text-secondary)]/30 border-t-[var(--app-text-primary)] animate-spin" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--app-text-secondary)]">
                    Loading 3D Studio Display...
                  </span>
                </div>
              )}

              <canvas ref={canvasRef} className="relative z-10 w-full h-full block bg-transparent" />

              {/* Viewport Floating Action Bar */}
              <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between pointer-events-none">
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--app-text-secondary)] bg-base-100/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[var(--app-text-secondary)]/20 shadow-sm pointer-events-auto">
                  Drag 360° to rotate
                </span>

                <div className="flex items-center gap-2 pointer-events-auto bg-base-100/80 backdrop-blur-md p-1.5 rounded-full border border-[var(--app-text-secondary)]/20 shadow-sm">
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
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black tracking-[0.2em] text-[var(--app-text-secondary)] uppercase">
                  PRO STUDIO HARDWARE
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  {selectedFinish.tag}
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--app-text-primary)] leading-tight">
                STUDIO DISPLAY 5K 360°
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[var(--app-text-secondary)] mt-3 leading-relaxed">
                {selectedFinish.desc}
              </p>
            </div>

            {/* Quick Specs Pills */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-base-100/60 border border-[var(--app-text-secondary)]/15 flex flex-col">
                <span className="text-[10px] font-bold text-[var(--app-text-secondary)] uppercase">Display Panel</span>
                <span className="text-xs font-extrabold text-[var(--app-text-primary)]">27" 5K Retina (5120×2880)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-base-100/60 border border-[var(--app-text-secondary)]/15 flex flex-col">
                <span className="text-[10px] font-bold text-[var(--app-text-secondary)] uppercase">Color Profile</span>
                <span className="text-xs font-extrabold text-[var(--app-text-primary)]">600 Nits • P3 Wide Color</span>
              </div>
            </div>

            {/* Finish & Material Selection Swatches */}
            <div className="flex flex-col gap-3 pt-2 border-t border-[var(--app-text-secondary)]/15">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                  SELECT ALUMINIUM FINISH
                </span>
                <span className="text-xs font-black uppercase text-[var(--app-text-primary)]">
                  {selectedFinish.name}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {MONITOR_FINISHES.map((finish) => {
                  const isSelected = selectedFinish.id === finish.id;
                  return (
                    <button
                      type="button"
                      key={finish.id}
                      onClick={() => {
                        setSelectedFinish(finish);
                        showToast(`Applied ${finish.name}`);
                      }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group bg-base-100/60 ${
                        isSelected
                          ? "border-[var(--app-text-primary)] ring-2 ring-[var(--app-text-primary)]/20 scale-102 shadow-lg"
                          : "border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/40 hover:-translate-y-0.5"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full mb-2 border border-white/20 shadow-md transition-transform group-hover:scale-105 flex items-center justify-center"
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