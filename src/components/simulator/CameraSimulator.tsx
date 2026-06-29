"use client";
import { useState, useMemo } from "react";
import { Camera, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CameraControls from "./CameraControls";
import DepthOfFieldVisualizer from "./DepthOfFieldVisualizer";
import PhotoPreview from "./PhotoPreview";
import ExposureMeter from "./ExposureMeter";
import { calculateExposure } from "@/lib/exposure-engine";
import type { CameraSettings } from "@/types";

const DEFAULT_SETTINGS: CameraSettings = {
  iso: 100,
  aperture: 5.6,
  shutterSpeed: 1 / 125,
  focalLength: 50,
  subjectDistance: 3,
  ambientLight: 12,
  tripod: false,
};

interface Props {
  initialSettings?: Partial<CameraSettings>;
  imageUrl?: string;
  imageUrls?: { under?: string; over?: string };
  locked?: Partial<Record<keyof CameraSettings, boolean>>;
  onShoot?: (settings: CameraSettings) => void;
  shootLabel?: string;
}

export default function CameraSimulator({
  initialSettings,
  imageUrl,
  imageUrls,
  locked,
  onShoot,
  shootLabel = "Fotografar",
}: Props) {
  const initialCameraSettings = { ...DEFAULT_SETTINGS, ...initialSettings };
  const [settings, setSettings] = useState<CameraSettings>(
    initialCameraSettings,
  );
  const result = useMemo(() => calculateExposure(settings), [settings]);
  const statusText = result.isUnderexposed
    ? "Subexposta"
    : result.isOverexposed
      ? "Superexposta"
      : "Equilibrada";

  return (
    <Card
      className="w-full"
      style={{
        border: "1px solid #3A3A3A",
        background: "#0A0A0A",
        borderRadius: "2px",
      }}
    >
      <CardHeader
        className="space-y-3 p-4 sm:p-5"
        style={{ borderBottom: "1px solid #3A3A3A" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="font-body font-semibold text-base text-[#FAFAFA]">
              Simulador de Câmera
            </CardTitle>
            <p className="mt-1 text-sm font-body" style={{ color: "#8A8A8A" }}>
              Ajuste um controle por vez e observe a foto mudar ao vivo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettings(initialCameraSettings)}
            className="flex min-h-[44px] w-full items-center justify-center gap-1.5 px-3 py-2 text-xs font-body transition-colors cursor-pointer hover:text-[#FAFAFA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E] sm:w-auto"
            style={{
              border: "1px solid #3A3A3A",
              color: "#8A8A8A",
              borderRadius: "2px",
            }}
            aria-label="Resetar configurações"
          >
            <RotateCcw size={12} />
            Resetar
          </button>
        </div>
        <div className="grid grid-cols-3 border border-[#3A3A3A]">
          {[
            ["EV", `${result.evDelta > 0 ? "+" : ""}${result.evDelta.toFixed(1)}`],
            ["Status", statusText],
            ["Dist. focal", `${settings.focalLength}mm`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 border-r border-[#3A3A3A] px-2 py-2 last:border-r-0 sm:px-3"
            >
              <p className="font-mono text-[9px] uppercase text-[#8A8A8A] [letter-spacing:0.16em]">
                {label}
              </p>
              <p className="mt-1 truncate font-mono text-xs font-semibold text-[#C8A96E] sm:text-sm">
                {value}
              </p>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-3 sm:p-4">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-6">
          <div className="space-y-3 lg:sticky lg:top-4 lg:self-start">
            <PhotoPreview
              result={result}
              imageUrl={imageUrl}
              imageUrls={imageUrls}
            />
            <ExposureMeter evDelta={result.evDelta} />
            <DepthOfFieldVisualizer settings={settings} result={result} />
          </div>

          <div className="mt-4 space-y-4 lg:mt-0">
            <CameraControls
              settings={settings}
              onChange={setSettings}
              locked={locked}
            />
            {onShoot && (
              <div className="px-2 pb-2 sm:px-4">
                <button
                  type="button"
                  onClick={() => onShoot(settings)}
                  className="w-full flex min-h-[48px] items-center justify-center gap-2 font-body font-semibold py-3 transition-colors cursor-pointer hover:bg-[#9A7A42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E]"
                  style={{
                    background: "#C8A96E",
                    color: "#0A0A0A",
                    borderRadius: "2px",
                  }}
                >
                  <Camera size={18} />
                  {shootLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
