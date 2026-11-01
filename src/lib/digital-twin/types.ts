export type CameraPreset = "ISO" | "FRONT" | "PLAN" | "END";

export interface SubAssemblyMetadata {
  id: "filter-bank" | "cooling-coil" | "centrifugal-fan" | "skid-base";
  num: string;
  name: string;
  discipline: string;
  hotspotAnchor: [number, number, number];
  materialSpecs: string;
  manufacturingProcess: string;
  designTolerances: string;
  validationStandard: string;
}

export interface DigitalTwinState {
  mode: "story" | "inspector";
  explodeFactor: number; // 0.0 to 1.0
  cameraPreset: CameraPreset;
  selectedAssemblyId: string | null;
  isFullscreen: boolean;
}
