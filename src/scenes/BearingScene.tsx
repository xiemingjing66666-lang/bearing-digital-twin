// src/scenes/BearingScene.tsx
import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { STLModel } from '../components/STLModel';
import { mockService } from '../services/MockDataService';
import type { AppConfig } from '../components/SettingsPanel';
import type { ViewMode } from '../components/DebugPanel';
import type { BearingTelemetry } from '../services/types';

interface SceneProps {
  config: AppConfig;
  viewMode: ViewMode; // 新增 prop
}

export const BearingScene: React.FC<SceneProps> = ({ config, viewMode }) => {
  const [telemetry, setTelemetry] = useState<BearingTelemetry | null>(null);

  useEffect(() => {
    const unsub = mockService.subscribe(setTelemetry);
    return unsub;
  }, []);

  // 根据当前模式，提取对应的数据和显示范围
  let activeFieldData: number[] = [];
  let activeRange: [number, number] = [0, 1];

  if (telemetry) {
    if (viewMode === 'pressure') {
      activeFieldData = telemetry.fieldData.pressureDistribution;
      // 压力范围动态上限，下限0
      activeRange = [0, Math.max(5, telemetry.scalars.maxPressure * 1.2)];
    } else if (viewMode === 'thickness') {
      activeFieldData = telemetry.fieldData.thicknessDistribution;
      // 厚度范围：0 ~ 100微米 (注意 MockDataService 里转成了微米)
      activeRange = [0, 100]; 
    } else if (viewMode === 'temperature') {
      activeFieldData = telemetry.fieldData.temperatureDistribution;
      // 温度范围：40 ~ 120度
      activeRange = [40, 120];
    }
  }

  return (
    <Canvas 
      shadows 
      camera={{ position: [200, 200, 200], fov: 45, near: 1, far: 1e8 }}
    >
      <color attach="background" args={['#111']} />
      
      {/* 灯光系统 */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[100, 100, 50]} intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-100, 50, -100]} intensity={0.8} color="#b0d0ff" />
      <directionalLight position={[0, -50, -50]} intensity={0.5} color="#ffecd0" />

      {/* 基座 */}
      {config.station.map((part) => (
        <STLModel 
          key={part.id} 
          url={part.url} 
          transform={part.transform}
          color={part.material.color}
          transparent={part.material.opacity < 1.0}
          opacity={part.material.opacity}
        />
      ))}
      
      {/* 轴承 (渲染当前选中的物理场) */}
      <STLModel 
        url={config.bearing.url} 
        transform={config.bearing.transform}
        color={config.bearing.material.color}
        transparent={config.bearing.material.opacity < 1.0}
        opacity={config.bearing.material.opacity}
        
        // 动态数据注入
        fieldData={activeFieldData}
        dataRange={activeRange}
        heatmapAxis={config.bearing.heatmapAxis}
        heatmapOffset={config.bearing.heatmapOffset}
      />

      {/* 主轴 */}
      <STLModel 
        url={config.shaft.url} 
        transform={config.shaft.transform}
        color={config.shaft.material.color}
        transparent={config.shaft.material.opacity < 1.0}
        opacity={config.shaft.material.opacity}
      />

      <OrbitControls makeDefault maxDistance={50000} />
      <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
        <GizmoViewport axisColors={['#ff3653', '#0adb50', '#2c8fdf']} labelColor="black" />
      </GizmoHelper>
    </Canvas>
  );
};