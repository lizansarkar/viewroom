import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// =========================================================
// 6 REALISTIC .GLB 3D PRODUCTS (2 ROWS X 3 COLUMNS)
// =========================================================
const GRID_PRODUCTS = [
  {
    id: "watch",
    name: "Classic Smart Watch",
    modelUrl: "/models/watch.glb",
  },
  {
    id: "chair",
    name: "Executive Office Chair",
    modelUrl: "/models/chair.glb",
  },
  {
    id: "bottle",
    name: "Hydro Sport Bottle",
    modelUrl: "/models/bottle.glb",
  },
  {
    id: "jumper",
    name: "Urban Knit Jumper",
    modelUrl: "/models/jumper.glb",
  },
  {
    id: "apartment",
    name: "Modern Apartment Suite",
    modelUrl: "/models/apartment.glb",
  },
  {
    id: "room",
    name: "Isometric 3D Studio",
    modelUrl: "/models/room.glb",
  },
];

// Reusable single shadow texture for maximum performance
let cachedShadowTexture = null;
function getSharedShadowTexture() {
  if (cachedShadowTexture) return cachedShadowTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.45)");
  grad.addColorStop(0.35, "rgba(0, 0, 0, 0.2)");
  grad.addColorStop(0.7, "rgba(0, 0, 0, 0.05)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  cachedShadowTexture = new THREE.CanvasTexture(canvas);
  return cachedShadowTexture;
}

// Shared loader instance
const gltfLoader = new GLTFLoader();

// Single Clean 360 Product Card Component (Real .glb Model)
function ProductCard({ product }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(true);
  const spinningRef = useRef(true);

  useEffect(() => {
    spinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.3, 6.2);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "default",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // High quality studio lighting
    scene.add(new THREE.AmbientLight(0xffffff, 2.0));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.4);
    fillLight.position.set(-5, 2, -4);
    scene.add(fillLight);

    const bottomBounce = new THREE.DirectionalLight(0xffffff, 0.8);
    bottomBounce.position.set(0, -5, 0);
    scene.add(bottomBounce);

    // Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: getSharedShadowTexture(),
      transparent: true,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.45;
    scene.add(shadow);

    // Model Container Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Load Real .glb Model
    let isDisposed = false;
    gltfLoader.load(
      product.modelUrl,
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;

        // Auto-center and normalize size across any model dimensions
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 2.6;
        const scale = maxDim > 0 ? targetSize / maxDim : 1;

        root.scale.setScalar(scale);
        root.position.x = -center.x * scale;
        root.position.y = -center.y * scale;
        root.position.z = -center.z * scale;

        modelGroup.add(root);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error(`Failed to load 3D model ${product.modelUrl}:`, error);
        setLoading(false);
      }
    );

    // Auto-Spin Animation Loop
    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);
      if (spinningRef.current) {
        modelGroup.rotation.y += 0.007;
      }
      renderer.render(scene, camera);
    };
    render();

    // Interaction Handlers (Drag to Rotate & Click anywhere to Pause)
    let isDragging = false;
    let hasMoved = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      hasMoved = false;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const dx = clientX - prevX;
      const dy = clientY - prevY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
      }

      modelGroup.rotation.y += dx * 0.012;
      modelGroup.rotation.x += dy * 0.012;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      if (isDragging && !hasMoved) {
        setIsSpinning((prev) => !prev);
      }
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
  }, [product.modelUrl]);

  return (
    <div className="group relative flex flex-col bg-base-100/80 backdrop-blur-xl border border-[var(--app-text-secondary)]/15 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 select-none">
      
      {/* 3D WebGL Viewport Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[250px] sm:h-[280px] bg-transparent cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
      >
        {/* Subtle loading spinner while .glb loads */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-base-100/30 backdrop-blur-[2px] pointer-events-none transition-opacity">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--app-text-secondary)]/30 border-t-[var(--app-text-primary)] animate-spin" />
          </div>
        )}

        <canvas ref={canvasRef} className="w-full h-full block bg-transparent relative z-10" />
      </div>

      {/* Card Details Footer: Only the Product Name Title */}
      <div className="p-5 flex flex-col items-center justify-center border-t border-[var(--app-text-secondary)]/15 bg-base-200/40">
        <h3 className="text-base font-extrabold uppercase tracking-tight text-[var(--app-text-primary)] text-center leading-tight">
          {product.name}
        </h3>
      </div>

    </div>
  );
}

// Main 2 Rows x 3 Columns (6 Products) Grid Component
export default function Product360Grid() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-14 sm:py-20 px-4 sm:px-8 transition-colors duration-250 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Section Header (Original Style & Typography) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[var(--app-text-secondary)]/15 pb-6">
          <div>
            <span className="font-heading text-xs font-extrabold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase block mb-2">
              INTERACTIVE 360 CATALOG
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-[var(--app-text-primary)]">
              EXPLORE 3D PRODUCTS
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[var(--app-text-secondary)] max-w-md">
            Spin, inspect, and experience 6 realistic everyday products in interactive 3D format across all devices.
          </p>
        </div>

        {/* 2 ROWS X 3 COLUMNS RESPONSIVE GRID (3 + 3 = 6 PRODUCTS TOTAL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {GRID_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}