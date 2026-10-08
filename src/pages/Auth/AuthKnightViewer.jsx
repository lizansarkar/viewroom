import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function AuthKnightViewer() {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 650;

    // 1. Scene with completely transparent background
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);

    // 3. Renderer with transparent background & zero borders
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting (Bright, crisp visibility in all themes)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 2.0);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x93c5fd, 1.8);
    backLight.position.set(0, 4, -4);
    scene.add(backLight);

    // 5. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 6. Load Knight.glb
    let mixer = null;
    let isDisposed = false;
    const loader = new GLTFLoader();

    loader.load(
      "/models/Knight.glb",
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;

        // Traverse first to remove Katana/Sword and re-color green parts to black
        root.traverse((node) => {
          // 1. Remove Katana/Sword completely
          if (
            node.name &&
            (node.name.toLowerCase().includes("sword") ||
              node.name.toLowerCase().includes("katana") ||
              node.name.toLowerCase().includes("armature.002"))
          ) {
            node.visible = false;
          }

          // 2. Tint green color to sleek matte black
          if (node.isMesh) {
            node.castShadow = true;
            const materials = Array.isArray(node.material)
              ? node.material
              : [node.material];

            materials.forEach((mat) => {
              if (!mat) return;
              const c = mat.color;
              if (
                mat.name === "2" ||
                (c && c.g > 0.15 && c.g > c.r * 1.3 && c.g > c.b * 1.3)
              ) {
                mat.color.setHex(0x18191c); // Sleek matte black
                mat.roughness = 0.55;
                mat.metalness = 0.25;
              } else {
                mat.roughness = Math.min(mat.roughness || 0.4, 0.5);
              }
            });
          }
        });

        // Safe auto-scale & center
        const box = new THREE.Box3().setFromObject(root);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        const targetHeight = 3.2;
        const scale = (!isNaN(maxDim) && maxDim > 0) ? (targetHeight / maxDim) : 0.23;
        root.scale.setScalar(scale);

        if (!isNaN(center.x) && !isNaN(box.min.y)) {
          root.position.x = -center.x * scale;
          root.position.y = -box.min.y * scale - 1.5;
          root.position.z = -center.z * scale;
        } else {
          root.position.set(0, -1.5, 0);
        }

        modelGroup.add(root);

        // Play guard animation if present in GLB
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(root);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Failed to load Knight.glb:", err);
        setLoading(false);
      }
    );

    // 7. User Interaction (Drag to Rotate)
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;
    const clock = new THREE.Clock();

    const onPointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      targetRotationY += deltaX * 0.008;
      prevMouseX = e.clientX;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 9. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      // Auto gentle rotation when idle
      if (!isDragging) {
        targetRotationY += 0.003;
      }

      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      modelGroup.rotation.y = currentRotationY;

      renderer.render(scene, camera);
    };
    animate();

    // 10. Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center select-none bg-transparent cursor-grab active:cursor-grabbing">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full min-h-[500px] bg-transparent" />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-transparent">
          <div className="loading loading-spinner loading-md text-base-content/50" />
        </div>
      )}
    </div>
  );
}

export default AuthKnightViewer;
