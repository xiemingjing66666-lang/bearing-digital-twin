// src/utils/colormap.ts
import * as THREE from 'three';

/**
 * 工业级 Jet 色谱映射 (参考 App.jsx)
 * 映射路径: 深蓝 -> 蓝 -> 青 -> 绿 -> 黄 -> 橙 -> 红 -> 深红
 * @param v 归一化数值 0.0 ~ 1.0
 */
export const getHeatmapColor = (v: number): THREE.Color => {
  // 确保数值在 0-1 之间
  let value = Math.max(0, Math.min(1, v));

  // Jet 色谱算法
  // 这种算法通过四个分段函数组合出丰富的过渡色
  const r = Math.min(Math.max(1.5 - Math.abs(value * 4 - 3), 0), 1);
  const g = Math.min(Math.max(1.5 - Math.abs(value * 4 - 2), 0), 1);
  const b = Math.min(Math.max(1.5 - Math.abs(value * 4 - 1), 0), 1);

  return new THREE.Color(r, g, b);
};