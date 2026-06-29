import type { ScoreBreakdown } from "@/types";

interface Props {
  score: ScoreBreakdown;
}

const GRADE = (n: number) =>
  n >= 90
    ? { label: "Excelente", color: "text-[#C8A96E]" }
    : n >= 70
      ? { label: "Bom", color: "text-[#FAFAFA]" }
      : n >= 50
        ? { label: "Regular", color: "text-[#8A8A8A]" }
        : { label: "Precisa melhorar", color: "text-[#8A8A8A]" };

export default function ScoreCard({ score }: Props) {
  const { label, color } = GRADE(score.total);

  return (
    <div className="border border-[#3A3A3A] bg-[#0A0A0A] p-4 space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`font-mono text-5xl font-bold ${color}`}>
          {score.total}
        </span>
        <span className="text-muted-foreground">/100</span>
        <span className={`font-body text-lg font-medium ${color}`}>
          {label}
        </span>
      </div>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        {[
          { label: "Exposição", value: score.exposureScore, max: 40 },
          { label: "Ruído", value: score.noiseScore, max: 20 },
          { label: "Movimento", value: score.motionScore, max: 20 },
          { label: "Profundidade", value: score.dofScore, max: 20 },
        ].map(({ label, value, max }) => (
          <div
            key={label}
            className="flex min-h-[40px] items-center justify-between border border-[#3A3A3A] bg-[#111111] px-3 py-2"
          >
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono text-[#FAFAFA]">
              {value}/{max}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
