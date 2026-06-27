import { Big_Shoulders, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-versa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Versa Visual PhotoLab",
  description: "Simulador de exposição fotográfica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${bigShoulders.variable} ${workSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-[#3A3A3A] bg-[#0A0A0A] backdrop-blur-sm">
          <nav className="container max-w-3xl mx-auto px-4 h-14 flex items-center gap-6">
            <Link
              href="/"
              className="font-display font-bold text-sm tracking-widest uppercase text-[#C8A96E]"
            >
              VERSA VISUAL
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors font-body"
            >
              Painel
            </Link>
            <Link
              href="/scenarios"
              className="text-sm text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors font-body"
            >
              Cenários
            </Link>
            <Link
              href="/simulator"
              className="text-sm text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors font-body"
            >
              Simulador
            </Link>
            <Link
              href="/library"
              className="text-sm text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors font-body"
            >
              Biblioteca
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
