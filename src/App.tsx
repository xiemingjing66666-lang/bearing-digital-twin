// src/App.tsx
import React, { useState, useRef } from 'react';
import { DebugPanel } from './components/DebugPanel';
import type { ViewMode } from './components/DebugPanel'; // ✅ 修复：导入类型
import { BearingScene } from './scenes/BearingScene';
import { SettingsPanel } from './components/SettingsPanel';
import type { AppConfig, StationPart } from './components/SettingsPanel'; // ✅ 修复：导入类型

// 工具函数：Blob 转 Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// 工具函数：Base64 转 Blob
const base64ToBlob = async (base64: string): Promise<Blob> => {
  const res = await fetch(base64);
  return await res.blob();
};

function App() {
  const INITIAL_CONFIG: AppConfig = {
    station: [],
    bearing: { 
      url: null, transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
      material: { color: '#88ccee', opacity: 0.6 },
      heatmapAxis: 'z', heatmapOffset: 0
    },
    shaft: { 
      url: null, transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
      material: { color: '#ffd700', opacity: 1.0 },
      heatmapAxis: 'z', heatmapOffset: 0
    },
  };

  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('pressure');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNew = () => { if (window.confirm('确定要新建项目吗？')) window.location.reload(); };

  const handleSave = async () => {
    try {
      const saveObj: any = JSON.parse(JSON.stringify(config));
      // 保存基座
      for (let i = 0; i < config.station.length; i++) {
        if (config.station[i].url) {
          const b = await (await fetch(config.station[i].url!)).blob();
          saveObj.station[i].fileData = await blobToBase64(b);
          saveObj.station[i].url = null;
        }
      }
      // 保存轴承和主轴
      for (const key of ['bearing', 'shaft'] as const) {
        if (config[key].url) {
          const b = await (await fetch(config[key].url!)).blob();
          saveObj[key].fileData = await blobToBase64(b);
          saveObj[key].url = null;
        }
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(saveObj)], {type:'application/json'}));
      a.download = `project.json`;
      a.click();
    } catch(e) { alert('保存失败'); }
  };

  const handleOpenClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const savedObj = JSON.parse(await file.text());
      const newConfig = { ...INITIAL_CONFIG };
      
      // 恢复基座数组
      if (Array.isArray(savedObj.station)) {
        newConfig.station = [];
        for (const p of savedObj.station) {
          const part: StationPart = { ...p, url: null };
          if (p.fileData) part.url = URL.createObjectURL(await base64ToBlob(p.fileData));
          newConfig.station.push(part);
        }
      }
      // 恢复单体
      for (const key of ['bearing', 'shaft'] as const) {
        if (savedObj[key]) {
          newConfig[key] = { ...savedObj[key], url: null };
          if (savedObj[key].fileData) newConfig[key].url = URL.createObjectURL(await base64ToBlob(savedObj[key].fileData));
        }
      }
      setConfig(newConfig);
      setIsSettingsOpen(true);
    } catch(e) { alert('打开失败'); }
  };

  const handleDeleteStationPart = (id: string) => {
    if (window.confirm('确认删除?')) setConfig(p => ({...p, station: p.station.filter(x=>x.id!==id)}));
  };

  // ✅ 修复：明确参数类型，解决 any 报错
  const handleFileUpload = (part: 'station' | 'bearing' | 'shaft', file: File) => {
    const url = URL.createObjectURL(file);
    if (part === 'station') {
      setConfig(p => ({
        ...p,
        station: [...p.station, {
          id: Date.now().toString(),
          name: file.name,
          url,
          transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
          material: { color: '#555', opacity: 1 }
        }]
      }));
    } else {
      // ✅ 修复：使用类型断言，确保 p[key] 被视为对象
      const key = part as 'bearing' | 'shaft';
      setConfig(p => ({
        ...p,
        [key]: { ...p[key], url }
      }));
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={handleFileChange} />
      
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <BearingScene config={config} viewMode={viewMode} />
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <DebugPanel onViewModeChange={setViewMode} />
        </div>
        
        {!isSettingsOpen && (
          <button 
            onClick={() => setIsSettingsOpen(true)}
            style={{ position: 'absolute', top: 20, right: 20, pointerEvents: 'auto', padding: '10px 20px', background: '#4facfe', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          >
            ⚙️ 设置 / 文件
          </button>
        )}

        <div style={{ pointerEvents: 'auto' }}>
          <SettingsPanel 
            isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}
            config={config} onConfigChange={setConfig} onFileUpload={handleFileUpload}
            onDeleteStationPart={handleDeleteStationPart}
            onNew={handleNew} onSave={handleSave} onOpen={handleOpenClick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;