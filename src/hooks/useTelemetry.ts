import { useEffect, useMemo, useState } from 'react';
import { telemetryService } from '../services/telemetryService';
import type { AlertEvent, AlertMetric, BearingTelemetry, TrendPoint } from '../services/types';

interface ThresholdConfig {
  maxPressure: number;
  maxTemperature: number;
  minFilmThickness: number;
}

interface AlertState {
  active: boolean;
  triggeredAt: number;
}

interface DashboardState {
  telemetry: BearingTelemetry | null;
  trendPoints: TrendPoint[];
  logs: AlertEvent[];
  tracker: Record<AlertMetric, AlertState>;
}

const WINDOW_SIZE = 120;

const THRESHOLDS: ThresholdConfig = {
  maxPressure: 10,
  maxTemperature: 105,
  minFilmThickness: 9,
};

const metricMeta: Record<AlertMetric, { label: string; comparison: 'gte' | 'lte' }> = {
  maxPressure: { label: '最大油膜压力', comparison: 'gte' },
  temperature: { label: '最高油膜温度', comparison: 'gte' },
  minFilmThickness: { label: '最小油膜厚度', comparison: 'lte' },
};

const initialState: DashboardState = {
  telemetry: null,
  trendPoints: [],
  logs: [],
  tracker: {
    maxPressure: { active: false, triggeredAt: 0 },
    temperature: { active: false, triggeredAt: 0 },
    minFilmThickness: { active: false, triggeredAt: 0 },
  },
};

const metricValue = (telemetry: BearingTelemetry, metric: AlertMetric) => {
  if (metric === 'temperature') return telemetry.scalars.temperature;
  return telemetry.scalars[metric];
};

const metricThreshold = (metric: AlertMetric) => {
  if (metric === 'temperature') return THRESHOLDS.maxTemperature;
  if (metric === 'maxPressure') return THRESHOLDS.maxPressure;
  return THRESHOLDS.minFilmThickness;
};

export const useTelemetry = () => {
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => {
    const unsubscribe = telemetryService.subscribe((telemetry) => {
      setState((prev) => {
        const timestamp = telemetry.timestamp;
        const nextEvents: AlertEvent[] = [];
        const tracker: DashboardState['tracker'] = {
          maxPressure: { ...prev.tracker.maxPressure },
          temperature: { ...prev.tracker.temperature },
          minFilmThickness: { ...prev.tracker.minFilmThickness },
        };

        (Object.keys(metricMeta) as AlertMetric[]).forEach((metric) => {
          const value = metricValue(telemetry, metric);
          const threshold = metricThreshold(metric);
          const meta = metricMeta[metric];
          const hit = meta.comparison === 'gte' ? value >= threshold : value <= threshold;
          const item = tracker[metric];

          if (hit && !item.active) {
            item.active = true;
            item.triggeredAt = timestamp;

            nextEvents.push({
              id: `${metric}-${timestamp}`,
              metric,
              level: 'critical',
              message: `${meta.label}越过阈值`,
              value,
              threshold,
              triggeredAt: timestamp,
              active: true,
            });
          }

          if (!hit && item.active) {
            item.active = false;

            nextEvents.push({
              id: `${metric}-recovery-${timestamp}`,
              metric,
              level: 'warning',
              message: `${meta.label}恢复正常`,
              value,
              threshold,
              triggeredAt: item.triggeredAt,
              recoveredAt: timestamp,
              active: false,
            });
          }
        });

        const logs = nextEvents.length > 0 ? [...nextEvents, ...prev.logs].slice(0, 40) : prev.logs;
        const trendPoints = [
          ...prev.trendPoints,
          {
            timestamp,
            maxPressure: telemetry.scalars.maxPressure,
            minFilmThickness: telemetry.scalars.minFilmThickness,
            temperature: telemetry.scalars.temperature,
          },
        ].slice(-WINDOW_SIZE);

        return {
          telemetry,
          trendPoints,
          logs,
          tracker,
        };
      });
    });

    return unsubscribe;
  }, []);

  // NOTE:
  // `logs` is historical event stream (trigger/recovery), not the source of truth
  // for current alarm status. Current status must be derived from `tracker`.
  const activeAlerts = useMemo(() => {
    const result: AlertEvent[] = [];
    (Object.keys(state.tracker) as AlertMetric[]).forEach((metric) => {
      const item = state.tracker[metric];
      if (!item.active || !state.telemetry) return;

      const threshold = metricThreshold(metric);
      const value = metricValue(state.telemetry, metric);
      result.push({
        id: `${metric}-active-${state.telemetry.timestamp}`,
        metric,
        level: 'critical',
        message: `${metricMeta[metric].label}处于告警状态`,
        value,
        threshold,
        triggeredAt: item.triggeredAt,
        active: true,
      });
    });
    return result;
  }, [state.telemetry, state.tracker]);

  const systemStatus = useMemo(
    () => ((Object.keys(state.tracker) as AlertMetric[]).some((metric) => state.tracker[metric].active) ? 'ALARM' : 'ONLINE'),
    [state.tracker],
  );

  return {
    telemetry: state.telemetry,
    trendPoints: state.trendPoints,
    logs: state.logs,
    activeAlerts,
    systemStatus,
  } as const;
};
