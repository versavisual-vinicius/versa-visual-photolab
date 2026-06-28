import CameraSimulator from "@/components/simulator/CameraSimulator";

export const metadata = { title: "Simulador — Versa Visual PhotoLab" };

export default function SimulatorPage() {
  return (
    <main className="container max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Simulador Livre</h1>
        <p className="text-muted-foreground">
          Comece de uma exposição equilibrada e mude um controle por vez para
          entender ISO, abertura e velocidade.
        </p>
      </div>
      <CameraSimulator
        initialSettings={{
          iso: 100,
          aperture: 5.6,
          shutterSpeed: 1 / 125,
          ambientLight: 12,
        }}
      />
    </main>
  );
}
