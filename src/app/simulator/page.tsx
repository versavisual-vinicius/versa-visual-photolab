import CameraSimulator from "@/components/simulator/CameraSimulator";

export const metadata = { title: "Simulador — Versa Visual PhotoLab" };

export default function SimulatorPage() {
  return (
    <main className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Simulador Livre</h1>
      <p className="text-muted-foreground mb-6">
        Experimente configurações da câmera e veja o resultado em tempo real.
      </p>
      <CameraSimulator />
    </main>
  );
}
