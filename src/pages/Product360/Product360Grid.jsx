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

// Helper to generate procedural studio environment map for metallic & glass reflections
function getStudioEnvMap(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const sceneEnv = new THREE.Scene();
  sceneEnv.background = new THREE.Color(0x0b0f19);

  // Softbox 1: Overhead main studio key
  const light1 = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  light1.position.set(0, 10, 3);
  light1.rotation.x = Math.PI / 2;
  sceneEnv.add(light1);

  // Softbox 2: Left cool blue fill strip
  const light2 = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 14),
    new THREE.MeshBasicMaterial({ color: 0x93c5fd })
  );
  light2.position.set(-9, 3, 3);
  light2.rotation.y = Math.PI / 2.5;
  sceneEnv.add(light2);

  // Softbox 3: Right warm rim strip
  const light3 = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 12),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  light3.position.set(9, 2, -3);
  light3.rotation.y = -Math.PI / 2.2;
  sceneEnv.add(light3);

  const envMap = pmremGenerator.fromScene(sceneEnv).texture;
  pmremGenerator.dispose();
  return envMap;
}

// Helper to create soft ground contact shadow
function createContactShadow() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.45)");
  gradient.addColorStop(0.35, "rgba(0, 0, 0, 0.22)");
  gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.05)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -1.6;
  return shadowMesh;
}

