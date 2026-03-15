import React from 'react';
import type { AlertEvent, BearingTelemetry } from '../../services/types';

interface Props {
  telemetry: BearingTelemetry | null;
  logs: AlertEvent[];
}

interface IndicatorCardProps {
  title: string;
  value: string;
  unit: string;
  color: string;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ title, value, unit, color }) => (
  <div className="indicator-card" style={{ borderLeftColor: color }}>
    <div className="indicator-title">{title}</div>
    <div className="indicator-value mono">
      {value} <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{unit}</span>
    </div>
  </div>
);

const formatTime = (value: number) => new Date(value).toLocaleTimeString();

export const RightPanel: React.FC<Props> = ({ telemetry, logs }) => {
  if (!telemetry) {
    return (
      <aside className="panel" style={{ padding: 16 }}>
        等待数据流...
      </aside>
    );
  }

  return (
    <aside className="panel" style={{ padding: 16, overflowY: 'auto' }}>
      <h3 className="metric-title" style={{ marginBottom: 10 }}>
        实时监测指标
      </h3>

      <IndicatorCard
        title="最小油膜厚度"
        value={telemetry.scalars.minFilmThickness.toFixed(2)}
        unit="μm"
        color="var(--success)"
      />
      <IndicatorCard
        title="最大油膜压力"
        value={telemetry.scalars.maxPressure.toFixed(2)}
        unit="MPa"
        color="var(--danger)"
      />
      <IndicatorCard
        title="最高油膜温度"
        value={telemetry.scalars.temperature.toFixed(1)}
        unit="°C"
        color="var(--warning)"
      />
      <IndicatorCard
        title="摩擦功耗"
        value={(telemetry.scalars.rpm * telemetry.scalars.load / 1_000_000).toFixed(2)}
        unit="kW"
        color="var(--accent)"
      />

      <section className="log-list">
        <div className="metric-title">告警日志</div>
        {logs.length === 0 && <div className="log-item">暂无告警</div>}
        {logs.slice(0, 10).map((log) => (
          <div key={log.id} className={`log-item ${log.active ? 'alert' : ''}`}>
            [{formatTime(log.recoveredAt ?? log.triggeredAt)}] {log.message}
            {' | '}
            {log.value.toFixed(2)}
            {log.active ? ' (触发)' : ' (恢复)'}
          </div>
        ))}
      </section>
    </aside>
  );
};
