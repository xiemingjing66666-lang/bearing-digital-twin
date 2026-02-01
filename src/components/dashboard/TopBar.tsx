// src/components/dashboard/TopBar.tsx
import React, { useState, useEffect } from 'react';

interface Props {
  onOpenSettings: () => void;
}

export const TopBar: React.FC<Props> = ({ onOpenSettings }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      height: '60px', background: '#1a1a1a', borderBottom: '1px solid #333',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', color: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', background: '#4facfe', borderRadius: '4px' }} />
        <h1 style={{ fontSize: '18px', margin: 0, fontWeight: 500 }}>
          滑动轴承数字孪生健康管理系统 <span style={{fontSize: '12px', color: '#666', marginLeft:'5px'}}>v1.0</span>
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '14px', fontFamily: 'monospace', color: '#aaa' }}>
          {time.toLocaleTimeString()}
        </span>
        <div style={{ width: '1px', height: '20px', background: '#444' }} />
        <button 
          onClick={onOpenSettings}
          style={{
            background: 'transparent', border: '1px solid #444', color: '#eee',
            padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
          }}
        >
          ⚙️ 系统设置
        </button>
      </div>
    </div>
  );
};