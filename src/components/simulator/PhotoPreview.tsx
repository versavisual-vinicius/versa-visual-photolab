"use client";
import type { ExposureResult } from "@/types";

interface Props {
  result: ExposureResult;
  scenarioEmoji?: string;
}

function getBrightness(delta: number): number {
  if (delta < -3) return 5;
  if (delta < -2) return 20;
  if (delta < -1) return 50;
  if (delta < 0) return 75;
  if (delta <= 1) return 100;
  if (delta <= 2) return 130;
  return 180;
}

export default function PhotoPreview({ result, scenarioEmoji = "🏖️" }: Props) {
  const brightness = getBrightness(result.evDelta);
  const blurPx = result.hasMotionBlur ? 3 : 0;

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-border"
      style={{ aspectRatio: "4/3", background: "#1e293b" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center text-8xl transition-all duration-300"
        style={{
          filter: `brightness(${brightness}%) blur(${blurPx}px)`,
          background: `hsl(${220 + result.evDelta * 5}, 20%, ${20 + brightness * 0.3}%)`,
        }}
      >
        {scenarioEmoji}
      </div>

      {result.hasNoise && (
        <div
          className="absolute inset-0 mix-blend-overlay pointer-events-none"
          style={{
            opacity: 0.25,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "cover",
          }}
        />
      )}

      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {result.isUnderexposed && (
          <span className="bg-blue-900/80 text-blue-200 text-xs px-2 py-0.5 rounded">
            Subexposta
          </span>
        )}
        {result.isOverexposed && (
          <span className="bg-yellow-900/80 text-yellow-200 text-xs px-2 py-0.5 rounded">
            Superexposta
          </span>
        )}
        {result.hasNoise && (
          <span className="bg-red-900/80 text-red-200 text-xs px-2 py-0.5 rounded">
            Ruído
          </span>
        )}
        {result.hasMotionBlur && (
          <span className="bg-purple-900/80 text-purple-200 text-xs px-2 py-0.5 rounded">
            Tremido
          </span>
        )}
        {!result.isUnderexposed &&
          !result.isOverexposed &&
          !result.hasNoise &&
          !result.hasMotionBlur && (
            <span className="bg-green-900/80 text-green-200 text-xs px-2 py-0.5 rounded">
              ✓ Exposta
            </span>
          )}
      </div>

      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-mono px-2 py-0.5 rounded">
        EV {result.ev.toFixed(1)} / cena {result.evScene}
      </div>
    </div>
  );
}
