import { Vector3 } from 'three';

export type SphericalCoords = {
  yaw: number;
  pitch: number;
};

export function sphericalToDir(yawDeg: number, pitchDeg: number) {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const cosPitch = Math.cos(pitch);
  return {
    x: cosPitch * Math.sin(yaw),
    y: Math.sin(pitch),
    z: cosPitch * Math.cos(yaw),
  };
}

export function positionToSpherical(position: { x: number; y: number; z: number }): SphericalCoords {
  const len = Math.hypot(position.x, position.y, position.z) || 1;
  const nx = position.x / len;
  const ny = position.y / len;
  const nz = position.z / len;
  return {
    yaw: (Math.atan2(nx, nz) * 180) / Math.PI,
    pitch: (Math.asin(Math.max(-1, Math.min(1, ny))) * 180) / Math.PI,
  };
}