// Helper to construct realistic procedural 3D model for each product type with high physical realism
function createFallbackProductGroup(productId, envMap) {
  const group = new THREE.Group();

  if (productId === "watch") {
    // 1. Polished Stainless Steel & 18K Gold Case
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.12,
      envMap,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.96,
      roughness: 0.14,
      envMap,
    });
    const dialMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.45,
      roughness: 0.25,
      envMap,
    });
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x542310,
      roughness: 0.65,
      metalness: 0.1,
    });

    // Main Cylindrical Case
    const caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.42, 64), caseMat);
    caseMesh.rotation.x = Math.PI / 2;
    group.add(caseMesh);

    // Bezel Ring with Chamfer
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(1.68, 0.1, 16, 64), goldMat);
    bezel.position.z = 0.22;
    group.add(bezel);

    // Knurled Crown at 3 o'clock
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 24), goldMat);
    crown.position.set(1.85, 0, 0);
    crown.rotation.z = Math.PI / 2;
    group.add(crown);

    // Chrono Pushers at 2 & 4 o'clock
    [Math.PI / 6, -Math.PI / 6].forEach((ang) => {
      const pusher = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16), caseMat);
      pusher.position.set(Math.cos(ang) * 1.75, Math.sin(ang) * 1.75, 0);
      pusher.rotation.z = ang - Math.PI / 2;
      group.add(pusher);
    });

    // Dial Face
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.56, 1.56, 0.04, 48), dialMat);
    dial.rotation.x = Math.PI / 2;
    dial.position.z = 0.2;
    group.add(dial);

    // Sub-dials (3 Chrono rings)
    [[-0.45, 0.2], [0.45, 0.2], [0, -0.45]].forEach(([x, y]) => {
      const subRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 12, 32), goldMat);
      subRing.position.set(x, y, 0.23);
      group.add(subRing);
    });

    // 12 Gold Hour Markers
    const markerGeo = new THREE.BoxGeometry(0.06, 0.22, 0.04);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const marker = new THREE.Mesh(markerGeo, goldMat);
      marker.position.set(Math.sin(angle) * 1.34, Math.cos(angle) * 1.34, 0.23);
      marker.rotation.z = -angle;
      group.add(marker);
    }

    // Hands
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.03), goldMat);
    hourHand.position.set(0, 0.28, 0.25);
    group.add(hourHand);

    const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.25, 0.03), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 }));
    minHand.position.set(0.24, 0.42, 0.27);
    minHand.rotation.z = -Math.PI / 4;
    group.add(minHand);

    // Sapphire Crystal Glass Cover with Soft Physical Tint
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.85,
      opacity: 0.95,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      envMap,
    });
    const crystal = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, 0.05, 48), crystalMat);
    crystal.rotation.x = Math.PI / 2;
    crystal.position.z = 0.25;
    group.add(crystal);

    // Stitched Italian Leather Straps
    const topStrap = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.7, 0.16), strapMat);
    topStrap.position.set(0, 2.8, -0.04);
    const botStrap = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.7, 0.16), strapMat);
    botStrap.position.set(0, -2.8, -0.04);
    group.add(topStrap);
    group.add(botStrap);

  } else if (productId === "tshirt") {
    // Cotton Streetwear T-Shirt with Natural Folds & Collar
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0x18181c,
      roughness: 0.82,
      metalness: 0.06,
    });
    const ribMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.9,
    });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.7, 0.55), shirtMat);
    torso.position.y = -0.15;
    group.add(torso);

    // Left Sleeve
    const sleeveLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 1.15, 24), shirtMat);
    sleeveLeft.rotation.z = Math.PI / 2.8;
    sleeveLeft.position.set(-1.45, 0.85, 0);
    group.add(sleeveLeft);

    // Right Sleeve
    const sleeveRight = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 1.15, 24), shirtMat);
    sleeveRight.rotation.z = -Math.PI / 2.8;
    sleeveRight.position.set(1.45, 0.85, 0);
    group.add(sleeveRight);

    // Ribbed Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.09, 16, 40), ribMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 1.22, 0);
    group.add(collar);

    // Minimalist Chest Logo Accent
    const badge = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.4 })
    );
    badge.position.set(0.45, 0.65, 0.29);
    group.add(badge);

  } else if (productId === "airpods") {
    // Ceramic White AirPods Charging Case with Chrome Hinge & Dual Earbuds
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.25,
      roughness: 0.12,
      envMap,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.96,
      roughness: 0.08,
      envMap,
    });

    // Rounded Charging Case Body
    const caseBody = new THREE.Mesh(new THREE.BoxGeometry(2.25, 1.7, 0.95), caseMat);
    caseBody.position.set(0, -0.4, 0);
    group.add(caseBody);

    // Chrome Parting Seam
    const seam = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.02, 16, 64), chromeMat);
    seam.rotation.x = Math.PI / 2;
    seam.position.set(0, 0.12, 0);
    group.add(seam);

    // Left and Right Earbuds Inside Dock
    [-0.55, 0.55].forEach((x) => {
      const earbudHead = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), caseMat);
      earbudHead.position.set(x, 1.15, 0.1);
      group.add(earbudHead);

      // Acoustic Mesh Vent
      const vent = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.16, 0.04),
        new THREE.MeshBasicMaterial({ color: 0x09090b })
      );
      vent.position.set(x + (x > 0 ? -0.2 : 0.2), 1.18, 0.24);
      group.add(vent);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.85, 20), caseMat);
      stem.position.set(x, 0.72, 0.1);
      group.add(stem);

      const chromeTip = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 20), chromeMat);
      chromeTip.position.set(x, 0.32, 0.1);
      group.add(chromeTip);
    });

  } else if (productId === "chair") {
    // Eames Lounge Chair with Walnut Veneer & Tufted Black Leather Cushions
    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x662d12,
      roughness: 0.28,
      metalness: 0.25,
      envMap,
    });
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.62,
      metalness: 0.18,
      envMap,
    });
    const chromeBaseMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15,
      envMap,
    });

    // Seat Cushion
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.32, 2.1), leatherMat);
    seat.position.y = -0.05;
    group.add(seat);

    // Seat Walnut Shell
    const seatShell = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.16, 2.2), walnutMat);
    seatShell.position.y = -0.25;
    group.add(seatShell);

    // Reclined Backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 0.3), leatherMat);
    back.position.set(0, 0.95, -0.9);
    back.rotation.x = -0.15;
    group.add(back);

    const backShell = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.7, 0.14), walnutMat);
    backShell.position.set(0, 0.95, -1.04);
    backShell.rotation.x = -0.15;
    group.add(backShell);

    // 5-Star Swivel Base
    const centerCol = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 24), chromeBaseMat);
    centerCol.position.set(0, -0.65, 0);
    group.add(centerCol);

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 1.3), chromeBaseMat);
      leg.position.set(Math.sin(angle) * 0.65, -0.98, Math.cos(angle) * 0.65);
      leg.rotation.y = angle;
      group.add(leg);
    }

  } else if (productId === "phone") {
    // Horizon Ultra Smartphone with OLED Curved Glass, Camera Island & Aluminum Frame
    const aluminumMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.94,
      roughness: 0.2,
      envMap,
    });
    const glassFrontMat = new THREE.MeshPhysicalMaterial({
      color: 0x020617,
      metalness: 0.9,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMap,
    });
    const cameraGlassMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.95,
      roughness: 0.08,
      envMap,
    });

    // Main Phone Body
    const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(1.85, 3.7, 0.18), aluminumMat);
    group.add(phoneBody);

    // OLED Front Glass Screen
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 3.55), glassFrontMat);
    screen.position.z = 0.1;
    group.add(screen);

    // Triple Camera Island
    const island = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.25, 0.14), aluminumMat);
    island.position.set(-0.45, 1.08, -0.14);
    group.add(island);

    // 3 Sapphire Camera Lenses
    [-0.35, 0, 0.35].forEach((yOffset) => {
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 24), cameraGlassMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(-0.45, 1.08 + yOffset, -0.22);
      group.add(lens);
    });

  } else if (productId === "camera") {
    // Lumix Retro Rangefinder Camera with Magnesium Top Plate & Optical Zoom Lens
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.92,
      roughness: 0.18,
      envMap,
    });
    const leatherGripMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.75,
      metalness: 0.15,
    });
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.8,
      roughness: 0.05,
      clearcoat: 1.0,
      envMap,
    });

    // Lower Leatherette Grip Body
    const bodyLower = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.35, 1.2), leatherGripMat);
    bodyLower.position.y = -0.3;
    group.add(bodyLower);

    // Brushed Magnesium Top Plate
    const bodyUpper = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.7, 1.2), silverMat);
    bodyUpper.position.y = 0.7;
    group.add(bodyUpper);

    // Stepped Optical Lens Barrel
    const barrelBase = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.45, 48), silverMat);
    barrelBase.rotation.x = Math.PI / 2;
    barrelBase.position.set(0.3, 0.05, 0.7);
    group.add(barrelBase);

    const barrelExt = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.65, 48), new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 }));
    barrelExt.rotation.x = Math.PI / 2;
    barrelExt.position.set(0.3, 0.05, 1.1);
    group.add(barrelExt);

    // Coated Front Optical Glass Element
    const lensFront = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 16), lensGlassMat);
    lensFront.position.set(0.3, 0.05, 1.3);
    lensFront.scale.z = 0.25;
    group.add(lensFront);

    // Shutter Dials on Top Plate
    [0.75, 1.15].forEach((x) => {
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.2, 24), silverMat);
      dial.position.set(x, 1.12, 0);
      group.add(dial);
    });

    // Rangefinder Viewfinder Window
    const vf = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.05), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9 }));
    vf.position.set(-1.05, 0.72, 0.62);
    group.add(vf);
  }

  return group;
}

