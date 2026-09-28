import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faRotate,
  faCamera,
  faDownload,
  faWandMagicSparkles,
  faXmark,
  faCube,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";

// =========================================================
// 6 DISTINCT REALISTIC EVERYDAY PRODUCTS DATASET
// =========================================================
const GRID_PRODUCTS = [
  {
    id: "watch",
    name: "Aero Chronograph 360",
    category: "Luxury Timepiece",
    price: "$4,850",
    glbUrl: "/models/watch.glb",
    color: "#f59e0b",
    tag: "360° SPIN",
  },
  {
    id: "tshirt",
    name: "Minimalist Black T-Shirt",
    category: "Streetwear Apparel",
    price: "$85",
    glbUrl: "/models/tshirt.glb",
    color: "#18181b",
    tag: "COTTON 3D",
  },
  {
    id: "airpods",
    name: "AirPods Pro Spatial",
    category: "Wireless Audio",
    price: "$249",
    glbUrl: "/models/airpods.glb",
    color: "#e2e8f0",
    tag: "NOISE CANCEL",
  },
  {
    id: "chair",
    name: "Eames Silhouette Lounge",
    category: "Designer Furniture",
    price: "$1,250",
    glbUrl: "/models/chair.glb",
    color: "#d97706",
    tag: "ARCHITECTURAL",
  },
  {
    id: "phone",
    name: "Horizon Ultra Smartphone",
    category: "Mobile Tech",
    price: "$999",
    glbUrl: "/models/phone.glb",
    color: "#6366f1",
    tag: "FLAGSHIP 5G",
  },
  {
    id: "camera",
    name: "Lumix Retro Rangefinder",
    category: "Photography",
    price: "$1,450",
    glbUrl: "/models/camera.glb",
    color: "#ec4899",
    tag: "OPTICAL ZOOM",
  },
];

// Helper to construct realistic fallback procedural 3D model for each product type
function createFallbackProductGroup(productId) {
  const group = new THREE.Group();
  if (productId === "watch") {
    // Watch Case
    const caseGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.38, 48);
    const caseMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.18 });
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    caseMesh.rotation.x = Math.PI / 2;
    group.add(caseMesh);

    // Bezel Ring
    const bezelGeo = new THREE.TorusGeometry(1.62, 0.08, 16, 64);
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.z = 0.2;
    group.add(bezelMesh);

    // Dial Face
    const dialGeo = new THREE.CylinderGeometry(1.52, 1.52, 0.04, 48);
    const dialMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, metalness: 0.5, roughness: 0.3 });
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.rotation.x = Math.PI / 2;
    dialMesh.position.z = 0.19;
    group.add(dialMesh);

    // Hour Markers
    const markerGeo = new THREE.BoxGeometry(0.06, 0.24, 0.04);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const marker = new THREE.Mesh(markerGeo, goldMat);
      marker.position.set(Math.sin(angle) * 1.3, Math.cos(angle) * 1.3, 0.22);
      marker.rotation.z = -angle;
      group.add(marker);
    }

    // Hands
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.03), goldMat);
    hourHand.position.set(0, 0.25, 0.25);
    group.add(hourHand);

    const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.25, 0.03), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    minHand.position.set(0.2, 0.35, 0.27);
    minHand.rotation.z = -Math.PI / 4;
    group.add(minHand);

    // Leather Straps
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 });
    const topStrap = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.6, 0.12), strapMat);
    topStrap.position.set(0, 2.7, -0.02);
    const botStrap = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.6, 0.12), strapMat);
    botStrap.position.set(0, -2.7, -0.02);
    group.add(topStrap);
    group.add(botStrap);

  } else if (productId === "tshirt") {
    // Black T-Shirt Torso & Sleeves
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x18181c, roughness: 0.85, metalness: 0.1 });
    
    // Torso body
    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.8, 0.5), shirtMat);
    torso.position.y = -0.2;
    group.add(torso);

    // Left & Right Sleeves
    const sleeveLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 1.1, 24), shirtMat);
    sleeveLeft.rotation.z = Math.PI / 3;
    sleeveLeft.position.set(-1.45, 0.85, 0);
    group.add(sleeveLeft);

    const sleeveRight = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 1.1, 24), shirtMat);
    sleeveRight.rotation.z = -Math.PI / 3;
    sleeveRight.position.set(1.45, 0.85, 0);
    group.add(sleeveRight);

    // Crew Neck Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.08, 16, 32), new THREE.MeshStandardMaterial({ color: 0x27272a }));
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 1.18, 0);
    group.add(collar);

  } else if (productId === "airpods") {
    // AirPods Charging Case & Earbuds
    const caseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.2, roughness: 0.15 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });

    // Charging Case Body
    const caseBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 0.9), caseMat);
    caseBody.position.set(0, -0.4, 0);
    group.add(caseBody);

    // Case Lid Seam
    const seam = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.02, 16, 48), chromeMat);
    seam.rotation.x = Math.PI / 2;
    seam.position.set(0, 0.1, 0);
    group.add(seam);

    // Left & Right Earbuds
    [-0.55, 0.55].forEach((x) => {
      const earbudHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), caseMat);
      earbudHead.position.set(x, 1.15, 0.1);
      group.add(earbudHead);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16), caseMat);
      stem.position.set(x, 0.75, 0.1);
      group.add(stem);

      const silverTip = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.1, 16), chromeMat);
      silverTip.position.set(x, 0.35, 0.1);
      group.add(silverTip);
    });

  } else if (productId === "chair") {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.35 });
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.75 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.28, 2.1), cushionMat);
    seat.position.y = 0;
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.7, 0.28), cushionMat);
    back.position.set(0, 0.98, -0.9);
    group.add(back);

    [[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.04, 1.5, 16), woodMat);
      leg.position.set(x, -0.75, z);
      group.add(leg);
    });

  } else if (productId === "phone") {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.2, roughness: 0.1 });
    const cameraMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, 3.0, 0.16), bodyMat);
    group.add(body);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 2.9), screenMat);
    screen.position.z = 0.085;
    group.add(screen);

    const camBump = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.06), cameraMat);
    camBump.position.set(-0.32, 1.0, -0.09);
    group.add(camBump);

  } else {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.88, roughness: 0.2 });
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.92, roughness: 0.15 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.55, 0.95), bodyMat);
    group.add(body);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.95, 0.97), gripMat);
    grip.position.y = -0.24;
    group.add(grip);

    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 1.15, 32), lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, 0.7);
    group.add(lens);
  }
  return group;
}

