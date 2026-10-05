import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faRotate,
  faPause,
  faDownload,
  faXmark,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";

// =========================================================
// PBR MATERIAL & LUXURY TIMEPIECE STYLE PRESETS
// =========================================================

const CASE_MATERIALS = [
  { id: "steel", name: "Polished Steel", color: 0xe2e8f0, metalness: 0.92, roughness: 0.15, preview: "linear-gradient(135deg, #f8fafc, #94a3b8)" },
  { id: "brushed", name: "Brushed Stainless", color: 0xcbd5e1, metalness: 0.88, roughness: 0.35, preview: "linear-gradient(135deg, #e2e8f0, #64748b)" },
  { id: "gold", name: "18K Yellow Gold", color: 0xf59e0b, metalness: 0.95, roughness: 0.15, preview: "linear-gradient(135deg, #fbbf24, #b45309)" },
  { id: "rose", name: "Rose Gold", color: 0xfb7185, metalness: 0.9, roughness: 0.2, preview: "linear-gradient(135deg, #fda4af, #be123c)" },
  { id: "bronze", name: "Aged Bronze", color: 0xb45309, metalness: 0.8, roughness: 0.45, preview: "linear-gradient(135deg, #d97706, #78350f)" },
  { id: "platinum", name: "Platinum 950", color: 0xf1f5f9, metalness: 0.98, roughness: 0.1, preview: "linear-gradient(135deg, #ffffff, #cbd5e1)" },
  { id: "ceramic", name: "Matte Black Ceramic", color: 0x18181b, metalness: 0.15, roughness: 0.7, preview: "linear-gradient(135deg, #3f3f46, #09090b)" },
  { id: "carbon", name: "Carbon Fiber", color: 0x27272a, metalness: 0.3, roughness: 0.6, preview: "linear-gradient(135deg, #52525b, #18181b)" },
  { id: "dlc", name: "DLC Tactical Black", color: 0x09090b, metalness: 0.85, roughness: 0.25, preview: "linear-gradient(135deg, #27272a, #000000)" },
];

const DIAL_VARIANTS = [
  { id: "onyx", name: "Onyx Sunburst", color: 0x0c0c0e, metalness: 0.4, roughness: 0.3, preview: "linear-gradient(135deg, #18181b, #000000)" },
  { id: "champagne", name: "Champagne Gold", color: 0xd97706, metalness: 0.8, roughness: 0.25, preview: "linear-gradient(135deg, #f59e0b, #92400e)" },
  { id: "porcelain", name: "Porcelain White", color: 0xf8fafc, metalness: 0.1, roughness: 0.4, preview: "linear-gradient(135deg, #ffffff, #e2e8f0)" },
  { id: "navy", name: "Royal Navy Sunray", color: 0x1e3a8a, metalness: 0.6, roughness: 0.25, preview: "linear-gradient(135deg, #3b82f6, #1e3a8a)" },
  { id: "emerald", name: "Emerald Sunburst", color: 0x065f46, metalness: 0.6, roughness: 0.25, preview: "linear-gradient(135deg, #10b981, #064e3b)" },
  { id: "slate", name: "Slate Grey", color: 0x334155, metalness: 0.45, roughness: 0.35, preview: "linear-gradient(135deg, #64748b, #1e293b)" },
  { id: "salmon", name: "Salmon Sunray", color: 0xf43f5e, metalness: 0.55, roughness: 0.3, preview: "linear-gradient(135deg, #fb7185, #9f1239)" },
  { id: "carbon", name: "Carbon Weave", color: 0x18181b, metalness: 0.2, roughness: 0.7, preview: "linear-gradient(135deg, #3f3f46, #18181b)" },
  { id: "ice", name: "Ice Silver", color: 0x94a3b8, metalness: 0.85, roughness: 0.2, preview: "linear-gradient(135deg, #e2e8f0, #64748b)" },
];

