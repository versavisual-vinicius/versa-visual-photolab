interface Props {
  messages: string[];
  technique?: string;
  nextAttempt?: string;
}

export default function FeedbackPanel({
  messages,
  technique,
  nextAttempt,
}: Props) {
  const isPerfect = messages.length === 0;

  return (
    <div className="space-y-3">
      {isPerfect ? (
        <div className="rounded-lg bg-green-950/50 border border-green-800 p-4">
          <p className="text-green-300 font-medium">
            ✅ Excelente! Configuração ideal para o cenário.
          </p>
        </div>
      ) : (
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
      )}

      {technique && (
        <div className="rounded-lg bg-blue-950/40 border border-blue-800/50 p-4">
          <p className="text-xs font-medium text-blue-400 uppercase tracking-wide mb-1">
            Técnica
          </p>
          <p className="text-sm text-blue-100">{technique}</p>
        </div>
      )}

      {nextAttempt && (
        <div className="rounded-lg bg-amber-950/30 border border-amber-700/50 p-4">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wide mb-1">
            Próxima tentativa
          </p>
          <p className="text-sm text-amber-100">{nextAttempt}</p>
        </div>
      )}
    </div>
  );
}
