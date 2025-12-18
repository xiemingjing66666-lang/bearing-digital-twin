// src/App.tsx
import { useState, useRef } from 'react';
import { DebugPanel } from './components/DebugPanel';
import { BearingScene } from './scenes/BearingScene';
import { SettingsPanel } from './components/SettingsPanel';
import type { AppConfig, StationPart } from './components/SettingsPanel';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const base64ToBlob = async (base64: string): Promise<Blob> => {
  const res = await fetch(base64);
  return await res.blob();
};

function App() {
  // 初始状态：station 是空数组
  const INITIAL_CONFIG: AppConfig = {
    station: [], // 数组
    bearing: { 
      url: null, transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
      material: { color: '#88ccee', opacity: 0.6 }
    },
    shaft: { 
      url: null, transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
      material: { color: '#ffd700', opacity: 1.0 }
    },
  };

  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNew = () => {
    if (window.confirm('确定要新建项目吗？未保存的进度将丢失。')) {
      window.location.reload();
    }
  };

  const handleSave = async () => {
    try {
      const saveObj: any = JSON.parse(JSON.stringify(config));

      // 1. 保存基座数组中的所有文件
      for (let i = 0; i < config.station.length; i++) {
        if (config.station[i].url) {
          const response = await fetch(config.station[i].url!);
          const blob = await response.blob();
          saveObj.station[i].fileData = await blobToBase64(blob);
          saveObj.station[i].url = null;
        }
      }

      // 2. 保存单体部件
      for (const key of ['bearing', 'shaft'] as const) {
        if (config[key].url) {
          const response = await fetch(config[key].url!);
          const blob = await response.blob();
          saveObj[key].fileData = await blobToBase64(blob);
          saveObj[key].url = null;
        }
      }

      const jsonString = JSON.stringify(saveObj, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `bearing_project_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
      link.click();
    } catch (e) {
      console.error(e);
      alert('保存失败');
    }
  };

  const handleOpenClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const savedObj = JSON.parse(text);
      const newConfig = { ...INITIAL_CONFIG };

      // 1. 恢复基座数组
      if (Array.isArray(savedObj.station)) {
        newConfig.station = [];
        for (const savedPart of savedObj.station) {
          const part: StationPart = {
            id: savedPart.id,
            name: savedPart.name,
            url: null,
            transform: savedPart.transform,
            material: savedPart.material
          };
          if (savedPart.fileData) {
            const blob = await base64ToBlob(savedPart.fileData);
            part.url = URL.createObjectURL(blob);
          }
          newConfig.station.push(part);
        }
      }

      // 2. 恢复单体部件
      for (const key of ['bearing', 'shaft'] as const) {
        const savedPart = savedObj[key];
        if (savedPart) {
          newConfig[key].transform = savedPart.transform;
          newConfig[key].material = savedPart.material;
          if (savedPart.fileData) {
            const blob = await base64ToBlob(savedPart.fileData);
            newConfig[key].url = URL.createObjectURL(blob);
          }
        }
      }

      setConfig(newConfig);
      setIsSettingsOpen(true);
      e.target.value = ''; 
    } catch (e) {
      console.error(e);
      alert('打开文件失败');
    }
  };

  // 新增：删除基座零件
  const handleDeleteStationPart = (id: string) => {
    if (!window.confirm('确定要删除这个零件吗？')) return;
    setConfig(prev => ({
      ...prev,
      station: prev.station.filter(p => p.id !== id)
    }));
  };

  // 统一文件上传处理
  const handleFileUpload = (part: 'station' | 'bearing' | 'shaft', file: File) => {
    const newUrl = URL.createObjectURL(file);

    if (part === 'station') {
      // 基座：添加到数组
      const newPart: StationPart = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5), // 生成唯一ID
        name: file.name,
        url: newUrl,
        transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
        material: { color: '#555555', opacity: 1.0 } // 默认材质
      };
      setConfig(prev => ({
        ...prev,
        station: [...prev.station, newPart]
      }));
    } else {
      // 单体：替换
      if (config[part].url) URL.revokeObjectURL(config[part].url!);
      setConfig(prev => ({
        ...prev,
        [part]: { ...prev[part], url: newUrl }
      }));
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={handleFileChange} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <BearingScene config={config} />
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <DebugPanel />
        </div>

        {!isSettingsOpen && (
          <button 
            onClick={() => setIsSettingsOpen(true)}
            style={{
              position: 'absolute', top: 20, right: 20, pointerEvents: 'auto', padding: '10px 20px',
              background: '#4facfe', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}
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