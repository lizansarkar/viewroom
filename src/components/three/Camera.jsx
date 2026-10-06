import React from "react";
import { PerspectiveCamera } from "@react-three/drei";

/**
 * Spatial Camera Configuration for 3D Product & Room Previews
 */
export default function Camera({ fov = 45, position = [0, 1.5, 4] }) {
  return (
    <PerspectiveCamera
      makeDefault
      fov={fov}
      position={position}
      near={0.1}
      far={100}
    />
  );
}

