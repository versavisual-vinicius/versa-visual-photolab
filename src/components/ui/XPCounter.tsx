interface Props {
  xp: number;
}

export default function XPCounter({ xp }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-yellow-950/60 border border-yellow-800/50 text-yellow-400 text-sm font-mono px-3 py-1 rounded-full">
      ⚡ {xp.toLocaleString("pt-BR")} XP
    </span>
  );
}
