// src/components/dashboard/RightPanel.tsx
import React from 'react';
import { useTelemetry } from '../../hooks/useTelemetry';

const IndicatorCard = ({ title, value, unit, color = '#fff' }: any) => (
  <div style={{ background: '#222', padding: '15px', borderRadius: '6px', marginBottom: '10px', borderLeft: `3px solid ${color}` }}>
    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{title}</div>
    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#eee', fontFamily: 'monospace' }}>
      {value} <span style={{ fontSize: '12px', color: '#555' }}>{unit}</span>
    </div>
  </div>
);

export const RightPanel: React.FC = () => {
  const data = useTelemetry();

  if (!data) return <div style={{ width: '240px', background: '#111', color: '#555', padding: '20px' }}>Waiting for data...</div>;

  return (
    <div style={{ width: '240px', background: '#111', borderLeft: '1px solid #333', padding: '20px', overflowY: 'auto' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#fff' }}>实时监测指标</h3>
      
      <IndicatorCard 
        title="最小油膜厚度 (h_min)" 
        value={data.scalars.minFilmThickness.toFixed(2)} 
        unit="μm" 
        color="#0adb50"
      />
      <IndicatorCard 
        title="最大油膜压力 (P_max)" 
        value={data.scalars.maxPressure.toFixed(2)} 
        unit="MPa" 
        color="#ff3653"
      />
      <IndicatorCard 
        title="最高油膜温度 (T_max)" 
        value={data.scalars.temperature.toFixed(1)} 
        unit="°C" 
        color="#ff7f50"
      />
      {/* 模拟一些额外计算值 */}
      <IndicatorCard 
        title="摩擦功耗 (W_f)" 
        value={(data.scalars.rpm * data.scalars.load / 1000000).toFixed(2)} 
        unit="kW" 
        color="#ffd700"
      />
      
      {/* 简易报警日志区域 */}
      <div style={{ marginTop: '30px' }}>
        <h4 style={{ fontSize: '12px', color: '#666', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>报警日志 (Logs)</h4>
        <div style={{ fontSize: '11px', color: '#555', fontFamily: 'monospace', lineHeight: '1.6' }}>
          <div>[10:02:01] 系统连接成功</div>
          <div>[10:02:02] 初始化数字孪生体</div>
          {data.scalars.maxPressure > 8.0 && <div style={{ color: '#ff3653' }}>[Alert] 压力超过阈值!</div>}
        </div>
      </div>
    </div>
  );
};