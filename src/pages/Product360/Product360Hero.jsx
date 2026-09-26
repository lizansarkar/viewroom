import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faRotate,
  faSliders,
  faEye,
  faDownload,
  faExpand,
  faCompress,
  faCheck,
  faXmark,
  faCircleDot,
  faGlobe,
  faLock,
  faCircleInfo,
  faVolumeHigh,
  faVolumeMute,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";

// =========================================================
// PBR MATERIAL & STYLE PRESETS
// =========================================================

const CASE_MATERIALS = [
  { id: "steel", name: "Polished Steel", color: 0xe2e8f0, metalness: 0.9, roughness: 0.15, clearcoat: 0.6, price: 0, preview: "linear-gradient(135deg, #f8fafc, #94a3b8)" },
  { id: "brushed", name: "Brushed Stainless", color: 0xcbd5e1, metalness: 0.85, roughness: 0.4, clearcoat: 0.2, price: 150, preview: "linear-gradient(135deg, #e2e8f0, #64748b)" },
  { id: "gold", name: "18K Yellow Gold", color: 0xf59e0b, metalness: 0.95, roughness: 0.15, clearcoat: 0.8, price: 1400, preview: "linear-gradient(135deg, #fbbf24, #b45309)" },
  { id: "rose", name: "Rose Gold", color: 0xfb7185, metalness: 0.9, roughness: 0.2, clearcoat: 0.7, price: 1500, preview: "linear-gradient(135deg, #fda4af, #be123c)" },
  { id: "bronze", name: "Aged Bronze", color: 0xb45309, metalness: 0.8, roughness: 0.5, clearcoat: 0.1, price: 350, preview: "linear-gradient(135deg, #d97706, #78350f)" },
  { id: "platinum", name: "Platinum 950", color: 0xf1f5f9, metalness: 0.98, roughness: 0.1, clearcoat: 0.9, price: 2200, preview: "linear-gradient(135deg, #ffffff, #cbd5e1)" },
  { id: "ceramic", name: "Matte Black Ceramic", color: 0x18181b, metalness: 0.1, roughness: 0.75, clearcoat: 0.1, price: 600, preview: "linear-gradient(135deg, #3f3f46, #09090b)" },
  { id: "carbon", name: "Carbon Fiber", color: 0x27272a, metalness: 0.3, roughness: 0.6, clearcoat: 0.4, price: 750, preview: "linear-gradient(135deg, #52525b, #18181b)" },
  { id: "dlc", name: "DLC Tactical Black", color: 0x09090b, metalness: 0.7, roughness: 0.3, clearcoat: 0.5, price: 450, preview: "linear-gradient(135deg, #27272a, #000000)" },
];

const DIAL_VARIANTS = [
  { id: "onyx", name: "Onyx Sunburst", color: 0x0c0c0e, metalness: 0.3, roughness: 0.35, preview: "linear-gradient(135deg, #18181b, #000000)" },
  { id: "champagne", name: "Champagne Gold", color: 0xd97706, metalness: 0.8, roughness: 0.25, preview: "linear-gradient(135deg, #f59e0b, #92400e)" },
  { id: "porcelain", name: "Porcelain White", color: 0xf8fafc, metalness: 0.1, roughness: 0.4, preview: "linear-gradient(135deg, #ffffff, #e2e8f0)" },
  { id: "navy", name: "Royal Navy Sunray", color: 0x1e3a8a, metalness: 0.5, roughness: 0.3, preview: "linear-gradient(135deg, #3b82f6, #1e3a8a)" },
  { id: "emerald", name: "Emerald Sunburst", color: 0x065f46, metalness: 0.5, roughness: 0.3, preview: "linear-gradient(135deg, #10b981, #064e3b)" },
  { id: "slate", name: "Slate Grey", color: 0x334155, metalness: 0.4, roughness: 0.4, preview: "linear-gradient(135deg, #64748b, #1e293b)" },
  { id: "salmon", name: "Salmon Sunray", color: 0xf43f5e, metalness: 0.5, roughness: 0.35, preview: "linear-gradient(135deg, #fb7185, #9f1239)" },
  { id: "carbon", name: "Carbon Weave", color: 0x18181b, metalness: 0.2, roughness: 0.7, preview: "linear-gradient(135deg, #3f3f46, #18181b)" },
  { id: "ice", name: "Ice Silver", color: 0x94a3b8, metalness: 0.85, roughness: 0.2, preview: "linear-gradient(135deg, #e2e8f0, #64748b)" },
];

