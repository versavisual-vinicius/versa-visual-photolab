interface Props {
  messages: string[];
}

export default function FeedbackPanel({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <div className="rounded-lg bg-green-950/50 border border-green-800 p-4">
        <p className="text-green-300 font-medium">
          ✅ Excelente! Configuração ideal para o cenário.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-slate-900 border border-border p-4 space-y-2">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Análise
      </p>
      <ul className="space-y-2">
        {messages.map((msg, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="text-yellow-400 mt-0.5">⚠</span>
            <span className="text-slate-200">{msg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
