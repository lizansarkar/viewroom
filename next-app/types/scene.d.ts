export type HotspotType = 'icon' | 'arrow';

export type SceneHotspot = {
  type: HotspotType;
  icon?: string;
  yaw: number;
  pitch: number;
  target: string;
  label?: string;
};

export type SceneData = {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  hotspots: SceneHotspot[];
};
