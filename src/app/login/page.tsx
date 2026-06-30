"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!isSupabaseConfigured()) {
      setMessage("Sincronização ainda não configurada. Continue sem login.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setMessage("Não foi possível iniciar o login agora.");
  };

  return (
    <main
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#050A0D",
        minHeight: "100vh",
      }}
    >
      {/* GLOW */}
      <div
        className="animate-pulse"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(94,127,140,0.22), transparent 62%)",
          pointerEvents: "none",
        }}
      />

      {/* GRID */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(164,184,191,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(164,184,191,.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "32px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        {/* TAGLINE */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: ".32em",
            textTransform: "uppercase",
            color: "#5E7F8C",
            margin: 0,
          }}
        >
          Onde a cena vira narrativa
        </p>

        {/* H1 */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 9vw, 104px)",
            lineHeight: 0.92,
            letterSpacing: "-.01em",
            color: "#F2F2F2",
            margin: 0,
            textAlign: "center",
          }}
        >
          VERSAVISUAL
        </h1>

        {/* PHOTOLAB ROW */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              flex: 1,
              maxWidth: "80px",
              height: "1px",
              background: "linear-gradient(to left, #5E7F8C, transparent)",
              display: "block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono-versa)",
              fontSize: "14px",
              letterSpacing: ".25em",
              color: "#A4B8BF",
            }}
          >
            PHOTOLAB
          </span>
          <span
            style={{
              flex: 1,
              maxWidth: "80px",
              height: "1px",
              background: "linear-gradient(to right, #5E7F8C, transparent)",
              display: "block",
            }}
          />
        </div>

        {/* BUTTON STACK */}
        <div
          style={{
            width: "100%",
            maxWidth: "340px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          {/* GOOGLE BUTTON */}
          <button
            onClick={handleLogin}
            style={{
              height: "54px",
              width: "100%",
              backgroundColor: "#F2F2F2",
              color: "#050A0D",
              border: "none",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "0 24px",
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#E8E8E8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#F2F2F2";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </button>

          {/* GUEST BUTTON */}
          <Link
            href="/scenarios"
            style={{
              height: "54px",
              width: "100%",
              backgroundColor: "transparent",
              color: "#A4B8BF",
              border: "1px solid rgba(164,184,191,.3)",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 500,
              textDecoration: "none",
              boxSizing: "border-box",
            }}
          >
            Continuar como visitante
          </Link>
        </div>

        {/* STATUS MESSAGE */}
        {message !== null && (
          <p
            style={{
              fontSize: "12px",
              color: "#A4B8BF",
              textAlign: "center",
              marginTop: "-4px",
              margin: "0",
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* FOOTER */}
      <footer
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(164,184,191,.1)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: ".15em",
            color: "#5E7F8C",
          }}
        >
          Vídeo · Fotografia · Storymaking · Brasil
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "#5E7F8C",
          }}
        >
          mayconviniciuscunha@icloud.com
        </span>
      </footer>
    </main>
  );
}
