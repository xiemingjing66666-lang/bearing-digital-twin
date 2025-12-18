// src/components/SettingsPanel.tsx
import React, { useState, useEffect } from 'react';
import type { ModelTransform } from './STLModel';

// === 类型定义 ===
export interface ModelMaterial {
  color: string;
  opacity: number;
}

// 通用零件配置 (用于轴承和主轴)
export interface SinglePartConfig {
  url: string | null;
  transform: ModelTransform;
  material: ModelMaterial;
}

// 基座子零件配置 (新增：id 和 name)
export interface StationPart {
  id: string;
  name: string;
  url: string | null;
  transform: ModelTransform;
  material: ModelMaterial;
}

// 全局配置结构
export interface AppConfig {
  station: StationPart[]; // ⚠️ 变化：基座变成了数组
  bearing: SinglePartConfig;
  shaft: SinglePartConfig;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onConfigChange: (newConfig: AppConfig) => void;
  onFileUpload: (part: 'station' | 'bearing' | 'shaft', file: File) => void;
  onDeleteStationPart: (id: string) => void; // 新增：删除回调
  onNew: () => void;
  onSave: () => void;
  onOpen: () => void;
}

export const SettingsPanel: React.FC<Props> = ({ 
  isOpen, onClose, config, onConfigChange, onFileUpload, onDeleteStationPart,
  onNew, onSave, onOpen 
}) => {
  const [activeTab, setActiveTab] = useState<'station' | 'bearing' | 'shaft'>('station');
  
  // 用于记录基座中当前正在编辑哪个零件 (存 ID)
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  // 当切换 Tab 或基座列表变化时，自动维护选中状态
  useEffect(() => {
    if (activeTab === 'station') {
      // 如果当前没选中，或者选中的ID不存在了，默认选中第一个
      if (!selectedStationId || !config.station.find(p => p.id === selectedStationId)) {
        if (config.station.length > 0) {
          setSelectedStationId(config.station[0].id);
        } else {
          setSelectedStationId(null);
        }
      }
    }
  }, [activeTab, config.station, selectedStationId]);

  // === 通用更新逻辑 (位置/旋转/材质) ===
  // 这里需要根据 activeTab 判断是更新数组里的某一项，还是更新单体对象
  const updateConfig = (updater: (target: any) => void) => {
    const newConfig = { ...config };
    
    if (activeTab === 'station') {
      if (!selectedStationId) return;
      // 找到当前选中的零件索引
      const index = newConfig.station.findIndex(p => p.id === selectedStationId);
      if (index === -1) return;
      
      // 深拷贝该零件
      newConfig.station = [...newConfig.station];
      newConfig.station[index] = { ...newConfig.station[index] };
      newConfig.station[index].transform = { ...newConfig.station[index].transform };
      newConfig.station[index].transform.position = [...newConfig.station[index].transform.position];
      newConfig.station[index].transform.rotation = [...newConfig.station[index].transform.rotation];
      newConfig.station[index].material = { ...newConfig.station[index].material };
      
      // 执行更新
      updater(newConfig.station[index]);

    } else {
      // 轴承或主轴 (单体)
      const part = activeTab as 'bearing' | 'shaft';
      newConfig[part] = { ...newConfig[part] };
      newConfig[part].transform = { ...newConfig[part].transform };
      newConfig[part].transform.position = [...newConfig[part].transform.position];
      newConfig[part].transform.rotation = [...newConfig[part].transform.rotation];
      newConfig[part].material = { ...newConfig[part].material };
      
      updater(newConfig[part]);
    }
    onConfigChange(newConfig);
  };

  const updatePosition = (axis: 0 | 1 | 2, value: number) => {
    updateConfig(target => target.transform.position[axis] = value);
  };

  const rotate90 = (axis: 0 | 1 | 2) => {
    updateConfig(target => target.transform.rotation[axis] += Math.PI / 2);
  };

  const updateMaterial = (type: 'color' | 'opacity', value: string | number) => {
    updateConfig(target => {
      if (type === 'color') target.material.color = value as string;
      else target.material.opacity = value as number;
    });
  };

  // 获取当前正在显示的数值 (用于绑定 Input)
  const getCurrentValues = () => {
    if (activeTab === 'station') {
      const part = config.station.find(p => p.id === selectedStationId);
      return part ? { t: part.transform, m: part.material } : null;
    } else {
      return { t: config[activeTab].transform, m: config[activeTab].material };
    }
  };

  const current = getCurrentValues();

  if (!isOpen) return null;

  const btnStyle: React.CSSProperties = {
    flex: 1, padding: '8px 0', background: '#333', border: '1px solid #444',
    color: '#eee', borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
  };

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

      {/* 工具栏 */}
      <div style={{ padding: '10px 20px', display: 'flex', gap: '10px', borderBottom: '1px solid #333', background: '#252525' }}>
        <button onClick={onNew} style={btnStyle}><span style={{fontSize: '16px'}}>📄</span> 新建</button>
        <button onClick={onOpen} style={btnStyle}><span style={{fontSize: '16px'}}>📂</span> 打开</button>
        <button onClick={onSave} style={btnStyle}><span style={{fontSize: '16px'}}>💾</span> 保存</button>
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
            {part === 'station' ? '基座(多零件)' : part === 'bearing' ? '轴承' : '主轴'}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        
        {/* === 1. 模型导入与列表区域 === */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888' }}>
            {activeTab === 'station' ? '添加零件 (STL)' : '加载模型 (STL)'}
          </h4>
          
          {/* 文件上传按钮 */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <label style={{ 
              flex: 1, background: '#4facfe', color: 'white', textAlign: 'center', 
              padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' 
            }}>
              {activeTab === 'station' ? '+ 添加 STL 零件' : '选择文件...'}
              <input 
                type="file" accept=".stl" style={{ display: 'none' }}
                // 注意：这里要把 value 清空，否则选同一个文件不触发 onChange
                onClick={(e) => (e.target as HTMLInputElement).value = ''}
                onChange={(e) => e.target.files?.[0] && onFileUpload(activeTab, e.target.files[0])}
              />
            </label>
          </div>

          {/* 如果是基座，显示零件列表 */}
          {activeTab === 'station' && (
            <div style={{ background: '#252525', borderRadius: '4px', overflow: 'hidden' }}>
              {config.station.length === 0 && (
                <div style={{ padding: '10px', fontSize: '12px', color: '#666', textAlign: 'center' }}>暂无零件</div>
              )}
              {config.station.map((part) => (
                <div 
                  key={part.id}
                  onClick={() => setSelectedStationId(part.id)}
                  style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', cursor: 'pointer', borderBottom: '1px solid #333',
                    background: selectedStationId === part.id ? '#3a3a3a' : 'transparent',
                    borderLeft: selectedStationId === part.id ? '3px solid #4facfe' : '3px solid transparent'
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                    {part.name}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteStationPart(part.id); }}
                    style={{ background: 'none', border: 'none', color: '#ff5858', cursor: 'pointer', padding: '2px' }}
                    title="删除"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 如果是单体，显示简单的状态 */}
          {activeTab !== 'station' && (
            <div style={{ fontSize: '10px', marginTop: '5px', color: config[activeTab].url ? '#4caf50' : '#666' }}>
              {config[activeTab].url ? '✅ 已加载' : '⚪ 未加载'}
            </div>
          )}
        </div>

        {/* === 分割线：以下为调整区域 === */}
        {/* 只有当当前有东西被选中时才显示调整控件 */}
        {current ? (
          <>
            <div style={{ padding: '5px 0', fontSize: '12px', color: '#4facfe', fontWeight: 'bold', borderBottom: '1px solid #333', marginBottom: '15px' }}>
              正在编辑: {activeTab === 'station' ? config.station.find(p=>p.id===selectedStationId)?.name : (activeTab==='bearing'?'轴承':'主轴')}
            </div>

            {/* 2. 位置调整 */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#888' }}>位置 (Position mm)</h4>
              {['X', 'Y', 'Z'].map((axisLabel, idx) => (
                <div key={`pos-${idx}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ width: '20px', fontSize: '12px', color: '#aaa' }}>{axisLabel}</span>
                  <input 
                    type="range" min="-1000" max="1000" step="1" 
                    value={current.t.position[idx as 0|1|2]}
                    onChange={(e) => updatePosition(idx as 0|1|2, parseFloat(e.target.value))}
                    style={{ flex: 1, margin: '0 10px', cursor: 'pointer' }}
                  />
                  <input 
                    type="number" step="0.1"
                    value={current.t.position[idx as 0|1|2]}
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
                  value={current.m.color}
                  onChange={(e) => updateMaterial('color', e.target.value)}
                  style={{ flex: 1, height: '30px', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#aaa', width: '60px' }}>透明度</span>
                <input 
                  type="range" min="0" max="1" step="0.01"
                  value={current.m.opacity}
                  onChange={(e) => updateMaterial('opacity', parseFloat(e.target.value))}
                  style={{ flex: 1, marginRight: '10px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', color: '#fff', width: '30px', textAlign: 'right' }}>
                  {current.m.opacity.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
            {activeTab === 'station' ? '请先添加并选中一个零件进行编辑' : '请先加载模型文件'}
          </div>
        )}

      </div>
    </div>
  );
};