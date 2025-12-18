// src/components/ModelUploadPanel.tsx
import React, { useState } from 'react';

interface Props {
  onFileUpload: (part: 'station' | 'bearing' | 'shaft', file: File) => void;
}

export const ModelUploadPanel: React.FC<Props> = ({ onFileUpload }) => {
  // 1. 定义折叠状态：默认展开 (true)
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (part: 'station' | 'bearing' | 'shaft') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileUpload(part, e.target.files[0]);
    }
  };

  const rowStyle: React.CSSProperties = { marginBottom: '10px' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#333' };

  return (
    <div style={{ 
      position: 'absolute', 
      top: 20, 
      right: 20, 
      width: '220px',
      background: 'rgba(255, 255, 255, 0.95)', //稍微增加一点不透明度
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)', 
      pointerEvents: 'auto',
      transition: 'height 0.3s ease', //以此增加平滑过渡效果（可选）
      overflow: 'hidden'
    }}>
      {/* === 标题栏 (始终显示) === */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '12px 15px',
          cursor: 'pointer',
          background: '#f5f5f5',
          borderBottom: isOpen ? '1px solid #eee' : 'none'
        }}
        onClick={() => setIsOpen(!isOpen)} // 点击标题栏即可折叠/展开
      >
        <h4 style={{ margin: 0, color: '#333', fontSize: '14px' }}>📁 模型导入</h4>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {isOpen ? '▼' : '▲'}
        </span>
      </div>
      
      {/* === 内容区 (折叠时隐藏) === */}
      {isOpen && (
        <div style={{ padding: '15px' }}>
          <div style={rowStyle}>
            <label style={labelStyle}>1. 实验台 (Base)</label>
            <input type="file" accept=".stl" onChange={handleChange('station')} style={{width: '100%', fontSize: '11px'}} />
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>2. 轴承瓦块 (Housing)</label>
            <input type="file" accept=".stl" onChange={handleChange('bearing')} style={{width: '100%', fontSize: '11px'}} />
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>3. 旋转轴 (Shaft)</label>
            <input type="file" accept=".stl" onChange={handleChange('shaft')} style={{width: '100%', fontSize: '11px'}} />
          </div>
          
          <div style={{fontSize: '10px', color: '#666', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '8px'}}>
            提示: 导入后使用下方灰色的 Leva 面板调整位置。
          </div>
        </div>
      )}
    </div>
  );
};