"use client";
import type { ExposureResult } from "@/types";

interface Props {
  result: ExposureResult;
  imageUrl?: string;
  imageUrls?: { under?: string; over?: string };
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
  imageUrl,
  imageUrls,
}: Props) {
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
  const opticalFilter = ({
    blurPx,
    contrastOffset = 0,
  }: {
    blurPx: number;
    contrastOffset?: number;
  }) =>
    [
      `brightness(${result.previewBrightnessPercent.toFixed(0)}%)`,
      `contrast(${Math.max(70, result.previewContrastPercent + contrastOffset).toFixed(0)}%)`,
      `saturate(${result.previewSaturationPercent.toFixed(0)}%)`,
      `blur(${blurPx.toFixed(2)}px)`,
    ].join(" ");
  const baseFilter = opticalFilter({ blurPx: baseBlurPx, contrastOffset: -4 });
  const subjectFilter = opticalFilter({ blurPx: subjectBlurPx });
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
        className="absolute inset-0 overflow-hidden transition-all duration-300"
        style={{
          ...commonStyle,
          background:
            "linear-gradient(135deg, #111111 0%, #242424 48%, #0A0A0A 100%)",
        }}
        aria-hidden={masked}
      >
        <div className="absolute inset-x-[14%] top-[18%] h-[22%] border border-[#3A3A3A] bg-[#FAFAFA]" />
        <div className="absolute inset-x-[18%] top-[46%] h-[10%] bg-[#C8A96E]" />
        <div className="absolute bottom-[18%] left-[22%] h-[12%] w-[18%] bg-[#3A3A3A]" />
        <div className="absolute bottom-[18%] right-[22%] h-[12%] w-[18%] bg-[#8A8A8A]" />
        <div className="absolute left-1/2 top-1/2 h-[54%] w-px -translate-x-1/2 -translate-y-1/2 bg-[#3A3A3A]" />
        <div className="absolute left-1/2 top-1/2 h-px w-[64%] -translate-x-1/2 -translate-y-1/2 bg-[#3A3A3A]" />
        <p className="absolute bottom-4 left-4 font-mono text-[10px] uppercase text-[#8A8A8A] [letter-spacing:0.18em]">
          preview sem imagem
        </p>
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

      {result.grainOpacity > 0 && (
        <div
          className="absolute inset-0 mix-blend-screen pointer-events-none"
          style={{
            opacity: result.grainOpacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "160px 160px",
          }}
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: result.vignetteOpacity,
          background:
            "radial-gradient(circle at 50% 44%, transparent 0%, transparent 52%, #000 100%)",
        }}
      />

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
