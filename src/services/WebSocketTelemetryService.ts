import type { SimulationParams, TelemetryProvider } from './telemetryContract';
import type { BearingTelemetry } from './types';

const noopTelemetry: BearingTelemetry = {
  timestamp: Date.now(),
  scalars: {
    rpm: 0,
    load: 0,
    loadDirection: 0,
    temperature: 0,
    vibrationAmp: 0,
    maxPressure: 0,
    minFilmThickness: 0,
  },
  fieldData: {
    pressureDistribution: [],
    thicknessDistribution: [],
    temperatureDistribution: [],
  },
};

export class WebSocketTelemetryService implements TelemetryProvider {
  private readonly url: string;

  private socket: WebSocket | null = null;

  private subscribers: ((data: BearingTelemetry) => void)[] = [];

  private latest: BearingTelemetry = noopTelemetry;

  constructor(url: string) {
    this.url = url;
  }

  public start() {
    if (this.socket) return;

    this.socket = new WebSocket(this.url);
    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(String(event.data)) as BearingTelemetry;
        this.latest = parsed;
        this.subscribers.forEach((cb) => cb(this.latest));
      } catch {
        // Ignore malformed payloads to keep the stream resilient.
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
    };
  }

  public stop() {
    if (!this.socket) return;
    this.socket.close();
    this.socket = null;
  }

  public subscribe(callback: (data: BearingTelemetry) => void) {
    this.subscribers.push(callback);
    callback(this.latest);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  public updateParams(newParams: Partial<SimulationParams>) {
    void newParams;
    // Placeholder for parity with mock service. Future implementations
    // can push control commands to server here.
  }
}

