import Link from "next/link";
import { CONCEPTS } from "@/lib/concepts";

export const metadata = { title: "Biblioteca — Versa Visual PhotoLab" };

export default function LibraryPage() {
  const count = CONCEPTS.length;
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
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 24px",
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

      {/* Header */}
      <div style={{ padding: "48px 24px 32px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: ".3em",
            textTransform: "uppercase",
            color: "#5E7F8C",
            margin: 0,
          }}
        >
          {`BIBLIOTECA · ${count} CONCEITOS`}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            color: "#F2F2F2",
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          Conceitos Essenciais
        </h1>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 1,
            background: "#253540",
          }}
        >
          {CONCEPTS.map((c) => (
            <Link
              key={c.slug}
              href={`/library/${c.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  background: "#0a1115",
                  padding: "20px",
                  transition: "background 0.2s",
                  cursor: "pointer",
                  height: "100%",
                }}
                className="library-card"
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: "#5E7F8C",
                    margin: 0,
                  }}
                >
                  {c.emoji}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#F2F2F2",
                    marginTop: 4,
                    marginBottom: 0,
                  }}
                >
                  {c.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "#A4B8BF",
                    marginTop: 8,
                    marginBottom: 0,
                  }}
                >
                  {c.summary}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono-versa)",
                    fontSize: 11,
                    color: "#5E7F8C",
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  {`⏱ ${c.readingTimeMinutes} min`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
