# UI/UX Simulator Improvements — Implementation Plan (com identidade Versa)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Melhorar hierarquia visual, clareza de exposição e acessibilidade do simulador — aplicando rigorosamente a identidade Versa Visual (Brand System 2026).

**Architecture:** Todas as mudanças são puramente visuais. O motor de exposição (`exposure-engine.ts`) e os tipos (`src/types/index.ts`) NÃO devem ser tocados. `CameraSimulator` é compartilhado entre `/simulator` e `/scenarios/[id]` — mudanças nele afetam ambas as rotas.

**Tech Stack:** Next.js 15 App Router, React, Tailwind CSS, shadcn/ui, lucide-react, next/font/google

## Global Constraints

- Nunca modificar `src/lib/exposure-engine.ts`, `src/types/index.ts`, `src/lib/scenarios.ts`
- **Paleta exclusiva Versa**: `#0A0A0A` `#C8A96E` `#9A7A42` `#FAFAFA` `#3A3A3A` `#8A8A8A` — nenhuma outra cor
- **Proibido**: laranja, verde (emerald/green), azul (sky/blue), vermelho fora de destructive, gradientes coloridos
- **Tipografia**: Big Shoulders Display (títulos), Work Sans (corpo), IBM Plex Mono (labels técnicos e valores de câmera)
- **Border radius**: 2px (`rounded-sm`) para cards e badges — `radius.card: 2px` do brand token
- **Border radius**: 4px máximo para botões — nunca `rounded-full` exceto em badges de XP/progresso
- Botão CTA primário: fundo `#C8A96E` (Ouro Versa), texto `#0A0A0A`
- `lucide-react` já disponível — usar para todos os ícones (sem emojis estruturais)
- Área mínima de toque: 44×44px em todos os elementos interativos

---

## Identidade Versa — referência rápida

| Token | Hex | Uso no app |
|-------|-----|-----------|
| Preto Operação | `#0A0A0A` | Background principal |
| Ouro Versa | `#C8A96E` | CTA primário, badge "Exposta", indicador da régua, ícones ativos |
| Ouro Escuro | `#9A7A42` | Hover do CTA, destaque alt |
| Branco Névoa | `#FAFAFA` | Texto primário, badge "Superexposta" (bg branco = excesso de luz) |
| Cinza Campo | `#3A3A3A` | Cards, borders, badge "Subexposta" (bg escuro = falta de luz) |
| Cinza Voz | `#8A8A8A` | Texto muted, labels secundários |

| Fonte | Uso |
|-------|-----|
| Big Shoulders Display | Títulos de seção, headings |
| Work Sans | Corpo, labels, hints |
| IBM Plex Mono | Valores técnicos: ISO, f/, velocidade, EV |

---

## File Map

| Ação | Arquivo | Responsabilidade |
|------|---------|-----------------|
| Modificar | `src/app/layout.tsx` | Adicionar fontes Versa via next/font/google |
| Modificar | `src/app/globals.css` | Adicionar CSS tokens Versa ao tema dark |
| Criar | `src/components/simulator/ExposureMeter.tsx` | Régua visual de EV com identidade Versa |
| Modificar | `src/components/simulator/CameraControls.tsx` | Agrupamento, IBM Plex Mono para valores, touch target tripé |
| Modificar | `src/components/simulator/PhotoPreview.tsx` | Badges com paleta Versa, remover EV técnico da foto |
| Modificar | `src/components/simulator/CameraSimulator.tsx` | Layout split desktop, CTA Ouro Versa, integrar ExposureMeter |
| Modificar | `src/app/scenarios/[id]/page.tsx` | Trocar emojis 🎯/💡 por ícones Lucide |
| Modificar | `src/app/dashboard/page.tsx` | Trocar emojis por ícones Lucide, touch targets |

---

## Task 0: Tokens e fontes Versa

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS variables `--versa-gold`, `--versa-gold-dark`, `--versa-cinza-campo`, `--versa-cinza-voz` disponíveis globalmente; font variables `--font-display`, `--font-body`, `--font-mono-versa` disponíveis via Tailwind

- [ ] **Step 1: Ler o layout atual para não sobrescrever imports existentes**

```bash
cat /Users/viniciuscunha/versa-visual-photolab/src/app/layout.tsx
```

- [ ] **Step 2: Atualizar `src/app/layout.tsx` para carregar as 3 fontes Versa**