const STRAP_OPTIONS = [
  { id: "leather", name: "Italian Calfskin", color: 0x78350f, price: 0, preview: "linear-gradient(135deg, #92400e, #451a03)" },
  { id: "alligator", name: "Alligator Leather", color: 0x451a03, price: 180, preview: "linear-gradient(135deg, #78350f, #270f03)" },
  { id: "bracelet", name: "3-Link Steel Bracelet", color: 0xcbd5e1, price: 350, preview: "linear-gradient(135deg, #f1f5f9, #64748b)" },
  { id: "rubber", name: "Sport Rubber", color: 0x18181b, price: 90, preview: "linear-gradient(135deg, #3f3f46, #09090b)" },
  { id: "nato", name: "NATO Fabric Weave", color: 0x1e293b, price: 60, preview: "linear-gradient(135deg, #475569, #0f172a)" },
  { id: "suede", name: "Velvet Suede", color: 0x475569, price: 120, preview: "linear-gradient(135deg, #64748b, #1e293b)" },
];

function Product360Hero() {
  // Customization State
  const [selectedCase, setSelectedCase] = useState(CASE_MATERIALS[2]); // Gold default
  const [selectedDial, setSelectedDial] = useState(DIAL_VARIANTS[0]); // Onyx Sunburst
  const [selectedStrap, setSelectedStrap] = useState(STRAP_OPTIONS[0]); // Leather
  const [activeTab, setActiveTab] = useState("case"); // "case" | "dial" | "strap" | "ar"

  // AR & Camera State
  const [isArActive, setIsArActive] = useState(false);
  const [arScale, setArScale] = useState(1.0);
  const [arPosX, setArPosX] = useState(0);
  const [arPosY, setArPosY] = useState(0);
  const [arTilt, setArTilt] = useState(0);
  const [arRotZ, setArRotZ] = useState(0);
  const [cameraError, setCameraError] = useState(null);

  // Viewport & Telemetry State
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [orbitYaw, setOrbitYaw] = useState(0);
  const [orbitPitch, setOrbitPitch] = useState(15);
  const [activeSubdialTooltip, setActiveSubdialTooltip] = useState(null);
  const [fps, setFps] = useState(60);
  const [toastMessage, setToastMessage] = useState(null);

  // Refs
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  // Three.js Scene Instance References
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    watchGroup: null,
    caseMesh: null,
    bezelMesh: null,
    dialMesh: null,
    subdialMeshes: [],
    hourHand: null,
    minuteHand: null,
    secondsHand: null,
    subdialHands: [],
    strapsGroup: null,
    materialsMap: {},
    dateTexture: null,
    dateContext: null,
    dateCanvas: null,
  });

  // Dynamic Price Calculation
  const basePrice = 1850;
  const totalPrice = basePrice + selectedCase.price + selectedStrap.price;

  // Configuration Code Generator
  const configCode = `#ATELIER-${selectedCase.id.toUpperCase()}-${selectedDial.id.toUpperCase()}-${selectedStrap.id.toUpperCase()}`;

  // Toast Notification Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // =========================================================
  // THREE.JS WATCH GEOMETRY & SCENE INITIALIZATION
  // =========================================================
  useEffect(() => {
    if (!viewportRef.current || !canvasRef.current) return;

    const width = viewportRef.current.clientWidth;
    const height = viewportRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lighting Environment
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfbbf24, 2.0);
    rimLight.position.set(0, -6, -5);
    scene.add(rimLight);

    // 5. Watch Root Group
    const watchGroup = new THREE.Group();
    scene.add(watchGroup);

    // Create Shared Materials Map
    const materialsMap = {
      case: new THREE.MeshStandardMaterial({
        color: selectedCase.color,
        metalness: selectedCase.metalness,
        roughness: selectedCase.roughness,
      }),
      dial: new THREE.MeshStandardMaterial({
        color: selectedDial.color,
        metalness: selectedDial.metalness,
        roughness: selectedDial.roughness,
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.15,
      }),
      silverAccent: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.95,
        roughness: 0.15,
      }),
      subdial: new THREE.MeshStandardMaterial({
        color: 0x111115,
        metalness: 0.4,
        roughness: 0.5,
      }),
      strap: new THREE.MeshStandardMaterial({
        color: selectedStrap.color,
        metalness: 0.1,
        roughness: 0.7,
      }),
    };

    // A. MIDCASE CYLINDER & LUGS
    const caseGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.5, 64);
    const caseMesh = new THREE.Mesh(caseGeo, materialsMap.case);
    caseMesh.rotation.x = Math.PI / 2;
    watchGroup.add(caseMesh);

    // Lugs (4 curved lugs)
    const lugGeo = new THREE.BoxGeometry(0.3, 0.4, 1.2);
    const lugPositions = [
      [-1.3, 2.1, 0],
      [1.3, 2.1, 0],
      [-1.3, -2.1, 0],
      [1.3, -2.1, 0],
    ];
    lugPositions.forEach(([x, y, z]) => {
      const lug = new THREE.Mesh(lugGeo, materialsMap.case);
      lug.position.set(x, y, z);
      lug.rotation.z = Math.atan2(y, x) * 0.2;
      watchGroup.add(lug);
    });

    // B. KNURLED BEZEL WITH TEETH
    const bezelGeo = new THREE.TorusGeometry(2.05, 0.12, 16, 80);
    const bezelMesh = new THREE.Mesh(bezelGeo, materialsMap.case);
    bezelMesh.position.z = 0.28;
    watchGroup.add(bezelMesh);

    // Fluted Crown
    const crownGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 18);
    const crownMesh = new THREE.Mesh(crownGeo, materialsMap.case);
    crownMesh.position.set(2.25, 0, 0);
    crownMesh.rotation.z = Math.PI / 2;
    watchGroup.add(crownMesh);

    // Pushers (2 Chronograph Buttons)
    const pusherGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.35, 16);
    const pusher1 = new THREE.Mesh(pusherGeo, materialsMap.case);
    pusher1.position.set(2.0, 1.1, 0);
    pusher1.rotation.z = Math.PI / 3;
    watchGroup.add(pusher1);

    const pusher2 = new THREE.Mesh(pusherGeo, materialsMap.case);
    pusher2.position.set(2.0, -1.1, 0);
    pusher2.rotation.z = -Math.PI / 3;
    watchGroup.add(pusher2);

    // C. DIAL PLATE
    const dialGeo = new THREE.CylinderGeometry(1.95, 1.95, 0.04, 64);
    const dialMesh = new THREE.Mesh(dialGeo, materialsMap.dial);
    dialMesh.rotation.x = Math.PI / 2;
    dialMesh.position.z = 0.25;
    watchGroup.add(dialMesh);

    // D. 12 HOUR MARKERS & 60 MINUTE TICKS
    const hourMarkerGeo = new THREE.BoxGeometry(0.08, 0.3, 0.05);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const marker = new THREE.Mesh(hourMarkerGeo, materialsMap.goldAccent);
      const radius = 1.65;
      marker.position.set(Math.sin(angle) * radius, Math.cos(angle) * radius, 0.28);
      marker.rotation.z = -angle;
      watchGroup.add(marker);
    }

    // E. 3 RECESSED SUBDIALS (3 o'clock, 6 o'clock, 9 o'clock)
    const subdialPositions = [
      { id: "30min", x: 0.9, y: 0, name: "30-MINUTE CHRONO REGISTER" },
      { id: "12hr", x: 0, y: -0.9, name: "12-HOUR TOTALIZER" },
      { id: "sec", x: -0.9, y: 0, name: "RUNNING SECONDS" },
    ];
    const subdialMeshes = [];
    const subdialHands = [];

    const subdialGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.03, 32);
    const subdialHandGeo = new THREE.BoxGeometry(0.02, 0.38, 0.02);

    subdialPositions.forEach((pos) => {
      const subMesh = new THREE.Mesh(subdialGeo, materialsMap.subdial.clone());
      subMesh.rotation.x = Math.PI / 2;
      subMesh.position.set(pos.x, pos.y, 0.27);
      subMesh.userData = { isSubdial: true, name: pos.name };
      watchGroup.add(subMesh);
      subdialMeshes.push(subMesh);

      // Subdial Needle Hand
      const hand = new THREE.Mesh(subdialHandGeo, materialsMap.goldAccent);
      hand.position.set(pos.x, pos.y, 0.3);
      watchGroup.add(hand);
      subdialHands.push(hand);
    });

    // F. LIVE DATE APERTURE CANVAS TEXTURE (4:30 Position)
    const dateCanvas = document.createElement("canvas");
    dateCanvas.width = 128;
    dateCanvas.height = 128;
    const dateCtx = dateCanvas.getContext("2d");

    const renderDateTexture = () => {
      dateCtx.fillStyle = "#0c0c0e";
      dateCtx.fillRect(0, 0, 128, 128);
      dateCtx.strokeStyle = "#f59e0b";
      dateCtx.lineWidth = 6;
      dateCtx.strokeRect(4, 4, 120, 120);

      const today = new Date().getDate();
      dateCtx.fillStyle = "#ffffff";
      dateCtx.font = "bold 64px sans-serif";
      dateCtx.textAlign = "center";
      dateCtx.textBaseline = "middle";
      dateCtx.fillText(String(today), 64, 68);
    };
    renderDateTexture();

    const dateTexture = new THREE.CanvasTexture(dateCanvas);
    const dateGeo = new THREE.PlaneGeometry(0.38, 0.35);
    const dateMat = new THREE.MeshBasicMaterial({ map: dateTexture });
    const dateMesh = new THREE.Mesh(dateGeo, dateMat);
    dateMesh.position.set(0.9, -0.9, 0.28);
    watchGroup.add(dateMesh);

    // G. SWORD HOUR & MINUTE HANDS + SECONDS NEEDLE
    // Hour Hand
    const hourHandGeo = new THREE.BoxGeometry(0.12, 1.1, 0.04);
    hourHandGeo.translate(0, 0.45, 0);
    const hourHand = new THREE.Mesh(hourHandGeo, materialsMap.goldAccent);
    hourHand.position.z = 0.32;
    watchGroup.add(hourHand);

    // Minute Hand
    const minHandGeo = new THREE.BoxGeometry(0.09, 1.5, 0.04);
    minHandGeo.translate(0, 0.65, 0);
    const minuteHand = new THREE.Mesh(minHandGeo, materialsMap.silverAccent);
    minuteHand.position.z = 0.35;
    watchGroup.add(minuteHand);

    // Sweeping Seconds Hand (Lollipop Counterweight)
    const secHandGeo = new THREE.BoxGeometry(0.03, 1.75, 0.02);
    secHandGeo.translate(0, 0.6, 0);
    const secondsHand = new THREE.Mesh(secHandGeo, materialsMap.goldAccent);
    secondsHand.position.z = 0.38;

    // Counterweight circle
    const dotGeo = new THREE.CircleGeometry(0.08, 16);
    const dotMesh = new THREE.Mesh(dotGeo, materialsMap.goldAccent);
    dotMesh.position.set(0, -0.25, 0);
    secondsHand.add(dotMesh);
    watchGroup.add(secondsHand);

    // H. DOMED SAPPHIRE CRYSTAL
    const crystalGeo = new THREE.CylinderGeometry(2.02, 2.02, 0.08, 64);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      roughness: 0,
      transmission: 0.92,
      ior: 1.52,
      reflectivity: 0.8,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.rotation.x = Math.PI / 2;
    crystalMesh.position.z = 0.32;
    watchGroup.add(crystalMesh);

    // I. STRAPS GROUP (Top & Bottom Attachment)
    const strapsGroup = new THREE.Group();
    watchGroup.add(strapsGroup);

    const buildStraps = (strapColor) => {
      // Clear old straps
      while (strapsGroup.children.length > 0) {
        strapsGroup.remove(strapsGroup.children[0]);
      }

      const strapMat = new THREE.MeshStandardMaterial({
        color: strapColor,
        metalness: 0.1,
        roughness: 0.7,
      });

      // Top Strap
      const topStrapGeo = new THREE.BoxGeometry(1.6, 2.8, 0.15);
      topStrapGeo.translate(0, 3.2, 0);
      const topStrap = new THREE.Mesh(topStrapGeo, strapMat);
      strapsGroup.add(topStrap);

      // Bottom Strap
      const botStrapGeo = new THREE.BoxGeometry(1.6, 2.8, 0.15);
      botStrapGeo.translate(0, -3.2, 0);
      const botStrap = new THREE.Mesh(botStrapGeo, strapMat);
      strapsGroup.add(botStrap);
    };
    buildStraps(selectedStrap.color);

    // Store references
    threeRef.current = {
      scene,
      camera,
      renderer,
      watchGroup,
      caseMesh,
      bezelMesh,
      dialMesh,
      subdialMeshes,
      hourHand,
      minuteHand,
      secondsHand,
      subdialHands,
      strapsGroup,
      materialsMap,
      dateTexture,
      dateContext: dateCtx,
      dateCanvas,
    };

    // =========================================================
    // REAL-TIME HAND SWEEP & RENDER ANIMATION LOOP
    // =========================================================
    let animId;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // FPS Measurement
      const nowTime = performance.now();
      frameCount++;
      if (nowTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = nowTime;
      }

      // Real-time Local Time Sweeping (28,800 vph continuous feel)
      const now = new Date();
      const ms = now.getMilliseconds();
      const sec = now.getSeconds() + ms / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = (now.getHours() % 12) + min / 60;

      if (secondsHand) secondsHand.rotation.z = -(sec / 60) * Math.PI * 2;
      if (minuteHand) minuteHand.rotation.z = -(min / 60) * Math.PI * 2;
      if (hourHand) hourHand.rotation.z = -(hr / 12) * Math.PI * 2;

      // Subdial Hand Rotation
      if (subdialHands[2]) subdialHands[2].rotation.z = -(sec / 60) * Math.PI * 2;
      if (subdialHands[0]) subdialHands[0].rotation.z = -(min / 30) * Math.PI * 2;
      if (subdialHands[1]) subdialHands[1].rotation.z = -(hr / 12) * Math.PI * 2;

      // Auto-rotation when idle (Slower luxury spin speed)
      if (isAutoRotate && watchGroup && !isArActive) {
        watchGroup.rotation.y += 0.0015;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
  }, []);

  // =========================================================
  // LIVE PBR MATERIAL PREVIEW SWAPPING EFFECTS
  // =========================================================
  useEffect(() => {
    const { materialsMap } = threeRef.current;
    if (materialsMap.case) {
      materialsMap.case.color.setHex(selectedCase.color);
      materialsMap.case.metalness = selectedCase.metalness;
      materialsMap.case.roughness = selectedCase.roughness;
      materialsMap.case.needsUpdate = true;
    }
  }, [selectedCase]);

  useEffect(() => {
    const { materialsMap } = threeRef.current;
    if (materialsMap.dial) {
      materialsMap.dial.color.setHex(selectedDial.color);
      materialsMap.dial.metalness = selectedDial.metalness;
      materialsMap.dial.roughness = selectedDial.roughness;
      materialsMap.dial.needsUpdate = true;
    }
  }, [selectedDial]);

  useEffect(() => {
    const { strapsGroup } = threeRef.current;
    if (strapsGroup) {
      const strapMat = new THREE.MeshStandardMaterial({
        color: selectedStrap.color,
        metalness: 0.1,
        roughness: 0.7,
      });
      strapsGroup.traverse((child) => {
        if (child.isMesh) child.material = strapMat;
      });
    }
  }, [selectedStrap]);

  // =========================================================
  // DRAG ORBIT INTERACTION
  // =========================================================
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsAutoRotate(false);
    previousPointerRef.current = {
      x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0].clientY) || 0,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !threeRef.current.watchGroup) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const deltaX = clientX - previousPointerRef.current.x;
    const deltaY = clientY - previousPointerRef.current.y;

    threeRef.current.watchGroup.rotation.y += deltaX * 0.01;
    threeRef.current.watchGroup.rotation.x += deltaY * 0.01;

    setOrbitYaw(Math.round((threeRef.current.watchGroup.rotation.y * 180) / Math.PI) % 360);
    setOrbitPitch(Math.round((threeRef.current.watchGroup.rotation.x * 180) / Math.PI) % 360);

    previousPointerRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // =========================================================
  // WEBCAM AR WRIST TRY-ON MODE
  // =========================================================
  const toggleArMode = async () => {
    if (!isArActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
        setIsArActive(true);
        setIsAutoRotate(false);
        setCameraError(null);
        showToast("Webcam AR Mode Activated! Use sliders to align on your wrist.");
      } catch (err) {
        console.warn("Camera access denied or unavailable:", err);
        setCameraError("Camera access required for AR wrist mode.");
        showToast("Camera access error. Please grant permissions.");
      }
    } else {
      if (webcamRef.current && webcamRef.current.srcObject) {
        const tracks = webcamRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setIsArActive(false);
      showToast("Exited AR Mode.");
    }
  };

  // AR Transform Application
  useEffect(() => {
    const { watchGroup } = threeRef.current;
    if (watchGroup) {
      if (isArActive) {
        watchGroup.position.set(arPosX, arPosY, 0);
        watchGroup.scale.set(arScale, arScale, arScale);
        watchGroup.rotation.set((arTilt * Math.PI) / 180, 0, (arRotZ * Math.PI) / 180);
      } else {
        watchGroup.position.set(0, 0, 0);
        watchGroup.scale.set(1, 1, 1);
        watchGroup.rotation.set(0, 0, 0);
      }
    }
  }, [isArActive, arScale, arPosX, arPosY, arTilt, arRotZ]);

  // Snapshot Capture & Download PNG
  const captureSnapshot = () => {
    if (!canvasRef.current) return;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvasRef.current.width;
    exportCanvas.height = canvasRef.current.height;
    const ctx = exportCanvas.getContext("2d");

    // Draw video background if AR active
    if (isArActive && webcamRef.current) {
      ctx.drawImage(webcamRef.current, 0, 0, exportCanvas.width, exportCanvas.height);
    } else {
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    // Draw WebGL Watch Canvas
    ctx.drawImage(canvasRef.current, 0, 0);

    const image = exportCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `viewroom-${selectedCase.id}-custom-watch.png`;
    link.href = image;
    link.click();
    showToast("Captured PNG Snapshot Downloaded!");
  };

  return (
    <section className="relative w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-10 sm:py-14 select-none overflow-hidden">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-black/90 text-amber-400 border border-amber-500/40 px-5 py-3 rounded-full text-xs font-bold tracking-wider shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2 text-amber-400" />
          {toastMessage}
        </div>
      )}

      {/* Main Atelier Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Customizer Layout: Left Viewport (Full Width Canvas) + Right Control Dock */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 3D WATCH VIEWPORT CANVAS CONTAINER (Columns 1-8) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            
            <div
              ref={viewportRef}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              className="relative w-full h-[460px] sm:h-[580px] lg:h-[650px] rounded-3xl overflow-hidden border border-[var(--app-border)]/20 shadow-2xl bg-transparent group cursor-grab active:cursor-grabbing transition-all"
            >
              {/* Webcam AR Background Video Stream */}
              <video
                ref={webcamRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isArActive ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />

              {/* Three.js WebGL Interactive Canvas */}
              <canvas ref={canvasRef} className="relative z-10 w-full h-full block" />

              {/* Ambient Background Radial Glow */}
              {!isArActive && (
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none transition-all duration-500 z-0"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, #${selectedCase.color.toString(16)}44 0%, transparent 70%)`,
                  }}
                />
              )}

              {/* TOP-LEFT TELEMETRY BADGE */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-3 bg-black/75 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full shadow-lg pointer-events-auto">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-black tracking-widest text-white uppercase">
                  3D LIVE • {fps} FPS • YAW {orbitYaw}°
                </span>
              </div>

              {/* TOP-RIGHT ACTION TOOLBAR */}
              <div className="absolute top-5 right-5 z-20 flex items-center gap-2 pointer-events-auto">
                {/* Auto Rotate Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoRotate(!isAutoRotate);
                    showToast(isAutoRotate ? "Auto-rotation paused." : "Auto-rotation active.");
                  }}
                  title="Toggle Auto Rotation"
                  className={`w-10 h-10 rounded-full border backdrop-blur-md text-white flex items-center justify-center text-xs transition-transform hover:scale-110 cursor-pointer ${
                    isAutoRotate ? "bg-amber-500/30 border-amber-400 text-amber-300" : "bg-black/60 border-white/20"
                  }`}
                >
                  <FontAwesomeIcon icon={faRotate} />
                </button>

                {/* AR Try On Toggle */}
                <button
                  type="button"
                  onClick={toggleArMode}
                  title="Toggle AR Wrist Try-On Mode"
                  className={`w-10 h-10 rounded-full border backdrop-blur-md text-white flex items-center justify-center text-xs transition-transform hover:scale-110 cursor-pointer ${
                    isArActive ? "bg-cyan-500/30 border-cyan-400 text-cyan-300" : "bg-black/60 border-white/20"
                  }`}
                >
                  <FontAwesomeIcon icon={faCamera} />
                </button>

                {/* Capture Snapshot PNG */}
                <button
                  type="button"
                  onClick={captureSnapshot}
                  title="Capture PNG Snapshot"
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center text-xs transition-transform hover:scale-110 cursor-pointer backdrop-blur-md"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
              </div>

              {/* DRAG INTERACTION OVERLAY HINT */}
              <div className="absolute bottom-5 left-5 z-20 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-[11px] text-white/80 font-semibold pointer-events-none">
                <FontAwesomeIcon icon={faSliders} className="text-amber-400" />
                <span>Drag to orbit 360° • Scroll to zoom</span>
              </div>

              {/* AR WRIST SLIDER CONTROL DOCK OVERLAY */}
              {isArActive && (
                <div className="absolute bottom-5 inset-x-5 z-30 bg-black/85 backdrop-blur-md border border-cyan-500/30 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-cyan-300 tracking-wider uppercase flex items-center gap-2">
                      <FontAwesomeIcon icon={faCamera} />
                      WEBCAM AR WRIST CALIBRATION CONTROLS
                    </span>
                    <button
                      type="button"
                      onClick={toggleArMode}
                      className="text-xs text-white/70 hover:text-white cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-white/70 uppercase block mb-1">Scale: {arScale.toFixed(2)}x</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={arScale}
                        onChange={(e) => setArScale(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-white/70 uppercase block mb-1">Pos X: {arPosX.toFixed(1)}</label>
                      <input
                        type="range"
                        min="-4"
                        max="4"
                        step="0.1"
                        value={arPosX}
                        onChange={(e) => setArPosX(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-white/70 uppercase block mb-1">Pos Y: {arPosY.toFixed(1)}</label>
                      <input
                        type="range"
                        min="-4"
                        max="4"
                        step="0.1"
                        value={arPosY}
                        onChange={(e) => setArPosY(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-white/70 uppercase block mb-1">Tilt: {arTilt}°</label>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        step="1"
                        value={arTilt}
                        onChange={(e) => setArTilt(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-white/70 uppercase block mb-1">Rotate Z: {arRotZ}°</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={arRotZ}
                        onChange={(e) => setArRotZ(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* CUSTOMIZATION CONTROL DOCK (Columns 9-12) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Customization Navigation Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-base-200/60 p-1.5 rounded-2xl border border-[var(--app-border)]/20">
              <button
                type="button"
                onClick={() => setActiveTab("case")}
                className={`py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  activeTab === "case"
                    ? "bg-[var(--app-text-primary)] text-[var(--app-background)] shadow-md"
                    : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
                }`}
              >
                Case
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("dial")}
                className={`py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  activeTab === "dial"
                    ? "bg-[var(--app-text-primary)] text-[var(--app-background)] shadow-md"
                    : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
                }`}
              >
                Dial
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("strap")}
                className={`py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  activeTab === "strap"
                    ? "bg-[var(--app-text-primary)] text-[var(--app-background)] shadow-md"
                    : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
                }`}
              >
                Strap
              </button>
            </div>

            {/* TAB 1: CASE MATERIAL SELECTOR */}
            {activeTab === "case" && (
              <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                    SELECT CASE MATERIAL ({CASE_MATERIALS.length})
                  </span>
                  <span className="text-xs font-black text-amber-400 uppercase">
                    SELECTED: {selectedCase.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {CASE_MATERIALS.map((mat) => {
                    const isSelected = selectedCase.id === mat.id;
                    return (
                      <button
                        type="button"
                        key={mat.id}
                        onClick={() => setSelectedCase(mat)}
                        className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer group ${
                          isSelected
                            ? "border-amber-400 bg-amber-500/10 shadow-lg scale-105"
                            : "border-[var(--app-border)]/20 bg-base-200/40 hover:border-amber-400/50"
                        }`}
                      >
                        {/* Gradient Sphere Preview */}
                        <div
                          className="w-10 h-10 rounded-full mb-2 shadow-inner border border-white/20 transition-transform group-hover:scale-110"
                          style={{ background: mat.preview }}
                        />
                        <span className="text-[11px] font-extrabold uppercase tracking-tight text-center leading-tight text-[var(--app-text-primary)] mb-1">
                          {mat.name}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">
                          {mat.price === 0 ? "Included" : `+$${mat.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: DIAL COLOR SELECTOR */}
            {activeTab === "dial" && (
              <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                    SELECT DIAL FINISH ({DIAL_VARIANTS.length})
                  </span>
                  <span className="text-xs font-black text-amber-400 uppercase">
                    SELECTED: {selectedDial.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {DIAL_VARIANTS.map((dial) => {
                    const isSelected = selectedDial.id === dial.id;
                    return (
                      <button
                        type="button"
                        key={dial.id}
                        onClick={() => setSelectedDial(dial)}
                        className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer group ${
                          isSelected
                            ? "border-amber-400 bg-amber-500/10 shadow-lg scale-105"
                            : "border-[var(--app-border)]/20 bg-base-200/40 hover:border-amber-400/50"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full mb-2 shadow-inner border border-white/20 transition-transform group-hover:scale-110"
                          style={{ background: dial.preview }}
                        />
                        <span className="text-[11px] font-extrabold uppercase tracking-tight text-center leading-tight text-[var(--app-text-primary)]">
                          {dial.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: STRAP TYPE SELECTOR */}
            {activeTab === "strap" && (
              <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                    SELECT STRAP STYLE ({STRAP_OPTIONS.length})
                  </span>
                  <span className="text-xs font-black text-amber-400 uppercase">
                    SELECTED: {selectedStrap.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {STRAP_OPTIONS.map((strap) => {
                    const isSelected = selectedStrap.id === strap.id;
                    return (
                      <button
                        type="button"
                        key={strap.id}
                        onClick={() => setSelectedStrap(strap)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group ${
                          isSelected
                            ? "border-amber-400 bg-amber-500/10 shadow-lg scale-105"
                            : "border-[var(--app-border)]/20 bg-base-200/40 hover:border-amber-400/50"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl shrink-0 shadow-inner border border-white/20 transition-transform group-hover:scale-110"
                          style={{ background: strap.preview }}
                        />
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-extrabold uppercase tracking-tight leading-tight text-[var(--app-text-primary)]">
                            {strap.name}
                          </span>
                          <span className="text-[10px] font-bold text-amber-400">
                            {strap.price === 0 ? "Standard" : `+$${strap.price}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACTION BUTTONS & SPEC HIGHLIGHTS */}
            <div className="flex flex-col gap-3 mt-4 border-t border-[var(--app-border)]/15 pt-6">
              <Button
                variant="primary"
                className="w-full !py-3.5 !text-xs !font-black !tracking-widest uppercase shadow-xl"
                onClick={() => showToast(`Saved custom watch order: ${configCode}`)}
              >
                ORDER CUSTOM TIMEPIECE (${totalPrice.toLocaleString()})
              </Button>

              <div className="flex items-center justify-between text-[11px] font-bold text-[var(--app-text-secondary)] px-1">
                <span>✓ 5-YEAR INTERNATIONAL WARRANTY</span>
                <span>✓ CERTIFIED CHRONOMETER</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Product360Hero;