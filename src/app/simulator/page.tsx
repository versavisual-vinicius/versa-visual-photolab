import CameraSimulator from "@/components/simulator/CameraSimulator";
import { Aperture, Gauge, SlidersHorizontal } from "lucide-react";

export const metadata = { title: "Simulador — Versa Visual PhotoLab" };

export default function SimulatorPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-5 sm:py-8">
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_420px] lg:items-end">
        <div className="space-y-3">
          <p className="font-mono text-[10px] font-medium uppercase text-[#8A8A8A] [letter-spacing:0.2em]">
            laboratório livre
          </p>
          <div className="space-y-2">
            <h1 className="font-body text-2xl font-bold text-[#FAFAFA] sm:text-3xl">
              Simulador Livre
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Comece de uma exposição equilibrada e mude um controle por vez
              para entender ISO, abertura e velocidade.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 border border-[#3A3A3A] bg-[#0A0A0A]">
          {[
            { icon: Gauge, label: "Exposição" },
            { icon: Aperture, label: "Foco" },
            { icon: SlidersHorizontal, label: "Controle" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex min-h-[72px] flex-col items-center justify-center gap-2 border-r border-[#3A3A3A] px-2 text-center last:border-r-0"
            >
              <Icon size={18} className="text-[#C8A96E]" aria-hidden="true" />
              <span className="font-body text-xs font-medium text-[#FAFAFA]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <CameraSimulator
        initialSettings={{
          iso: 100,
          aperture: 5.6,
          shutterSpeed: 1 / 125,
          ambientLight: 12,
        }}
        imageUrl="/scenarios/estudio-normal.jpg"
        imageUrls={{
          under: "/scenarios/estudio-sub.jpg",
          over: "/scenarios/estudio-over.jpg",
        }}
      />
    </main>
  );
}
