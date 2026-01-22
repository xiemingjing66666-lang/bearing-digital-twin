// src/services/MockDataService.ts
import type { BearingTelemetry } from './types'; // ✅ 必须使用 type 导入

interface SimulationParams {
  rpm: number;
  load: number;
  loadDirection: number;
}

class MockDataService {
  private timer: number | null = null;
  private subscribers: ((data: BearingTelemetry) => void)[] = [];
  
  private params: SimulationParams = {
    rpm: 0,
    load: 0,
    loadDirection: 0
  };

  private readonly FIELD_RESOLUTION = 360; 
  private readonly NOMINAL_CLEARANCE = 0.05; 

  public start() {
    if (this.timer) return;
    const loop = () => {
      this.update();
      this.timer = requestAnimationFrame(loop);
    };
    this.timer = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
  }

  public updateParams(newParams: Partial<SimulationParams>) {
    this.params = { ...this.params, ...newParams };
  }

  public subscribe(callback: (data: BearingTelemetry) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private update() {
    const { rpm, load, loadDirection } = this.params;
    const normRPM = rpm / 10000;
    const normLoad = load / 50000;
    const loadRad = (loadDirection * Math.PI) / 180;

    const maxPressure = 0.5 + (15 * normLoad) + (5 * normRPM); 
    const minFilmThickness = Math.max(5, (this.NOMINAL_CLEARANCE * 1000) * (1 - (0.9 * normLoad)));
    const temperature = 25 + (80 * normRPM) + (30 * normLoad);
    const vibrationAmp = (10 * normRPM) + (Math.random() * 2);

    const pressureArray: number[] = [];
    const thicknessArray: number[] = [];
    const temperatureArray: number[] = [];

    const eccentricity = Math.min(0.95, Math.max(0.1, 0.2 + 0.8 * normLoad - 0.3 * normRPM));
    // attitudeAngle 决定了最小膜厚的位置
    const attitudeAngle = 3.0 + normRPM * 0.5 + loadRad; 
    // pressurePhase 决定了最大压力的位置
    const pressurePhase = Math.PI + (normRPM * 0.5) + loadRad; 
    // 温度场通常稍微滞后于压力场，但也随载荷旋转
    const tempPhase = 2.0 + loadRad;

    for (let i = 0; i < this.FIELD_RESOLUTION; i++) {
      const theta = (i / this.FIELD_RESOLUTION) * Math.PI * 2;
      
      // 压力场
      let pVal = Math.sin(theta + pressurePhase);
      pVal = Math.max(0, pVal);
      pressureArray.push(pVal * maxPressure);

      // 厚度场
      const hVal = this.NOMINAL_CLEARANCE * (1 + eccentricity * Math.cos(theta - attitudeAngle));
      thicknessArray.push(hVal * 1000); 

      // 温度场
      const tempFactor = 0.5 * (1 - Math.cos(theta - 2)); 
      const tVal = 40 + tempFactor * (temperature - 40);
      temperatureArray.push(tVal);
    }

    const telemetryData: BearingTelemetry = {
      timestamp: Date.now(),
      scalars: { 
        rpm,   // ✅ 现在 types.ts 里有这个字段了，不会报错
        load,  // ✅ 同上
        loadDirection,
        temperature, 
        vibrationAmp, 
        maxPressure, 
        minFilmThickness 
      },
      fieldData: {
        pressureDistribution: pressureArray,
        thicknessDistribution: thicknessArray,
        temperatureDistribution: temperatureArray
      }
    };

    this.subscribers.forEach(cb => cb(telemetryData));
  }
}

export const mockService = new MockDataService();