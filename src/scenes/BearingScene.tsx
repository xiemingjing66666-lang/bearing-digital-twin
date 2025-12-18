// src/scenes/BearingScene.tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { STLModel } from '../components/STLModel';
import type { AppConfig } from '../components/SettingsPanel';

interface SceneProps {
  config: AppConfig;
}

export const BearingScene: React.FC<SceneProps> = ({ config }) => {
  return (
    <Canvas 
      shadows 
      camera={{ position: [200, 200, 200], fov: 45, near: 1, far: 1e8 }}
    >
      <color attach="background" args={['#111']} />
      
      {/* === 模型部分：现在使用动态材质参数 === */}
      
      {/* 1. 基座 */}
      <STLModel 
        url={config.station.url} 
        transform={config.station.transform}
        // 使用配置中的颜色
        color={config.station.material.color}
        // 如果透明度小于1，自动开启透明模式
        transparent={config.station.material.opacity < 1.0}
        opacity={config.station.material.opacity}
      />
      
      {/* 2. 轴承 */}
      <STLModel 
        url={config.bearing.url} 
        transform={config.bearing.transform}
        color={config.bearing.material.color}
        transparent={config.bearing.material.opacity < 1.0}
        opacity={config.bearing.material.opacity}
      />

      {/* 3. 主轴 */}
      <STLModel 
        url={config.shaft.url} 
        transform={config.shaft.transform}
        color={config.shaft.material.color}
        transparent={config.shaft.material.opacity < 1.0}
        opacity={config.shaft.material.opacity}
      />

      {/* === 环境部分 === */}
      <OrbitControls makeDefault maxDistance={50000} />
      <Environment preset="city" />
      <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
        <GizmoViewport axisColors={['#ff3653', '#0adb50', '#2c8fdf']} labelColor="black" />
      </GizmoHelper>
    </Canvas>
  );
};