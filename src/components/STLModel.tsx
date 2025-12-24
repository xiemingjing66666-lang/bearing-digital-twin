// src/components/STLModel.tsx
import React, { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';
import { getHeatmapColor } from '../utils/colormap';

export interface ModelTransform {
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface STLModelProps {
  url: string | null;
  transform: ModelTransform;
  color?: string;
  transparent?: boolean;
  opacity?: number;
  fieldData?: number[]; 
  dataRange?: [number, number];
  heatmapAxis?: 'x' | 'y' | 'z';
  heatmapOffset?: number; 
}

const InnerSTLMesh: React.FC<STLModelProps & { url: string }> = ({
  url, transform, color = '#aaaaaa', transparent = false, opacity = 1.0,
  fieldData, dataRange = [0, 10], heatmapAxis = 'z', heatmapOffset = 0
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useLoader(STLLoader, url);

  useEffect(() => {
    if (!geometry || !fieldData || fieldData.length === 0) return;

    // 1. 计算包围盒与中心
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // 计算各轴向的长度 (用于归一化轴向距离)
    const sizeX = box.max.x - box.min.x;
    const sizeY = box.max.y - box.min.y;
    const sizeZ = box.max.z - box.min.z;

    const positionAttribute = geometry.getAttribute('position');
    const count = positionAttribute.count;
    const colors: number[] = [];
    const [minVal, maxVal] = dataRange;
    const range = maxVal - minVal || 1; 

    // 角度偏移转弧度
    const offsetRad = (heatmapOffset * Math.PI) / 180;

    for (let i = 0; i < count; i++) {
      // 获取原始坐标
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      // 计算相对于中心的局部坐标
      const lx = x - center.x;
      const ly = y - center.y;
      const lz = z - center.z;

      let angle = 0;
      let axialDistNormalized = 0; // 归一化的轴向距离 (0=中心, 1=边缘)

      // 根据选择的轴向，计算角度和轴向距离
      if (heatmapAxis === 'z') {
        angle = Math.atan2(ly, lx);
        // 沿 Z 轴的距离 / 半个 Z 轴长度
        axialDistNormalized = Math.abs(lz) / (sizeZ / 2);
      } else if (heatmapAxis === 'y') {
        angle = Math.atan2(lz, lx);
        axialDistNormalized = Math.abs(ly) / (sizeY / 2);
      } else {
        // x
        angle = Math.atan2(lz, ly);
        axialDistNormalized = Math.abs(lx) / (sizeX / 2);
      }
      
      // 应用相位偏移
      angle += offsetRad;

      // 归一化角度
      angle = angle % (Math.PI * 2);
      if (angle < 0) angle += Math.PI * 2;
      
      // 1. 获取基础压力值 (来自圆周分布数据)
      const totalPoints = fieldData.length;
      let index = Math.floor((angle / (Math.PI * 2)) * totalPoints);
      index = Math.max(0, Math.min(totalPoints - 1, index));
      let baseValue = fieldData[index];

      // 2. 计算轴向衰减系数 (Axial Profile)
      // 使用 1 - x^4 的曲线，模拟两端压力泄露归零的效果
      // Math.min(axialDistNormalized, 1) 防止超出边界
      const axialFactor = 1 - Math.pow(Math.min(axialDistNormalized, 1), 4);

      // 3. 最终值 = 基础值 * 衰减系数
      const finalValue = baseValue * axialFactor;

      // 4. 颜色映射
      const normalized = (finalValue - minVal) / range;
      const c = getHeatmapColor(normalized);
      colors.push(c.r, c.g, c.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.attributes.color.needsUpdate = true;

  }, [geometry, fieldData, dataRange, heatmapAxis, heatmapOffset]);

  const useVertexColors = fieldData && fieldData.length > 0;

  return (
    <mesh 
      ref={meshRef}
      geometry={geometry}
      position={transform.position}
      rotation={transform.rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial 
        key={useVertexColors ? `field-${heatmapAxis}` : 'basic'} 
        color={useVertexColors ? '#ffffff' : color} 
        vertexColors={useVertexColors}
        transparent={transparent} 
        opacity={opacity} 
        // 增加粗糙度，让颜色看起来更像工程塑料/金属，减少反光干扰
        metalness={0.3} 
        roughness={0.7} 
        side={THREE.DoubleSide}
        depthWrite={!transparent}
      />
    </mesh>
  );
};

export const STLModel: React.FC<STLModelProps> = (props) => {
  if (!props.url) return null;
  return (
    <React.Suspense fallback={null}>
      <InnerSTLMesh {...props} url={props.url} />
    </React.Suspense>
  );
};