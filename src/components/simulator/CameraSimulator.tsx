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
  scenarioEmoji?: string;
  imageUrl?: string;
  imageUrls?: { under?: string; over?: string };
  locked?: Partial<Record<keyof CameraSettings, boolean>>;
  onShoot?: (settings: CameraSettings) => void;
  shootLabel?: string;
}

export default function CameraSimulator({
  initialSettings,
  scenarioEmoji,
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
        className="space-y-2"
        style={{ borderBottom: "1px solid #3A3A3A" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-body transition-colors cursor-pointer hover:text-[#FAFAFA]"
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
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Layout: coluna única em mobile, 2 colunas em desktop */}
        <div className="md:grid md:grid-cols-2 md:gap-6">
          {/* Coluna esquerda: feedback visual */}
          <div className="space-y-3">
            <PhotoPreview
              result={result}
              scenarioEmoji={scenarioEmoji}
              imageUrl={imageUrl}
              imageUrls={imageUrls}
            />
            <ExposureMeter evDelta={result.evDelta} />
            <DepthOfFieldVisualizer settings={settings} result={result} />
          </div>

          {/* Coluna direita: controles */}
          <div className="space-y-4 mt-4 md:mt-0">
            <CameraControls
              settings={settings}
              onChange={setSettings}
              locked={locked}
            />
            {onShoot && (
              <div className="px-4 pb-2">
                {/* CTA primário: Ouro Versa — brand system */}
                <button
                  onClick={() => onShoot(settings)}
                  className="w-full flex items-center justify-center gap-2 font-body font-semibold py-3 transition-colors cursor-pointer min-h-[44px]"
                  style={{
                    background: "#C8A96E",
                    color: "#0A0A0A",
                    borderRadius: "2px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#9A7A42";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#C8A96E";
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
