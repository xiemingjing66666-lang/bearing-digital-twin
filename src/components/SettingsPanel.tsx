import React, { useMemo, useState } from 'react';
import { telemetryService } from '../services/telemetryService';
import type { AppConfig, SinglePartConfig, StationPart, ViewMode } from '../types/app';

type EditableTab = 'station' | 'bearing' | 'shaft' | 'simulation';

type EditableTarget = StationPart | SinglePartConfig;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onConfigChange: (newConfig: AppConfig) => void;
  onFileUpload: (part: 'station' | 'bearing' | 'shaft', file: File) => void;
  onDeleteStationPart: (id: string) => void;
  onNew: () => void;
  onSave: () => void;
  onOpen: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const tabText: Record<EditableTab, string> = {
  station: '基座',
  bearing: '轴承',
  shaft: '主轴',
  simulation: '模拟',
};

const modeText: Record<ViewMode, string> = {
  pressure: '压力',
  thickness: '膜厚',
  temperature: '温度',
};

const clampNum = (value: string, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const updateTransformPosition = (target: EditableTarget, axis: 0 | 1 | 2, value: number) => {
  target.transform.position[axis] = value;
};

const updateTransformRotation = (target: EditableTarget, axis: 0 | 1 | 2, delta: number) => {
  target.transform.rotation[axis] += delta;
};

const isSinglePartConfig = (target: EditableTarget): target is SinglePartConfig => {
  return 'heatmapAxis' in target;
};

export const SettingsPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
  onFileUpload,
  onDeleteStationPart,
  onNew,
  onSave,
  onOpen,
  viewMode,
  onViewModeChange,
}) => {
  const [activeTab, setActiveTab] = useState<EditableTab>('station');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [rpm, setRpm] = useState(3000);
  const [load, setLoad] = useState(10000);
  const [loadDirection, setLoadDirection] = useState(0);

  const actualStationId = useMemo(() => {
    if (selectedStationId && config.station.some((item) => item.id === selectedStationId)) {
      return selectedStationId;
    }
    return config.station[0]?.id ?? null;
  }, [config.station, selectedStationId]);

  const currentTarget: EditableTarget | null = useMemo(() => {
    if (activeTab === 'station') {
      return config.station.find((item) => item.id === actualStationId) ?? null;
    }
    if (activeTab === 'bearing') return config.bearing;
    if (activeTab === 'shaft') return config.shaft;
    return null;
  }, [activeTab, actualStationId, config]);

  const mutateCurrentTarget = (handler: (target: EditableTarget) => void) => {
    if (!currentTarget) return;

    if (activeTab === 'station') {
      const idx = config.station.findIndex((item) => item.id === actualStationId);
      if (idx < 0) return;

      const clonedStation = config.station.map((item, i) => (i === idx ? structuredClone(item) : item));
      handler(clonedStation[idx]);
      onConfigChange({ ...config, station: clonedStation });
      return;
    }

    if (activeTab === 'bearing' || activeTab === 'shaft') {
      const cloned = structuredClone(config[activeTab]);
      handler(cloned);
      onConfigChange({ ...config, [activeTab]: cloned });
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="settings-drawer">
      <div className="settings-head">
        <strong>工程管理</strong>
        <button type="button" className="tool-btn" onClick={onClose}>
          关闭
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: 12, borderBottom: '1px solid var(--border)' }}>
        <button type="button" className="tool-btn" onClick={onNew}>新建</button>
        <button type="button" className="tool-btn" onClick={onOpen}>打开</button>
        <button type="button" className="tool-btn" onClick={onSave}>保存</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: 10, borderBottom: '1px solid var(--border)' }}>
        {(Object.keys(tabText) as EditableTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`view-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ marginBottom: 0, textAlign: 'center', padding: 8 }}
          >
            {tabText[tab]}
          </button>
        ))}
      </div>

      <div className="settings-body">
        {activeTab === 'simulation' && (
          <>
            <div className="field-row">
              <label>可视化模式</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {(Object.keys(modeText) as ViewMode[]).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => onViewModeChange(mode)}
                    className={`view-btn ${mode === viewMode ? 'active' : ''}`}
                    style={{ margin: 0, textAlign: 'center', padding: 8 }}
                  >
                    {modeText[mode]}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <label>转速 (RPM): {rpm}</label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={rpm}
                onChange={(event) => {
                  const value = clampNum(event.target.value, 0);
                  setRpm(value);
                  telemetryService.updateParams({ rpm: value });
                }}
                className="dark-input"
              />
            </div>

            <div className="field-row">
              <label>载荷 (N): {load}</label>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={load}
                onChange={(event) => {
                  const value = clampNum(event.target.value, 0);
                  setLoad(value);
                  telemetryService.updateParams({ load: value });
                }}
                className="dark-input"
              />
            </div>

            <div className="field-row">
              <label>载荷方向 (°): {loadDirection}</label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={loadDirection}
                onChange={(event) => {
                  const value = clampNum(event.target.value, 0);
                  setLoadDirection(value);
                  telemetryService.updateParams({ loadDirection: value });
                }}
                className="dark-input"
              />
            </div>
          </>
        )}

        {activeTab !== 'simulation' && (
          <>
            <div className="field-row">
              <label>{activeTab === 'station' ? '添加基座部件 STL' : '加载 STL 模型'}</label>
              <input
                type="file"
                accept=".stl"
                className="dark-input"
                onClick={(event) => {
                  (event.target as HTMLInputElement).value = '';
                }}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  onFileUpload(activeTab, file);
                }}
              />
            </div>

            {activeTab === 'station' && (
              <div className="field-row">
                <label>基座零件列表</label>
                <div style={{ display: 'grid', gap: 8 }}>
                  {config.station.length === 0 && <div className="badge">暂无零件</div>}
                  {config.station.map((part) => (
                    <div
                      key={part.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: 8,
                        alignItems: 'center',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        padding: 8,
                        background: part.id === actualStationId ? 'var(--accent-soft)' : 'transparent',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedStationId(part.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'left',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        {part.name}
                      </button>
                      <button type="button" className="tool-btn" onClick={() => onDeleteStationPart(part.id)}>
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTarget && (
              <>
                <div className="field-row">
                  <label>位置 (XYZ)</label>
                  {[0, 1, 2].map((axis) => (
                    <div key={axis} className="range-row" style={{ marginBottom: 8 }}>
                      <input
                        type="range"
                        min="-1000"
                        max="1000"
                        step="1"
                        value={currentTarget.transform.position[axis as 0 | 1 | 2]}
                        onChange={(event) =>
                          mutateCurrentTarget((target) =>
                            updateTransformPosition(target, axis as 0 | 1 | 2, clampNum(event.target.value)),
                          )
                        }
                        className="dark-input"
                      />
                      <input
                        type="number"
                        className="dark-input"
                        value={currentTarget.transform.position[axis as 0 | 1 | 2]}
                        onChange={(event) =>
                          mutateCurrentTarget((target) =>
                            updateTransformPosition(target, axis as 0 | 1 | 2, clampNum(event.target.value)),
                          )
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="field-row">
                  <label>旋转</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {(['X', 'Y', 'Z'] as const).map((axisName, idx) => (
                      <button
                        type="button"
                        key={axisName}
                        className="tool-btn"
                        onClick={() => mutateCurrentTarget((target) => updateTransformRotation(target, idx as 0 | 1 | 2, Math.PI / 2))}
                      >
                        {axisName} +90°
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === 'bearing' && isSinglePartConfig(currentTarget) && (
                  <div className="field-row">
                    <label>热力图映射设置</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                      {(['x', 'y', 'z'] as const).map((axis) => (
                        <button
                          type="button"
                          key={axis}
                          className={`view-btn ${currentTarget.heatmapAxis === axis ? 'active' : ''}`}
                          style={{ marginBottom: 0, textAlign: 'center', padding: 8 }}
                          onClick={() => mutateCurrentTarget((target) => {
                            if (isSinglePartConfig(target)) target.heatmapAxis = axis;
                          })}
                        >
                          {axis.toUpperCase()} 轴
                        </button>
                      ))}
                    </div>

                    <div className="range-row">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        className="dark-input"
                        value={currentTarget.heatmapOffset ?? 0}
                        onChange={(event) => mutateCurrentTarget((target) => {
                          if (isSinglePartConfig(target)) target.heatmapOffset = clampNum(event.target.value, 0);
                        })}
                      />
                      <input
                        type="number"
                        className="dark-input"
                        value={currentTarget.heatmapOffset ?? 0}
                        onChange={(event) => mutateCurrentTarget((target) => {
                          if (isSinglePartConfig(target)) target.heatmapOffset = clampNum(event.target.value, 0);
                        })}
                      />
                    </div>
                  </div>
                )}

                <div className="field-row">
                  <label>材质颜色</label>
                  <input
                    type="color"
                    className="dark-input"
                    value={currentTarget.material.color}
                    onChange={(event) => mutateCurrentTarget((target) => {
                      target.material.color = event.target.value;
                    })}
                  />
                </div>

                <div className="field-row">
                  <label>透明度: {currentTarget.material.opacity.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    className="dark-input"
                    value={currentTarget.material.opacity}
                    onChange={(event) => mutateCurrentTarget((target) => {
                      target.material.opacity = clampNum(event.target.value, 1);
                    })}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
