"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CameraControls from "./CameraControls";
import DepthOfFieldVisualizer from "./DepthOfFieldVisualizer";
import PhotoPreview from "./PhotoPreview";
import { calculateExposure } from "@/lib/exposure-engine";
import type { CameraSettings } from "@/types";

const DEFAULT_SETTINGS: CameraSettings = {
  iso: 400,
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
  locked?: Partial<Record<keyof CameraSettings, boolean>>;
  onShoot?: (settings: CameraSettings) => void;
  shootLabel?: string;
}

export default function CameraSimulator({
  initialSettings,
  scenarioEmoji,
  imageUrl,
  locked,
  onShoot,
  shootLabel = "Fotografar",
}: Props) {
  const [settings, setSettings] = useState<CameraSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });

  const result = useMemo(() => calculateExposure(settings), [settings]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Simulador de Câmera</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PhotoPreview
          result={result}
          scenarioEmoji={scenarioEmoji}
          imageUrl={imageUrl}
        />
        <DepthOfFieldVisualizer settings={settings} result={result} />
        <CameraControls
          settings={settings}
          onChange={setSettings}
          locked={locked}
        />
        {onShoot && (
          <button
            onClick={() => onShoot(settings)}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            📸 {shootLabel}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
