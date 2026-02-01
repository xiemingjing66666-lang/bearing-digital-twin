// src/components/SettingsPanel.tsx
import React, { useState, useEffect } from 'react';
import type { ModelTransform } from './STLModel';
import { mockService } from '../services/MockDataService';

// === 类型定义区域 ===

// 1. 将 ViewMode 类型定义移至此处，供 App.tsx 引用
export type ViewMode = 'pressure' | 'thickness' | 'temperature';

export interface ModelMaterial {
  color: string;
  opacity: number;
}

export interface SinglePartConfig {
  url: string | null;
  transform: ModelTransform;
  material: ModelMaterial;
  heatmapAxis?: 'x' | 'y' | 'z';
  heatmapOffset?: number;
}

export interface StationPart {
  id: string;
  name: string;
  url: string | null;
  transform: ModelTransform;
  material: ModelMaterial;
}

export interface AppConfig {
  station: StationPart[];
  bearing: SinglePartConfig;
  shaft: SinglePartConfig;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onConfigChange: (newConfig: AppConfig) => void;
  onFileUpload: (part: 'station' | 'bearing' | 'shaft', file: File) => void;
  onDeleteStationPart: (id: string) => void;
  onNew: () => void;
  onSave: () => void;
  onOpen: () => void;

  // 2. 新增 Props：从父组件接收视图模式状态
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

// === 组件定义区域 ===
export const SettingsPanel: React.FC<Props> = ({ 
  isOpen, onClose, config, onConfigChange, onFileUpload, onDeleteStationPart,
  onNew, onSave, onOpen,
  viewMode, onViewModeChange 
}) => {
  // 3. 修改 activeTab 类型，增加 'debug'
  const [activeTab, setActiveTab] = useState<'station' | 'bearing' | 'shaft' | 'debug'>('station');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  // 4. 迁移原 DebugPanel 的状态 (用于控制滑块)
  const [rpm, setRpm] = useState(3000);
  const [load, setLoad] = useState(10000);
  const [loadDirection, setLoadDirection] = useState(0);

  // 自动选中逻辑
  useEffect(() => {
    if (activeTab === 'station') {
      if (!selectedStationId || !config.station.find(p => p.id === selectedStationId)) {
        if (config.station.length > 0) setSelectedStationId(config.station[0].id);
        else setSelectedStationId(null);
      }
    }
  }, [activeTab, config.station, selectedStationId]);

  // 通用更新函数
  const updateConfig = (updater: (target: any) => void) => {
    const newConfig = { ...config };
    if (activeTab === 'station') {
      if (!selectedStationId) return;
      const index = newConfig.station.findIndex(p => p.id === selectedStationId);
      if (index === -1) return;
      newConfig.station = [...newConfig.station];
      newConfig.station[index] = JSON.parse(JSON.stringify(newConfig.station[index]));
      updater(newConfig.station[index]);
    } else if (activeTab === 'bearing' || activeTab === 'shaft') {
      const part = activeTab;
      newConfig[part] = JSON.parse(JSON.stringify(newConfig[part]));
      updater(newConfig[part]);
    }
    onConfigChange(newConfig);
  };

  // 具体属性更新 helper
  const updatePosition = (axis: 0 | 1 | 2, value: number) => updateConfig(t => t.transform.position[axis] = value);
  const rotate90 = (axis: 0 | 1 | 2) => updateConfig(t => t.transform.rotation[axis] += Math.PI / 2);
  const updateMaterial = (type: 'color' | 'opacity', value: string | number) => {
    updateConfig(t => type === 'color' ? t.material.color = value : t.material.opacity = value);
  };
  const updateHeatmapAxis = (axis: 'x' | 'y' | 'z') => updateConfig(t => t.heatmapAxis = axis);
  const updateHeatmapOffset = (val: number) => updateConfig(t => t.heatmapOffset = val);

  // 5. 迁移原 DebugPanel 的事件处理
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

  // 获取当前选中对象的数据
  const getCurrentValues = () => {
    if (activeTab === 'station') return config.station.find(p => p.id === selectedStationId) || null;
    if (activeTab === 'bearing' || activeTab === 'shaft') return config[activeTab];
    return null;
  };

  const current: any = getCurrentValues();

  if (!isOpen) return null;

  // 样式定义
  const btnStyle: React.CSSProperties = {
    flex: 1, padding: '8px 0', background: '#333', border: '1px solid #444',
    color: '#eee', borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
  };

  // 视图模式按钮样式
  const modeBtnStyle = (mode: ViewMode) => ({
    flex: 1, padding: '8px 0', 
    background: viewMode === mode ? '#4facfe' : '#333',
    color: viewMode === mode ? '#fff' : '#aaa',
    border: '1px solid #444', borderRadius: '4px', cursor: 'pointer',
    fontSize: '12px', fontWeight: 'bold'
  });

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: '360px',
      background: '#1e1e1e', color: '#eee', boxShadow: '-5px 0 15px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', zIndex: 1000, borderLeft: '1px solid #333'
    }}>
      {/* 标题栏 */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>⚙️ 工程管理</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>✕</button>
      </div>

      {/* 顶部工具栏 */}
      <div style={{ padding: '10px 20px', display: 'flex', gap: '10px', borderBottom: '1px solid #333', background: '#252525' }}>
        <button onClick={onNew} style={btnStyle}>📄 新建</button>
        <button onClick={onOpen} style={btnStyle}>📂 打开</button>
        <button onClick={onSave} style={btnStyle}>💾 保存</button>
      </div>

      {/* 选项卡切换 (增加了 'debug') */}
      <div style={{ display: 'flex', borderBottom: '1px solid #333', marginTop: '5px' }}>
        {(['station', 'bearing', 'shaft', 'debug'] as const).map(part => (
          <button
            key={part} onClick={() => setActiveTab(part)}
            style={{
              flex: 1, padding: '12px 0', background: activeTab === part ? '#2a2a2a' : 'transparent',
              border: 'none', color: activeTab === part ? '#4facfe' : '#888', cursor: 'pointer',
              borderBottom: activeTab === part ? '2px solid #4facfe' : 'none',
              fontSize: '12px'
            }}
          >
            {part === 'station' ? '基座' : part === 'bearing' ? '轴承' : part === 'shaft' ? '主轴' : '🛠️ 模拟'}
          </button>
        ))}
      </div>

      {/* 内容滚动区域 */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        
        {/* === A. 模拟调试面板内容 (仅在 debug 模式下显示) === */}
        {activeTab === 'debug' && (
          <div style={{ animation: 'fadeIn 0.3s' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#888' }}>模拟工况设置 (Mock Data)</h4>
            
            {/* 视图模式切换 */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px', textTransform: 'uppercase' }}>可视化视图 (Visual Mode)</div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => onViewModeChange('pressure')} style={modeBtnStyle('pressure')}>压力场</button>
                <button onClick={() => onViewModeChange('thickness')} style={modeBtnStyle('thickness')}>膜厚</button>
                <button onClick={() => onViewModeChange('temperature')} style={modeBtnStyle('temperature')}>温度</button>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '20px 0' }} />

            {/* 滑块控制 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span>转速 (RPM)</span> <span style={{ color: '#4facfe', fontWeight: 'bold' }}>{rpm}</span>
                </label>
                <input type="range" min="0" max="10000" step="100" value={rpm} onChange={handleRpmChange} style={{ width: '100%', cursor: 'pointer' }} />
              </div>
              
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span>载荷 (N)</span> <span style={{ color: '#ffafbd', fontWeight: 'bold' }}>{load}</span>
                </label>
                <input type="range" min="0" max="50000" step="500" value={load} onChange={handleLoadChange} style={{ width: '100%', cursor: 'pointer' }} />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span>载荷方向 (Deg)</span> <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{loadDirection}°</span>
                </label>
                <input type="range" min="0" max="360" step="1" value={loadDirection} onChange={handleDirectionChange} style={{ width: '100%', cursor: 'pointer' }} />
              </div>
            </div>

            <div style={{ marginTop: '30px', padding: '12px', background: '#332b00', borderRadius: '4px', border: '1px solid #665500', fontSize: '11px', color: '#ffeeba', lineHeight: '1.4' }}>
              ⚠️ <strong>开发模式提示：</strong><br/>
              当前数据由 MockDataService 生成。此面板用于验证物理场映射算法，待真实 WebSocket 数据接入后可移除。
            </div>
          </div>
        )}

        {/* === B. 原有模型设置内容 (非 debug 模式下显示) === */}
        {activeTab !== 'debug' && (
          <>
            {/* 1. 文件列表 / 上传区 */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888' }}>
                {activeTab === 'station' ? '添加零件 (STL)' : '加载模型 (STL)'}
              </h4>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <label style={{ flex: 1, background: '#4facfe', color: 'white', textAlign: 'center', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  {activeTab === 'station' ? '+ 添加 STL' : '选择文件...'}
                  <input type="file" accept=".stl" style={{ display: 'none' }} onClick={(e) => (e.target as HTMLInputElement).value = ''} onChange={(e) => e.target.files?.[0] && onFileUpload(activeTab, e.target.files[0])} />
                </label>
              </div>
              {/* 基座多零件列表 */}
              {activeTab === 'station' && (
                <div style={{ background: '#252525', borderRadius: '4px', overflow: 'hidden' }}>
                  {config.station.map((part) => (
                    <div key={part.id} onClick={() => setSelectedStationId(part.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', cursor: 'pointer', borderBottom: '1px solid #333', background: selectedStationId === part.id ? '#3a3a3a' : 'transparent', borderLeft: selectedStationId === part.id ? '3px solid #4facfe' : '3px solid transparent' }}>
                      <span style={{ fontSize: '12px', color: '#eee', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{part.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteStationPart(part.id); }} style={{ background: 'none', border: 'none', color: '#ff5858', cursor: 'pointer' }}>🗑</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. 属性调整区 (仅当选中有效对象时显示) */}
            {current ? (
              <>
                {/* 位置 */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#888' }}>位置 (Position)</h4>
                  {['X', 'Y', 'Z'].map((axisLabel, idx) => (
                    <div key={`pos-${idx}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ width: '20px', fontSize: '12px', color: '#aaa' }}>{axisLabel}</span>
                      <input type="range" min="-1000" max="1000" step="1" value={current.transform.position[idx as 0|1|2]} onChange={(e) => updatePosition(idx as 0|1|2, parseFloat(e.target.value))} style={{ flex: 1, margin: '0 10px' }} />
                      <input type="number" value={current.transform.position[idx as 0|1|2]} onChange={(e) => updatePosition(idx as 0|1|2, parseFloat(e.target.value))} style={{ width: '60px', background: '#333', border: '1px solid #444', color: 'white', borderRadius: '4px', textAlign: 'right' }} />
                    </div>
                  ))}
                </div>

                {/* 旋转 */}
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#888' }}>旋转 (Rotation)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    {['X', 'Y', 'Z'].map((axis, idx) => (
                      <button key={`rot-${idx}`} onClick={() => rotate90(idx as 0|1|2)} style={{ padding: '8px 0', background: '#333', border: '1px solid #444', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
                        <span style={{fontWeight: 'bold', color: idx===0?'#ff3653':idx===1?'#0adb50':'#2c8fdf'}}>{axis}</span> ↻
                      </button>
                    ))}
                  </div>
                </div>

                {/* 热力图配置 (仅轴承显示) */}
                {activeTab === 'bearing' && config.bearing.url && (
                  <div style={{ marginBottom: '30px', padding: '10px', background: '#2a2a2a', borderRadius: '6px', border: '1px solid #444' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#4facfe' }}>📊 物理场映射设置</h4>
                    
                    {/* 轴向选择 */}
                    <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px' }}>1. 选择 STL 原始圆柱轴向：</div>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                      {(['x', 'y', 'z'] as const).map(axis => (
                        <button
                          key={axis}
                          onClick={() => updateHeatmapAxis(axis)}
                          style={{
                            flex: 1, padding: '5px', borderRadius: '4px', cursor: 'pointer',
                            border: current.heatmapAxis === axis ? '1px solid #4facfe' : '1px solid #444',
                            background: current.heatmapAxis === axis ? '#4facfe' : '#333',
                            color: current.heatmapAxis === axis ? '#fff' : '#aaa'
                          }}
                        >
                          {axis.toUpperCase()} 轴
                        </button>
                      ))}
                    </div>

                    {/* 相位旋转 */}
                    <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px' }}>2. 旋转云图 (寻找红色高压区)：</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="range" min="0" max="360" step="1" 
                        value={current.heatmapOffset || 0}
                        onChange={(e) => updateHeatmapOffset(parseFloat(e.target.value))}
                        style={{ flex: 1, marginRight: '10px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '11px', color: '#fff', width: '30px', textAlign: 'right' }}>
                        {current.heatmapOffset || 0}°
                      </span>
                    </div>
                  </div>
                )}

                {/* 外观 */}
                <div>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#888' }}>外观</h4>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '12px', color: '#aaa', width: '60px' }}>颜色</span>
                    <input type="color" value={current.material.color} onChange={(e) => updateMaterial('color', e.target.value)} style={{ flex: 1, height: '30px', padding: 0, border: 'none', background: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#aaa', width: '60px' }}>透明度</span>
                    <input type="range" min="0" max="1" step="0.01" value={current.material.opacity} onChange={(e) => updateMaterial('opacity', parseFloat(e.target.value))} style={{ flex: 1, marginRight: '10px' }} />
                    <span style={{ fontSize: '12px', color: '#fff' }}>{current.material.opacity.toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
                {activeTab === 'station' ? '请先添加并选中一个零件' : '请先加载模型'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};