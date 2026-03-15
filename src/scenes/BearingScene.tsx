import React from 'react';
import { Canvas } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import { STLModel } from '../components/STLModel';
import type { BearingTelemetry } from '../services/types';
import type { AppConfig, ViewMode } from '../types/app';

interface SceneProps {
  config: AppConfig;
  viewMode: ViewMode;
  telemetry: BearingTelemetry | null;
}

export const BearingScene: React.FC<SceneProps> = ({ config, viewMode, telemetry }) => {
  let activeFieldData: number[] = [];
  let activeRange: [number, number] = [0, 1];

  if (telemetry) {
    if (viewMode === 'pressure') {
      activeFieldData = telemetry.fieldData.pressureDistribution;
      activeRange = [0, Math.max(5, telemetry.scalars.maxPressure * 1.2)];
    } else if (viewMode === 'thickness') {
      activeFieldData = telemetry.fieldData.thicknessDistribution;
      activeRange = [0, 100];
    } else {
      activeFieldData = telemetry.fieldData.temperatureDistribution;
      activeRange = [40, 120];
    }
  }

  return (
    <Canvas shadows camera={{ position: [200, 200, 200], fov: 45, near: 1, far: 1e8 }}>
      <color attach="background" args={['#081426']} />

      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[100, 100, 50]} intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-100, 50, -100]} intensity={0.8} color="#b0d0ff" />
      <directionalLight position={[0, -50, -50]} intensity={0.5} color="#ffecd0" />

      {config.station.map((part) => (
        <STLModel
          key={part.id}
          url={part.url}
          transform={part.transform}
          color={part.material.color}
          transparent={part.material.opacity < 1}
          opacity={part.material.opacity}
        />
      ))}

      <STLModel
        url={config.bearing.url}
        transform={config.bearing.transform}
        color={config.bearing.material.color}
        transparent={config.bearing.material.opacity < 1}
        opacity={config.bearing.material.opacity}
        fieldData={activeFieldData}
        dataRange={activeRange}
        heatmapAxis={config.bearing.heatmapAxis}
        heatmapOffset={config.bearing.heatmapOffset}
      />

      <STLModel
        url={config.shaft.url}
        transform={config.shaft.transform}
        color={config.shaft.material.color}
        transparent={config.shaft.material.opacity < 1}
        opacity={config.shaft.material.opacity}
      />

      <OrbitControls makeDefault maxDistance={50000} />
      <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
        <GizmoViewport axisColors={['#ff3653', '#0adb50', '#2c8fdf']} labelColor="black" />
      </GizmoHelper>
    </Canvas>
  );
};
