import React, { useEffect, useState } from 'react';

interface Props {
  onOpenSettings: () => void;
  systemStatus: 'ONLINE' | 'ALARM';
}

export const TopBar: React.FC<Props> = ({ onOpenSettings, systemStatus }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'linear-gradient(180deg, #25c4ff, #1478de)',
          }}
        />
        <h1 className="brand-title">
          滑动轴承数字孪生监测系统 <span className="badge">v1.1</span>
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{time.toLocaleString()}</span>
        <span
          style={{
            color: systemStatus === 'ALARM' ? 'var(--danger)' : 'var(--success)',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {systemStatus}
        </span>
        <button type="button" onClick={onOpenSettings} className="tool-btn">
          系统设置
        </button>
      </div>
    </header>
  );
};
