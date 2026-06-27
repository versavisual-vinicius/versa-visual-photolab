import Link from "next/link";
import XPCounter from "@/components/ui/XPCounter";

export const metadata = { title: "Perfil — Versa Visual PhotoLab" };

export default function ProfilePage() {
  return (
    <main className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>
      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <p className="font-semibold">Fotógrafo em treinamento</p>
            <XPCounter xp={0} />
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border p-6 space-y-2">
        <p className="font-semibold">Conquistas</p>
        <p className="text-sm text-muted-foreground">
          Complete cenários para desbloquear conquistas.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Voltar ao painel
      </Link>
    </main>
  );
}
