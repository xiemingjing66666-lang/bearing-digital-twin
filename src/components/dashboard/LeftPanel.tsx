import React from 'react';
import type { BearingTelemetry } from '../../services/types';
import type { ViewMode } from '../../types/app';

interface Props {
  telemetry: BearingTelemetry | null;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  systemStatus: 'ONLINE' | 'ALARM';
}

const modeText: Record<ViewMode, string> = {
  pressure: '压力场分布',
  thickness: '油膜厚度',
  temperature: '温度场分布',
};

export const LeftPanel: React.FC<Props> = ({ telemetry, viewMode, onViewModeChange, systemStatus }) => {
  return (
    <aside className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="metric-block">
        <h3 className="metric-title">实时工况</h3>
        <div style={{ marginBottom: 20 }}>
          <div className="metric-title">转速 (RPM)</div>
          <div className="metric-value mono">{(telemetry?.scalars.rpm ?? 0).toFixed(0)}</div>
        </div>
        <div>
          <div className="metric-title">载荷 (N)</div>
          <div className="metric-value mono">{(telemetry?.scalars.load ?? 0).toFixed(0)}</div>
        </div>
      </div>

      <div style={{ padding: 16, flex: 1 }}>
        <h3 className="metric-title">可视化模式</h3>
        {(Object.keys(modeText) as ViewMode[]).map((mode) => (
          <button
            type="button"
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`view-btn ${viewMode === mode ? 'active' : ''}`}
          >
            {modeText[mode]}
          </button>
        ))}
      </div>

      <div className="status-line">
        系统状态:{' '}
        <span style={{ color: systemStatus === 'ALARM' ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
          {systemStatus}
        </span>
      </div>
    </aside>
  );
};