O arquivo atual importa `Inter` de `next/font/google`. Substituir pelo conjunto Versa:

```tsx
import { Big_Shoulders_Display, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-versa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Versa Visual PhotoLab",
  description: "Simulador de exposição fotográfica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${bigShoulders.variable} ${workSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <header className="border-b border-[#3A3A3A] bg-[#0A0A0A]">
          <nav className="container max-w-3xl mx-auto px-4 h-14 flex items-center gap-6">
            <Link href="/" className="font-display font-bold text-sm tracking-widest uppercase text-[#C8A96E]">
              VERSA VISUAL
            </Link>
            <Link href="/dashboard" className="text-sm text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors font-body">
              Painel
            </Link>
            <Link href="/scenarios" className="text-sm text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors font-body">
              Cenários
            </Link>
            <Link href="/simulator" className="text-sm text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors font-body">
              Simulador
            </Link>
            <Link href="/library" className="text-sm text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors font-body">
              Biblioteca
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
```

> **Atenção:** Se o layout atual tiver outros elementos no `<header>` ou `<nav>`, preserve-os — apenas troque Inter pelas 3 fontes Versa e aplique as classes de cor da marca.

- [ ] **Step 3: Adicionar tokens Versa ao `src/app/globals.css`**

No bloco `@theme inline { ... }`, adicionar as font variables:

```css
  --font-body: var(--font-body);
  --font-display: var(--font-display);
  --font-mono: var(--font-mono-versa);
```

No bloco `.dark { ... }`, adicionar logo após `--ring:`:

```css
  /* Versa Brand Tokens */
  --versa-gold: #C8A96E;
  --versa-gold-dark: #9A7A42;
  --versa-cinza-campo: #3A3A3A;
  --versa-cinza-voz: #8A8A8A;
  --versa-branco: #FAFAFA;
  --versa-preto: #0A0A0A;

  /* Sobrescrever shadcn defaults com identidade Versa */
  --background: oklch(0.06 0 0);         /* #0A0A0A */
  --foreground: oklch(0.98 0 0);         /* #FAFAFA */
  --card: oklch(0.25 0 0);              /* #3A3A3A */
  --card-foreground: oklch(0.98 0 0);
  --border: oklch(0.25 0 0);            /* #3A3A3A */
  --primary: oklch(0.73 0.09 75);        /* #C8A96E Ouro Versa */
  --primary-foreground: oklch(0.06 0 0); /* #0A0A0A */
  --muted: oklch(0.25 0 0);             /* #3A3A3A */
  --muted-foreground: oklch(0.56 0 0);   /* #8A8A8A */
  --radius: 0.125rem;                    /* 2px — radius.card Versa */
```

- [ ] **Step 4: Adicionar classes utilitárias de fonte no `@layer base` do globals.css**

Ao final do bloco `@layer base { ... }`:

```css
  .font-display { font-family: var(--font-display), sans-serif; }
  .font-body    { font-family: var(--font-body), sans-serif; }
  .font-mono    { font-family: var(--font-mono-versa), monospace; }
```

- [ ] **Step 5: Verificar TypeScript e CSS**

```bash
cd /Users/viniciuscunha/versa-visual-photolab && npx tsc --noEmit 2>&1 | head -20
```

Esperado: nenhum erro de TypeScript

- [ ] **Step 6: Verificar fontes no browser**

```bash
npm run dev
```

Abrir `http://localhost:3000` e inspecionar o header — "VERSA VISUAL" deve aparecer em Big Shoulders Display em dourado (`#C8A96E`).

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: add Versa brand tokens and typography system (Big Shoulders, Work Sans, IBM Plex Mono)"
```

---

## Task 1: ExposureMeter — régua visual de EV com identidade Versa

**Files:**
- Create: `src/components/simulator/ExposureMeter.tsx`

**Interfaces:**
- Consumes: `evDelta: number` (de `ExposureResult.evDelta`) — valores típicos entre −5 e +5; 0 = exposição ideal
- Produces: componente `<ExposureMeter evDelta={number} />` usado pela Task 4

**Regras de cor Versa:**
- Trilho: gradiente `#0A0A0A → #3A3A3A → #FAFAFA` (único gradiente aprovado: Preto→Cinza Campo→Branco)
- Indicador (ponteiro): sempre `#C8A96E` (Ouro Versa), posição indica o estado
- Label "Equilibrada": `#C8A96E` (Ouro Versa)
- Label "Subexposta": `#8A8A8A` (Cinza Voz)
- Label "Superexposta": `#FAFAFA` (Branco Névoa)
- Valores EV: IBM Plex Mono

