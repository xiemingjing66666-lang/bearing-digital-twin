import React, { useEffect, useRef, useState } from 'react';
import { LeftPanel } from './components/dashboard/LeftPanel';
import { BottomPanel } from './components/dashboard/BottomPanel';
import { RightPanel } from './components/dashboard/RightPanel';
import { TopBar } from './components/dashboard/TopBar';
import { SettingsPanel } from './components/SettingsPanel';
import { useTelemetry } from './hooks/useTelemetry';
import { BearingScene } from './scenes/BearingScene';
import { telemetryService } from './services/telemetryService';
import type { AppConfig, StationPart, ViewMode } from './types/app';
import './styles/theme.css';
import './styles/app.css';

interface PersistedPart extends Omit<StationPart, 'url'> {
  url: null;
  fileData?: string;
}

interface PersistedConfig {
  station: PersistedPart[];
  bearing: {
    url: null;
    fileData?: string;
    transform: AppConfig['bearing']['transform'];
    material: AppConfig['bearing']['material'];
    heatmapAxis?: 'x' | 'y' | 'z';
    heatmapOffset?: number;
  };
  shaft: {
    url: null;
    fileData?: string;
    transform: AppConfig['shaft']['transform'];
    material: AppConfig['shaft']['material'];
    heatmapAxis?: 'x' | 'y' | 'z';
    heatmapOffset?: number;
  };
}

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const base64ToBlob = async (base64: string): Promise<Blob> => {
  const response = await fetch(base64);
  return response.blob();
};

const initialConfig: AppConfig = {
  station: [],
  bearing: {
    url: null,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
    material: { color: '#88ccee', opacity: 0.6 },
    heatmapAxis: 'z',
    heatmapOffset: 0,
  },
  shaft: {
    url: null,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
    material: { color: '#ffd700', opacity: 1 },
    heatmapAxis: 'z',
    heatmapOffset: 0,
  },
};

function App() {
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('pressure');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { telemetry, trendPoints, logs, systemStatus } = useTelemetry();

  useEffect(() => {
    telemetryService.start();
    return () => telemetryService.stop();
  }, []);

  const handleNew = () => {
    if (window.confirm('确认要新建项目吗？当前未保存内容会丢失。')) {
      window.location.reload();
    }
  };

  const handleSave = async () => {
    try {
      const saveObj: PersistedConfig = {
        station: [],
        bearing: { ...config.bearing, url: null },
        shaft: { ...config.shaft, url: null },
      };

      for (const stationPart of config.station) {
        const persistedPart: PersistedPart = { ...stationPart, url: null };
        if (stationPart.url) {
          const blob = await (await fetch(stationPart.url)).blob();
          persistedPart.fileData = await blobToBase64(blob);
        }
        saveObj.station.push(persistedPart);
      }

      for (const key of ['bearing', 'shaft'] as const) {
        const part = config[key];
        if (part.url) {
          const blob = await (await fetch(part.url)).blob();
          saveObj[key].fileData = await blobToBase64(blob);
        }
      }

      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(saveObj)], { type: 'application/json' }));
      a.download = 'project.json';
      a.click();
    } catch {
      alert('保存失败，请重试');
    }
  };

  const handleOpenClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const savedObj = JSON.parse(await file.text()) as PersistedConfig;
      const newConfig: AppConfig = structuredClone(initialConfig);

      if (Array.isArray(savedObj.station)) {
        newConfig.station = [];
        for (const part of savedObj.station) {
          const restoredPart: StationPart = { ...part, url: null };
          if (part.fileData) {
            restoredPart.url = URL.createObjectURL(await base64ToBlob(part.fileData));
          }
          newConfig.station.push(restoredPart);
        }
      }

      for (const key of ['bearing', 'shaft'] as const) {
        const part = savedObj[key];
        if (!part) continue;

        newConfig[key] = { ...part, url: null };
        if (part.fileData) {
          newConfig[key].url = URL.createObjectURL(await base64ToBlob(part.fileData));
        }
      }

      setConfig(newConfig);
      setIsSettingsOpen(true);
    } catch {
      alert('打开失败，请确认文件格式正确');
    }
  };

  const handleDeleteStationPart = (id: string) => {
    if (window.confirm('确认删除该基座零件吗？')) {
      setConfig((prev) => ({ ...prev, station: prev.station.filter((item) => item.id !== id) }));
    }
  };

  const handleFileUpload = (part: 'station' | 'bearing' | 'shaft', file: File) => {
    const url = URL.createObjectURL(file);

    if (part === 'station') {
      setConfig((prev) => ({
        ...prev,
        station: [
          ...prev.station,
          {
            id: Date.now().toString(),
            name: file.name,
            url,
            transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
            material: { color: '#445d7c', opacity: 1 },
          },
        ],
      }));
      return;
    }

    setConfig((prev) => ({
      ...prev,
      [part]: { ...prev[part], url },
    }));
  };

  return (
    <div className="app-root">
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />

      <TopBar onOpenSettings={() => setIsSettingsOpen(true)} systemStatus={systemStatus} />

      <div className="app-main">
        <LeftPanel
          telemetry={telemetry}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          systemStatus={systemStatus}
        />

        <div className="center-stack">
          <div className="panel scene-shell" style={{ position: 'relative' }}>
            <BearingScene config={config} viewMode={viewMode} telemetry={telemetry} />
          </div>
          <BottomPanel points={trendPoints} />
        </div>

        <RightPanel telemetry={telemetry} logs={logs} />
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onConfigChange={setConfig}
        onFileUpload={handleFileUpload}
        onDeleteStationPart={handleDeleteStationPart}
        onNew={handleNew}
        onSave={handleSave}
        onOpen={handleOpenClick}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  );
}

export default App;

