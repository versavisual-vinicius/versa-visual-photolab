import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Cenários — Versa Visual PhotoLab" };

export default function ScenariosPage() {
  return (
    <main className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Cenários de Treino</h1>
          <p className="text-muted-foreground">
            Escolha uma situação real e receba um desafio fotográfico.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Treine sem login. Seu progresso fica no navegador.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SCENARIOS.map((s) => (
          <Link key={s.id} href={`/scenarios/${s.id}`}>
            <Card className="group overflow-hidden hover:border-primary/50 transition-colors cursor-pointer h-full">
              <div
                className="h-40 border-b border-border bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ backgroundImage: `url(${s.imageUrl})` }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>{s.emoji}</span>
                  {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{s.description}</p>
                <p className="text-sm text-primary font-medium">
                  {s.challenge.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-1">
                    ISO ideal {s.ideal.iso}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-1">
                    f/{s.ideal.aperture}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-1">
                    EV cena {s.ambientLight}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
