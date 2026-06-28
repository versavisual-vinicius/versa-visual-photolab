import type {
  CameraSettings,
  ExposureResult,
  ScenarioIdealSettings,
  AttemptFeedback,
  ScoreBreakdown,
} from "@/types";

const COC_MM = 0.029;

export function calculateExposure(s: CameraSettings): ExposureResult {
  const ev100 = Math.log2(s.aperture ** 2 / s.shutterSpeed);
  const ev = ev100 + Math.log2(s.iso / 100);
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

  return {
    ev,
    evScene,
    evDelta,
    isUnderexposed: evDelta < -1,
    isOverexposed: evDelta > 1,
    hasNoise: s.iso >= 3200,
    hasMotionBlur: s.shutterSpeed > 1 / 60 && !s.tripod,
    dofMm,
    hasShallowDof: dofMm < 500,
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
    Math.log2(ideal.aperture ** 2 / ideal.shutterSpeed) +
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
        "A foto ficou clara demais (superexposta) — reduza o ISO, feche a abertura ou use uma velocidade mais rápida.",
      );
    } else {
      messages.push(
        "A foto ficou escura demais — aumente o ISO, abra a abertura ou use uma velocidade mais lenta.",
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