- [ ] **Step 1: Criar `src/components/simulator/ExposureMeter.tsx`**

```tsx
"use client";

interface Props {
  evDelta: number;
}

export default function ExposureMeter({ evDelta }: Props) {
  // Clamp para exibição: −3 a +3 EV
  const clamped = Math.max(-3, Math.min(3, evDelta));
  // Posição do indicador: 0% = extremo esquerdo (−3 EV / subexposta), 100% = direito (+3 EV / superexposta)
  const pct = ((clamped + 3) / 6) * 100;

  const isUnder = evDelta > 1;
  const isOver = evDelta < -1;

  const labelText = isUnder
    ? "Subexposta"
    : isOver
      ? "Superexposta"
      : "Equilibrada";

  // Cor do label: ouro para equilibrada, branco névoa para super, cinza voz para sub
  const labelColor = isUnder
    ? "text-[#8A8A8A]"
    : isOver
      ? "text-[#FAFAFA]"
      : "text-[#C8A96E]";

  const evText =
    Math.abs(evDelta) > 0.2
      ? ` ${evDelta > 0 ? "+" : ""}${evDelta.toFixed(1)} EV`
      : "";

  return (
    <div className="space-y-1.5 px-1" aria-label={`Medidor de exposição: ${labelText}`}>
      {/* Trilho — gradiente aprovado Preto→Cinza Campo→Branco */}
      <div
        className="relative h-2.5 overflow-hidden border border-[#3A3A3A]"
        style={{
          background: "linear-gradient(to right, #0A0A0A, #3A3A3A 50%, #FAFAFA)",
          borderRadius: "2px",
        }}
      >
        {/* Zona central neutra (±1 EV) — sutil indicação da faixa ideal */}
        <div
          className="absolute top-0 h-full"
          style={{
            left: "33.3%",
            width: "33.3%",
            background: "rgba(200, 169, 110, 0.15)",
          }}
        />
        {/* Indicador — Ouro Versa, sempre */}
        <div
          className="absolute top-0 w-0.5 h-full transition-all duration-300"
          style={{
            left: `calc(${pct}% - 1px)`,
            background: "#C8A96E",
            boxShadow: "0 0 4px #C8A96E80",
          }}
        />
      </div>

      {/* Marcadores de escala — IBM Plex Mono */}
      <div className="flex justify-between font-mono text-[10px] text-[#8A8A8A] select-none">
        <span>−3</span>
        <span>−2</span>
        <span>−1</span>
        <span className="font-bold text-[#FAFAFA]">0</span>
        <span>+1</span>
        <span>+2</span>
        <span>+3</span>
      </div>

      {/* Status — Work Sans body */}
      <p className={`text-xs font-medium text-center font-body ${labelColor}`}>
        {labelText}
        <span className="font-mono text-[#8A8A8A]">{evText}</span>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /Users/viniciuscunha/versa-visual-photolab && npx tsc --noEmit 2>&1 | grep ExposureMeter
```

Esperado: nenhuma saída

- [ ] **Step 3: Commit**

```bash
git add src/components/simulator/ExposureMeter.tsx
git commit -m "feat: add ExposureMeter with Versa brand palette (gold indicator, mono typography)"
```

---

## Task 2: PhotoPreview — badges com paleta Versa

**Files:**
- Modify: `src/components/simulator/PhotoPreview.tsx`

**Interfaces:**
- Consumes: `ExposureResult` (sem mudança)
- Produces: mesmo componente `<PhotoPreview />` — sem EV no canto inferior (removido)

**Regras de cor Versa para os badges:**
- "Exposta": bg `#C8A96E` (Ouro Versa) + texto `#0A0A0A` — sucesso = ouro
- "Subexposta": bg `#3A3A3A` (Cinza Campo) + texto `#FAFAFA` — escuro = falta de luz
- "Superexposta": bg `#FAFAFA` (Branco Névoa) + texto `#0A0A0A` — branco = excesso de luz
- "Ruído" / "Tremida": bg `#3A3A3A` + texto `#8A8A8A` — estado técnico, menor ênfase
- Tamanho: `text-sm px-2.5 py-1 font-medium` (maior que o original `text-xs`)
- Border radius: 2px (inline style, pois `rounded-sm` = `0.125rem` após Task 0)
- **Remover** o overlay `EV {result.ev.toFixed(1)} / cena {result.evScene}` do canto inferior

