import React, { useEffect, useState } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Fallback Canvas Texture generator in case an image asset fails to load
function createCanvasPanoramaTexture(sceneName = 'Living Room') {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background Gradient (Ceiling to Floor)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.45, '#1e293b');
  bgGrad.addColorStop(0.5, '#334155');
  bgGrad.addColorStop(0.55, '#451a03');
  bgGrad.addColorStop(1, '#1c1917');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Grid / Horizon Line
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(0, 512);
  ctx.lineTo(2048, 512);
  ctx.stroke();

  // North Wall (Window View)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.fillRect(100, 200, 312, 300);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(100, 200, 312, 300);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NORTH VIEW - GARDEN', 256, 350);

  // East Wall (Lounge Area)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(600, 400, 320, 120);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`EAST WALL - ${sceneName.toUpperCase()}`, 760, 460);

  // South Wall (Fireplace)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(1150, 420, 230, 90);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('SOUTH WALL - FIREPLACE', 1265, 475);

  // West Wall (Kitchen / Dining)
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(1600, 380, 380, 130);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('WEST WALL - DINING AREA', 1790, 450);

  // Cardinal Markers
  const drawMarker = (x, text, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, 80, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, 80);
  };

  drawMarker(256, 'N', '#10b981');
  drawMarker(760, 'E', '#3b82f6');
  drawMarker(1265, 'S', '#f59e0b');
  drawMarker(1790, 'W', '#14b8a6');

  // Title Watermark
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VIEWROOM 360° EQUIRECTANGULAR SPATIAL TOUR', 1024, 960);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function PanoramaScene({ panoramaUrl, sceneName, onError }) {
  const { camera } = useThree();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    // Reset camera position inside sphere
    camera.position.set(0, 0, 0.1);
    camera.fov = 75;
    camera.updateProjectionMatrix();
  }, [camera, panoramaUrl]);

  useEffect(() => {
    if (!panoramaUrl) {
      setTexture(createCanvasPanoramaTexture(sceneName));
      return;
    }

    const loader = new THREE.TextureLoader();
    let isCancelled = false;

    loader.load(
      panoramaUrl,
      (loadedTexture) => {
        if (isCancelled) return;
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        if (isCancelled) return;
        console.warn('Failed to load image texture, falling back to procedural 360 panorama:', error);
        setTexture(createCanvasPanoramaTexture(sceneName));
        if (onError) onError(error);
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [panoramaUrl, sceneName, onError]);

  if (!texture) return null;

  return (
    <>
      {/* 360 Sphere Mesh rendered from the inside out */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbit Controls tuned for natural touch & mouse rotation */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={-0.45}
        zoomSpeed={0.8}
        minDistance={1}
        maxDistance={200}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
        reverseOrbit={false}
      />
    </>
  );
}
