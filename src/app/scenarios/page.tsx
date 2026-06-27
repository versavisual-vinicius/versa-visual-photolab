import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Cenários — Versa Visual PhotoLab" };

export default function ScenariosPage() {
  return (
    <main className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Cenários de Treino</h1>
      <p className="text-muted-foreground mb-6">
        Escolha uma situação real e receba um desafio fotográfico.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {SCENARIOS.map((s) => (
          <Link key={s.id} href={`/scenarios/${s.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>{s.emoji}</span>
                  {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{s.description}</p>
                <p className="text-xs text-primary mt-3 font-medium">
                  {s.challenge.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