// Single 3D Product Interactive Card Component
function Product360Card({ product, onOpenModal, onToast }) {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const threeRef = useRef({});
  const isSpinningRef = useRef(true);
  const [isSpinning, setIsSpinning] = useState(true);

  // Sync ref with state
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
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.4);

    // 3. Ultra-realistic WebGL Renderer with ACESFilmic Tone Mapping
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
    renderer.toneMappingExposure = 1.18;

    // 4. Studio Environment Reflection Map
    const envMap = getStudioEnvMap(renderer);
    scene.environment = envMap;

    // 5. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);

    // 6. Ground Soft Contact Shadow
    const contactShadow = createContactShadow();
    scene.add(contactShadow);

    // 7. Product 3D Root Group
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
        const fallback = createFallbackProductGroup(product.id, envMap);
        productGroup.add(fallback);
      }
    );

    threeRef.current = { scene, camera, renderer, productGroup };

    // Render Animation Loop (Slow, cinematic smooth rotation)
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isSpinningRef.current && productGroup) {
        productGroup.rotation.y += 0.005;
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

    threeRef.current.productGroup.rotation.y += deltaX * 0.012;
    threeRef.current.productGroup.rotation.x += deltaY * 0.012;

    prevPointerRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Download snapshot
  const downloadSnapshot = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `viewroom-${product.id}-photoreal-3d.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    onToast(`High-res PNG downloaded for ${product.name}`);
  };

  return (
    <div className="group relative flex flex-col bg-base-100/90 backdrop-blur-2xl border border-[var(--app-text-secondary)]/15 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 select-none">
      
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
        className="relative w-full h-[250px] sm:h-[280px] bg-transparent cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full block bg-transparent relative z-10" />
      </div>

      {/* Card Details & Action Toolbar Footer */}
      <div className="p-5 flex flex-col gap-4 border-t border-[var(--app-text-secondary)]/15 bg-base-200/50">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--app-text-secondary)]">
            {product.category}
          </span>
          <h3 className="text-base font-extrabold uppercase tracking-tight text-[var(--app-text-primary)] leading-tight mt-0.5">
            {product.name}
          </h3>
        </div>

        {/* Action Toolbar: Left Inspect 3D GLB Button + Right Grouped Control Icons */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--app-text-secondary)]/15">
          
          <Button
            variant="primary"
            className="!px-3.5 !py-2 !text-[10px] font-extrabold uppercase tracking-wider !rounded-xl cursor-pointer flex items-center gap-1.5"
            onClick={() => onOpenModal(product)}
          >
            <FontAwesomeIcon icon={faCube} className="text-cyan-400 text-xs" />
            Inspect 3D GLB
          </Button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next = !isSpinning;
                setIsSpinning(next);
                onToast(next ? `Cinematic spin active: ${product.name}` : `Spin paused: ${product.name}`);
              }}
              title={isSpinning ? "Pause Auto-Spin" : "Play Auto-Spin"}
              className="w-8 h-8 rounded-full bg-[var(--app-text-primary)]/10 hover:bg-[var(--app-text-primary)]/20 text-[var(--app-text-primary)] flex items-center justify-center text-xs transition-colors cursor-pointer border border-[var(--app-text-primary)]/15"
            >
              <FontAwesomeIcon icon={isSpinning ? faPause : faRotate} />
            </button>

            <button
              type="button"
              onClick={() => onOpenModal(product)}
              title="Full 3D Studio Inspector"
              className="w-8 h-8 rounded-full bg-[var(--app-text-primary)]/10 hover:bg-[var(--app-text-primary)]/20 text-[var(--app-text-primary)] hover:text-cyan-400 flex items-center justify-center text-xs transition-colors cursor-pointer border border-[var(--app-text-primary)]/15"
            >
              <FontAwesomeIcon icon={faCamera} />
            </button>

            <button
              type="button"
              onClick={downloadSnapshot}
              title="Download High-Res Snapshot"
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

// Dedicated Full-Screen 3D Studio Inspector Modal Viewer Component
function Product360ModalViewer({ product, onClose, onToast }) {
  const modalCanvasRef = useRef(null);
  const modalContainerRef = useRef(null);
  const [modalSpin, setModalSpin] = useState(true);
  const modalSpinRef = useRef(true);

  useEffect(() => {
    modalSpinRef.current = modalSpin;
  }, [modalSpin]);

  useEffect(() => {
    if (!modalContainerRef.current || !modalCanvasRef.current) return;

    const width = modalContainerRef.current.clientWidth;
    const height = modalContainerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6.2);

    const renderer = new THREE.WebGLRenderer({
      canvas: modalCanvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const envMap = getStudioEnvMap(renderer);
    scene.environment = envMap;

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(5, 8, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x93c5fd, 1.6);
    fill.position.set(-6, -2, 5);
    scene.add(fill);

    const shadow = createContactShadow();
    shadow.scale.set(1.4, 1.4, 1.4);
    scene.add(shadow);

    const productGroup = new THREE.Group();
    scene.add(productGroup);

    const loader = new GLTFLoader();
    loader.load(
      product.glbUrl,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.4 / maxDim;
        model.scale.set(scale, scale, scale);
        box.setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        productGroup.add(model);
      },
      undefined,
      () => {
        const fallback = createFallbackProductGroup(product.id, envMap);
        productGroup.add(fallback);
      }
    );

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (modalSpinRef.current) {
        productGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Mouse drag interaction in modal
    let isDragging = false;
    let prev = { x: 0, y: 0 };

    const onDown = (e) => {
      isDragging = true;
      setModalSpin(false);
      prev = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      productGroup.rotation.y += dx * 0.01;
      productGroup.rotation.x += dy * 0.01;
      prev = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      isDragging = false;
    };
    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.min(Math.max(camera.position.z + e.deltaY * 0.005, 3.5), 10);
    };

    const canvas = modalCanvasRef.current;
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("wheel", onWheel);
      renderer.dispose();
    };
  }, [product]);

  const handleDownload = () => {
    if (!modalCanvasRef.current) return;
    const link = document.createElement("a");
    link.download = `viewroom-${product.id}-photoreal-studio.png`;
    link.href = modalCanvasRef.current.toDataURL("image/png");
    link.click();
    onToast(`Full studio render downloaded for ${product.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-base-100 border border-[var(--app-text-secondary)]/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--app-text-secondary)]/15 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCube} />
              PHOTOREALISTIC 3D STUDIO INSPECTOR
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--app-text-primary)] mt-0.5">
              {product.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-base-200 hover:bg-base-300 text-[var(--app-text-primary)] flex items-center justify-center text-sm transition-all cursor-pointer border border-[var(--app-text-secondary)]/15"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Live Interactive 3D Canvas Viewport */}
        <div
          ref={modalContainerRef}
          className="w-full h-80 sm:h-[420px] bg-gradient-to-b from-slate-950 via-slate-900 to-black rounded-2xl relative overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <canvas ref={modalCanvasRef} className="w-full h-full block relative z-10" />

          {/* Interactive Control Overlay Chips */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
              Drag to Orbit • Scroll to Zoom
            </span>
          </div>

          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalSpin((prev) => !prev)}
              className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={modalSpin ? faPause : faRotate} />
              {modalSpin ? "Pause Spin" : "Auto Spin"}
            </button>
          </div>
        </div>

        {/* Modal Controls & Specs Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div>
            <span className="text-xs font-semibold text-[var(--app-text-secondary)] block">
              Category: <strong className="text-[var(--app-text-primary)]">{product.category}</strong>
            </span>
            <span className="text-sm font-black text-amber-400">
              {product.price} <span className="text-[10px] text-[var(--app-text-secondary)] font-normal">/ Studio Model Edition</span>
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-base-200 hover:bg-base-300 text-xs font-extrabold text-[var(--app-text-primary)] border border-[var(--app-text-secondary)]/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faDownload} />
              Export 4K PNG
            </button>
            <Button
              variant="primary"
              onClick={() => {
                onToast(`AR Mode launched for ${product.name}`);
                onClose();
              }}
              className="!px-5 !py-2.5 !text-xs font-extrabold uppercase !rounded-xl"
            >
              Launch AR View
            </Button>
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

      {/* Full-Screen Live 3D Studio Inspector Modal */}
      {selectedProduct && (
        <Product360ModalViewer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onToast={showToast}
        />
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[var(--app-text-secondary)]/15 pb-6">
          <div>
            <span className="font-heading text-xs font-extrabold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase block mb-2">
              PHOTOREALISTIC 3D CATALOG
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-[var(--app-text-primary)]">
              EXPLORE 3D PRODUCTS
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[var(--app-text-secondary)] max-w-md">
            Spin, inspect, and experience 6 realistic everyday products in photorealistic PBR studio format with soft contact shadows across all devices.
          </p>
        </div>

        {/* 2 ROWS X 3 COLUMNS RESPONSIVE GRID (6 PRODUCTS TOTAL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {GRID_PRODUCTS.map((prod) => (
            <Product360Card
              key={prod.id}
              product={prod}
              onToast={showToast}
              onOpenModal={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Product360Grid;