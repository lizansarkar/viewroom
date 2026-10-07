import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// =========================================================
// 4 HIGH-END ULTRA-CLEAN 360 PRODUCTS (Fast & Lightweight)
// =========================================================
const PRODUCTS = [
  {
    id: "watch",
    name: "Aero Chronograph 360",
    category: "Luxury Timepiece",
  },
  {
    id: "headset",
    name: "Spatial Vision VR Lens",
    category: "Spatial Hardware",
  },
  {
    id: "chair",
    name: "Eames Silhouette Lounge",
    category: "Modern Furniture",
  },
  {
    id: "camera",
    name: "Lumix Retro Rangefinder",
    category: "Optical Camera",
  },
];

// Single reusable shadow texture (Creates zero memory overhead)
let cachedShadowTexture = null;
function getSharedShadowTexture() {
  if (cachedShadowTexture) return cachedShadowTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.4)");
  grad.addColorStop(0.4, "rgba(0, 0, 0, 0.15)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  cachedShadowTexture = new THREE.CanvasTexture(canvas);
  return cachedShadowTexture;
}

// Lightweight realistic 3D models with physical materials
function buildProductModel(id) {
  const group = new THREE.Group();

  if (id === "watch") {
    // Luxury Chronograph Watch
    const steel = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    const dialMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.25 });
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x542310, roughness: 0.7 });

    const caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.38, 48), steel);
    caseMesh.rotation.x = Math.PI / 2;
    group.add(caseMesh);

    const bezel = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.09, 16, 48), gold);
    bezel.position.z = 0.2;
    group.add(bezel);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.28, 16), gold);
    crown.position.set(1.75, 0, 0);
    crown.rotation.z = Math.PI / 2;
    group.add(crown);

    const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.48, 0.04, 36), dialMat);
    dial.rotation.x = Math.PI / 2;
    dial.position.z = 0.19;
    group.add(dial);

    // Hands
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.03), gold);
    hourHand.position.set(0, 0.25, 0.23);
    group.add(hourHand);

    const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.2, 0.03), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    minHand.position.set(0.2, 0.35, 0.24);
    minHand.rotation.z = -Math.PI / 4;
    group.add(minHand);

    // Straps
    const s1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.5, 0.14), strapMat);
    s1.position.set(0, 2.6, -0.04);
    const s2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.5, 0.14), strapMat);
    s2.position.set(0, -2.6, -0.04);
    group.add(s1);
    group.add(s2);

  } else if (id === "headset") {
    // Spatial VR Headset (Replaced T-shirt & AirPods)
    const glassVisor = new THREE.MeshPhysicalMaterial({
      color: 0x020617,
      metalness: 0.9,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const frame = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const fabricStrap = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.85 });

    // Curved Front Glass Visor
    const visor = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 0.8), glassVisor);
    visor.position.set(0, 0, 0.4);
    group.add(visor);

    // Aluminum Chassis Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.48, 1.1), frame);
    group.add(body);

    // Audio Side Pods
    [-1.55, 1.55].forEach((x) => {
      const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.4, 16), frame);
      pod.rotation.z = Math.PI / 2;
      pod.position.set(x, 0, -0.3);
      group.add(pod);
    });

    // Flexible Knitted Loop Headband
    const strap = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.22, 16, 48), fabricStrap);
    strap.position.set(0, 0, -0.9);
    group.add(strap);

  } else if (id === "chair") {
    // Eames Silhouette Lounge Chair
    const walnut = new THREE.MeshStandardMaterial({ color: 0x542310, roughness: 0.35, metalness: 0.2 });
    const leather = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.65 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.3, 2.0), leather);
    group.add(seat);

    const seatShell = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.14, 2.1), walnut);
    seatShell.position.y = -0.2;
    group.add(seatShell);

    const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.5, 0.28), leather);
    back.position.set(0, 0.9, -0.85);
    back.rotation.x = -0.15;
    group.add(back);

    const backShell = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 0.12), walnut);
    backShell.position.set(0, 0.9, -1.0);
    backShell.rotation.x = -0.15;
    group.add(backShell);

    const baseCol = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16), chrome);
    baseCol.position.y = -0.6;
    group.add(baseCol);

    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 1.2), chrome);
      leg.position.set(Math.sin(ang) * 0.6, -0.9, Math.cos(ang) * 0.6);
      leg.rotation.y = ang;
      group.add(leg);
    }

  } else if (id === "camera") {
    // Lumix Retro Rangefinder Camera
    const silver = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.18 });
    const leatherGrip = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.75 });
    const lensGlass = new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transmission: 0.75, roughness: 0.05 });

    const lower = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.3, 1.1), leatherGrip);
    lower.position.y = -0.25;
    group.add(lower);

    const upper = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.65, 1.1), silver);
    upper.position.y = 0.65;
    group.add(upper);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.7, 32), silver);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0.3, 0.05, 0.85);
    group.add(barrel);

    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 16), lensGlass);
    lens.position.set(0.3, 0.05, 1.15);
    lens.scale.z = 0.25;
    group.add(lens);

    [0.7, 1.1].forEach((x) => {
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 16), silver);
      dial.position.set(x, 1.05, 0);
      group.add(dial);
    });
  }

  return group;
}

// Single Lightweight 360 Product Card
function ProductCard({ product }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
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
    renderer.toneMappingExposure = 1.15;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(4, 6, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x93c5fd, 1.4);
    fill.position.set(-5, -2, 4);
    scene.add(fill);

    // Soft Shadow
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: getSharedShadowTexture(),
      transparent: true,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.55;
    scene.add(shadow);

    // Product Model
    const modelGroup = buildProductModel(product.id);
    scene.add(modelGroup);

    // Animation Loop
    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);
      if (spinningRef.current) {
        modelGroup.rotation.y += 0.007;
      }
      renderer.render(scene, camera);
    };
    render();

    // Interaction handlers (Drag & Click-to-Pause)
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
        // Simple click toggles pause / play
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
  }, [product.id]);

  return (
    <div className="group flex flex-col items-center bg-base-100 border border-base-content/10 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-base-content/25 select-none">
      
      {/* 3D WebGL Viewport */}
      <div
        ref={containerRef}
        className="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Clean Title Only */}
      <div className="w-full text-center pt-3 border-t border-base-content/10">
        <h3 className="font-heading text-sm sm:text-base font-extrabold uppercase tracking-tight text-base-content">
          {product.name}
        </h3>
        <p className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider mt-0.5">
          {product.category}
        </p>
      </div>

    </div>
  );
}

// Main Grid Section
export default function Product360Grid() {
  return (
    <section className="w-full bg-base-200/50 py-12 sm:py-16 px-4 sm:px-8 select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Simple Section Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold tracking-[0.2em] text-base-content/50 uppercase block">
            INTERACTIVE 360° SHOWCASE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-base-content">
            3D VIRTUAL PRODUCTS
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 max-w-md mx-auto">
            Drag to rotate in full 360° or click to pause auto-spin.
          </p>
        </div>

        {/* 4 Clean Responsive Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}