// src/components/dashboard/LeftPanel.tsx
import React from 'react';
import { useTelemetry } from '../../hooks/useTelemetry';
import type { ViewMode } from '../SettingsPanel';

interface Props {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const LeftPanel: React.FC<Props> = ({ viewMode, onViewModeChange }) => {
  const telemetry = useTelemetry();

  // 按钮样式
  const btnStyle = (mode: ViewMode) => ({
    width: '100%', padding: '12px 10px', marginBottom: '8px',
    background: viewMode === mode ? 'rgba(79, 172, 254, 0.15)' : '#1f1f1f',
    border: viewMode === mode ? '1px solid #4facfe' : '1px solid #333',
    color: viewMode === mode ? '#4facfe' : '#888',
    borderRadius: '6px', cursor: 'pointer', textAlign: 'left' as const,
    fontSize: '13px', fontWeight: viewMode === mode ? 600 : 400,
    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
  });

  return (
    <div style={{ width: '260px', background: '#121212', borderRight: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
      
      {/* A. 工况监控 (只读显示) */}
      <div style={{ padding: '25px 20px', borderBottom: '1px solid #2a2a2a', background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Real-time Conditions
        </h3>
        
        {/* 1. 转速显示 */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4facfe' }}></span>
            <span style={{ fontSize: '12px', color: '#aaa' }}>转速 (RPM)</span>
          </div>
          <div style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#fff', 
            fontFamily: '"DMMono", "Courier New", monospace',
            letterSpacing: '-1px',
            lineHeight: '1.0'
          }}>
            {telemetry?.scalars.rpm.toFixed(0) || '0'}
          </div>
        </div>

        {/* 2. 载荷显示 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffafbd' }}></span>
            <span style={{ fontSize: '12px', color: '#aaa' }}>载荷 (Load)</span>
          </div>
          <div style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#fff', 
            fontFamily: '"DMMono", "Courier New", monospace',
            letterSpacing: '-1px',
            lineHeight: '1.0'
          }}>
            {telemetry?.scalars.load.toFixed(0) || '0'}
            <span style={{ fontSize: '14px', color: '#666', marginLeft: '6px', fontWeight: 'normal' }}>N</span>
          </div>
        </div>
      </div>

      {/* B. 视图控制 */}
      <div style={{ padding: '20px', flex: 1 }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Visualization View
        </h3>
        <button onClick={() => onViewModeChange('pressure')} style={btnStyle('pressure')}>
          <span>🌊</span> 压力场分布 (Pressure)
        </button>
        <button onClick={() => onViewModeChange('thickness')} style={btnStyle('thickness')}>
          <span>📏</span> 油膜厚度 (Thickness)
        </button>
        <button onClick={() => onViewModeChange('temperature')} style={btnStyle('temperature')}>
          <span>🌡️</span> 温度场分布 (Temp)
        </button>
      </div>

      {/* 底部状态装饰 */}
      <div style={{ padding: '15px 20px', borderTop: '1px solid #2a2a2a', fontSize: '11px', color: '#444' }}>
        System Status: <span style={{ color: '#0adb50' }}>● Online</span>
      </div>
    </div>
  );
};