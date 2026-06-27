import { notFound } from "next/navigation";
import { getConcept } from "@/lib/concepts";
import Link from "next/link";

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) notFound();

  const sections = concept.body
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <main className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
      <Link
        href="/library"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Biblioteca
      </Link>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">{concept.emoji}</span>
          <h1 className="text-2xl font-bold">{concept.title}</h1>
        </div>
        <p className="text-muted-foreground">{concept.summary}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          ⏱ {concept.readingTimeMinutes} min de leitura
        </p>
      </div>
      <article className="space-y-4">
        {sections.map((section, i) => {
          if (section.startsWith("### "))
            return (
              <h3 key={i} className="text-lg font-medium mt-4">
                {section.replace("### ", "")}
              </h3>
            );
          if (section.startsWith("## "))
            return (
              <h2 key={i} className="text-xl font-semibold mt-6">
                {section.replace("## ", "")}
              </h2>
            );
          if (section.startsWith("| ")) {
            const rows = section
              .split("\n")
              .filter((r) => !r.match(/^\|[\s\-|]+\|$/));
            return (
              <div key={i} className="overflow-x-auto">
                <table className="text-sm w-full border-collapse">
                  {rows.map((row, ri) => {
                    const cells = row.split("|").filter((c) => c.trim());
                    return (
                      <tr key={ri} className="border-b border-border">
                        {cells.map((cell, ci) => (
                          <td
                            key={ci}
                            className="px-3 py-1.5 text-muted-foreground first:text-foreground"
                          >
                            {cell.trim()}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </table>
              </div>
            );
          }
          if (section.startsWith("- ")) {
            const items = section.split("\n").filter((l) => l.startsWith("- "));
            return (
              <ul
                key={i}
                className="list-disc list-inside space-y-1 text-muted-foreground"
              >
                {items.map((item, ii) => (
                  <li key={ii}>
                    {item
                      .replace(/^- \*\*(.+?)\*\* —/, "")
                      .replace("- ", "")
                      .trim()}
                  </li>
                ))}
              </ul>
            );
          }
          if (section.match(/^\d+\. /)) {
            const items = section.split("\n").filter((l) => l.match(/^\d+\. /));
            return (
              <ol
                key={i}
                className="list-decimal list-inside space-y-1 text-muted-foreground"
              >
                {items.map((item, ii) => (
                  <li key={ii}>{item.replace(/^\d+\. /, "")}</li>
                ))}
              </ol>
            );
          }
          return (
            <p key={i} className="text-muted-foreground leading-relaxed">
              {section}
            </p>
          );
        })}
      </article>
    </main>
  );
}
