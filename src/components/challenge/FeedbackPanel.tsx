import { CheckCircle2, TriangleAlert } from "lucide-react";

interface Props {
  messages: string[];
}

export default function FeedbackPanel({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <div className="border border-[#3A3A3A] bg-[#111111] p-4">
        <p className="flex items-start gap-2 text-sm font-medium text-[#C8A96E]">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" aria-hidden />
          Excelente! Configuração ideal para o cenário.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#3A3A3A] bg-[#0A0A0A] p-4 space-y-3">
      <p className="font-mono text-[10px] font-medium uppercase text-[#8A8A8A] [letter-spacing:0.18em]">
        Análise
      </p>
      <ul className="space-y-2">
        {messages.map((msg, i) => (
          <li key={i} className="flex gap-2 text-sm leading-6">
            <TriangleAlert
              size={16}
              className="mt-1 shrink-0 text-[#C8A96E]"
              aria-hidden
            />
            <span className="text-[#FAFAFA]">{msg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
