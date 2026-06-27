import Link from "next/link";
import { CONCEPTS } from "@/lib/concepts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Biblioteca — Versa Visual PhotoLab" };

export default function LibraryPage() {
  return (
    <main className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Biblioteca de Conceitos</h1>
      <p className="text-muted-foreground mb-6">
        Aulas rápidas com exemplos visuais.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {CONCEPTS.map((c) => (
          <Link key={c.slug} href={`/library/${c.slug}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span>{c.emoji}</span>
                  {c.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{c.summary}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  ⏱ {c.readingTimeMinutes} min de leitura
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
