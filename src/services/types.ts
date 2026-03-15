export interface BearingTelemetry {
  timestamp: number;
  scalars: {
    rpm: number;
    load: number;
    loadDirection: number;
    temperature: number;
    vibrationAmp: number;
    maxPressure: number;
    minFilmThickness: number;
  };
  fieldData: {
    pressureDistribution: number[];
    thicknessDistribution: number[];
    temperatureDistribution: number[];
  };
}

export type AlertMetric = 'maxPressure' | 'temperature' | 'minFilmThickness';

export type AlertLevel = 'warning' | 'critical';

export interface AlertEvent {
  id: string;
  metric: AlertMetric;
  level: AlertLevel;
  message: string;
  value: number;
  threshold: number;
  triggeredAt: number;
  recoveredAt?: number;
  active: boolean;
}

export interface TrendPoint {
  timestamp: number;
  maxPressure: number;
  minFilmThickness: number;
  temperature: number;
}
