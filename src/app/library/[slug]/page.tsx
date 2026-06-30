"use client";
import { use, useEffect } from "react";
import { notFound } from "next/navigation";
import { getConcept } from "@/lib/concepts";
import { markLocalConceptRead } from "@/lib/local-progress";
import {
  createClient,
  isSupabaseConfigured,
  markConceptRead,
} from "@/lib/supabase";
import Link from "next/link";
import MarkdownContent from "@/components/ui/MarkdownContent";

export default function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const concept = getConcept(slug);
  if (!concept) notFound();

  useEffect(() => {
    const track = async () => {
      markLocalConceptRead(slug);
      if (!isSupabaseConfigured()) return;

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) await markConceptRead(user.id, slug);
      } catch {
        // Leitura local já foi salva; sincronização é opcional.
      }
    };
    track();
  }, [slug]);

  return (
    <main className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
      <Link
        href="/library"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Biblioteca
      </Link>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">{concept.emoji}</span>
          <h1 className="text-2xl font-bold">{concept.title}</h1>
        </div>
        <p className="text-muted-foreground">{concept.summary}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          ⏱ {concept.readingTimeMinutes} min de leitura
        </p>
      </div>
      <MarkdownContent content={concept.body} />
    </main>
  );
}
