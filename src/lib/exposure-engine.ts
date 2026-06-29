import type {
  CameraSettings,
  ExposureResult,
  ScenarioIdealSettings,
  AttemptFeedback,
  ScoreBreakdown,
} from "@/types";

const COC_MM = 0.029;
const FOCAL_LENGTH_REFERENCE_MM = 25;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function calculateFocalLengthScale(focalLength: number) {
  return clamp(focalLength / FOCAL_LENGTH_REFERENCE_MM, 0.75, 6);
}

function calculatePreviewBrightness(evDelta: number) {
  return clamp(100 - evDelta * 25, 8, 185);
}

function calculatePreviewContrast(evDelta: number) {
  const exposureStress = Math.min(1, Math.abs(evDelta) / 3);
  return clamp(108 - exposureStress * 24, 78, 112);
}

function calculatePreviewSaturation(evDelta: number, iso: number) {
  const exposureStress = Math.min(1, Math.abs(evDelta) / 3);
  const isoStress = Math.min(1, Math.max(0, Math.log2(iso / 800)) / 4);
  return clamp(105 - exposureStress * 24 - isoStress * 10, 70, 108);
}

function calculateGrainOpacity(iso: number) {
  if (iso <= 800) return 0;
  return clamp(Math.log2(iso / 800) * 0.08, 0.08, 0.34);
}

export function calculateExposure(s: CameraSettings): ExposureResult {
  const ev100 = Math.log2(s.aperture ** 2 / s.shutterSpeed);
  const ev = ev100 - Math.log2(s.iso / 100);
  const evScene = s.ambientLight;
  const evDelta = ev - evScene;

  const f = s.focalLength;
  const N = s.aperture;
  const c = COC_MM;
  const d = s.subjectDistance * 1000;
  const hyperfocal = f ** 2 / (N * c);
  const dofNear = (hyperfocal * d) / (hyperfocal + (d - f));
  const dofFar =
    d >= hyperfocal ? Infinity : (hyperfocal * d) / (hyperfocal - (d - f));
  const dofMm = dofFar === Infinity ? 999999 : dofFar - dofNear;

  const freezeShutter = 1 / 60;
  const subjectMotionBlurPx =
    s.shutterSpeed > freezeShutter
      ? clamp(Math.log2(s.shutterSpeed / freezeShutter) * 1.2, 0, 6)
      : 0;
  const safeShutterByFocal =
    s.focalLength <= 25
      ? 1 / 60
      : s.focalLength <= 50
        ? 1 / 125
        : s.focalLength <= 85
          ? 1 / 160
          : 1 / 250;
  const safeShutter = Math.max(1 / s.focalLength, safeShutterByFocal);
  const cameraShakeBlurPx =
    !s.tripod && s.shutterSpeed > safeShutter
      ? clamp(Math.log2(s.shutterSpeed / safeShutter) * 2, 0, 5)
      : 0;
  const motionBlurPx = Math.max(subjectMotionBlurPx, cameraShakeBlurPx);

  const apertureOpenness = clamp((5.6 - s.aperture) / (5.6 - 1.4), 0, 1);
  const focalEffect = Math.pow(s.focalLength / 50, 1.15);
  const distanceEffect = clamp(3 / s.subjectDistance, 0.45, 1.6);
  const assumedBackgroundDistance = Math.min(20000, d + 6000);
  const dofMiss =
    dofFar === Infinity
      ? 0
      : clamp(
          (assumedBackgroundDistance - dofFar) / assumedBackgroundDistance,
          0,
          1,
        );
  const backgroundSeparation = clamp(0.65 + dofMiss, 0.65, 1.45);
  const backgroundBlurPx =
    apertureOpenness === 0
      ? 0
      : clamp(
          apertureOpenness *
            focalEffect *
            distanceEffect *
            backgroundSeparation *
            4.2,
          0,
          10,
        );
  const previewBrightnessPercent = calculatePreviewBrightness(evDelta);
  const previewContrastPercent = calculatePreviewContrast(evDelta);
  const previewSaturationPercent = calculatePreviewSaturation(evDelta, s.iso);
  const grainOpacity = calculateGrainOpacity(s.iso);
  const vignetteOpacity = clamp(
    0.1 + Math.max(0, s.focalLength - 50) / 260 + Math.abs(evDelta) * 0.025,
    0.08,
    0.26,
  );

  return {
    ev,
    evScene,
    evDelta,
    isUnderexposed: evDelta > 1,
    isOverexposed: evDelta < -1,
    hasNoise: s.iso >= 3200,
    hasMotionBlur: motionBlurPx > 0.5,
    motionBlurPx,
    cameraShakeBlurPx,
    subjectMotionBlurPx,
    dofMm,
    hasShallowDof: dofMm < 500,
    backgroundBlurPx,
    focalScale: calculateFocalLengthScale(s.focalLength),
    previewBrightnessPercent,
    previewContrastPercent,
    previewSaturationPercent,
    grainOpacity,
    vignetteOpacity,
  };
}

