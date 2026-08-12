import * as THREE from 'three';

// Radius at which hotspot markers are anchored just inside the 360 sphere.
export const HOTSPOT_SPHERE_RADIUS = 499;

// Normalize an arbitrary {x, y, z} vector to a unit direction.
export function normalizeDir({ x = 0, y = 0, z = 0 } = {}) {
  const len = Math.hypot(x, y, z) || 1;
  return { x: x / len, y: y / len, z: z / len };
}

// Convert a human-readable azimuth/elevation (degrees) into a unit direction.
export function sphericalToDir(yawDeg, pitchDeg = 0) {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const r = Math.cos(pitch);
  return { x: r * Math.sin(yaw), y: Math.sin(pitch), z: r * Math.cos(yaw) };
}

// Convert a stored direction into display yaw/pitch (degrees). Read-only helper.
export function dirToSpherical({ x = 0, y = 0, z = 0 } = {}) {
  const n = normalizeDir({ x, y, z });
  return {
    yaw: (Math.atan2(n.x, n.z) * 180) / Math.PI,
    pitch: (Math.asin(Math.max(-1, Math.min(1, n.y))) * 180) / Math.PI,
  };
}

// Convert a stored direction into a THREE.Vector3 anchored on the panorama sphere.
export function dirToPosition(dir, radius = HOTSPOT_SPHERE_RADIUS) {
  const n = normalizeDir(dir);
  return new THREE.Vector3(n.x, n.y, n.z).multiplyScalar(radius);
}
