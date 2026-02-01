// src/components/dashboard/BottomPanel.tsx
import React from 'react';

export const BottomPanel: React.FC = () => {
  return (
    <div style={{ height: '160px', background: '#151515', borderTop: '1px solid #333', padding: '15px' }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888' }}>趋势分析 (Trend Analysis - Placeholder)</h4>
      <div style={{ 
        width: '100%', height: '100px', 
        background: 'linear-gradient(90deg, #222 1px, transparent 1px), linear-gradient(#222 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        border: '1px dashed #333',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: '12px'
      }}>
        [此处将集成 ECharts 实时折线图]
      </div>
    </div>
  );
};