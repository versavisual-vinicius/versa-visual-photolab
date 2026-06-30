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
  motionBlurPx: number;
  cameraShakeBlurPx: number;
  subjectMotionBlurPx: number;
  dofMm: number;
  hasShallowDof: boolean;
  backgroundBlurPx: number;
  focalScale: number;
  previewBrightnessPercent: number;
  previewContrastPercent: number;
  previewSaturationPercent: number;
  grainOpacity: number;
  vignetteOpacity: number;
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

export interface ScenarioFeedbackCopy {
  underexposed?: string;
  overexposed?: string;
  noisy?: string;
  motionBlur?: string;
  shallowDofMissed?: string;
  perfect?: string;
  nextAttempt?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  imageUrl: string;
  imageUrls?: { under?: string; over?: string };
  ambientLight: number;
  challenge: ScenarioChallenge;
  ideal: ScenarioIdealSettings;
  // V2 pedagogical metadata (optional — not required for existing scenarios)
  learningOrder?: number;
  coursePillar?: string;
  courseModule?: string;
  intention?: string;
  professionalUse?: string;
  lightType?: string;
  lightDirection?: string;
  lightChallenge?: string;
  feedback?: ScenarioFeedbackCopy;
}

export interface ScoreBreakdown {
  total: number;
  exposureScore: number;
  noiseScore: number;
  motionScore: number;
  dofScore: number;
  // V2 dimensions (optional — populated when scenario has pedagogy metadata)
  intentionScore?: number;
  professionalScore?: number;
}

export interface AttemptFeedback {
  messages: string[];
  idealSettings: Pick<CameraSettings, "iso" | "aperture" | "shutterSpeed">;
  score: ScoreBreakdown;
  // V2 feedback sections (optional)
  technique?: string;
  eye?: string;
  professionalApplication?: string;
  nextAttempt?: string;
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
