"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getLocalProgress } from "@/lib/local-progress";
import XPCounter from "@/components/ui/XPCounter";
import type { UserProgress } from "@/types";

export default function ProfilePage() {
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    scenariosCompleted: [],
    conceptsRead: [],
  });

  useEffect(() => {
    setProgress(getLocalProgress());
  }, []);

  return (
    <main className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>
      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <p className="font-semibold">Fotógrafo em treinamento</p>
            <XPCounter xp={progress.xp} />
            <p className="mt-1 text-xs text-muted-foreground">
              Modo visitante: progresso salvo neste navegador.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border p-6 space-y-2">
        <p className="font-semibold">Conquistas</p>
        <p className="text-sm text-muted-foreground">
          {progress.scenariosCompleted.length} cenários concluídos e{" "}
          {progress.conceptsRead.length} conceitos estudados.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Voltar ao painel
      </Link>
    </main>
  );
}
