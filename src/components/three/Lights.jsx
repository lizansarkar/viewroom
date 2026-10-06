import React from "react";

/**
 * Spatial Lighting Rig for 3D GLTF / GLB Product Models
 * Provides luxury studio illumination with ambient, directional key, and rim lights.
 */
export default function Lights() {
  return (
    <>
      {/* Soft Ambient Fill */}
      <ambientLight intensity={0.7} />

      {/* Main Directional Key Light with Crisp Highlights */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Cool Tint Rim Light for Silhouette Definition */}
      <directionalLight
        position={[-5, 4, -5]}
        intensity={0.5}
        color="#38bdf8"
      />

      {/* Subtle Warm Bounce Light from Floor */}
      <directionalLight
        position={[0, -4, 2]}
        intensity={0.25}
        color="#fbbf24"
      />
    </>
  );
}

