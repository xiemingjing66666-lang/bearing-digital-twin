// src/components/STLModel.tsx
import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';

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
}

const InnerSTLMesh: React.FC<STLModelProps & { url: string }> = ({
  url, transform, color = '#aaaaaa', transparent = false, opacity = 1.0
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useLoader(STLLoader, url);

  return (
    <mesh 
      ref={meshRef}
      geometry={geometry}
      position={transform.position}
      rotation={transform.rotation}
      castShadow
      receiveShadow
    >
      {/* ✅ 修复核心：
         1. key: 当 transparent 属性变化时，强制重新创建材质，解决“拖动无效”的问题。
         2. side: DoubleSide 让模型内部也可见，透明效果更好。
         3. depthWrite: 透明物体通常设为 false 以避免遮挡错误，但在简单场景 true 也可以。
            这里我们根据透明度动态调整。
      */}
      <meshStandardMaterial 
        key={transparent ? 'transparent' : 'opaque'} 
        color={color} 
        transparent={transparent} 
        opacity={opacity} 
        metalness={0.6} 
        roughness={0.4} 
        side={THREE.DoubleSide}
        depthWrite={!transparent} // 透明时关闭深度写入，防止画面闪烁
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