const STRAP_OPTIONS = [
  { id: "leather", name: "Italian Calfskin", color: 0x78350f, isMetal: false, preview: "linear-gradient(135deg, #92400e, #451a03)" },
  { id: "alligator", name: "Alligator Leather", color: 0x451a03, isMetal: false, preview: "linear-gradient(135deg, #78350f, #270f03)" },
  { id: "bracelet", name: "3-Link Steel Bracelet", color: 0xcbd5e1, isMetal: true, preview: "linear-gradient(135deg, #f1f5f9, #64748b)" },
  { id: "rubber", name: "Sport Rubber", color: 0x18181b, isMetal: false, preview: "linear-gradient(135deg, #3f3f46, #09090b)" },
  { id: "nato", name: "NATO Fabric Weave", color: 0x1e293b, isMetal: false, preview: "linear-gradient(135deg, #475569, #0f172a)" },
  { id: "suede", name: "Velvet Suede", color: 0x475569, isMetal: false, preview: "linear-gradient(135deg, #64748b, #1e293b)" },
];

function Product360Hero() {
  // Customization State
  const [selectedCase, setSelectedCase] = useState(CASE_MATERIALS[0]); // Polished Steel default
  const [selectedDial, setSelectedDial] = useState(DIAL_VARIANTS[0]); // Onyx Sunburst default
  const [selectedStrap, setSelectedStrap] = useState(STRAP_OPTIONS[0]); // Italian Calfskin
  const [activeTab, setActiveTab] = useState("case");

  // AR & Camera State
  const [isArActive, setIsArActive] = useState(false);
  const [arScale, setArScale] = useState(1.0);
  const [arPosX, setArPosX] = useState(0);
  const [arPosY, setArPosY] = useState(0);
  const [arTilt, setArTilt] = useState(0);
  const [arRotZ, setArRotZ] = useState(0);

  // Viewport State
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const isAutoRotateRef = useRef(isAutoRotate);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

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
    hourHand: null,
    minuteHand: null,
    secondsHand: null,
    subdialHands: [],
    strapsGroup: null,
    materialsMap: {},
  });

  // Toast Notification Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // =========================================================
  // THREE.JS LUXURY WATCH GEOMETRY & SCENE INITIALIZATION
  // =========================================================
  useEffect(() => {
    if (!viewportRef.current || !canvasRef.current) return;

    const width = viewportRef.current.clientWidth;
    const height = viewportRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    // 3. Renderer with High Dynamic Quality
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Studio Lighting Environment for Metallic & Glass Reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8e7, 3.2);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.6);
    fillLight.position.set(-6, -3, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfbbf24, 2.5);
    rimLight.position.set(0, -6, -5);
    scene.add(rimLight);

    const topSpecularLight = new THREE.DirectionalLight(0xffffff, 1.8);
    topSpecularLight.position.set(0, 6, 4);
    scene.add(topSpecularLight);

    // 5. Watch Root Group
    const watchGroup = new THREE.Group();
    scene.add(watchGroup);

    // Shared Materials Map
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
        color: 0x111116,
        metalness: 0.5,
        roughness: 0.4,
      }),
      subdialBorder: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.15,
      }),
      strap: new THREE.MeshStandardMaterial({
        color: selectedStrap.color,
        metalness: selectedStrap.isMetal ? selectedCase.metalness : 0.1,
        roughness: selectedStrap.isMetal ? selectedCase.roughness : 0.65,
      }),
    };

    // ---------------------------------------------------------
    // A. MAIN STEPPED CASE CYLINDER
    // ---------------------------------------------------------
    const caseGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.44, 64);
    const caseMesh = new THREE.Mesh(caseGeo, materialsMap.case);
    caseMesh.rotation.x = Math.PI / 2;
    watchGroup.add(caseMesh);

    // Case Back Plate
    const caseBackGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.08, 64);
    const caseBackMesh = new THREE.Mesh(caseBackGeo, materialsMap.case);
    caseBackMesh.rotation.x = Math.PI / 2;
    caseBackMesh.position.z = -0.24;
    watchGroup.add(caseBackMesh);

    // ---------------------------------------------------------
    // B. CURVED TAPERED LUGS (4 Lugs)
    // ---------------------------------------------------------
    const lugPositions = [
      { x: -1.25, y: 2.1, z: 0, rotZ: 0.12 },
      { x: 1.25, y: 2.1, z: 0, rotZ: -0.12 },
      { x: -1.25, y: -2.1, z: 0, rotZ: -0.12 },
      { x: 1.25, y: -2.1, z: 0, rotZ: 0.12 },
    ];
    lugPositions.forEach((pos) => {
      const lugGeo = new THREE.BoxGeometry(0.32, 0.85, 0.38);
      const lug = new THREE.Mesh(lugGeo, materialsMap.case);
      lug.position.set(pos.x, pos.y, pos.z);
      lug.rotation.z = pos.rotZ;
      watchGroup.add(lug);
    });

    // ---------------------------------------------------------
    // C. STEPPED BEZEL & KNURLED CROWN / PUSHERS
    // ---------------------------------------------------------
    // Outer Bezel Ring
    const bezelGeo = new THREE.TorusGeometry(2.08, 0.1, 16, 96);
    const bezelMesh = new THREE.Mesh(bezelGeo, materialsMap.case);
    bezelMesh.position.z = 0.23;
    watchGroup.add(bezelMesh);

    // Inner Chamfer Ring
    const innerBezelGeo = new THREE.TorusGeometry(1.96, 0.04, 16, 96);
    const innerBezelMesh = new THREE.Mesh(innerBezelGeo, materialsMap.goldAccent);
    innerBezelMesh.position.z = 0.25;
    watchGroup.add(innerBezelMesh);

    // Knurled Crown at 3 o'clock
    const crownGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.35, 24);
    const crownMesh = new THREE.Mesh(crownGeo, materialsMap.case);
    crownMesh.position.set(2.22, 0, 0);
    crownMesh.rotation.z = Math.PI / 2;
    watchGroup.add(crownMesh);

    // 2 Chronograph Pushers (2 o'clock and 4 o'clock)
    const pusherGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.32, 16);
    const pusher1 = new THREE.Mesh(pusherGeo, materialsMap.case);
    pusher1.position.set(1.98, 1.05, 0);
    pusher1.rotation.z = Math.PI / 3;
    watchGroup.add(pusher1);

    const pusher2 = new THREE.Mesh(pusherGeo, materialsMap.case);
    pusher2.position.set(1.98, -1.05, 0);
    pusher2.rotation.z = -Math.PI / 3;
    watchGroup.add(pusher2);

    // ---------------------------------------------------------
    // D. DIAL FACE & LUXURY CANVAS TEXTURE (HOROLOGIUM)
    // ---------------------------------------------------------
    const dialGeo = new THREE.CylinderGeometry(1.93, 1.93, 0.03, 64);
    const dialMesh = new THREE.Mesh(dialGeo, materialsMap.dial);
    dialMesh.rotation.x = Math.PI / 2;
    dialMesh.position.z = 0.22;
    watchGroup.add(dialMesh);

    // Dial Brand Text Canvas
    const brandCanvas = document.createElement("canvas");
    brandCanvas.width = 512;
    brandCanvas.height = 128;
    const brandCtx = brandCanvas.getContext("2d");
    brandCtx.clearRect(0, 0, 512, 128);
    brandCtx.fillStyle = "#f59e0b";
    brandCtx.font = "bold 34px Times New Roman, serif";
    brandCtx.textAlign = "center";
    brandCtx.textBaseline = "middle";
    brandCtx.fillText("HOROLOGIUM", 256, 45);
    brandCtx.fillStyle = "#94a3b8";
    brandCtx.font = "bold 16px sans-serif";
    brandCtx.fillText("AUTOMATIC CHRONOMETER", 256, 82);

    const brandTexture = new THREE.CanvasTexture(brandCanvas);
    const brandGeo = new THREE.PlaneGeometry(1.5, 0.38);
    const brandMat = new THREE.MeshBasicMaterial({ map: brandTexture, transparent: true });
    const brandMesh = new THREE.Mesh(brandGeo, brandMat);
    brandMesh.position.set(0, 0.95, 0.25);
    watchGroup.add(brandMesh);

    // ---------------------------------------------------------
    // E. 12 APPLIED HOUR MARKERS & MINUTE TICK RING
    // ---------------------------------------------------------
    const hourMarkerGeo = new THREE.BoxGeometry(0.08, 0.28, 0.05);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const marker = new THREE.Mesh(hourMarkerGeo, materialsMap.goldAccent);
      const radius = 1.62;
      marker.position.set(Math.sin(angle) * radius, Math.cos(angle) * radius, 0.25);
      marker.rotation.z = -angle;
      watchGroup.add(marker);
    }

    // Outer Gold Minute Track Ring
    const trackRingGeo = new THREE.TorusGeometry(1.78, 0.012, 16, 96);
    const trackRingMesh = new THREE.Mesh(trackRingGeo, materialsMap.goldAccent);
    trackRingMesh.position.z = 0.24;
    watchGroup.add(trackRingMesh);

    // ---------------------------------------------------------
    // F. 3 RECESSED SUBDIALS WITH GOLDEN BORDER RINGS
    // ---------------------------------------------------------
    const subdialPositions = [
      { id: "30min", x: 0.85, y: 0 },
      { id: "12hr", x: 0, y: -0.85 },
      { id: "sec", x: -0.85, y: 0 },
    ];
    const subdialHands = [];

    const subdialGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.02, 32);
    const subdialBorderGeo = new THREE.TorusGeometry(0.47, 0.02, 16, 48);
    const subdialHandGeo = new THREE.BoxGeometry(0.02, 0.36, 0.02);

    subdialPositions.forEach((pos) => {
      // Subdial Face Plate
      const subMesh = new THREE.Mesh(subdialGeo, materialsMap.subdial);
      subMesh.rotation.x = Math.PI / 2;
      subMesh.position.set(pos.x, pos.y, 0.24);
      watchGroup.add(subMesh);

      // Subdial Gold Border Ring
      const subBorder = new THREE.Mesh(subdialBorderGeo, materialsMap.subdialBorder);
      subBorder.position.set(pos.x, pos.y, 0.25);
      watchGroup.add(subBorder);

      // Subdial Needle Hand
      const hand = new THREE.Mesh(subdialHandGeo, materialsMap.goldAccent);
      hand.position.set(pos.x, pos.y, 0.27);
      watchGroup.add(hand);
      subdialHands.push(hand);
    });

    // ---------------------------------------------------------
    // G. LIVE DATE WINDOW APERTURE (4:30 Position)
    // ---------------------------------------------------------
    const dateCanvas = document.createElement("canvas");
    dateCanvas.width = 128;
    dateCanvas.height = 128;
    const dateCtx = dateCanvas.getContext("2d");

    const renderDateTexture = () => {
      dateCtx.fillStyle = "#ffffff";
      dateCtx.fillRect(0, 0, 128, 128);
      dateCtx.strokeStyle = "#b45309";
      dateCtx.lineWidth = 8;
      dateCtx.strokeRect(4, 4, 120, 120);

      const today = new Date().getDate();
      dateCtx.fillStyle = "#0f172a";
      dateCtx.font = "bold 68px sans-serif";
      dateCtx.textAlign = "center";
      dateCtx.textBaseline = "middle";
      dateCtx.fillText(String(today), 64, 68);
    };
    renderDateTexture();

    const dateTexture = new THREE.CanvasTexture(dateCanvas);
    const dateGeo = new THREE.PlaneGeometry(0.36, 0.32);
    const dateMat = new THREE.MeshBasicMaterial({ map: dateTexture });
    const dateMesh = new THREE.Mesh(dateGeo, dateMat);
    dateMesh.position.set(0.85, -0.85, 0.25);
    watchGroup.add(dateMesh);

    // ---------------------------------------------------------
    // H. SWORD HOUR & MINUTE HANDS + SWEEPING SECONDS
    // ---------------------------------------------------------
    // Center Cap Pin
    const capGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 24);
    const capMesh = new THREE.Mesh(capGeo, materialsMap.goldAccent);
    capMesh.rotation.x = Math.PI / 2;
    capMesh.position.z = 0.34;
    watchGroup.add(capMesh);

    // Hour Hand
    const hourHandGeo = new THREE.BoxGeometry(0.12, 1.05, 0.04);
    hourHandGeo.translate(0, 0.42, 0);
    const hourHand = new THREE.Mesh(hourHandGeo, materialsMap.goldAccent);
    hourHand.position.z = 0.29;
    watchGroup.add(hourHand);

    // Minute Hand
    const minHandGeo = new THREE.BoxGeometry(0.08, 1.48, 0.04);
    minHandGeo.translate(0, 0.62, 0);
    const minuteHand = new THREE.Mesh(minHandGeo, materialsMap.silverAccent);
    minuteHand.position.z = 0.32;
    watchGroup.add(minuteHand);

    // Sweeping Seconds Hand (Lollipop Counterweight)
    const secHandGeo = new THREE.BoxGeometry(0.03, 1.72, 0.02);
    secHandGeo.translate(0, 0.58, 0);
    const secondsHand = new THREE.Mesh(secHandGeo, materialsMap.goldAccent);
    secondsHand.position.z = 0.35;

    const dotGeo = new THREE.CircleGeometry(0.07, 16);
    const dotMesh = new THREE.Mesh(dotGeo, materialsMap.goldAccent);
    dotMesh.position.set(0, -0.25, 0);
    secondsHand.add(dotMesh);
    watchGroup.add(secondsHand);

    // ---------------------------------------------------------
    // I. DOMED HIGH-GLOSS SAPPHIRE CRYSTAL LENS
    // ---------------------------------------------------------
    const crystalGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.07, 64);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.05,
      transmission: 0.95,
      ior: 1.5,
      reflectivity: 0.9,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.rotation.x = Math.PI / 2;
    crystalMesh.position.z = 0.29;
    watchGroup.add(crystalMesh);

    // ---------------------------------------------------------
    // J. STRAPS GROUP (Top & Bottom Attachment)
    // ---------------------------------------------------------
    const strapsGroup = new THREE.Group();
    watchGroup.add(strapsGroup);

    const buildStraps = (strapItem, caseMatConfig) => {
      while (strapsGroup.children.length > 0) {
        strapsGroup.remove(strapsGroup.children[0]);
      }

      const strapMat = new THREE.MeshStandardMaterial({
        color: strapItem.color,
        metalness: strapItem.isMetal ? caseMatConfig.metalness : 0.1,
        roughness: strapItem.isMetal ? caseMatConfig.roughness : 0.65,
      });

      if (strapItem.isMetal) {
        // 3-Link Steel / Metallic Bracelet Links
        const numLinks = 9;
        for (let i = 0; i < numLinks; i++) {
          const yTop = 2.45 + i * 0.42;
          const linkGeo = new THREE.BoxGeometry(1.65, 0.38, 0.16);
          const topLink = new THREE.Mesh(linkGeo, strapMat);
          topLink.position.set(0, yTop, -0.05);
          strapsGroup.add(topLink);

          const yBot = -2.45 - i * 0.42;
          const botLink = new THREE.Mesh(linkGeo, strapMat);
          botLink.position.set(0, yBot, -0.05);
          strapsGroup.add(botLink);
        }
      } else {
        // Tapered Leather / Rubber / Fabric Strap
        const topStrapGeo = new THREE.BoxGeometry(1.65, 3.2, 0.16);
        topStrapGeo.translate(0, 3.8, -0.05);
        const topStrap = new THREE.Mesh(topStrapGeo, strapMat);
        strapsGroup.add(topStrap);

        const botStrapGeo = new THREE.BoxGeometry(1.65, 3.2, 0.16);
        botStrapGeo.translate(0, -3.8, -0.05);
        const botStrap = new THREE.Mesh(botStrapGeo, strapMat);
        strapsGroup.add(botStrap);
      }
    };
    buildStraps(selectedStrap, selectedCase);

    // Store references
    threeRef.current = {
      scene,
      camera,
      renderer,
      watchGroup,
      hourHand,
      minuteHand,
      secondsHand,
      subdialHands,
      strapsGroup,
      materialsMap,
    };

    // =========================================================
    // REAL-TIME HAND SWEEP & RENDER ANIMATION LOOP
    // =========================================================
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Real-time Local Time Sweeping
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

      // Auto-rotation when idle
      if (isAutoRotateRef.current && watchGroup && !isArActive) {
        watchGroup.rotation.y += 0.002;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // LIVE PBR MATERIAL PREVIEW SWAPPING EFFECTS
  // =========================================================
  useEffect(() => {
    const { materialsMap, strapsGroup } = threeRef.current;
    if (materialsMap.case) {
      materialsMap.case.color.setHex(selectedCase.color);
      materialsMap.case.metalness = selectedCase.metalness;
      materialsMap.case.roughness = selectedCase.roughness;
      materialsMap.case.needsUpdate = true;
    }
    if (selectedStrap.isMetal && strapsGroup) {
      const strapMat = new THREE.MeshStandardMaterial({
        color: selectedStrap.color,
        metalness: selectedCase.metalness,
        roughness: selectedCase.roughness,
      });
      strapsGroup.traverse((child) => {
        if (child.isMesh) child.material = strapMat;
      });
    }
  }, [selectedCase, selectedStrap]);

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
        metalness: selectedStrap.isMetal ? selectedCase.metalness : 0.1,
        roughness: selectedStrap.isMetal ? selectedCase.roughness : 0.65,
      });
      strapsGroup.traverse((child) => {
        if (child.isMesh) child.material = strapMat;
      });
    }
  }, [selectedStrap, selectedCase]);

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
        showToast("Webcam AR Mode Activated! Use sliders to align on your wrist.");
      } catch (err) {
        console.warn("Camera access denied or unavailable:", err);
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

    if (isArActive && webcamRef.current) {
      ctx.drawImage(webcamRef.current, 0, 0, exportCanvas.width, exportCanvas.height);
    } else {
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

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

        {/* Customizer Layout: Left 3D Viewport + Right Control Dock */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* 3D WATCH VIEWPORT CONTAINER (Columns 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              ref={viewportRef}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              className="relative w-full h-[480px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-transparent group cursor-grab active:cursor-grabbing transition-all flex items-center justify-center"
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
              <canvas ref={canvasRef} className="relative z-10 w-full h-full block bg-transparent" />

              {/* AR WRIST SLIDER CONTROL DOCK OVERLAY */}
              {isArActive && (
                <div className="absolute bottom-4 inset-x-4 z-30 bg-base-200/95 text-[var(--app-text-primary)] border border-[var(--app-text-secondary)]/20 p-4 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                      <FontAwesomeIcon icon={faCamera} />
                      WEBCAM AR WRIST CALIBRATION CONTROLS
                    </span>
                    <button
                      type="button"
                      onClick={toggleArMode}
                      className="text-xs text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-1">Scale: {arScale.toFixed(2)}x</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={arScale}
                        onChange={(e) => setArScale(parseFloat(e.target.value))}
                        className="w-full cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-1">Pos X: {arPosX.toFixed(1)}</label>
                      <input
                        type="range"
                        min="-4"
                        max="4"
                        step="0.1"
                        value={arPosX}
                        onChange={(e) => setArPosX(parseFloat(e.target.value))}
                        className="w-full cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-1">Pos Y: {arPosY.toFixed(1)}</label>
                      <input
                        type="range"
                        min="-4"
                        max="4"
                        step="0.1"
                        value={arPosY}
                        onChange={(e) => setArPosY(parseFloat(e.target.value))}
                        className="w-full cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-1">Tilt: {arTilt}°</label>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        step="1"
                        value={arTilt}
                        onChange={(e) => setArTilt(parseInt(e.target.value))}
                        className="w-full cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-1">Rotate Z: {arRotZ}°</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={arRotZ}
                        onChange={(e) => setArRotZ(parseInt(e.target.value))}
                        className="w-full cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* CUSTOMIZATION CONTROL DOCK (Columns 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Customization Category Tabs - 3 Buttons in 1 Row (3D Button Style) */}
            <div className="grid grid-cols-3 gap-2 border-b border-[var(--app-text-secondary)]/15 pb-4 w-full">
              {[
                { id: "case", label: "CASE MATERIAL" },
                { id: "dial", label: "DIAL FINISH" },
                { id: "strap", label: "STRAP STYLE" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "primary" : "secondary"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full !px-1 !py-2 sm:!py-2.5 !rounded-sm !text-[10px] sm:!text-xs font-extrabold uppercase tracking-wider text-center justify-center cursor-pointer ${
                      isActive ? "scale-102" : "opacity-90 hover:opacity-100"
                    }`}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </div>

            {/* TAB CONTENT PANEL CONTAINER WITH FIXED MIN-HEIGHT TO PREVENT LAYOUT SHIFTS */}
            <div className="min-h-[290px] sm:min-h-[310px] flex flex-col justify-start transition-all duration-300">
              {/* TAB 1: CASE MATERIAL VISUAL COLOR SWATCHES */}
              {activeTab === "case" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                      SELECT CASE COLOR & MATERIAL
                    </span>
                    <span className="text-xs font-black uppercase text-[var(--app-text-primary)]">
                      {selectedCase.name}
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
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer group ${
                            isSelected
                              ? "border-[var(--app-text-primary)] bg-[var(--app-text-primary)]/10 scale-105 shadow-md"
                              : "border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/40"
                          }`}
                        >
                          {/* Swatch Sphere */}
                          <div
                            className={`w-10 h-10 rounded-full mb-2 border border-white/30 shadow-md transition-transform group-hover:scale-110 ${
                              isSelected ? "ring-2 ring-[var(--app-text-primary)] ring-offset-2 ring-offset-[var(--app-background)]" : ""
                            }`}
                            style={{ background: mat.preview }}
                          />
                          <span className="text-[11px] font-extrabold uppercase tracking-tight text-center leading-tight text-[var(--app-text-primary)]">
                            {mat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: DIAL COLOR SWATCHES */}
              {activeTab === "dial" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                      SELECT DIAL COLOR & FINISH
                    </span>
                    <span className="text-xs font-black uppercase text-[var(--app-text-primary)]">
                      {selectedDial.name}
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
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer group ${
                            isSelected
                              ? "border-[var(--app-text-primary)] bg-[var(--app-text-primary)]/10 scale-105 shadow-md"
                              : "border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/40"
                          }`}
                        >
                          {/* Swatch Sphere */}
                          <div
                            className={`w-10 h-10 rounded-full mb-2 border border-white/30 shadow-md transition-transform group-hover:scale-110 ${
                              isSelected ? "ring-2 ring-[var(--app-text-primary)] ring-offset-2 ring-offset-[var(--app-background)]" : ""
                            }`}
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

              {/* TAB 3: STRAP COLOR SWATCHES */}
              {activeTab === "strap" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                      SELECT STRAP COLOR & MATERIAL
                    </span>
                    <span className="text-xs font-black uppercase text-[var(--app-text-primary)]">
                      {selectedStrap.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {STRAP_OPTIONS.map((strap) => {
                      const isSelected = selectedStrap.id === strap.id;
                      return (
                        <button
                          type="button"
                          key={strap.id}
                          onClick={() => setSelectedStrap(strap)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer group ${
                            isSelected
                              ? "border-[var(--app-text-primary)] bg-[var(--app-text-primary)]/10 scale-105 shadow-md"
                              : "border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/40"
                          }`}
                        >
                          {/* Swatch Box */}
                          <div
                            className={`w-10 h-10 rounded-full mb-2 border border-white/30 shadow-md transition-transform group-hover:scale-110 ${
                              isSelected ? "ring-2 ring-[var(--app-text-primary)] ring-offset-2 ring-offset-[var(--app-background)]" : ""
                            }`}
                            style={{ background: strap.preview }}
                          />
                          <span className="text-[11px] font-extrabold uppercase tracking-tight text-center leading-tight text-[var(--app-text-primary)]">
                            {strap.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ICON-ONLY ACTION TOOLBAR BELOW COLOR/MATERIAL SELECTION SECTION */}
            <div className="flex items-center justify-start gap-6 pt-3 border-t border-[var(--app-text-secondary)]/15 mt-2">
              {/* Pause / Auto-Spin Toggle Icon */}
              <button
                type="button"
                onClick={() => {
                  const nextState = !isAutoRotate;
                  setIsAutoRotate(nextState);
                  showToast(nextState ? "Auto-rotation active." : "Auto-rotation paused.");
                }}
                title={isAutoRotate ? "Pause Spin" : "Auto Spin"}
                className="p-1 text-xl text-[var(--app-text-primary)] transition-transform hover:scale-125 cursor-pointer bg-transparent border-0 outline-none shadow-none"
              >
                <FontAwesomeIcon icon={isAutoRotate ? faPause : faRotate} />
              </button>

              {/* AR Mode Toggle Icon */}
              <button
                type="button"
                onClick={toggleArMode}
                title={isArActive ? "Exit AR Mode" : "AR Wrist Mode"}
                className={`p-1 text-xl transition-transform hover:scale-125 cursor-pointer bg-transparent border-0 outline-none shadow-none ${
                  isArActive ? "text-cyan-400" : "text-[var(--app-text-primary)]"
                }`}
              >
                <FontAwesomeIcon icon={faCamera} />
              </button>

              {/* Save PNG Snapshot Icon */}
              <button
                type="button"
                onClick={captureSnapshot}
                title="Save PNG Snapshot"
                className="p-1 text-xl text-[var(--app-text-primary)] transition-transform hover:scale-125 cursor-pointer bg-transparent border-0 outline-none shadow-none"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Product360Hero;