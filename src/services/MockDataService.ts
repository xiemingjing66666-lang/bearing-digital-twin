import type { SimulationParams, TelemetryProvider } from './telemetryContract';
import type { BearingTelemetry } from './types';

export class MockDataService implements TelemetryProvider {
  private timer: number | null = null;

  private subscribers: ((data: BearingTelemetry) => void)[] = [];

  private params: SimulationParams = {
    rpm: 3000,
    load: 10000,
    loadDirection: 0,
  };

  private readonly fieldResolution = 360;

  private readonly nominalClearance = 0.05;

  private readonly scalarJitter = {
    pressure: 0.03,
    thickness: 0.02,
    temperature: 0.015,
  };

  private readonly fieldJitter = {
    pressure: 0.01,
    thickness: 0.008,
    temperature: 0.006,
  };

  private readonly smoothAlpha = 0.2;

  private smoothedScalars = {
    maxPressure: 0,
    minFilmThickness: 0,
    temperature: 0,
  };

  public start() {
    if (this.timer) return;

    const loop = () => {
      this.update();
      this.timer = requestAnimationFrame(loop);
    };

    this.timer = requestAnimationFrame(loop);
  }

  public stop() {
    if (!this.timer) return;

    cancelAnimationFrame(this.timer);
    this.timer = null;
  }

  public updateParams(newParams: Partial<SimulationParams>) {
    this.params = { ...this.params, ...newParams };
  }

  public subscribe(callback: (data: BearingTelemetry) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private withJitter(base: number, ratio: number) {
    return base + base * ratio * (2 * Math.random() - 1);
  }

  private smooth(prev: number, next: number) {
    if (prev === 0) return next;
    return prev + this.smoothAlpha * (next - prev);
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  private update() {
    const { rpm, load, loadDirection } = this.params;
    const normRPM = rpm / 10000;
    const normLoad = load / 50000;
    const loadRad = (loadDirection * Math.PI) / 180;

    const baseMaxPressure = 0.5 + 15 * normLoad + 5 * normRPM;
    const baseMinFilmThickness = Math.max(5, this.nominalClearance * 1000 * (1 - 0.9 * normLoad));
    const baseTemperature = 25 + 80 * normRPM + 30 * normLoad;

    const jitteredPressure = this.withJitter(baseMaxPressure, this.scalarJitter.pressure);
    const jitteredThickness = this.withJitter(baseMinFilmThickness, this.scalarJitter.thickness);
    const jitteredTemperature = this.withJitter(baseTemperature, this.scalarJitter.temperature);

    const maxPressure = this.clamp(this.smooth(this.smoothedScalars.maxPressure, jitteredPressure), 0, 100);
    const minFilmThickness = this.clamp(this.smooth(this.smoothedScalars.minFilmThickness, jitteredThickness), 3, 200);
    const temperature = this.clamp(this.smooth(this.smoothedScalars.temperature, jitteredTemperature), 20, 160);

    this.smoothedScalars = {
      maxPressure,
      minFilmThickness,
      temperature,
    };

    const vibrationAmp = 10 * normRPM + Math.random() * 2;

    const pressureArray: number[] = [];
    const thicknessArray: number[] = [];
    const temperatureArray: number[] = [];

    const eccentricity = Math.min(0.95, Math.max(0.1, 0.2 + 0.8 * normLoad - 0.3 * normRPM));
    const attitudeAngle = 3.0 + normRPM * 0.5 + loadRad;
    const pressurePhase = Math.PI + normRPM * 0.5 + loadRad;

    for (let i = 0; i < this.fieldResolution; i += 1) {
      const theta = (i / this.fieldResolution) * Math.PI * 2;

      let pressure = Math.sin(theta + pressurePhase);
      pressure = Math.max(0, pressure);
      const pressureWithJitter = this.withJitter(pressure * maxPressure, this.fieldJitter.pressure);
      pressureArray.push(this.clamp(pressureWithJitter, 0, 100));

      const thickness = this.nominalClearance * (1 + eccentricity * Math.cos(theta - attitudeAngle));
      const thicknessWithJitter = this.withJitter(thickness * 1000, this.fieldJitter.thickness);
      thicknessArray.push(this.clamp(thicknessWithJitter, 3, 200));

      const tempFactor = 0.5 * (1 - Math.cos(theta - 2));
      const tempValue = 40 + tempFactor * (temperature - 40);
      const tempWithJitter = this.withJitter(tempValue, this.fieldJitter.temperature);
      temperatureArray.push(this.clamp(tempWithJitter, 20, 160));
    }

    const telemetryData: BearingTelemetry = {
      timestamp: Date.now(),
      scalars: {
        rpm,
        load,
        loadDirection,
        temperature,
        vibrationAmp,
        maxPressure,
        minFilmThickness,
      },
      fieldData: {
        pressureDistribution: pressureArray,
        thicknessDistribution: thicknessArray,
        temperatureDistribution: temperatureArray,
      },
    };

    this.subscribers.forEach((cb) => cb(telemetryData));
  }
}

export const mockService = new MockDataService();
