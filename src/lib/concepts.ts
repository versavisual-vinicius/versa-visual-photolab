import type { Concept } from "@/types";

export const CONCEPTS: Concept[] = [
  {
    slug: "triangulo-exposicao",
    title: "Triângulo da Exposição",
    summary:
      "ISO, abertura e velocidade trabalham juntos para controlar a quantidade de luz na foto.",
    readingTimeMinutes: 3,
    emoji: "🔺",
    body: `## O que é o Triângulo da Exposição?\n\nToda fotografia depende de três variáveis que controlam a **exposição** — a quantidade de luz que chega ao sensor da câmera:\n\n- **ISO** — sensibilidade do sensor à luz\n- **Abertura (f/)** — tamanho da abertura da lente\n- **Velocidade do obturador** — tempo que o sensor fica exposto\n\n## Como eles se relacionam\n\nAumentar qualquer um deles clareia a foto. Diminuir, escurece. O desafio é escolher a combinação certa para a cena — cada variável tem efeitos colaterais:\n\n| Variável | Clareia quando | Efeito colateral |\n|---|---|---|\n| ISO | aumenta | introduz ruído |\n| Abertura | abre (f/ menor) | reduz profundidade de campo |\n| Velocidade | diminui | pode causar tremido |\n\n## Exemplo prático\n\nCena de praia com sol forte (EV 15): ISO 100 + f/8 + 1/500s = perfeito.`,
  },
  {
    slug: "profundidade-de-campo",
    title: "Profundidade de Campo",
    summary:
      "A área da foto que aparece nítida — controlada pela abertura, distância focal e distância do assunto.",
    readingTimeMinutes: 3,
    emoji: "🔍",
    body: `## O que é Profundidade de Campo (DoF)?\n\nÉ a **área da cena que aparece em foco** na foto. Fora dessa área, tudo fica desfocado (bokeh).\n\n## O que afeta a DoF?\n\n1. **Abertura** — abertura maior (f/ menor) = DoF menor (mais desfoque)\n2. **Distância focal** — lente mais longa (85mm) = DoF menor\n3. **Distância do assunto** — mais perto = DoF menor\n\n## Quando usar DoF rasa vs. profunda?\n\n- **Retratos**: DoF rasa — fundo desfocado destaca o rosto (f/1.8 a f/2.8)\n- **Paisagens**: DoF profunda — tudo em foco (f/11 a f/16)\n- **Produtos**: DoF média — assunto nítido, fundo suave (f/4 a f/5.6)`,
  },
  {
    slug: "bokeh",
    title: "Bokeh",
    summary:
      "O efeito visual de desfoque no fundo — criado com abertura aberta e distância focal longa.",
    readingTimeMinutes: 2,
    emoji: "✨",
    body: `## O que é Bokeh?\n\nBokeh é o **aspecto visual das áreas fora de foco** — geralmente visto como círculos ou formas suaves no fundo.\n\n## Como criar bokeh?\n\n1. Use **abertura aberta**: f/1.4, f/1.8 ou f/2.8\n2. Use **lente longa**: 85mm ou mais\n3. **Aproxime-se** do assunto\n4. Coloque o assunto **longe do fundo**\n\n## Exemplo\n\nRetrato com f/1.8, 85mm, sujeito a 2m do fundo → bokeh clássico e suave.`,
  },
  {
    slug: "ruido",
    title: "Ruído Digital",
    summary:
      "Granulação indesejada causada por ISO alto — quanto maior o ISO, mais ruído na imagem.",
    readingTimeMinutes: 2,
    emoji: "📺",
    body: `## O que é Ruído Digital?\n\nÉ a **granulação ou textura aleatória** que aparece na imagem quando o ISO está alto.\n\n## Quando aparece?\n\n- **ISO 100–800**: quase sem ruído\n- **ISO 1600–3200**: ruído perceptível, mas aceitável\n- **ISO 6400+**: ruído intenso, detalhes perdidos\n\n## Como evitar?\n\n1. Mantenha o **ISO o mais baixo possível**\n2. Compense com **abertura maior** ou **velocidade menor**\n3. Use **tripé** para poder usar velocidades lentas com ISO baixo\n\n## Quando aceitar o ruído?\n\nEm ambientes escuros sem tripé, é melhor ter uma foto com ruído do que uma foto tremida.`,
  },
  {
    slug: "motion-blur",
    title: "Motion Blur (Tremido)",
    summary:
      "Desfoque causado por movimento — do assunto ou da câmera — durante a exposição.",
    readingTimeMinutes: 2,
    emoji: "💨",
    body: `## O que é Motion Blur?\n\nÉ o **desfoque causado por movimento** durante o tempo em que o obturador está aberto.\n\n## Velocidade mínima sem tripé\n\nRegra geral: use velocidade de pelo menos **1/(distância focal)**\n\n- 50mm → mínimo 1/60s\n- 85mm → mínimo 1/100s\n- 200mm → mínimo 1/200s\n\n## Para congelar movimento\n\n- Pessoa caminhando: 1/125s\n- Criança correndo: 1/500s\n- Onda do mar: 1/500s a 1/1000s`,
  },
  {
    slug: "modos-camera",
    title: "Modos da Câmera",
    summary:
      "Manual, Av, Tv e Programa — cada modo entrega diferente nível de controle ao fotógrafo.",
    readingTimeMinutes: 3,
    emoji: "🎛️",
    body: `## Os quatro modos principais\n\n### M — Manual\nVocê controla **tudo**: ISO, abertura e velocidade.\n\n### Av / A — Prioridade de Abertura\nVocê escolhe a **abertura**; a câmera define a velocidade. Ideal para controlar profundidade de campo.\n\n### Tv / S — Prioridade de Velocidade\nVocê escolhe a **velocidade**; a câmera define a abertura. Ideal para congelar movimento.\n\n### P — Programa\nA câmera escolhe abertura e velocidade; você controla o ISO.\n\n## Quando usar cada um?\n\n| Situação | Modo recomendado |\n|---|---|\n| Aprendizado e controle total | Manual |\n| Retrato / bokeh | Av |\n| Esporte / ação | Tv |\n| Situações variadas | P |`,
  },
];

export function getConcept(slug: string): Concept | undefined {
  return CONCEPTS.find((c) => c.slug === slug);
}
