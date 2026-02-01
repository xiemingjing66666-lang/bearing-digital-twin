// src/App.tsx
import React, { useState, useRef, useEffect } from 'react';
import { BearingScene } from './scenes/BearingScene';
import { SettingsPanel, type AppConfig, type StationPart, type ViewMode } from './components/SettingsPanel';
import { mockService } from './services/MockDataService';

// 引入新组件
import { TopBar } from './components/dashboard/TopBar';
import { LeftPanel } from './components/dashboard/LeftPanel';
import { RightPanel } from './components/dashboard/RightPanel';
import { BottomPanel } from './components/dashboard/BottomPanel';

// ... (工具函数保持不变: blobToBase64, base64ToBlob) ...

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
  // ... (Config 保持不变) ...
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

  // 全局启动服务
  useEffect(() => {
    mockService.start();
    return () => mockService.stop();
  }, []);

  // ... (handleNew, handleSave, handleOpenClick, handleFileChange, handleDeleteStationPart, handleFileUpload 保持不变) ...
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
      const key = part as 'bearing' | 'shaft';
      setConfig(p => ({
        ...p,
        [key]: { ...p[key], url }
      }));
    }
  };


  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden' }}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={handleFileChange} />
      
      {/* 1. 顶部 Header */}
      <TopBar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* 2. 主体区域 (Flex Row) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* 左侧控制栏 */}
        <LeftPanel viewMode={viewMode} onViewModeChange={setViewMode} />

        {/* 中央显示区 (Flex Column: 3D + Bottom) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          {/* 3D 场景层 */}
          <div style={{ flex: 1, position: 'relative' }}>
             {/* 注意：Canvas 默认会填满父容器。
                我们在这里放置 BearingScene，它内部是绝对定位还是响应式 Canvas 取决于实现。
                通常 R3F Canvas 设为 width: 100%, height: 100% 即可。
                这里为了保险，我们在 BearingScene 外面套一个 div 确保尺寸。
             */}
             <div style={{ width: '100%', height: '100%' }}>
                <BearingScene config={config} viewMode={viewMode} />
             </div>
          </div>

          {/* 底部趋势栏 */}
          <BottomPanel />
        </div>

        {/* 右侧指标栏 */}
        <RightPanel />

      </div>

      {/* 悬浮/抽屉式设置面板 (不占据布局空间) */}
      <SettingsPanel 
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}
        config={config} onConfigChange={setConfig} onFileUpload={handleFileUpload}
        onDeleteStationPart={handleDeleteStationPart}
        onNew={handleNew} onSave={handleSave} onOpen={handleOpenClick}
        viewMode={viewMode} onViewModeChange={setViewMode}
      />
    </div>
  );
}

export default App;