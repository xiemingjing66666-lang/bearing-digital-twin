// src/components/DebugPanel.tsx
import React, { useEffect, useState } from 'react';
import { mockService } from '../services/MockDataService';
import type { BearingTelemetry } from '../services/types';

// 定义视图模式类型
export type ViewMode = 'pressure' | 'thickness' | 'temperature';

interface Props {
  // 新增：通知父组件切换模式
  onViewModeChange: (mode: ViewMode) => void;
}

export const DebugPanel: React.FC<Props> = ({ onViewModeChange }) => {
  const [data, setData] = useState<BearingTelemetry | null>(null);
  const [rpm, setRpm] = useState(3000);
  const [load, setLoad] = useState(10000);
  const [loadDirection, setLoadDirection] = useState(0);
  const [activeMode, setActiveMode] = useState<ViewMode>('pressure');

  useEffect(() => {
    mockService.start();
    const unsubscribe = mockService.subscribe(setData);
    return () => {
      mockService.stop();
      unsubscribe();
    };
  }, []);

  const handleRpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setRpm(val);
    mockService.updateParams({ rpm: val });
  };

  const handleLoadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLoad(val);
    mockService.updateParams({ load: val });
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLoadDirection(val);
    mockService.updateParams({ loadDirection: val });
  };

  // 切换模式处理
  const handleModeClick = (mode: ViewMode) => {
    setActiveMode(mode);
    onViewModeChange(mode);
  };

  if (!data) return <div style={{ color: 'white', padding: '20px' }}>Connecting...</div>;

  // 按钮通用样式
  const btnStyle = (mode: ViewMode) => ({
    flex: 1,
    padding: '6px 0',
    background: activeMode === mode ? '#4facfe' : '#333',
    color: activeMode === mode ? '#fff' : '#aaa',
    border: '1px solid #444',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ 
      position: 'absolute', top: 20, left: 20, width: '300px',
      padding: '20px', background: 'rgba(30, 30, 30, 0.9)', 
      backdropFilter: 'blur(10px)', borderRadius: '12px', 
      color: '#e0e0e0', fontFamily: 'sans-serif', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100 
    }}>
      <h3 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #444', paddingBottom: '10px', fontSize: '14px' }}>
        🛠️ 数字孪生控制台
      </h3>
      
      {/* 1. 控制区 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>转速 (RPM)</span> <span style={{ color: '#4facfe' }}>{rpm}</span>
          </label>
          <input type="range" min="0" max="10000" step="100" value={rpm} onChange={handleRpmChange} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>载荷 (N)</span> <span style={{ color: '#ffafbd' }}>{load}</span>
          </label>
          <input type="range" min="0" max="50000" step="500" value={load} onChange={handleLoadChange} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>载荷方向 (Deg)</span> <span style={{ color: '#ffd700' }}>{loadDirection}°</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="360" 
            step="1" 
            value={loadDirection} 
            onChange={handleDirectionChange} 
            style={{ width: '100%' }} 
          />
        </div>
      </div>

      {/* 2. 视图模式切换 (新增) */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '10px', color: '#888', marginBottom: '5px', textTransform: 'uppercase' }}>可视化视图 (Visual Mode)</div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => handleModeClick('pressure')} style={btnStyle('pressure')}>压力场</button>
          <button onClick={() => handleModeClick('thickness')} style={btnStyle('thickness')}>油膜厚度</button>
          <button onClick={() => handleModeClick('temperature')} style={btnStyle('temperature')}>温度场</button>
        </div>
      </div>

      {/* 3. 实时数据 */}
      <div style={{ background: '#252525', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#888' }}>实时监测 (Telemetry)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '12px' }}>
          {/* 压力 - 根据模式高亮 */}
          <div style={{ opacity: activeMode === 'pressure' ? 1 : 0.5 }}>
            <div style={{ color: '#aaa' }}>最大压力</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
              {data.scalars.maxPressure.toFixed(2)} <span style={{fontSize:'10px'}}>MPa</span>
            </div>
          </div>
          {/* 厚度 - 根据模式高亮 */}
          <div style={{ opacity: activeMode === 'thickness' ? 1 : 0.5 }}>
            <div style={{ color: '#aaa' }}>最小膜厚</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0adb50' }}>
              {data.scalars.minFilmThickness.toFixed(2)} <span style={{fontSize:'10px'}}>μm</span>
            </div>
          </div>
          {/* 温度 - 根据模式高亮 */}
          <div style={{ opacity: activeMode === 'temperature' ? 1 : 0.5 }}>
            <div style={{ color: '#aaa' }}>瓦块温度</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff5858' }}>
              {data.scalars.temperature.toFixed(1)} <span style={{fontSize:'10px'}}>°C</span>
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>振动幅值</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#aaa' }}>
              {data.scalars.vibrationAmp.toFixed(2)} <span style={{fontSize:'10px'}}>μm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};