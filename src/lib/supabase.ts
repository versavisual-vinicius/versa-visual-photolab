import { createBrowserClient } from "@supabase/ssr";
import type { CameraSettings, AttemptFeedback, UserProgress } from "@/types";

function getSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getSupabaseKey());
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = getSupabaseKey();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase is not configured.");
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
}

export async function saveAttempt(
  userId: string,
  scenarioId: string,
  settings: CameraSettings,
  feedback: AttemptFeedback,
) {
  const supabase = createClient();
  const { error } = await supabase.from("attempts").insert({
    user_id: userId,
    scenario_id: scenarioId,
    settings,
    score: feedback.score.total,
    feedback: {
      messages: feedback.messages,
      idealSettings: feedback.idealSettings,
      score: feedback.score,
    },
  });
  if (error) console.error("saveAttempt error:", error.message);
}

export async function getUserProgress(userId: string): Promise<UserProgress> {
  const supabase = createClient();
  const { data } = await supabase
    .from("user_progress")
    .select("xp, scenarios_completed, concepts_read")
    .eq("user_id", userId)
    .single();
  if (!data) return { xp: 0, scenariosCompleted: [], conceptsRead: [] };
  return {
    xp: data.xp,
    scenariosCompleted: data.scenarios_completed ?? [],
    conceptsRead: data.concepts_read ?? [],
  };
}

export async function incrementXP(
  userId: string,
  points: number,
  scenarioId?: string,
) {
  const supabase = createClient();
  const current = await getUserProgress(userId);
  const scenariosCompleted = scenarioId
    ? [...new Set([...current.scenariosCompleted, scenarioId])]
    : current.scenariosCompleted;

  await supabase.from("user_progress").upsert({
    user_id: userId,
    xp: current.xp + points,
    scenarios_completed: scenariosCompleted,
    concepts_read: current.conceptsRead,
    updated_at: new Date().toISOString(),
  });
}

export async function markConceptRead(userId: string, slug: string) {
  const supabase = createClient();
  const current = await getUserProgress(userId);
  const conceptsRead = [...new Set([...current.conceptsRead, slug])];
  await supabase.from("user_progress").upsert({
    user_id: userId,
    xp: current.xp + 5,
    scenarios_completed: current.scenariosCompleted,
    concepts_read: conceptsRead,
    updated_at: new Date().toISOString(),
  });
}