- [ ] **Step 1: Substituir `src/components/simulator/PhotoPreview.tsx`**

```tsx
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
  const blurPx = result.hasMotionBlur ? 3 : 0;
  const activeImage = resolveImage(result.evDelta, imageUrl, imageUrls);

  return (
    <div
      className="relative overflow-hidden border border-[#3A3A3A]"
      style={{ aspectRatio: "4/3", background: "#0A0A0A", borderRadius: "2px" }}
    >
      {activeImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: `url(${activeImage})`,
            filter: `brightness(${brightness}%) blur(${blurPx}px)`,
          }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-8xl transition-all duration-300"
          style={{
            filter: `brightness(${brightness}%) blur(${blurPx}px)`,
            background: `hsl(${220 + result.evDelta * 5}, 20%, ${20 + brightness * 0.3}%)`,
          }}
        >
          {scenarioEmoji}
        </div>
      )}

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
            style={{ background: "#3A3A3A", color: "#FAFAFA", borderRadius: "2px" }}
          >
            Subexposta
          </span>
        )}
        {result.isOverexposed && (
          <span
            className="text-sm font-medium px-2.5 py-1 font-body"
            style={{ background: "#FAFAFA", color: "#0A0A0A", borderRadius: "2px" }}
          >
            Superexposta
          </span>
        )}
        {result.hasNoise && (
          <span
            className="text-sm font-medium px-2.5 py-1 font-body"
            style={{ background: "#3A3A3A", color: "#8A8A8A", borderRadius: "2px" }}
          >
            Ruído
          </span>
        )}
        {result.hasMotionBlur && (
          <span
            className="text-sm font-medium px-2.5 py-1 font-body"
            style={{ background: "#3A3A3A", color: "#8A8A8A", borderRadius: "2px" }}
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
              style={{ background: "#C8A96E", color: "#0A0A0A", borderRadius: "2px" }}
            >
              Exposta
            </span>
          )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /Users/viniciuscunha/versa-visual-photolab && npx tsc --noEmit 2>&1 | grep PhotoPreview
```

Esperado: nenhuma saída

- [ ] **Step 3: Commit**

```bash
git add src/components/simulator/PhotoPreview.tsx
git commit -m "fix: apply Versa brand palette to exposure badges (gold=exposta, cinza=sub, branco=super)"
```

---

## Task 3: CameraControls — agrupamento e tipografia Versa

**Files:**
- Modify: `src/components/simulator/CameraControls.tsx`

**Interfaces:**
- Consumes: `CameraSettings`, `locked?` — sem mudança
- Produces: mesmo componente `<CameraControls />` — interface Props inalterada

**Mudanças de identidade:**
- `SectionLabel`: IBM Plex Mono, CAPS, tracking+3 — igual ao "Label" do brand system
- Valores dos sliders (ISO, f/, velocidade, mm): IBM Plex Mono + Ouro Versa
- Labels dos sliders: Work Sans medium
- Hints: Work Sans regular, Cinza Voz `#8A8A8A`
- Botão Tripé: `min-h-[44px] px-4 py-2` (touch target 44px), border 1px Cinza Campo, radius 2px
- Separador de seção: borda `#3A3A3A` (Cinza Campo)
- Grupo "Composição & Foco": `opacity-70` para hierarquia visual (menor ênfase que Exposição)

- [ ] **Step 1: Substituir `src/components/simulator/CameraControls.tsx`**

