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
    <div style={{ background: "#050A0D", minHeight: "100vh" }}>
      {/* Sticky nav */}
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
            padding: "0 24px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            href="/library"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "#5E7F8C",
              textDecoration: "none",
            }}
          >
            ← BIBLIOTECA
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
          <span
            style={{
              width: 1,
              height: 16,
              background: "rgba(164,184,191,.2)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: ".25em",
              textTransform: "uppercase",
              color: "#5E7F8C",
            }}
          >
            PHOTOLAB
          </span>
        </div>
      </nav>

      {/* Content */}
      <main
        style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 64px" }}
      >
        <div style={{ marginBottom: 32 }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "#5E7F8C",
              margin: "0 0 16px",
            }}
          >
            {concept.emoji}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "#F2F2F2",
              margin: 0,
            }}
          >
            {concept.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "#A4B8BF",
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            {concept.summary}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono-versa)",
              fontSize: 12,
              color: "#5E7F8C",
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            {`⏱ ${concept.readingTimeMinutes} min de leitura`}
          </p>
        </div>
        <MarkdownContent content={concept.body} />
      </main>
    </div>
  );
}
