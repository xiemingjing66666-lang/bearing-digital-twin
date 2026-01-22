// src/services/types.ts

export interface BearingTelemetry {
  timestamp: number;
  scalars: {
    // ✅ 新增：必须显式声明 rpm 和 load，否则 MockDataService 会报错
    rpm: number;
    load: number;
    loadDirection: number;  // ✅ 新增：载荷方向 (角度 0-360)
    
    temperature: number;
    vibrationAmp: number;
    maxPressure: number;
    minFilmThickness: number;
  };
  fieldData: {
    pressureDistribution: number[];
    // ✅ 新增：物理场数组
    thicknessDistribution: number[];
    temperatureDistribution: number[];
  };
}