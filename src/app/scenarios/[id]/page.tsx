"use client";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import { getScenario } from "@/lib/scenarios";
import { calculateExposure, scoreAttempt } from "@/lib/exposure-engine";
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

  if (!scenario) notFound();

  const handleShoot = (settings: CameraSettings) => {
    const settingsWithScene = {
      ...settings,
      ambientLight: scenario.ambientLight,
    };
    const result = calculateExposure(settingsWithScene);
    const fb = scoreAttempt(result, settingsWithScene, scenario.ideal);
    setAttempt(settingsWithScene);
    setFeedback(fb);
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

      <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
        <p className="font-medium text-primary mb-2">🎯 Desafio</p>
        <p className="text-sm">{scenario.challenge.description}</p>
        <ul className="mt-3 space-y-1">
          {scenario.challenge.hints.map((h, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-2">
              <span>💡</span>
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
          <FeedbackPanel messages={feedback.messages} />
          <SettingsComparator attempt={attempt} feedback={feedback} />
        </div>
      )}
    </main>
  );
}