```tsx
"use client";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { CameraSettings } from "@/types";

const ISO_STOPS = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
const APERTURE_STOPS = [1.4, 1.8, 2.0, 2.8, 4, 5.6, 8, 11, 16, 22];
const SHUTTER_STOPS = [
  1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125,
  1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4, 1 / 2, 1,
];
const FOCAL_LENGTHS = [24, 35, 50, 85, 105, 135];
const SHUTTER_LABELS = [
  "1/2000", "1/1000", "1/500", "1/250", "1/125",
  "1/60", "1/30", "1/15", "1/8", "1/4", "1/2", '1"',
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
          <Label className="font-body font-medium text-[#FAFAFA] text-sm">{label}</Label>
          {hint && (
            <p className="font-body text-xs mt-0.5" style={{ color: "#8A8A8A" }}>
              {hint}
            </p>
          )}
        </div>
        {/* Valor técnico: IBM Plex Mono, Ouro Versa */}
        <span className="font-mono font-semibold text-sm" style={{ color: "#C8A96E" }}>
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

export default function CameraControls({ settings, onChange, locked = {} }: Props) {
  const isoIdx = Math.max(0, ISO_STOPS.indexOf(settings.iso));
  const apIdx = Math.max(
    0,
    APERTURE_STOPS.findIndex((a) => Math.abs(a - settings.aperture) < 0.01),
  );
  const shutIdx = Math.max(
    0,
    SHUTTER_STOPS.findIndex((s) => Math.abs(s - settings.shutterSpeed) < 0.00001),
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
          onChange={(i) => onChange({ ...settings, iso: ISO_STOPS[Math.round(i)] })}
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
          onChange={(i) => onChange({ ...settings, aperture: APERTURE_STOPS[Math.round(i)] })}
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
          onChange={(i) => onChange({ ...settings, shutterSpeed: SHUTTER_STOPS[Math.round(i)] })}
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
          onChange={(i) => onChange({ ...settings, focalLength: FOCAL_LENGTHS[Math.round(i)] })}
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
          <Label className="font-body text-sm font-medium text-[#FAFAFA]">Tripé</Label>
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
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /Users/viniciuscunha/versa-visual-photolab && npx tsc --noEmit 2>&1 | grep CameraControls
```

Esperado: nenhuma saída

- [ ] **Step 3: Commit**

```bash
git add src/components/simulator/CameraControls.tsx
git commit -m "feat: apply Versa brand to camera controls (IBM Plex Mono values, gold accent, grouped sections)"
```

---

## Task 4: CameraSimulator — layout split desktop e CTA Ouro Versa

**Files:**
- Modify: `src/components/simulator/CameraSimulator.tsx`

**Interfaces:**
- Consumes: `ExposureMeter` de `./ExposureMeter`
- Produces: mesmo componente `<CameraSimulator />` — interface Props inalterada

**Mudanças de identidade:**
- Botão "Fotografar": bg `#C8A96E` (Ouro Versa), texto `#0A0A0A`, radius 2px — CTA primário da marca
- Botão "Resetar": border `#3A3A3A`, texto `#8A8A8A`, hover texto `#FAFAFA` — ação secundária
- Card: border `#3A3A3A`, sem `rounded-lg` (usa 2px do token global)
- Header do card: título em Work Sans, subtítulo em `#8A8A8A`
- Layout: coluna única em mobile, grid 2 colunas em desktop
- Remover o bloco de status exposição (`text-blue-300/yellow-300/green-300`) — substituído pelo ExposureMeter
- Emoji 📸 → ícone Lucide `Camera`
- Ícone `RotateCcw` para o Resetar

- [ ] **Step 1: Substituir `src/components/simulator/CameraSimulator.tsx`**

```tsx
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
  const [settings, setSettings] = useState<CameraSettings>(initialCameraSettings);
  const result = useMemo(() => calculateExposure(settings), [settings]);

  return (
    <Card
      className="w-full"
      style={{ border: "1px solid #3A3A3A", background: "#0A0A0A", borderRadius: "2px" }}
    >
      <CardHeader className="space-y-2" style={{ borderBottom: "1px solid #3A3A3A" }}>
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
                    (e.currentTarget as HTMLButtonElement).style.background = "#9A7A42";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#C8A96E";
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
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /Users/viniciuscunha/versa-visual-photolab && npx tsc --noEmit 2>&1 | grep -E "(CameraSimulator|ExposureMeter)"
```

Esperado: nenhuma saída

- [ ] **Step 3: Verificar visualmente nas duas rotas**

```bash
npm run dev
```

- `http://localhost:3000/simulator` — botão "Fotografar" dourado, régua com indicador ouro, badges com paleta Versa
- `http://localhost:3000/scenarios/praia` — mesmo botão "Fotografar e avaliar" dourado

- [ ] **Step 4: Commit**

```bash
git add src/components/simulator/CameraSimulator.tsx
git commit -m "feat: Ouro Versa CTA, split desktop layout, remove emoji icon, integrate ExposureMeter"
```

---

## Task 5: Scenario page — ícones Lucide, identidade Versa no card de desafio

