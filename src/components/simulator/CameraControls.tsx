"use client";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { CameraSettings } from "@/types";

const ISO_STOPS = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
const APERTURE_STOPS = [1.4, 1.8, 2.0, 2.8, 4, 5.6, 8, 11, 16, 22];
const SHUTTER_STOPS = [
  1 / 2000,
  1 / 1000,
  1 / 500,
  1 / 250,
  1 / 125,
  1 / 60,
  1 / 30,
  1 / 15,
  1 / 8,
  1 / 4,
  1 / 2,
  1,
];
const FOCAL_LENGTHS = [24, 35, 50, 85, 105, 135];
const SHUTTER_LABELS = [
  "1/2000",
  "1/1000",
  "1/500",
  "1/250",
  "1/125",
  "1/60",
  "1/30",
  "1/15",
  "1/8",
  "1/4",
  "1/2",
  '1"',
];

interface Props {
  settings: CameraSettings;
  onChange: (s: CameraSettings) => void;
  locked?: Partial<Record<keyof CameraSettings, boolean>>;
}

function SliderRow({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <Label className="text-muted-foreground">{label}</Label>
        <span className="font-mono font-medium">{displayValue}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(val) => {
          const v = Array.isArray(val) ? (val as number[])[0] : (val as number);
          onChange(v);
        }}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}

export default function CameraControls({
  settings,
  onChange,
  locked = {},
}: Props) {
  const isoIdx = Math.max(0, ISO_STOPS.indexOf(settings.iso));
  const apIdx = Math.max(
    0,
    APERTURE_STOPS.findIndex((a) => Math.abs(a - settings.aperture) < 0.01),
  );
  const shutIdx = Math.max(
    0,
    SHUTTER_STOPS.findIndex(
      (s) => Math.abs(s - settings.shutterSpeed) < 0.00001,
    ),
  );
  const focalIdx = Math.max(0, FOCAL_LENGTHS.indexOf(settings.focalLength));

  return (
    <div className="space-y-4 p-4">
      <SliderRow
        label="ISO"
        value={isoIdx}
        displayValue={`ISO ${ISO_STOPS[isoIdx]}`}
        min={0}
        max={ISO_STOPS.length - 1}
        step={1}
        disabled={locked.iso}
        onChange={(i) =>
          onChange({ ...settings, iso: ISO_STOPS[Math.round(i)] })
        }
      />
      <SliderRow
        label="Abertura"
        value={apIdx}
        displayValue={`f/${APERTURE_STOPS[apIdx]}`}
        min={0}
        max={APERTURE_STOPS.length - 1}
        step={1}
        disabled={locked.aperture}
        onChange={(i) =>
          onChange({ ...settings, aperture: APERTURE_STOPS[Math.round(i)] })
        }
      />
      <SliderRow
        label="Velocidade"
        value={shutIdx}
        displayValue={SHUTTER_LABELS[shutIdx]}
        min={0}
        max={SHUTTER_STOPS.length - 1}
        step={1}
        disabled={locked.shutterSpeed}
        onChange={(i) =>
          onChange({ ...settings, shutterSpeed: SHUTTER_STOPS[Math.round(i)] })
        }
      />
      <SliderRow
        label="Distância focal"
        value={focalIdx}
        displayValue={`${FOCAL_LENGTHS[focalIdx]}mm`}
        min={0}
        max={FOCAL_LENGTHS.length - 1}
        step={1}
        disabled={locked.focalLength}
        onChange={(i) =>
          onChange({ ...settings, focalLength: FOCAL_LENGTHS[Math.round(i)] })
        }
      />
      <SliderRow
        label="Distância do assunto"
        value={settings.subjectDistance}
        displayValue={`${settings.subjectDistance.toFixed(1)}m`}
        min={0.5}
        max={15}
        step={0.5}
        disabled={locked.subjectDistance}
        onChange={(v) => onChange({ ...settings, subjectDistance: v })}
      />
      <div className="flex items-center gap-3 pt-1">
        <Label className="text-sm text-muted-foreground">Tripé</Label>
        <button
          onClick={() => onChange({ ...settings, tripod: !settings.tripod })}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            settings.tripod
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {settings.tripod ? "Ligado" : "Desligado"}
        </button>
      </div>
    </div>
  );
}
