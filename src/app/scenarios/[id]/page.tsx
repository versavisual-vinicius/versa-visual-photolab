"use client";
import { useState, use } from "react";
import Link from "next/link";
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
    const fb = scoreAttempt(
      result,
      settingsWithScene,
      scenario.ideal,
      scenario,
    );
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
    <div style={{ background: "#050A0D", minHeight: "100vh" }}>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(5,10,13,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(164,184,191,0.08)",
          height: 56,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "0 16px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            href="/scenarios"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "#5E7F8C",
              textDecoration: "none",
            }}
          >
            ← CENÁRIOS
          </Link>
          <span style={{ flex: 1 }} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              letterSpacing: ".15em",
              color: "#C8A96E",
            }}
          >
            VERSAVISUAL
          </span>
        </div>
      </nav>

      <main
        style={{
          maxWidth: 672,
          margin: "0 auto",
          padding: "32px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              color: "#F2F2F2",
              margin: 0,
            }}
          >
            {scenario.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "#A4B8BF",
              marginTop: 8,
            }}
          >
            {scenario.description}
          </p>
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
                Progresso salvo neste navegador. Entrar com Google é opcional e
                só serve para sincronizar depois.
              </p>
            )}
            <FeedbackPanel
              messages={feedback.messages}
              technique={feedback.technique}
              nextAttempt={feedback.nextAttempt}
            />
            <SettingsComparator attempt={attempt} feedback={feedback} />
          </div>
        )}
      </main>
    </div>
  );
}
