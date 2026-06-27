export interface CameraSettings {
  iso: number;
  aperture: number;
  shutterSpeed: number;
  focalLength: number;
  subjectDistance: number;
  ambientLight: number;
  tripod: boolean;
}

export interface ExposureResult {
  ev: number;
  evScene: number;
  evDelta: number;
  isUnderexposed: boolean;
  isOverexposed: boolean;
  hasNoise: boolean;
  hasMotionBlur: boolean;
  dofMm: number;
  hasShallowDof: boolean;
}

export interface ScenarioChallenge {
  description: string;
  hints: string[];
}

export interface ScenarioIdealSettings {
  iso: number;
  aperture: number;
  shutterSpeed: number;
  toleranceEV: number;
  requiresShallowDof: boolean;
  requiresFrozenMotion: boolean;
  requiresLowNoise: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  imageUrl: string;
  ambientLight: number;
  challenge: ScenarioChallenge;
  ideal: ScenarioIdealSettings;
}

export interface ScoreBreakdown {
  total: number;
  exposureScore: number;
  noiseScore: number;
  motionScore: number;
  dofScore: number;
}

export interface AttemptFeedback {
  messages: string[];
  idealSettings: Pick<CameraSettings, "iso" | "aperture" | "shutterSpeed">;
  score: ScoreBreakdown;
}

export interface Concept {
  slug: string;
  title: string;
  summary: string;
  readingTimeMinutes: number;
  emoji: string;
  body: string;
}

export interface UserProgress {
  xp: number;
  scenariosCompleted: string[];
  conceptsRead: string[];
}
