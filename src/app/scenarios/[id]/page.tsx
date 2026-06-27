"use client";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import { Target, Lightbulb } from "lucide-react";
import { getScenario } from "@/lib/scenarios";
import { calculateExposure, scoreAttempt } from "@/lib/exposure-engine";
import { saveLocalAttempt } from "@/lib/local-progress";
import {
  createClient,
  incrementXP,
  isSupabaseConfigured,
  saveAttempt,
} from "@/lib/supabase";
import CameraSimulator from "@/components/simulator/CameraSimulator";
import FeedbackPanel from "@/components/challenge/FeedbackPanel";
import ScoreCard from "@/components/challenge/ScoreCard";
import SettingsComparator from "@/components/challenge/SettingsComparator";
import type { CameraSettings, AttemptFeedback } from "@/types";

export default function ScenarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const scenario = getScenario(id);

  const [attempt, setAttempt] = useState<CameraSettings | null>(null);
  const [feedback, setFeedback] = useState<AttemptFeedback | null>(null);
  const [savedLocally, setSavedLocally] = useState(false);

  if (!scenario) notFound();

  const handleShoot = async (settings: CameraSettings) => {
    const settingsWithScene = {
      ...settings,
      ambientLight: scenario.ambientLight,
    };
    const result = calculateExposure(settingsWithScene);
    const fb = scoreAttempt(result, settingsWithScene, scenario.ideal);
    setAttempt(settingsWithScene);
    setFeedback(fb);
    saveLocalAttempt(id, settingsWithScene, fb);
    setSavedLocally(true);

    try {
      if (!isSupabaseConfigured()) return;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await saveAttempt(user.id, id, settingsWithScene, fb);
        await incrementXP(user.id, fb.score.total, id);
      }
    } catch {
      // O modo visitante continua funcionando mesmo sem Supabase configurado.
    }
  };

  return (
    <main className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">{scenario.emoji}</span>
          <h1 className="text-2xl font-bold">{scenario.title}</h1>
        </div>
        <p className="text-muted-foreground">{scenario.description}</p>
      </div>

      <div
        className="p-4"
        style={{
          border: "1px solid rgba(200,169,110,0.30)",
          background: "rgba(200,169,110,0.06)",
          borderRadius: "2px",
        }}
      >
        <div
          className="flex items-center gap-2 font-body font-medium mb-2"
          style={{ color: "#C8A96E" }}
        >
          <Target size={15} aria-hidden="true" />
          <span>Desafio</span>
        </div>
        <p className="font-body text-sm text-[#FAFAFA]">
          {scenario.challenge.description}
        </p>
        <ul className="mt-3 space-y-1.5">
          {scenario.challenge.hints.map((h, i) => (
            <li
              key={i}
              className="font-body text-xs flex gap-2 items-start"
              style={{ color: "#8A8A8A" }}
            >
              <Lightbulb
                size={11}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "#C8A96E" }}
                aria-hidden="true"
              />
              {h}
            </li>
          ))}
        </ul>
      </div>

      <CameraSimulator
        initialSettings={{
          ambientLight: scenario.ambientLight,
          iso: scenario.ideal.iso,
          aperture: scenario.ideal.aperture,
          shutterSpeed: scenario.ideal.shutterSpeed,
        }}
        scenarioEmoji={scenario.emoji}
        imageUrl={scenario.imageUrl}
        imageUrls={scenario.imageUrls}
        onShoot={handleShoot}
        shootLabel="Fotografar e avaliar"
      />

      {feedback && attempt && (
        <div className="space-y-4">
          <ScoreCard score={feedback.score} />
          {savedLocally && (
            <p className="rounded-lg border border-green-900/50 bg-green-950/30 px-4 py-3 text-sm text-green-200">
              Progresso salvo neste navegador. Entrar com Google é opcional e só
              serve para sincronizar depois.
            </p>
          )}
          <FeedbackPanel messages={feedback.messages} />
          <SettingsComparator attempt={attempt} feedback={feedback} />
        </div>
      )}
    </main>
  );
}
