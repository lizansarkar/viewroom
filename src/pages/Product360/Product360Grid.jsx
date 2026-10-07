import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// =========================================================
// 6 DISTINCT HIGH-END 3D PRODUCTS (2 ROWS X 3 COLUMNS)
// =========================================================
const GRID_PRODUCTS = [
  {
    id: "watch",
    name: "Aero Chronograph 360",
  },
  {
    id: "headset",
    name: "Spatial Vision VR Lens",
  },
  {
    id: "drone",
    name: "Apex Aerial 4K Drone",
  },
  {
    id: "chair",
    name: "Eames Silhouette Lounge",
  },
  {
    id: "phone",
    name: "Horizon Ultra Smartphone",
  },
  {
    id: "camera",
    name: "Lumix Retro Rangefinder",
  },
];

// Single reusable shadow texture (Zero memory leak, fast load)
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

// Procedural realistic 3D model builder for all 6 products
function buildProductModel(id) {
  const group = new THREE.Group();

  if (id === "watch") {
    // 1. Luxury Chronograph Timepiece
    const steel = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.96, roughness: 0.15 });
    const dial = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.25 });
    const strap = new THREE.MeshStandardMaterial({ color: 0x542310, roughness: 0.65 });

    const caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, 0.4, 48), steel);
    caseMesh.rotation.x = Math.PI / 2;
    group.add(caseMesh);

    const bezel = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.09, 16, 48), gold);
    bezel.position.z = 0.21;
    group.add(bezel);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.28, 16), gold);
    crown.position.set(1.8, 0, 0);
    crown.rotation.z = Math.PI / 2;
    group.add(crown);

    const dialMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.04, 36), dial);
    dialMesh.rotation.x = Math.PI / 2;
    dialMesh.position.z = 0.2;
    group.add(dialMesh);

    // Sub-dial accents
    [[-0.45, 0.2], [0.45, 0.2], [0, -0.45]].forEach(([x, y]) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 12, 24), gold);
      ring.position.set(x, y, 0.22);
      group.add(ring);
    });

    // Hands
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.03), gold);
    hourHand.position.set(0, 0.25, 0.24);
    group.add(hourHand);

    const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.2, 0.03), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    minHand.position.set(0.2, 0.35, 0.25);
    minHand.rotation.z = -Math.PI / 4;
    group.add(minHand);

    // Stitched leather straps
    const s1 = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.6, 0.15), strap);
    s1.position.set(0, 2.7, -0.04);
    const s2 = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.6, 0.15), strap);
    s2.position.set(0, -2.7, -0.04);
    group.add(s1);
    group.add(s2);

  } else if (id === "headset") {
    // 2. Spatial Vision VR Lens (Replaces AirPods)
    const glassVisor = new THREE.MeshPhysicalMaterial({
      color: 0x020617,
      metalness: 0.92,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const frame = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.88, roughness: 0.2 });
    const fabric = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.85 });

    const visor = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 0.85), glassVisor);
    visor.position.set(0, 0, 0.4);
    group.add(visor);

    const body = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.48, 1.15), frame);
    group.add(body);

    [-1.55, 1.55].forEach((x) => {
      const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.4, 16), frame);
      pod.rotation.z = Math.PI / 2;
      pod.position.set(x, 0, -0.3);
      group.add(pod);
    });

    const strap = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.22, 16, 48), fabric);
    strap.position.set(0, 0, -0.95);
    group.add(strap);

  } else if (id === "drone") {
    // 3. Apex Aerial 4K Drone (Replaces Black T-Shirt)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.6, roughness: 0.3 });
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2 });
    const armMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.8, roughness: 0.3 });

    // Fuselage Central Body
    const core = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2.2), bodyMat);
    group.add(core);

    // Front Optical Sensor Eye
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transmission: 0.8, roughness: 0.1 }));
    eye.position.set(0, -0.1, 1.15);
    group.add(eye);

    // 4 Diagonal Rotor Arms & Propeller Discs
    [[-1.4, 1.3], [1.4, 1.3], [-1.4, -1.3], [1.4, -1.3]].forEach(([x, z]) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12), armMat);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = Math.atan2(z, x);
      arm.position.set(x / 2, 0.1, z / 2);
      group.add(arm);

      // Motor Cap
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.28, 16), armMat);
      motor.position.set(x, 0.22, z);
      group.add(motor);

      // Spin Propeller Blades
      const prop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.02, 0.15), rotorMat);
      prop.position.set(x, 0.38, z);
      prop.rotation.y = Math.PI / 4;
      group.add(prop);
    });

  } else if (id === "chair") {
    // 4. Eames Silhouette Lounge Chair
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

  } else if (id === "phone") {
    // 5. Horizon Ultra Smartphone
    const aluminum = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.95, roughness: 0.2 });
    const glassFront = new THREE.MeshPhysicalMaterial({ color: 0x020617, metalness: 0.9, roughness: 0.05, clearcoat: 1.0 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.95, roughness: 0.1 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.85, 3.7, 0.18), aluminum);
    group.add(body);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 3.55), glassFront);
    screen.position.z = 0.1;
    group.add(screen);

    const island = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.25, 0.12), aluminum);
    island.position.set(-0.45, 1.08, -0.14);
    group.add(island);

    [-0.35, 0, 0.35].forEach((yOff) => {
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 20), lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(-0.45, 1.08 + yOff, -0.22);
      group.add(lens);
    });

  } else if (id === "camera") {
    // 6. Lumix Retro Rangefinder Camera
    const silver = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.18 });
    const leatherGrip = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.75 });
    const lensGlass = new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transmission: 0.8, roughness: 0.05 });

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

// Single Clean 360 Product Card Component (Preserves original styling & design)
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

    // Direct & Ambient Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(4, 6, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x93c5fd, 1.4);
    fill.position.set(-5, -2, 4);
    scene.add(fill);

    // Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: getSharedShadowTexture(),
      transparent: true,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.55;
    scene.add(shadow);

    // 3D Model Group
    const modelGroup = buildProductModel(product.id);
    scene.add(modelGroup);

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
        // Click without dragging toggles spin state
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
    <div className="group relative flex flex-col bg-base-100/80 backdrop-blur-xl border border-[var(--app-text-secondary)]/15 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 select-none">
      
      {/* 3D WebGL Viewport Container (Unobstructed 3D Product Display) */}
      <div
        ref={containerRef}
        className="relative w-full h-[250px] sm:h-[280px] bg-transparent cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
      >
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
              INTERACTIVE CATALOG
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