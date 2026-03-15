import type { BearingTelemetry } from './types';

export interface SimulationParams {
  rpm: number;
  load: number;
  loadDirection: number;
}

export type TelemetrySubscriber = (data: BearingTelemetry) => void;

export interface TelemetryProvider {
  start(): void;
  stop(): void;
  subscribe(callback: TelemetrySubscriber): () => void;
  updateParams(newParams: Partial<SimulationParams>): void;
}
