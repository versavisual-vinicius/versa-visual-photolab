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
    <div style={{ background: "#050A0D", minHeight: "100vh" }}>
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

      <main
        style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 64px" }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: ".3em",
            textTransform: "uppercase",
            color: "#5E7F8C",
            margin: "0 0 12px",
          }}
        >
          PERFIL
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            color: "#F2F2F2",
            margin: "0 0 32px",
          }}
        >
          Fotógrafo em treinamento
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 1,
            background: "#253540",
            marginBottom: 1,
          }}
        >
          <div style={{ background: "#0a1115", padding: "24px 20px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#5E7F8C",
                margin: "0 0 8px",
              }}
            >
              XP TOTAL
            </p>
            <XPCounter xp={progress.xp} />
          </div>
          <div style={{ background: "#0a1115", padding: "24px 20px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#5E7F8C",
                margin: "0 0 8px",
              }}
            >
              CENÁRIOS
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                color: "#C8A96E",
                margin: 0,
              }}
            >
              {progress.scenariosCompleted.length}
            </p>
          </div>
          <div style={{ background: "#0a1115", padding: "24px 20px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#5E7F8C",
                margin: "0 0 8px",
              }}
            >
              CONCEITOS
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                color: "#C8A96E",
                margin: 0,
              }}
            >
              {progress.conceptsRead.length}
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#0a1115",
            border: "1px solid #253540",
            padding: "16px 20px",
            marginTop: 24,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono-versa)",
              fontSize: 11,
              color: "#A4B8BF",
              margin: 0,
            }}
          >
            Modo visitante — progresso salvo neste navegador.
          </p>
        </div>
      </main>
    </div>
  );
}
