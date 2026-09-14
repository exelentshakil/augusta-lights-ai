export type LightingSystemType = "christmas_c9" | "omni_permanent";

export interface RooflineSegment {
  id: string;
  name: string;
  points: [number, number][]; // percentage coordinates [x%, y%]
  isFrontFacing: boolean;
  enabled: boolean;
  bulbCount: number;
}

export interface WindowCoordinate {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  panes: number;
}

export interface TreeCoordinate {
  id: string;
  name: string;
  trunkX: number;
  baseY: number;
  canopyX: number;
  canopyY: number;
  radius: number;
}

export interface PropertyImagePreset {
  id: string;
  name: string;
  style: string;
  description: string;
  architectureType: string;
  hasVehicle: boolean;
  vehicleDescription?: string;
  hasTrashCans: boolean;
  rooflines: RooflineSegment[];
  windows: WindowCoordinate[];
  trees: TreeCoordinate[];
  wreathAnchor: { x: number; y: number };
  drivewayBounds: { startX: number; startY: number; endX: number; endY: number };
}

export interface ChristmasPattern {
  id: string;
  name: string;
  colorName: string;
  palette: string[]; // e.g. ["#ffdf9e"] for warm white, ["#ef4444", "#ef4444", "#ffffff", "#ffffff"] for candy cane
  colorDescriptions: string;
  isBestSeller?: boolean;
  bulbType: "SMD C9 Commercial LED";
  spacingInches: 15;
}

export interface OmniPattern {
  id: string;
  name: string;
  colorName: string;
  beamColor: string;
  ambientColor: string;
  spacingInches: 8;
  wallWashReachPct: number;
  description: string;
}

export interface DecorOptions {
  treeWraps: {
    enabled: boolean;
    treeId?: string;
    lightType: "5mm Warm White Mini" | "5mm Cool White Mini" | "5mm Multicolor";
    placementNote: string;
  };
  shrubs: {
    enabled: boolean;
    lightType: "5mm Warm White Mini" | "5mm Red/Green Mini";
    placementNote: string;
  };
  wreaths: {
    enabled: boolean;
    sizeInches: 36 | 48 | 60;
    placementNote: string;
  };
  groundStakes: {
    enabled: boolean;
    location: "driveway" | "sidewalk" | "flower_beds";
    color: string;
    placementNote: string;
  };
}

export interface CustomerResidence {
  lastName: string;
  residenceTitle: string;
  address: string;
  franchiseLocation: string;
  consultationDate: string;
  initialBallparkQuote: number;
}

export interface RenderTelemetry {
  provider: "OpenAI" | "Gemini" | "Deterministic Local Engine";
  model: string;
  latencyMs: number;
  architecturalPreservationScore: number;
  detectedRooflineSegments: number;
  totalBulbCount: number;
  timestamp: string;
}
