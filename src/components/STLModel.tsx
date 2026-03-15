import React, { useEffect, useMemo, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { getHeatmapColor } from '../utils/colormap';
import type { ModelTransform } from '../types/app';

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
  url,
  transform,
  color = '#aaaaaa',
  transparent = false,
  opacity = 1,
  fieldData,
  dataRange = [0, 10],
  heatmapAxis = 'z',
  heatmapOffset = 0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const loadedGeometry = useLoader(STLLoader, url);

  const geometry = useMemo(() => loadedGeometry.clone(), [loadedGeometry]);

  useEffect(() => {
    if (!geometry || !fieldData || fieldData.length === 0) return;

    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return;

    const center = new THREE.Vector3();
    box.getCenter(center);

    const sizeX = box.max.x - box.min.x;
    const sizeY = box.max.y - box.min.y;
    const sizeZ = box.max.z - box.min.z;

    const positionAttribute = geometry.getAttribute('position');
    const colors: number[] = [];
    const [minVal, maxVal] = dataRange;
    const range = maxVal - minVal || 1;
    const offsetRad = (heatmapOffset * Math.PI) / 180;

    for (let i = 0; i < positionAttribute.count; i += 1) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      const lx = x - center.x;
      const ly = y - center.y;
      const lz = z - center.z;

      let angle = 0;
      let axialDistNormalized = 0;

      if (heatmapAxis === 'z') {
        angle = Math.atan2(ly, lx);
        axialDistNormalized = Math.abs(lz) / (sizeZ / 2);
      } else if (heatmapAxis === 'y') {
        angle = Math.atan2(lz, lx);
        axialDistNormalized = Math.abs(ly) / (sizeY / 2);
      } else {
        angle = Math.atan2(lz, ly);
        axialDistNormalized = Math.abs(lx) / (sizeX / 2);
      }

      angle += offsetRad;
      angle %= Math.PI * 2;
      if (angle < 0) angle += Math.PI * 2;

      const totalPoints = fieldData.length;
      let index = Math.floor((angle / (Math.PI * 2)) * totalPoints);
      index = Math.max(0, Math.min(totalPoints - 1, index));
      const baseValue = fieldData[index];

      const axialFactor = 1 - Math.pow(Math.min(axialDistNormalized, 1), 4);
      const finalValue = baseValue * axialFactor;
      const normalized = (finalValue - minVal) / range;

      const mapped = getHeatmapColor(normalized);
      colors.push(mapped.r, mapped.g, mapped.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }, [dataRange, fieldData, geometry, heatmapAxis, heatmapOffset]);

  const useVertexColors = Boolean(fieldData && fieldData.length > 0);

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
