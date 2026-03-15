import * as THREE from 'three';

export const getHeatmapColor = (v: number): THREE.Color => {
  const value = Math.max(0, Math.min(1, v));

  const r = Math.min(Math.max(1.5 - Math.abs(value * 4 - 3), 0), 1);
  const g = Math.min(Math.max(1.5 - Math.abs(value * 4 - 2), 0), 1);
  const b = Math.min(Math.max(1.5 - Math.abs(value * 4 - 1), 0), 1);

  return new THREE.Color(r, g, b);
};
