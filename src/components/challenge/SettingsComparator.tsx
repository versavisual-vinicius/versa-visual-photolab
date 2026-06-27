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
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-3 bg-muted/40 text-xs text-muted-foreground uppercase tracking-wide px-3 py-2">
        <span>Parâmetro</span>
        <span className="text-center">Sua tentativa</span>
        <span className="text-center">Configuração ideal</span>
      </div>
      {rows.map(({ label, yours, ideal, ok }) => (
        <div
          key={label}
          className="grid grid-cols-3 px-3 py-2 border-t border-border text-sm items-center"
        >
          <span className="text-muted-foreground">{label}</span>
          <span
            className={`text-center font-mono ${ok ? "text-green-400" : "text-red-400"}`}
          >
            {yours}
          </span>
          <span className="text-center font-mono text-slate-300">{ideal}</span>
        </div>
      ))}
    </div>
  );
}
