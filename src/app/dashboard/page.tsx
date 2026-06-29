"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Camera,
  CheckCircle2,
  LayoutDashboard,
  Target,
} from "lucide-react";
import { SCENARIOS } from "@/lib/scenarios";
import { CONCEPTS } from "@/lib/concepts";
import { getLocalProgress } from "@/lib/local-progress";
import {
  createClient,
  getUserProgress,
  isSupabaseConfigured,
} from "@/lib/supabase";
import XPCounter from "@/components/ui/XPCounter";
import ProgressBar from "@/components/ui/ProgressBar";
import type { UserProgress } from "@/types";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    scenariosCompleted: [],
    conceptsRead: [],
  });

  useEffect(() => {
    const load = async () => {
      setProgress(getLocalProgress());
      if (!isSupabaseConfigured()) return;

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const data = await getUserProgress(user.id);
        setProgress(data);
      } catch {
        setProgress(getLocalProgress());
      }
    };
    load();
  }, []);

  const scenariosCompleted = progress.scenariosCompleted.length;
  const conceptsRead = progress.conceptsRead.length;
  const scenarioProgress =
    SCENARIOS.length > 0 ? (scenariosCompleted / SCENARIOS.length) * 100 : 0;
  const conceptProgress =
    CONCEPTS.length > 0 ? (conceptsRead / CONCEPTS.length) * 100 : 0;
  const summary = [
    { label: "XP", value: progress.xp },
    { label: "Cenários", value: `${scenariosCompleted}/${SCENARIOS.length}` },
    { label: "Conceitos", value: `${conceptsRead}/${CONCEPTS.length}` },
  ];

  return (
    <main className="container mx-auto max-w-6xl px-4 py-5 sm:py-8">
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_420px] lg:items-end">
        <div className="space-y-2">
          <p className="font-mono text-[10px] font-medium uppercase text-[#8A8A8A] [letter-spacing:0.2em]">
            Modo visitante
          </p>
          <h1 className="font-body text-2xl font-bold text-[#FAFAFA] sm:text-3xl">
            Painel de Treino
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Seu progresso fica salvo neste navegador. Login é opcional.
          </p>
        </div>
        <div className="grid grid-cols-3 border border-[#3A3A3A] bg-[#0A0A0A]">
          {summary.map((item) => (
            <div
              key={item.label}
              className="min-w-0 border-r border-[#3A3A3A] px-3 py-3 last:border-r-0"
            >
              <p className="font-mono text-[9px] uppercase text-[#8A8A8A] [letter-spacing:0.16em]">
                {item.label}
              </p>
              <p className="mt-1 truncate font-mono text-sm font-semibold text-[#C8A96E]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="border border-[#3A3A3A] bg-[#0A0A0A] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-body font-semibold text-[#FAFAFA]">
              <Target size={18} className="text-[#C8A96E]" aria-hidden="true" />
              Cenários
            </h2>
            <span className="font-mono text-xs text-[#8A8A8A]">
              {Math.round(scenarioProgress)}%
            </span>
          </div>
          <ProgressBar
            value={scenarioProgress}
            label={`${scenariosCompleted} / ${SCENARIOS.length} concluídos`}
          />
          <div className="mt-4 grid gap-2">
            {SCENARIOS.map((s) => (
              <Link
                key={s.id}
                href={`/scenarios/${s.id}`}
                className="flex min-h-[48px] items-center justify-between gap-3 border border-[#3A3A3A] px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-[#C8A96E] hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span aria-hidden="true">{s.emoji}</span>
                  <span className="truncate">{s.title}</span>
                </span>
                {progress.scenariosCompleted.includes(s.id) && (
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-[#C8A96E]"
                    aria-label="Concluído"
                  />
                )}
              </Link>
            ))}
          </div>
        </section>

        <section className="border border-[#3A3A3A] bg-[#0A0A0A] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-body font-semibold text-[#FAFAFA]">
              <BookOpen
                size={18}
                className="text-[#C8A96E]"
                aria-hidden="true"
              />
              Biblioteca
            </h2>
            <span className="font-mono text-xs text-[#8A8A8A]">
              {Math.round(conceptProgress)}%
            </span>
          </div>
          <ProgressBar
            value={conceptProgress}
            label={`${conceptsRead} / ${CONCEPTS.length} conceitos lidos`}
          />
          <div className="mt-4 grid gap-2">
            {CONCEPTS.map((c) => (
              <Link
                key={c.slug}
                href={`/library/${c.slug}`}
                className="flex min-h-[48px] items-center justify-between gap-3 border border-[#3A3A3A] px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-[#C8A96E] hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span aria-hidden="true">{c.emoji}</span>
                  <span className="truncate">{c.title}</span>
                </span>
                {progress.conceptsRead.includes(c.slug) && (
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-[#C8A96E]"
                    aria-label="Lido"
                  />
                )}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-4 border border-[#3A3A3A] bg-[#0A0A0A] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-body font-semibold text-[#FAFAFA]">
            <LayoutDashboard
              size={18}
              className="text-[#C8A96E]"
              aria-hidden="true"
            />
            Ações rápidas
          </h2>
          <XPCounter xp={progress.xp} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: "/simulator", label: "Abrir simulador", icon: Camera },
            { href: "/scenarios", label: "Ver desafios", icon: Target },
            { href: "/library", label: "Estudar conceitos", icon: BookOpen },
          ].map(({ href, label, icon: Icon }, index) => (
            <Link
              key={href}
              href={href}
              className={
                index === 1
                  ? "flex min-h-[48px] items-center justify-center gap-2 bg-[#C8A96E] px-4 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-[#9A7A42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E]"
                  : "flex min-h-[48px] items-center justify-center gap-2 border border-[#3A3A3A] px-4 py-3 text-sm font-medium text-[#FAFAFA] transition-colors hover:border-[#C8A96E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E]"
              }
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
