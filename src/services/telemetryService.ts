import type { TelemetryProvider } from './telemetryContract';
import { mockService } from './MockDataService';
import { WebSocketTelemetryService } from './WebSocketTelemetryService';

const source = import.meta.env.VITE_TELEMETRY_SOURCE ?? 'mock';

export const telemetryService: TelemetryProvider =
  source === 'websocket'
    ? new WebSocketTelemetryService(import.meta.env.VITE_TELEMETRY_WS_URL ?? 'ws://localhost:8080/ws/telemetry')
    : mockService;
