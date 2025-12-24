// src/services/types.ts

export interface BearingTelemetry {
  timestamp: number;
  scalars: {
    // ✅ 新增：必须显式声明 rpm 和 load，否则 MockDataService 会报错
    rpm: number;
    load: number;
    
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