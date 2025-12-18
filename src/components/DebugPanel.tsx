// src/components/DebugPanel.tsx
import React, { useEffect, useState } from 'react';
// 注意：这里导入实例 mockService
import { mockService } from '../services/MockDataService';
// 注意：导入接口时加上 type 关键字，避免 Vite 报错
import type { BearingTelemetry } from '../services/types';

export const DebugPanel: React.FC = () => {
  // 1. 定义状态存储接收到的遥测数据
  const [data, setData] = useState<BearingTelemetry | null>(null);
  // 2. 定义状态存储当前的控制参数（用于滑块回显）
  const [rpm, setRpm] = useState(3000);
  const [load, setLoad] = useState(10000);

  // 3. 生命周期：组件挂载时启动引擎并订阅
  useEffect(() => {
    // 启动模拟引擎，每 100ms 更新一次数据
    mockService.start(100);

    // 订阅数据更新
    const unsubscribe = mockService.subscribe((newData) => {
      setData(newData);
    });

    // 组件卸载时清理：停止引擎，取消订阅
    return () => {
      mockService.stop();
      unsubscribe();
    };
  }, []);

  // 4. 处理用户交互：改变转速
  const handleRpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setRpm(val);
    // 关键：通知引擎更新参数
    mockService.updateParams({ rpm: val });
  };

  // 处理用户交互：改变载荷
  const handleLoadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLoad(val);
    mockService.updateParams({ load: val });
  };

  // 如果还没收到第一帧数据，显示加载状态
  if (!data) {
    return <div style={{ color: 'white', padding: '20px' }}>正在连接模拟引擎...</div>;
  }

  // 5. 渲染界面
  return (
    <div style={{ 
      position: 'absolute', 
      top: 20, 
      left: 20, 
      width: '320px',
      padding: '20px', 
      background: 'rgba(30, 30, 30, 0.9)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '12px', 
      color: '#e0e0e0',
      fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      zIndex: 100 // 确保浮在最上层
    }}>
      <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
        🛠️ 数字孪生控制台
      </h3>
      
      {/* --- 控制区 --- */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
            <span>转速 (RPM)</span>
            <span style={{ color: '#4facfe' }}>{rpm}</span>
          </label>
          <input 
            type="range" min="0" max="10000" step="100" 
            value={rpm} onChange={handleRpmChange} 
            style={{ width: '100%', cursor: 'pointer' }} 
          />
        </div>

        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
            <span>载荷 (N)</span>
            <span style={{ color: '#ffafbd' }}>{load}</span>
          </label>
          <input 
            type="range" min="0" max="50000" step="500" 
            value={load} onChange={handleLoadChange} 
            style={{ width: '100%', cursor: 'pointer' }} 
          />
        </div>
      </div>

      {/* --- 数据监视区 --- */}
      <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>
          实时遥测 (Telemetry)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
          <div>
            <div style={{ color: '#aaa' }}>最大压力</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
              {data.scalars.maxPressure.toFixed(2)} <span style={{fontSize:'10px'}}>MPa</span>
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>瓦块温度</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff5858' }}>
              {data.scalars.temperature.toFixed(1)} <span style={{fontSize:'10px'}}>°C</span>
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>最小膜厚</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4facfe' }}>
              {data.scalars.minFilmThickness.toFixed(2)} <span style={{fontSize:'10px'}}>μm</span>
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>振动幅值</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9a9e' }}>
              {data.scalars.vibrationAmp.toFixed(2)} <span style={{fontSize:'10px'}}>μm</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- 场数据简易预览 (模拟 3D 变色逻辑) --- */}
      <div style={{ marginTop: '15px' }}>
        <div style={{ fontSize: '10px', color: '#666', marginBottom: '5px' }}>压力场分布预览 (Field Data)</div>
        <div style={{ display: 'flex', height: '6px', gap: '1px' }}>
          {data.fieldData.pressureDistribution.map((val, idx) => (
            <div key={idx} style={{ 
              flex: 1, 
              // 简单的热力图颜色映射：数值越高越红，越低越蓝
              backgroundColor: `hsl(${240 - Math.min(val * 20, 240)}, 80%, 60%)`,
              opacity: val > 0.1 ? 1 : 0.3
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};