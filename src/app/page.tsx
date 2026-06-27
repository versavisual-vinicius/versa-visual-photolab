import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";

export default function LandingPage() {
  return (
    <main className="container max-w-4xl mx-auto px-4 py-16 space-y-20">
      <section className="text-center space-y-6">
        <p className="text-6xl">📸</p>
        <h1 className="text-4xl md:text-5xl font-bold">
          Aprenda fotografia
          <br />
          <span className="text-primary">praticando de verdade</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          O Duolingo da fotografia. Simule câmeras reais, complete desafios por
          cenário e receba feedback automático instantâneo.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/scenarios"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Começar agora — é grátis
          </Link>
          <Link
            href="/simulator"
            className="bg-muted text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            Explorar o simulador
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-center mb-8">
          O que você vai aprender
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🎛️",
              title: "Simulador completo",
              desc: "Ajuste ISO, abertura, velocidade e focal em tempo real. Veja o resultado antes de fotografar.",
            },
            {
              emoji: "🎯",
              title: "Desafios por cenário",
              desc: "5 cenários reais: praia, estúdio, ambiente interno, campo e casa. Cada um com objetivo e dicas.",
            },
            {
              emoji: "📊",
              title: "Feedback automático",
              desc: "Saiba exatamente por que a foto ficou errada — ruído, tremido, sub/superexposição — e como corrigir.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border p-6 space-y-3"
            >
              <p className="text-3xl">{f.emoji}</p>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-center mb-8">
          Cenários disponíveis
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SCENARIOS.map((s) => (
            <Link
              key={s.id}
              href={`/scenarios/${s.id}`}
              className="rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
            >
              <span className="text-2xl">{s.emoji}</span>
              <p className="font-medium mt-2">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {s.challenge.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
