import type { CameraSettings, AttemptFeedback } from "@/types";

const SHUTTER_LABEL = (s: number) =>
  s >= 1 ? `${s}"` : `1/${Math.round(1 / s)}s`;

interface Props {
  attempt: CameraSettings;
  feedback: AttemptFeedback;
}

export default function SettingsComparator({ attempt, feedback }: Props) {
  const { idealSettings } = feedback;
  const rows = [
    {
      label: "ISO",
      yours: `ISO ${attempt.iso}`,
      ideal: `ISO ${idealSettings.iso}`,
      ok: attempt.iso === idealSettings.iso,
    },
    {
      label: "Abertura",
      yours: `f/${attempt.aperture}`,
      ideal: `f/${idealSettings.aperture}`,
      ok:
        Math.abs(
          Math.log2(attempt.aperture) - Math.log2(idealSettings.aperture),
        ) <= 1,
    },
    {
      label: "Velocidade",
      yours: SHUTTER_LABEL(attempt.shutterSpeed),
      ideal: SHUTTER_LABEL(idealSettings.shutterSpeed),
      ok:
        Math.abs(
          Math.log2(attempt.shutterSpeed) -
            Math.log2(idealSettings.shutterSpeed),
        ) <= 1,
    },
  ];

  return (
    <div className="overflow-hidden border border-[#3A3A3A] bg-[#0A0A0A]">
      <div className="grid grid-cols-[0.8fr_1fr_1fr] bg-[#111111] px-3 py-2 font-mono text-[10px] uppercase text-[#8A8A8A] [letter-spacing:0.12em]">
        <span>Parâmetro</span>
        <span className="text-center">Sua tentativa</span>
        <span className="text-center">Configuração ideal</span>
      </div>
      {rows.map(({ label, yours, ideal, ok }) => (
        <div
          key={label}
          className="grid min-h-[44px] grid-cols-[0.8fr_1fr_1fr] items-center border-t border-[#3A3A3A] px-3 py-2 text-sm"
        >
          <span className="text-muted-foreground">{label}</span>
          <span
            className={`text-center font-mono ${ok ? "text-[#C8A96E]" : "text-[#FAFAFA]"}`}
          >
            {yours}
          </span>
          <span className="text-center font-mono text-[#8A8A8A]">{ideal}</span>
        </div>
      ))}
    </div>
  );
}
