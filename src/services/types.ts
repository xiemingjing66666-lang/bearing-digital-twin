// src/services/types.ts

// 必须要有 export
export interface SimulationParams {
  rpm: number;
  load: number;
  eccentricity: number;
}

// ⚠️ 检查这里：必须要有 export
export interface BearingTelemetry {
  timestamp: number;
  scalars: {
    maxPressure: number;
    minFilmThickness: number;
    temperature: number;
    vibrationAmp: number;
  };
  fieldData: {
    pressureDistribution: number[];
  };
}