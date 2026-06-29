"use client";
import type { ExposureResult } from "@/types";

interface Props {
  result: ExposureResult;
  scenarioEmoji?: string;
  imageUrl?: string;
  imageUrls?: { under?: string; over?: string };
}

function getBrightness(delta: number): number {
  if (delta > 3) return 5;
  if (delta > 2) return 20;
  if (delta > 1) return 50;
  if (delta > 0) return 75;
  if (delta >= -1) return 100;
  if (delta >= -2) return 130;
  return 180;
}

function resolveImage(
  evDelta: number,
  imageUrl?: string,
  imageUrls?: { under?: string; over?: string },
): string | undefined {
  if (!imageUrl) return undefined;
  if (imageUrls) {
    if (evDelta > 1 && imageUrls.under) return imageUrls.under;
    if (evDelta < -1 && imageUrls.over) return imageUrls.over;
  }
  return imageUrl;
}

export default function PhotoPreview({
  result,
  scenarioEmoji = "🏖️",
  imageUrl,
  imageUrls,
}: Props) {
  const brightness = getBrightness(result.evDelta);
  const activeImage = resolveImage(result.evDelta, imageUrl, imageUrls);
  const focalScale = result.focalScale;
  const baseScale = focalScale * (result.backgroundBlurPx > 0.05 ? 1.012 : 1);
  const cameraShakeBlurPx = result.cameraShakeBlurPx;
  const backgroundBlurPx = result.backgroundBlurPx;
  const subjectBlurPx = Math.max(
    result.subjectMotionBlurPx,
    result.cameraShakeBlurPx,
  );
  const baseBlurPx = cameraShakeBlurPx + backgroundBlurPx;
  const baseFilter = `brightness(${brightness}%) blur(${baseBlurPx.toFixed(2)}px)`;
  const subjectFilter = `brightness(${brightness}%) blur(${subjectBlurPx.toFixed(2)}px)`;
  const showSubjectPlane =
    result.backgroundBlurPx > 0.05 ||
    result.subjectMotionBlurPx > 0.05 ||
    result.cameraShakeBlurPx > 0.05;

  const renderPlane = ({
    filter,
    scale,
    masked = false,
  }: {
    filter: string;
    scale: number;
    masked?: boolean;
  }) => {
    const commonStyle = {
      filter,
      transform: `scale(${scale.toFixed(4)})`,
      transformOrigin: "50% 45%",
      transition: "filter 0.3s ease, transform 0.3s ease",
      ...(masked
        ? {
            WebkitMaskImage:
              "radial-gradient(ellipse 34% 46% at 50% 43%, #000 0%, #000 58%, transparent 78%)",
            maskImage:
              "radial-gradient(ellipse 34% 46% at 50% 43%, #000 0%, #000 58%, transparent 78%)",
          }
        : {}),
    };

    if (activeImage) {
      return (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            ...commonStyle,
            backgroundImage: `url(${activeImage})`,
          }}
          aria-hidden={masked}
        />
      );
    }

    return (
      <div
        className="absolute inset-0 flex items-center justify-center text-8xl transition-all duration-300"
        style={{
          ...commonStyle,
          background: `hsl(${220 + result.evDelta * 5}, 20%, ${20 + brightness * 0.3}%)`,
        }}
        aria-hidden={masked}
      >
        {scenarioEmoji}
      </div>
    );
  };

  return (
    <div
      className="relative overflow-hidden border border-[#3A3A3A]"
      style={{ aspectRatio: "4/3", background: "#0A0A0A", borderRadius: "2px" }}
    >
      {renderPlane({ filter: baseFilter, scale: baseScale })}

      {showSubjectPlane &&
        renderPlane({ filter: subjectFilter, scale: focalScale, masked: true })}

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

      {/* Badges — paleta exclusiva Versa, sem cores externas */}
      <div className="absolute top-2 left-2 flex flex-col gap-1.5">
        {result.isUnderexposed && (
          <span
            className="text-sm font-medium px-2.5 py-1 font-body"
            style={{
              background: "#3A3A3A",
              color: "#FAFAFA",
              borderRadius: "2px",
            }}
          >
            Subexposta
          </span>
        )}
        {result.isOverexposed && (
          <span
            className="text-sm font-medium px-2.5 py-1 font-body"
            style={{
              background: "#FAFAFA",
              color: "#0A0A0A",
              borderRadius: "2px",
            }}
          >
            Superexposta
          </span>
        )}
        {result.hasNoise && (
          <span
            className="text-sm font-medium px-2.5 py-1 font-body"
            style={{
              background: "#3A3A3A",
              color: "#8A8A8A",
              borderRadius: "2px",
            }}
          >
            Ruído
          </span>
        )}
        {result.hasMotionBlur && (
          <span
            className="text-sm font-medium px-2.5 py-1 font-body"
            style={{
              background: "#3A3A3A",
              color: "#8A8A8A",
              borderRadius: "2px",
            }}
          >
            Tremida
          </span>
        )}
        {!result.isUnderexposed &&
          !result.isOverexposed &&
          !result.hasNoise &&
          !result.hasMotionBlur && (
            <span
              className="text-sm font-medium px-2.5 py-1 font-body"
              style={{
                background: "#C8A96E",
                color: "#0A0A0A",
                borderRadius: "2px",
              }}
            >
              Exposta
            </span>
          )}
      </div>
    </div>
  );
}
