import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";

export const metadata = { title: "Cenários — Versa Visual PhotoLab" };

const DIFFICULTY: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  praia: {
    label: "INICIANTE",
    color: "#5E7F8C",
    bg: "rgba(94,127,140,.2)",
    border: "rgba(94,127,140,.3)",
  },
  estudio: {
    label: "INTERMEDIÁRIO",
    color: "#C8A96E",
    bg: "rgba(200,169,110,.15)",
    border: "rgba(200,169,110,.3)",
  },
  ambiente: {
    label: "INTERMEDIÁRIO",
    color: "#C8A96E",
    bg: "rgba(200,169,110,.15)",
    border: "rgba(200,169,110,.3)",
  },
  campo: {
    label: "AVANÇADO",
    color: "#e2473f",
    bg: "rgba(226,71,63,.15)",
    border: "rgba(226,71,63,.3)",
  },
  casa: {
    label: "AVANÇADO",
    color: "#e2473f",
    bg: "rgba(226,71,63,.15)",
    border: "rgba(226,71,63,.3)",
  },
};

export default function ScenariosPage() {
  return (
    <div style={{ background: "#050A0D", minHeight: "100vh" }}>
      {/* Nav */}
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
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
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
          SIMULADOR · 5 CENÁRIOS
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            color: "#F2F2F2",
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          Escolha sua Cena
        </h1>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 1,
            background: "#253540",
          }}
        >
          {SCENARIOS.map((s) => {
            const diff = DIFFICULTY[s.id] ?? DIFFICULTY.estudio;
            return (
              <Link
                key={s.id}
                href={`/scenarios/${s.id}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3/4",
                    overflow: "hidden",
                    background: "#0a1115",
                    cursor: "pointer",
                  }}
                  className="scenario-card"
                >
                  {/* Background image */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${s.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "transform 0.3s ease",
                    }}
                    className="scenario-card-img"
                  />
                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(5,10,13,.9) 0%, rgba(5,10,13,.3) 40%, transparent 70%)",
                    }}
                  />
                  {/* Bottom info */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "16px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        letterSpacing: ".2em",
                        textTransform: "uppercase",
                        color: diff.color,
                        background: diff.bg,
                        border: `1px solid ${diff.border}`,
                        borderRadius: 2,
                        padding: "2px 6px",
                      }}
                    >
                      {diff.label}
                    </span>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        color: "#F2F2F2",
                        margin: "8px 0 0",
                      }}
                    >
                      {s.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "#A4B8BF",
                        margin: "4px 0 0",
                      }}
                    >
                      EV {s.ambientLight}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