**Files:**
- Modify: `src/app/scenarios/[id]/page.tsx`

**Mudanças:**
- `🎯 Desafio` → ícone `Target` (Lucide) + texto "Desafio"
- `💡` nos hints → ícone `Lightbulb` inline, cor `#C8A96E` (Ouro Versa)
- Card de desafio: border `#C8A96E` com opacity 30%, bg `rgba(200,169,110,0.06)` — destaque dourado suave em vez de `bg-primary/10`
- Emoji do cenário no `<h1>`: manter (é dado do cenário, não ícone estrutural)

- [ ] **Step 1: Editar `src/app/scenarios/[id]/page.tsx`**

Adicionar imports no topo (junto aos existentes):

```tsx
import { Target, Lightbulb } from "lucide-react";
```

Substituir o bloco do card de desafio:

```tsx
      <div
        className="p-4"
        style={{
          border: "1px solid rgba(200,169,110,0.30)",
          background: "rgba(200,169,110,0.06)",
          borderRadius: "2px",
        }}
      >
        <div className="flex items-center gap-2 font-body font-medium mb-2" style={{ color: "#C8A96E" }}>
          <Target size={15} aria-hidden="true" />
          <span>Desafio</span>
        </div>
        <p className="font-body text-sm text-[#FAFAFA]">{scenario.challenge.description}</p>
        <ul className="mt-3 space-y-1.5">
          {scenario.challenge.hints.map((h, i) => (
            <li key={i} className="font-body text-xs flex gap-2 items-start" style={{ color: "#8A8A8A" }}>
              <Lightbulb
                size={11}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "#C8A96E" }}
                aria-hidden="true"
              />
              {h}
            </li>
          ))}
        </ul>
      </div>
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /Users/viniciuscunha/versa-visual-photolab && npx tsc --noEmit 2>&1 | grep "scenarios"
```

Esperado: nenhuma saída

- [ ] **Step 3: Verificar visualmente**

Navegar para `http://localhost:3000/scenarios/praia`
- [ ] Card de desafio com borda dourada suave e ícone Target
- [ ] Hints com ícone Lightbulb dourado

- [ ] **Step 4: Commit**

```bash
git add "src/app/scenarios/[id]/page.tsx"
git commit -m "fix: Versa brand on scenario challenge card (gold accent, Lucide icons)"
```

---

## Task 6: Dashboard — ícones Lucide e identidade Versa

**Files:**
- Modify: `src/app/dashboard/page.tsx`

**Mudanças:**
- Heading "Painel de Treino": adicionar `font-display` (Big Shoulders Display)
- `🎯 Cenários` → `Target` Lucide, cor `#C8A96E`
- `📚 Biblioteca` → `BookOpen` Lucide, cor `#C8A96E`
- `🚀 Ações rápidas` → `Zap` Lucide, cor `#C8A96E`
- Links de ação rápida: `🎛️` → `SlidersHorizontal`; `🎯` → `Target`; `📚` → `BookOpen`
- Cards das seções: border `#3A3A3A`, bg `#0A0A0A`, radius 2px
- Botão primário "Ver desafios": bg `#C8A96E`, texto `#0A0A0A` (CTA principal = Ouro Versa)
- Botões secundários: border `#3A3A3A`, texto `#8A8A8A`, hover texto `#FAFAFA`
- Touch targets: `min-h-[44px]` em todos os links de ação

- [ ] **Step 1: Substituir `src/app/dashboard/page.tsx`**

```tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Target, BookOpen, Zap, SlidersHorizontal } from "lucide-react";
import { SCENARIOS } from "@/lib/scenarios";
import { CONCEPTS } from "@/lib/concepts";
import { getLocalProgress } from "@/lib/local-progress";
import {
  createClient,
  getUserProgress,
  isSupabaseConfigured,
} from "@/lib/supabase";
import XPCounter from "@/components/ui/XPCounter";
import ProgressBar from "@/components/ui/ProgressBar";
import type { UserProgress } from "@/types";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    scenariosCompleted: [],
    conceptsRead: [],
  });

  useEffect(() => {
    const load = async () => {
      setProgress(getLocalProgress());
      if (!isSupabaseConfigured()) return;
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const data = await getUserProgress(user.id);
        setProgress(data);
      } catch {
        setProgress(getLocalProgress());
      }
    };
    load();
  }, []);

  const scenariosCompleted = progress.scenariosCompleted.length;
  const conceptsRead = progress.conceptsRead.length;
  const scenarioProgress = SCENARIOS.length > 0 ? (scenariosCompleted / SCENARIOS.length) * 100 : 0;
  const conceptProgress = CONCEPTS.length > 0 ? (conceptsRead / CONCEPTS.length) * 100 : 0;

  return (
    <main className="container max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-sm" style={{ color: "#8A8A8A" }}>Modo visitante</p>
          {/* Big Shoulders Display para o heading principal */}
          <h1 className="font-display text-2xl font-bold text-[#FAFAFA]">Painel de Treino</h1>
          <p className="font-body text-sm" style={{ color: "#8A8A8A" }}>
            Seu progresso fica salvo neste navegador. Login é opcional.
          </p>
        </div>
        <XPCounter xp={progress.xp} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div
          className="p-5 space-y-3"
          style={{ border: "1px solid #3A3A3A", borderRadius: "2px", background: "#0A0A0A" }}
        >
          <h2 className="font-body font-semibold text-[#FAFAFA] flex items-center gap-2">
            <Target size={15} style={{ color: "#C8A96E" }} aria-hidden="true" />
            Cenários
          </h2>
          <ProgressBar
            value={scenarioProgress}
            label={`${scenariosCompleted} / ${SCENARIOS.length} concluídos`}
          />
          <div className="space-y-2 mt-2">
            {SCENARIOS.map((s) => (
              <Link
                key={s.id}
                href={`/scenarios/${s.id}`}
                className="flex items-center gap-2 font-body text-sm transition-colors hover:text-[#FAFAFA]"
                style={{ color: "#8A8A8A" }}
              >
                <span aria-hidden="true">{s.emoji}</span>
                <span>{s.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div
          className="p-5 space-y-3"
          style={{ border: "1px solid #3A3A3A", borderRadius: "2px", background: "#0A0A0A" }}
        >
          <h2 className="font-body font-semibold text-[#FAFAFA] flex items-center gap-2">
            <BookOpen size={15} style={{ color: "#C8A96E" }} aria-hidden="true" />
            Biblioteca
          </h2>
          <ProgressBar
            value={conceptProgress}
            label={`${conceptsRead} / ${CONCEPTS.length} conceitos lidos`}
          />
          <div className="space-y-2 mt-2">
            {CONCEPTS.map((c) => (
              <Link
                key={c.slug}
                href={`/library/${c.slug}`}
                className="flex items-center gap-2 font-body text-sm transition-colors hover:text-[#FAFAFA]"
                style={{ color: "#8A8A8A" }}
              >
                <span aria-hidden="true">{c.emoji}</span>
                <span>{c.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        className="p-5"
        style={{ border: "1px solid #3A3A3A", borderRadius: "2px", background: "#0A0A0A" }}
      >
        <h2 className="font-body font-semibold text-[#FAFAFA] mb-4 flex items-center gap-2">
          <Zap size={15} style={{ color: "#C8A96E" }} aria-hidden="true" />
          Ações rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/simulator"
            className="flex items-center gap-2 font-body text-sm transition-colors min-h-[44px] px-4 py-2 hover:text-[#FAFAFA]"
            style={{ border: "1px solid #3A3A3A", color: "#8A8A8A", borderRadius: "2px" }}
          >
            <SlidersHorizontal size={14} aria-hidden="true" />
            Abrir simulador
          </Link>
          {/* CTA primário: Ouro Versa */}
          <Link
            href="/scenarios"
            className="flex items-center gap-2 font-body font-semibold text-sm min-h-[44px] px-4 py-2"
            style={{ background: "#C8A96E", color: "#0A0A0A", borderRadius: "2px" }}
          >
            <Target size={14} aria-hidden="true" />
            Ver desafios
          </Link>
          <Link
            href="/library"
            className="flex items-center gap-2 font-body text-sm transition-colors min-h-[44px] px-4 py-2 hover:text-[#FAFAFA]"
            style={{ border: "1px solid #3A3A3A", color: "#8A8A8A", borderRadius: "2px" }}
          >
            <BookOpen size={14} aria-hidden="true" />
            Estudar conceitos
          </Link>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /Users/viniciuscunha/versa-visual-photolab && npx tsc --noEmit 2>&1 | grep dashboard
```

Esperado: nenhuma saída

- [ ] **Step 3: Verificar visualmente**

