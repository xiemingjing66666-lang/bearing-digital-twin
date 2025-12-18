// src/components/SettingsPanel.tsx
import React, { useState } from 'react';
import type { ModelTransform } from './STLModel';

export interface ModelMaterial {
  color: string;
  opacity: number;
}

export interface PartConfig {
  url: string | null;
  transform: ModelTransform;
  material: ModelMaterial;
}

export interface AppConfig {
  station: PartConfig;
  bearing: PartConfig;
  shaft: PartConfig;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onConfigChange: (newConfig: AppConfig) => void;
  onFileUpload: (part: keyof AppConfig, file: File) => void;
  // 新增回调
  onNew: () => void;
  onSave: () => void;
  onOpen: () => void;
}

export const SettingsPanel: React.FC<Props> = ({ 
  isOpen, onClose, config, onConfigChange, onFileUpload,
  onNew, onSave, onOpen 
}) => {
  const [activeTab, setActiveTab] = useState<keyof AppConfig>('station');

  const updatePosition = (axis: 0 | 1 | 2, value: number) => {
    const newConfig = { ...config };
    newConfig[activeTab] = { ...newConfig[activeTab] };
    newConfig[activeTab].transform = { ...newConfig[activeTab].transform };
    newConfig[activeTab].transform.position = [...newConfig[activeTab].transform.position];
    newConfig[activeTab].transform.position[axis] = value;
    onConfigChange(newConfig);
  };

  const rotate90 = (axis: 0 | 1 | 2) => {
    const newConfig = { ...config };
    newConfig[activeTab] = { ...newConfig[activeTab] };
    newConfig[activeTab].transform = { ...newConfig[activeTab].transform };
    newConfig[activeTab].transform.rotation = [...newConfig[activeTab].transform.rotation];
    newConfig[activeTab].transform.rotation[axis] += Math.PI / 2;
    onConfigChange(newConfig);
  };

  const updateMaterial = (type: 'color' | 'opacity', value: string | number) => {
    const newConfig = { ...config };
    newConfig[activeTab] = { ...newConfig[activeTab] };
    newConfig[activeTab].material = { ...newConfig[activeTab].material };
    if (type === 'color') newConfig[activeTab].material.color = value as string;
    else newConfig[activeTab].material.opacity = value as number;
    onConfigChange(newConfig);
  };

  if (!isOpen) return null;

  // 按钮通用样式
  const btnStyle: React.CSSProperties = {
    flex: 1, padding: '8px 0', background: '#333', border: '1px solid #444',
    color: '#eee', borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
  };

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: '340px',
      background: '#1e1e1e', color: '#eee', boxShadow: '-5px 0 15px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', zIndex: 1000, borderLeft: '1px solid #333'
    }}>
      {/* 标题栏 */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>⚙️ 工程管理</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>✕</button>
      </div>

      {/* === 顶部工具栏 (新建/打开/保存) === */}
      <div style={{ padding: '10px 20px', display: 'flex', gap: '10px', borderBottom: '1px solid #333', background: '#252525' }}>
        <button onClick={onNew} style={btnStyle} title="清空当前场景">
          <span style={{fontSize: '16px'}}>📄</span> 新建
        </button>
        <button onClick={onOpen} style={btnStyle} title="加载工程文件 (.json)">
          <span style={{fontSize: '16px'}}>📂</span> 打开
        </button>
        <button onClick={onSave} style={btnStyle} title="保存包含模型数据的工程文件">
          <span style={{fontSize: '16px'}}>💾</span> 保存
        </button>
      </div>

      {/* 选项卡 */}
      <div style={{ display: 'flex', borderBottom: '1px solid #333', marginTop: '5px' }}>
        {(['station', 'bearing', 'shaft'] as const).map(part => (
          <button
            key={part}
            onClick={() => setActiveTab(part)}
            style={{
              flex: 1, padding: '12px 0', background: activeTab === part ? '#2a2a2a' : 'transparent',
              border: 'none', color: activeTab === part ? '#4facfe' : '#888', cursor: 'pointer',
              borderBottom: activeTab === part ? '2px solid #4facfe' : 'none', transition: 'all 0.3s'
            }}
          >
            {part === 'station' ? '基座' : part === 'bearing' ? '轴承' : '主轴'}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        
        {/* 1. 文件导入 */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888' }}>当前模型 (STL)</h4>
          <input 
            type="file" accept=".stl" 
            onChange={(e) => e.target.files?.[0] && onFileUpload(activeTab, e.target.files[0])}
            style={{ width: '100%', fontSize: '12px' }}
          />
          <div style={{ fontSize: '10px', marginTop: '5px', color: config[activeTab].url ? '#4caf50' : '#666' }}>
            {config[activeTab].url ? '✅ 已加载' : '⚪ 未加载'}
          </div>
        </div>

        {/* 2. 位置调整 */}
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#888' }}>位置 (Position mm)</h4>
          {['X', 'Y', 'Z'].map((axisLabel, idx) => (
            <div key={`pos-${idx}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ width: '20px', fontSize: '12px', color: '#aaa' }}>{axisLabel}</span>
              <input 
                type="range" min="-1000" max="1000" step="1" 
                value={config[activeTab].transform.position[idx as 0|1|2]}
                onChange={(e) => updatePosition(idx as 0|1|2, parseFloat(e.target.value))}
                style={{ flex: 1, margin: '0 10px', cursor: 'pointer' }}
              />
              <input 
                type="number" step="0.1"
                value={config[activeTab].transform.position[idx as 0|1|2]}
                onChange={(e) => updatePosition(idx as 0|1|2, parseFloat(e.target.value))}
                style={{ width: '60px', background: '#333', border: '1px solid #444', color: 'white', borderRadius: '4px', padding: '2px 5px', fontSize: '12px', textAlign: 'right' }}
              />
            </div>
          ))}
        </div>

        {/* 3. 旋转调整 */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#888' }}>旋转 (Rotation)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {['X', 'Y', 'Z'].map((axis, idx) => (
              <button
                key={`rot-${idx}`} onClick={() => rotate90(idx as 0|1|2)}
                style={{
                  padding: '10px 0', background: '#333', border: '1px solid #444', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                }}
              >
                <span style={{fontWeight: 'bold', color: idx===0?'#ff3653':idx===1?'#0adb50':'#2c8fdf'}}>{axis}轴</span>
                <span>↻ +90°</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. 外观调整 */}
        <div>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#888' }}>外观 (Appearance)</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '12px', color: '#aaa', width: '60px' }}>颜色</span>
            <input 
              type="color"
              value={config[activeTab].material.color}
              onChange={(e) => updateMaterial('color', e.target.value)}
              style={{ flex: 1, height: '30px', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#aaa', width: '60px' }}>透明度</span>
            <input 
              type="range" min="0" max="1" step="0.01"
              value={config[activeTab].material.opacity}
              onChange={(e) => updateMaterial('opacity', parseFloat(e.target.value))}
              style={{ flex: 1, marginRight: '10px', cursor: 'pointer' }}
            />
             <span style={{ fontSize: '12px', color: '#fff', width: '30px', textAlign: 'right' }}>
              {config[activeTab].material.opacity.toFixed(2)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};