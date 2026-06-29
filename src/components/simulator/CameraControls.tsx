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
const FOCAL_LENGTHS = [25, 35, 50, 85, 105, 135];
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

// Label de seção: IBM Plex Mono, CAPS, tracking+3 — padrão Versa brand
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[10px] font-medium uppercase pb-1.5"
      style={{
        letterSpacing: "0.2em",
        color: "#8A8A8A",
        borderBottom: "1px solid #3A3A3A",
      }}
    >
      {children}
    </p>
  );
}

function SliderRow({
  label,
  hint,
  value,
  displayValue,
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-start">
        <div>
          {/* Label: Work Sans medium */}
          <Label className="font-body font-medium text-[#FAFAFA] text-sm">
            {label}
          </Label>
          {hint && (
            <p
              className="font-body text-xs mt-0.5"
              style={{ color: "#8A8A8A" }}
            >
              {hint}
            </p>
          )}
        </div>
        {/* Valor técnico: IBM Plex Mono, Ouro Versa */}
        <span
          className="font-mono font-semibold text-sm"
          style={{ color: "#C8A96E" }}
        >
          {displayValue}
        </span>
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
    <div className="space-y-5 p-4">
      {/* Grupo primário: Triângulo de Exposição */}
      <div className="space-y-4">
        <SectionLabel>Exposição</SectionLabel>
        <SliderRow
          label="ISO"
          hint="Mais ISO clareia, mas aumenta ruído."
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
          hint="Número menor clareia e desfoca mais o fundo."
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
          hint="Mais rápida congela movimento, mas escurece."
          value={shutIdx}
          displayValue={SHUTTER_LABELS[shutIdx]}
          min={0}
          max={SHUTTER_STOPS.length - 1}
          step={1}
          disabled={locked.shutterSpeed}
          onChange={(i) =>
            onChange({
              ...settings,
              shutterSpeed: SHUTTER_STOPS[Math.round(i)],
            })
          }
        />
      </div>

      {/* Grupo secundário: Composição & Foco — menor ênfase visual */}
      <div className="space-y-4 opacity-70">
        <SectionLabel>Composição & Foco</SectionLabel>
        <SliderRow
          label="Distância focal"
          hint="Muda o enquadramento e a profundidade de campo."
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
          hint="Mais perto aumenta o desfoque do fundo."
          value={settings.subjectDistance}
          displayValue={`${settings.subjectDistance.toFixed(1)}m`}
          min={0.5}
          max={15}
          step={0.5}
          disabled={locked.subjectDistance}
          onChange={(v) => onChange({ ...settings, subjectDistance: v })}
        />
        <div className="flex items-center gap-3 pt-1">
          <Label className="font-body text-sm font-medium text-[#FAFAFA]">
            Tripé
          </Label>
          <button
            onClick={() => onChange({ ...settings, tripod: !settings.tripod })}
            aria-pressed={settings.tripod}
            className="min-h-[44px] px-4 py-2 font-body text-sm font-medium transition-colors cursor-pointer"
            style={{
              background: settings.tripod ? "#C8A96E" : "transparent",
              color: settings.tripod ? "#0A0A0A" : "#8A8A8A",
              border: `1px solid ${settings.tripod ? "#C8A96E" : "#3A3A3A"}`,
              borderRadius: "2px",
            }}
          >
            {settings.tripod ? "Ligado" : "Desligado"}
          </button>
        </div>
      </div>
    </div>
  );
}
