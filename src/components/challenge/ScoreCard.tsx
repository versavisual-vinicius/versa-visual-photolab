import type { ScoreBreakdown } from "@/types";

interface Props {
  score: ScoreBreakdown;
}

const GRADE = (n: number) =>
  n >= 90
    ? { label: "Excelente", color: "text-green-400" }
    : n >= 70
      ? { label: "Bom", color: "text-blue-400" }
      : n >= 50
        ? { label: "Regular", color: "text-yellow-400" }
        : { label: "Precisa melhorar", color: "text-red-400" };

export default function ScoreCard({ score }: Props) {
  const { label, color } = GRADE(score.total);

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-baseline gap-3">
        <span className={`text-5xl font-bold ${color}`}>{score.total}</span>
        <span className="text-muted-foreground">/100</span>
        <span className={`text-lg font-medium ${color}`}>{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {[
          { label: "Exposição", value: score.exposureScore, max: 40 },
          { label: "Ruído", value: score.noiseScore, max: 20 },
          { label: "Movimento", value: score.motionScore, max: 20 },
          { label: "Profundidade", value: score.dofScore, max: 20 },
        ].map(({ label, value, max }) => (
          <div
            key={label}
            className="flex justify-between bg-muted/30 rounded px-2 py-1"
          >
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono">
              {value}/{max}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
