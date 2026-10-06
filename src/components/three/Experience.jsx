import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Camera from "./Camera";
import Lights from "./Lights";
import Scene from "./Scene";

/**
 * Three.js Spatial Experience 3D Canvas
 * Production-ready R3F wrapper with fallback loader and responsive camera.
 */
export default function Experience({
  className = "w-full h-full min-h-[350px]",
  autoRotate = true,
  children,
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Canvas shadows dpr={[1, 2]}>
        <Camera position={[0, 1.2, 3.8]} fov={45} />
        <Lights />
        <Suspense fallback={null}>
          <Scene autoRotate={autoRotate} modelChildren={children} />
        </Suspense>
      </Canvas>
    </div>
  );
}
