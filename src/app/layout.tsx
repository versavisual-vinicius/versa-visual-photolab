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
          <nav className="container mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2 sm:h-14 sm:flex-row sm:items-center sm:gap-4 sm:py-0">
            <Link
              href="/"
              className="shrink-0 font-display text-sm font-bold uppercase text-[#C8A96E] [letter-spacing:0.14em]"
              aria-label="VERSA VISUAL"
            >
              <span className="sm:hidden">VERSA</span>
              <span className="hidden sm:inline">VERSA VISUAL</span>
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-1 gap-y-0 sm:w-max sm:gap-3">
                {[
                  ["/dashboard", "Painel"],
                  ["/scenarios", "Cenários"],
                  ["/simulator", "Simulador"],
                  ["/library", "Biblioteca"],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex min-h-[44px] items-center px-2 text-sm text-[#8A8A8A] transition-colors hover:text-[#FAFAFA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E] sm:px-3"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
