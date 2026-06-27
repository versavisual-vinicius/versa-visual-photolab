import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";
import { CONCEPTS } from "@/lib/concepts";
import XPCounter from "@/components/ui/XPCounter";
import ProgressBar from "@/components/ui/ProgressBar";

export const metadata = { title: "Painel — Versa Visual PhotoLab" };

export default function DashboardPage() {
  return (
    <main className="container max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Painel de Treino</h1>
        <XPCounter xp={0} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border p-5 space-y-3">
          <h2 className="font-semibold">🎯 Cenários</h2>
          <ProgressBar value={0} label={`0 / ${SCENARIOS.length} concluídos`} />
          <div className="space-y-2 mt-2">
            {SCENARIOS.map((s) => (
              <Link
                key={s.id}
                href={`/scenarios/${s.id}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{s.emoji}</span>
                <span>{s.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border p-5 space-y-3">
          <h2 className="font-semibold">📚 Biblioteca</h2>
          <ProgressBar
            value={0}
            label={`0 / ${CONCEPTS.length} conceitos lidos`}
          />
          <div className="space-y-2 mt-2">
            {CONCEPTS.map((c) => (
              <Link
                key={c.slug}
                href={`/library/${c.slug}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{c.emoji}</span>
                <span>{c.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-5">
        <h2 className="font-semibold mb-4">🚀 Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/simulator"
            className="bg-muted px-4 py-2 rounded-lg text-sm hover:bg-muted/80 transition-colors"
          >
            🎛️ Abrir simulador
          </Link>
          <Link
            href="/scenarios"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            🎯 Ver desafios
          </Link>
          <Link
            href="/library"
            className="bg-muted px-4 py-2 rounded-lg text-sm hover:bg-muted/80 transition-colors"
          >
            📚 Estudar conceitos
          </Link>
        </div>
      </div>
    </main>
  );
}