export function scoreAttempt(
  result: ExposureResult,
  settings: CameraSettings,
  ideal: ScenarioIdealSettings,
): AttemptFeedback {
  const messages: string[] = [];
  let exposureScore = 40;
  let noiseScore = 20;
  let motionScore = 20;
  let dofScore = 20;

  const idealEV =
    Math.log2(ideal.aperture ** 2 / ideal.shutterSpeed) -
    Math.log2(ideal.iso / 100);
  const evDiffFromIdeal = result.ev - idealEV;
  const absDelta = Math.abs(evDiffFromIdeal);
  if (absDelta > ideal.toleranceEV) {
    const penalty = Math.min(
      40,
      Math.floor((absDelta - ideal.toleranceEV) * 15),
    );
    exposureScore = Math.max(0, 40 - penalty);
    if (evDiffFromIdeal > 0) {
      messages.push(
        "A foto ficou escura demais — aumente o ISO, abra a abertura ou use uma velocidade mais lenta.",
      );
    } else {
      messages.push(
        "A foto ficou clara demais (superexposta) — reduza o ISO, feche a abertura ou use uma velocidade mais rápida.",
      );
    }
  }

  if (result.hasNoise) {
    if (ideal.requiresLowNoise) {
      noiseScore = settings.iso >= 6400 ? 0 : 5;
      messages.push(
        "ISO alto gerou muito ruído — tente reduzir o ISO e compensar com abertura maior ou velocidade menor.",
      );
    } else {
      noiseScore = settings.iso >= 6400 ? 10 : 15;
      messages.push("ISO elevado introduziu algum ruído digital na imagem.");
    }
  }

  if (result.hasMotionBlur) {
    if (ideal.requiresFrozenMotion) {
      motionScore = 0;
      messages.push(
        "Velocidade muito baixa causou tremido — use pelo menos 1/125s para congelar o movimento.",
      );
    } else {
      motionScore = 10;
      messages.push(
        "Velocidade lenta causou leve tremido. Use tripé ou aumente a velocidade do obturador.",
      );
    }
  }

  if (ideal.requiresShallowDof && !result.hasShallowDof) {
    dofScore = 0;
    messages.push(
      "O fundo não ficou desfocado — abra mais a abertura (número f/ menor) ou aproxime-se do assunto.",
    );
  } else if (!ideal.requiresShallowDof && result.hasShallowDof) {
    dofScore = 10;
    messages.push(
      "Profundidade de campo muito rasa — feche um pouco a abertura para manter mais área em foco.",
    );
  }

  const total = exposureScore + noiseScore + motionScore + dofScore;

  return {
    messages,
    idealSettings: {
      iso: ideal.iso,
      aperture: ideal.aperture,
      shutterSpeed: ideal.shutterSpeed,
    },
    score: { total, exposureScore, noiseScore, motionScore, dofScore },
  };
}
