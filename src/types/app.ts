export type ViewMode = 'pressure' | 'thickness' | 'temperature';

export interface ModelMaterial {
  color: string;
  opacity: number;
}

export interface ModelTransform {
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface SinglePartConfig {
  url: string | null;
  transform: ModelTransform;
  material: ModelMaterial;
  heatmapAxis?: 'x' | 'y' | 'z';
  heatmapOffset?: number;
}

export interface StationPart {
  id: string;
  name: string;
  url: string | null;
  transform: ModelTransform;
  material: ModelMaterial;
}

export interface AppConfig {
  station: StationPart[];
  bearing: SinglePartConfig;
  shaft: SinglePartConfig;
}
