import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Versa Visual · PhotoLab Simulador",
  description:
    "Aprenda fotografia praticando com simulações reais, desafios e feedback automático.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <nav className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-50">
          <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-sm">
              📸 Versa Visual · PhotoLab
            </Link>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href="/simulator"
                className="hover:text-foreground transition-colors"
              >
                Simulador
              </Link>
              <Link
                href="/scenarios"
                className="hover:text-foreground transition-colors"
              >
                Cenários
              </Link>
              <Link
                href="/library"
                className="hover:text-foreground transition-colors"
              >
                Biblioteca
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-foreground transition-colors"
              >
                Painel
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
