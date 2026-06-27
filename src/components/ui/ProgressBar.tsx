interface Props {
  value: number;
  label?: string;
}

export default function ProgressBar({ value, label }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
