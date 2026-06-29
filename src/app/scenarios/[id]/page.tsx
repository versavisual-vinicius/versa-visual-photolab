"use client";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Target } from "lucide-react";
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
    <main className="container mx-auto max-w-6xl px-4 py-5 sm:py-8">
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_420px] lg:items-end">
        <div className="space-y-3">
          <Link
            href="/scenarios"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#8A8A8A] transition-colors hover:text-[#FAFAFA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Cenários
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl" aria-hidden="true">
                {scenario.emoji}
              </span>
              <h1 className="text-2xl font-bold text-[#FAFAFA] sm:text-3xl">
                {scenario.title}
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {scenario.description}
            </p>
          </div>
        </div>

        <section
          className="p-4"
          style={{
            border: "1px solid rgba(200,169,110,0.30)",
            background: "rgba(200,169,110,0.06)",
            borderRadius: "2px",
          }}
          aria-labelledby="scenario-challenge"
        >
          <div
            className="flex items-center gap-2 font-body font-medium mb-2"
            style={{ color: "#C8A96E" }}
          >
            <Target size={15} aria-hidden="true" />
            <h2 id="scenario-challenge">Desafio</h2>
          </div>
          <p className="font-body text-sm leading-6 text-[#FAFAFA]">
            {scenario.challenge.description}
          </p>
          <ul className="mt-3 space-y-2">
            {scenario.challenge.hints.map((h, i) => (
              <li
                key={i}
                className="font-body text-xs flex gap-2 items-start leading-5"
                style={{ color: "#8A8A8A" }}
              >
                <Lightbulb
                  size={12}
                  className="mt-1 flex-shrink-0"
                  style={{ color: "#C8A96E" }}
                  aria-hidden="true"
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <CameraSimulator
        initialSettings={{
          ambientLight: scenario.ambientLight,
          iso: scenario.ideal.iso,
          aperture: scenario.ideal.aperture,
          shutterSpeed: scenario.ideal.shutterSpeed,
        }}
        imageUrl={scenario.imageUrl}
        imageUrls={scenario.imageUrls}
        onShoot={handleShoot}
        shootLabel="Fotografar e avaliar"
      />

      {feedback && attempt && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <ScoreCard score={feedback.score} />
          {savedLocally && (
            <p className="border border-[#3A3A3A] bg-[#111111] px-4 py-3 text-sm text-[#C8A96E] lg:col-span-2">
              Progresso salvo neste navegador. Entrar com Google é opcional e só
              serve para sincronizar depois.
            </p>
          )}
          <FeedbackPanel messages={feedback.messages} />
          <div className="lg:col-span-2">
            <SettingsComparator attempt={attempt} feedback={feedback} />
          </div>
        </div>
      )}
    </main>
  );
}
