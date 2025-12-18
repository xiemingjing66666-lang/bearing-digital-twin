// src/App.tsx
import { useState, useRef } from 'react';
import { DebugPanel } from './components/DebugPanel';
import { BearingScene } from './scenes/BearingScene';
import { SettingsPanel } from './components/SettingsPanel';
import type { AppConfig, PartConfig } from './components/SettingsPanel';

// === 工具函数：Blob 转 Base64 (用于保存) ===
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// === 工具函数：Base64 转 Blob (用于打开) ===
const base64ToBlob = async (base64: string): Promise<Blob> => {
  const res = await fetch(base64);
  return await res.blob();
};

function App() {
  // 初始状态常量
  const INITIAL_CONFIG: AppConfig = {
    station: { 
      url: null, transform: { position: [0, 0, 0], rotation: [0, 0, 0] },
      material: { color: '#555555', opacity: 1.0 }
    },
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
  
  // 隐藏的文件输入框引用，用于“打开”功能
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. 新建 (Reset) ---
  const handleNew = () => {
    if (window.confirm('确定要新建项目吗？未保存的进度将丢失。')) {
      // 最稳健的重置方式：刷新页面
      window.location.reload();
    }
  };

  // --- 2. 保存 (Save) ---
  const handleSave = async () => {
    try {
      // 创建一个可序列化的对象，用于存储 JSON
      const saveObj: any = JSON.parse(JSON.stringify(config)); // 深拷贝配置数据

      // 遍历所有部件，如果有 URL (说明导入了模型)，则需要把模型数据(Blob)抓取出来转成 Base64
      for (const key of ['station', 'bearing', 'shaft'] as const) {
        if (config[key].url) {
          const response = await fetch(config[key].url!);
          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          // 在保存的文件里，用 fileData 字段存储巨大的 Base64 字符串
          saveObj[key].fileData = base64;
          // url 字段在本地没用，清空避免误导
          saveObj[key].url = null; 
        }
      }

      // 生成 JSON 字符串
      const jsonString = JSON.stringify(saveObj, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // 触发下载
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `bearing_twin_project_${new Date().toISOString().slice(0,10)}.json`;
      link.click();
    } catch (e) {
      console.error('Save failed:', e);
      alert('保存失败，请查看控制台错误信息。');
    }
  };

  // --- 3. 打开 (Open) ---
  const handleOpenClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const savedObj = JSON.parse(text);
      
      const newConfig = { ...INITIAL_CONFIG }; // 从初始状态开始构建

      // 遍历解析
      for (const key of ['station', 'bearing', 'shaft'] as const) {
        const savedPart = savedObj[key];
        
        // 恢复参数 (Transform & Material)
        if (savedPart) {
          newConfig[key].transform = savedPart.transform;
          newConfig[key].material = savedPart.material;

          // 恢复模型文件 (如果有 Base64 数据)
          if (savedPart.fileData) {
            const blob = await base64ToBlob(savedPart.fileData);
            const newUrl = URL.createObjectURL(blob);
            newConfig[key].url = newUrl;
          }
        }
      }

      // 更新状态
      setConfig(newConfig);
      setIsSettingsOpen(true); // 打开面板让用户看到加载结果
      
      // 清空 input 防止重复选择同文件不触发 onChange
      e.target.value = ''; 
    } catch (e) {
      console.error('Open failed:', e);
      alert('打开文件失败：格式错误或文件损坏。');
    }
  };

  // --- 原有上传逻辑 ---
  const handleFileUpload = (part: keyof AppConfig, file: File) => {
    if (config[part].url) URL.revokeObjectURL(config[part].url!);
    const newUrl = URL.createObjectURL(file);
    setConfig(prev => ({
      ...prev,
      [part]: { ...prev[part], url: newUrl }
    }));
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      
      {/* 隐藏的 input 用于打开文件 */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json" 
        onChange={handleFileChange} 
      />

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
              position: 'absolute', top: 20, right: 20,
              pointerEvents: 'auto', padding: '10px 20px',
              background: '#4facfe', color: 'white', border: 'none',
              borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}
          >
            ⚙️ 设置 / 文件
          </button>
        )}

        <div style={{ pointerEvents: 'auto' }}>
          <SettingsPanel 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)}
            config={config}
            onConfigChange={setConfig}
            onFileUpload={handleFileUpload}
            // 传递新功能的处理器
            onNew={handleNew}
            onSave={handleSave}
            onOpen={handleOpenClick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;