Navegar para `http://localhost:3000/dashboard`
- [ ] Heading "Painel de Treino" em Big Shoulders Display
- [ ] Ícones Target/BookOpen/Zap em dourado `#C8A96E`
- [ ] Botão "Ver desafios" com fundo dourado `#C8A96E`
- [ ] Bordas em Cinza Campo `#3A3A3A`
- [ ] Emojis dos cenários e conceitos ainda aparecem nas listas (são dados, não ícones estruturais)

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "fix: Versa brand on dashboard (gold icons, sharp radius, Ouro Versa CTA)"
```

---

## Task 7: Verificação final, build e contraste

**Files:**
- Nenhum arquivo novo

- [ ] **Step 1: Build de produção**

```bash
cd /Users/viniciuscunha/versa-visual-photolab && npm run build 2>&1 | tail -20
```

Esperado: `✓ Compiled successfully` sem erros de TypeScript. Warnings de imagem são aceitáveis.

- [ ] **Step 2: Verificar contraste WCAG nos tokens Versa**

| Par | Contraste mínimo exigido | Verificar |
|-----|--------------------------|-----------|
| `#C8A96E` sobre `#0A0A0A` | 4.5:1 | Texto em Ouro no fundo Preto |
| `#FAFAFA` sobre `#0A0A0A` | 4.5:1 | Texto branco no fundo preto |
| `#0A0A0A` sobre `#C8A96E` | 4.5:1 | Texto preto no badge/botão dourado |
| `#8A8A8A` sobre `#0A0A0A` | 3:1 mínimo | Texto muted (labels secundários) |

Verificar com DevTools → inspetor de acessibilidade. Se `#8A8A8A` sobre `#0A0A0A` falhar 3:1, subir para `#9A9A9A`.

- [ ] **Step 3: Verificar rotas críticas**

```bash
npm run dev
```

| Rota | O que verificar |
|------|----------------|
| `/simulator` | Régua EV dourada, grupos Exposição/Composição, CTA dourado |
| `/scenarios/praia` | Card de desafio com borda dourada, ícone Target, botão Fotografar dourado |
| `/dashboard` | Heading Big Shoulders, ícones dourados, botão "Ver desafios" dourado |

- [ ] **Step 4: Verificar fontes carregadas**

Abrir DevTools → Network → filtrar "font". Confirmar que carregam:
- `Big_Shoulders_Display`
- `Work_Sans`
- `IBM_Plex_Mono`

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "chore: final verification — Versa brand system applied across simulator UI"
```

---

## Self-Review

### Spec Coverage

| Requisito | Task |
|-----------|------|
| Paleta exclusiva Versa (sem cores externas) | 0, 1, 2, 3, 4, 5, 6 |
| IBM Plex Mono para valores técnicos | 0, 3 |
| Big Shoulders Display para headings | 0, 6 |
| Work Sans para corpo | 0, 3, 4, 6 |
| Border radius 2px (radius.card Versa) | 0, 2, 3, 4, 5, 6 |
| CTA primário = Ouro Versa | 4, 6 |
| Régua visual de EV | 1 |
| Badges com paleta Versa | 2 |
| Agrupamento Exposição vs Composição | 3 |
| Touch target tripé 44px | 3 |
| Substituir emojis estruturais | 4, 5, 6 |
| Layout split desktop | 4 |
| Build sem erros | 7 |
| Verificação de contraste WCAG | 7 |

### Riscos Documentados

1. **`CameraSimulator` compartilhado**: Task 4 inclui verificação explícita de `/simulator` e `/scenarios/praia`
2. **font variables no Tailwind**: Task 0 define `.font-display`, `.font-body`, `.font-mono` no `@layer base` — se Tailwind não reconhecer, usar `style={{ fontFamily: "var(--font-display)" }}` como fallback inline
3. **`--radius: 0.125rem`** no `.dark`: pode afetar outros componentes shadcn (Input, Select, etc.) — verificar em Task 7 que não quebrou formulários de login/perfil
4. **Contraste de `#8A8A8A`**: Cinza Voz sobre Preto Operação — verificar em Task 7; se < 3:1, usar `#9A9A9A`
5. **Hover nos botões gold**: implementado via `onMouseEnter/Leave` inline — se shadcn sobrescrever, usar `hover:` class no Tailwind com `data-[hover]:` ou adicionar token CSS para `--versa-gold-dark`
