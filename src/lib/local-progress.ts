import type { AttemptFeedback, CameraSettings, UserProgress } from "@/types";

const STORAGE_KEY = "versa-visual-photolab-progress-v1";

type StoredAttempt = {
  scenarioId: string;
  settings: CameraSettings;
  score: number;
  feedback: AttemptFeedback;
  createdAt: string;
};

type LocalProgress = UserProgress & {
  attempts: StoredAttempt[];
};

const EMPTY_PROGRESS: LocalProgress = {
  xp: 0,
  scenariosCompleted: [],
  conceptsRead: [],
  attempts: [],
};

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function readProgress(): LocalProgress {
  if (!canUseStorage()) return EMPTY_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LocalProgress>;
    return {
      xp: parsed.xp ?? 0,
      scenariosCompleted: parsed.scenariosCompleted ?? [],
      conceptsRead: parsed.conceptsRead ?? [],
      attempts: parsed.attempts ?? [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function writeProgress(progress: LocalProgress) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getLocalProgress(): UserProgress {
  const progress = readProgress();
  return {
    xp: progress.xp,
    scenariosCompleted: progress.scenariosCompleted,
    conceptsRead: progress.conceptsRead,
  };
}

export function saveLocalAttempt(
  scenarioId: string,
  settings: CameraSettings,
  feedback: AttemptFeedback,
) {
  const progress = readProgress();
  const attempts = [
    {
      scenarioId,
      settings,
      feedback,
      score: feedback.score.total,
      createdAt: new Date().toISOString(),
    },
    ...progress.attempts,
  ].slice(0, 25);

  writeProgress({
    ...progress,
    xp: progress.xp + feedback.score.total,
    scenariosCompleted: [
      ...new Set([...progress.scenariosCompleted, scenarioId]),
    ],
    attempts,
  });
}

export function markLocalConceptRead(slug: string) {
  const progress = readProgress();
  if (progress.conceptsRead.includes(slug)) return;

  writeProgress({
    ...progress,
    xp: progress.xp + 5,
    conceptsRead: [...progress.conceptsRead, slug],
  });
}
