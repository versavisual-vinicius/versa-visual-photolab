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
    <div
      className="space-y-1.5 px-1"
      aria-label={`Medidor de exposição: ${labelText}`}
    >
      {/* Trilho — gradiente aprovado Preto→Cinza Campo→Branco */}
      <div
        className="relative h-2.5 overflow-hidden border border-[#3A3A3A]"
        style={{
          background:
            "linear-gradient(to right, #0A0A0A, #3A3A3A 50%, #FAFAFA)",
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
