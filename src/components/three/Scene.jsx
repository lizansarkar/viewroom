import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, ContactShadows, OrbitControls } from "@react-three/drei";

/**
 * Spatial Scene Canvas Content with Interactive Rotation, Floating Physics & Ground Shadow
 */
export default function Scene({ autoRotate = true, modelChildren }) {
  const meshRef = useRef();

  // Subtle floating idle rotation
  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2}
        maxDistance={7}
        maxPolarAngle={Math.PI / 2 + 0.1}
      />

      {modelChildren ? (
        <group ref={meshRef}>{modelChildren}</group>
      ) : (
        /* Default Elegant Spatial Sphere / Showcase Node if no external model passed */
        <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
          <group ref={meshRef}>
            {/* Outer Translucent Spatial Gyro Ring */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[1.3, 0.04, 24, 64]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.1}
                metalness={0.9}
                wireframe={false}
              />
            </mesh>

            {/* Inner Core Floating Node */}
            <mesh>
              <icosahedronGeometry args={[0.85, 2]} />
              <meshStandardMaterial
                color="#38bdf8"
                roughness={0.2}
                metalness={0.8}
                wireframe={false}
              />
            </mesh>
          </group>
        </Float>
      )}

      {/* Realistic Ground Contact Shadow */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.65}
        scale={6}
        blur={1.5}
        far={4}
      />
    </>
  );
}