// Single 3D Product Canvas Card Component
function Product360Card({ product, onToast, onOpenModal }) {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(true);
  const isSpinningRef = useRef(isSpinning);

  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    productGroup: null,
  });

  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    if (!viewportRef.current || !canvasRef.current) return;

    const width = viewportRef.current.clientWidth;
    const height = viewportRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lighting Environment
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8e7, 2.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    // 5. Product 3D Root Group
    const productGroup = new THREE.Group();
    scene.add(productGroup);

    // Load GLB model file with fallback
    const loader = new GLTFLoader();
    loader.load(
      product.glbUrl,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.2 / maxDim;
        model.scale.set(scale, scale, scale);
        box.setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        productGroup.add(model);
      },
      undefined,
      () => {
        const fallback = createFallbackProductGroup(product.id);
        productGroup.add(fallback);
      }
    );

    threeRef.current = { scene, camera, renderer, productGroup };

    // Render Animation Loop (Slow, smooth spin up)
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isSpinningRef.current && productGroup) {
        productGroup.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!viewportRef.current) return;
      const w = viewportRef.current.clientWidth;
      const h = viewportRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [product]);

  // Pointer drag rotation handlers
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsSpinning(false);
    prevPointerRef.current = {
      x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0].clientY) || 0,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !threeRef.current.productGroup) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const deltaX = clientX - prevPointerRef.current.x;
    const deltaY = clientY - prevPointerRef.current.y;

    threeRef.current.productGroup.rotation.y += deltaX * 0.01;
    threeRef.current.productGroup.rotation.x += deltaY * 0.01;

    prevPointerRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Download snapshot
  const downloadSnapshot = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `viewroom-${product.id}-3d.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    onToast(`Snapshot PNG downloaded for ${product.name}`);
  };

  return (
    <div className="group relative flex flex-col bg-base-100/80 backdrop-blur-xl border border-[var(--app-text-secondary)]/15 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 select-none">
      
      {/* Top Header Bar inside Card */}
      <div className="flex items-center justify-between px-5 pt-5 pb-1 z-10">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--app-text-primary)]/10 text-[var(--app-text-primary)] border border-[var(--app-text-primary)]/15">
          {product.tag}
        </span>
        <span className="text-xs font-black uppercase tracking-wider text-[var(--app-text-primary)]">
          {product.price}
        </span>
      </div>

      {/* 3D WebGL Viewport Container (Unobstructed 3D GLB Model Display) */}
      <div
        ref={viewportRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className="relative w-full h-[240px] sm:h-[270px] bg-transparent cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full block bg-transparent relative z-10" />
      </div>

      {/* Card Details & Hero-Style Action Toolbar Footer (Positioned Below GLB Model) */}
      <div className="p-5 flex flex-col gap-4 border-t border-[var(--app-text-secondary)]/15 bg-base-200/40">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--app-text-secondary)]">
            {product.category}
          </span>
          <h3 className="text-base font-extrabold uppercase tracking-tight text-[var(--app-text-primary)] leading-tight mt-0.5">
            {product.name}
          </h3>
        </div>

        {/* Compact Hero-Style Toolbar: Left Inspect 3D GLB Button + Right Grouped Control Icons */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--app-text-secondary)]/15">
          
          {/* Left: Inspect 3D GLB Button */}
          <Button
            variant="primary"
            className="!px-3.5 !py-2 !text-[10px] font-extrabold uppercase tracking-wider !rounded-xl cursor-pointer flex items-center gap-1.5"
            onClick={() => onOpenModal(product)}
          >
            <FontAwesomeIcon icon={faCube} className="text-cyan-400 text-xs" />
            Inspect 3D GLB
          </Button>

          {/* Right: Grouped Action Icons (Pause/Spin, AR Camera, Download Snapshot) */}
          <div className="flex items-center gap-2">
            {/* Pause / Play Auto-Spin Toggle Icon */}
            <button
              type="button"
              onClick={() => {
                const next = !isSpinning;
                setIsSpinning(next);
                onToast(next ? `Slow spin active: ${product.name}` : `Spin paused: ${product.name}`);
              }}
              title={isSpinning ? "Pause Auto-Spin" : "Play Auto-Spin"}
              className="w-8 h-8 rounded-full bg-[var(--app-text-primary)]/10 hover:bg-[var(--app-text-primary)]/20 text-[var(--app-text-primary)] flex items-center justify-center text-xs transition-colors cursor-pointer border border-[var(--app-text-primary)]/15"
            >
              <FontAwesomeIcon icon={isSpinning ? faPause : faRotate} />
            </button>

            {/* AR Mode Toggle Icon */}
            <button
              type="button"
              onClick={() => onOpenModal(product)}
              title="AR Camera Mode"
              className="w-8 h-8 rounded-full bg-[var(--app-text-primary)]/10 hover:bg-[var(--app-text-primary)]/20 text-[var(--app-text-primary)] hover:text-cyan-400 flex items-center justify-center text-xs transition-colors cursor-pointer border border-[var(--app-text-primary)]/15"
            >
              <FontAwesomeIcon icon={faCamera} />
            </button>

            {/* Snapshot Download PNG Icon */}
            <button
              type="button"
              onClick={downloadSnapshot}
              title="Download PNG Snapshot"
              className="w-8 h-8 rounded-full bg-[var(--app-text-primary)]/10 hover:bg-[var(--app-text-primary)]/20 text-[var(--app-text-primary)] hover:text-emerald-400 flex items-center justify-center text-xs transition-colors cursor-pointer border border-[var(--app-text-primary)]/15"
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

// Main 2x3 Grid Section Component
function Product360Grid() {
  const [toastMsg, setToastMsg] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-14 sm:py-20 px-4 sm:px-8 transition-colors duration-250 select-none">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-black/90 text-amber-400 border border-amber-500/40 px-5 py-3 rounded-full text-xs font-bold tracking-wider shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2 text-amber-400" />
          {toastMsg}
        </div>
      )}

      {/* AR / Inspect Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-base-100 border border-[var(--app-text-secondary)]/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--app-text-secondary)] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCube} className="text-cyan-400" />
                  3D GLB INSPECTOR & AR MODE
                </span>
                <h3 className="text-xl font-extrabold uppercase text-[var(--app-text-primary)]">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-lg text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] cursor-pointer p-2"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="w-full h-72 bg-gradient-to-b from-slate-900 to-black rounded-2xl flex items-center justify-center relative overflow-hidden border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <FontAwesomeIcon icon={faCamera} className="text-cyan-400" />
                3D GLB MODEL ACTIVE ({selectedProduct.glbUrl})
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-[var(--app-text-secondary)]">
                PRICE: <strong className="text-[var(--app-text-primary)]">{selectedProduct.price}</strong>
              </span>
              <Button
                variant="primary"
                onClick={() => {
                  showToast(`AR Mode launched for ${selectedProduct.name}`);
                  setSelectedProduct(null);
                }}
              >
                Launch AR View
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Section Header */}
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
            Spin, inspect, and experience 6 realistic everyday products in interactive 3D GLB format across all devices.
          </p>
        </div>

        {/* 2 ROWS X 3 COLUMNS RESPONSIVE GRID (6 PRODUCTS TOTAL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {GRID_PRODUCTS.map((prod) => (
            <Product360Card
              key={prod.id}
              product={prod}
              onToast={showToast}
              onOpenModal={setSelectedProduct}
            />
          ))}
        </div>

      </div>

    </section>
  );
}

export default Product360Grid;