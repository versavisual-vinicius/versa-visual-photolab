import type { Scenario } from "@/types";

export const SCENARIOS: Scenario[] = [
  {
    id: "praia",
    title: "Praia",
    description:
      "Luz intensa, areia reflexiva. O sol bate forte e o mar está agitado.",
    emoji: "🏖️",
    imageUrl: "/scenarios/praia-normal.jpg",
    imageUrls: {
      under: "/scenarios/praia-sub.jpg",
      over: "/scenarios/praia-over.jpg",
    },
    ambientLight: 15,
    challenge: {
      description:
        "Congele uma onda sem estourar a exposição. O sol está brilhante.",
      hints: [
        "Use velocidade alta (1/500s ou mais) para congelar o movimento.",
        "Com tanta luz, você pode fechar a abertura e manter ISO baixo.",
        "Cuidado: areia e água refletem muito — pode superexpor fácil.",
      ],
    },
    ideal: {
      iso: 100,
      aperture: 8,
      shutterSpeed: 1 / 500,
      toleranceEV: 1,
      requiresShallowDof: false,
      requiresFrozenMotion: true,
      requiresLowNoise: true,
    },
  },
  {
    id: "estudio",
    title: "Estúdio",
    description: "Luz artificial controlada, fundo neutro. Sessão de produto.",
    emoji: "🎬",
    imageUrl: "/scenarios/estudio-normal.jpg",
    imageUrls: {
      under: "/scenarios/estudio-sub.jpg",
      over: "/scenarios/estudio-over.jpg",
    },
    ambientLight: 9,
    challenge: {
      description:
        "Fotografe o produto com exposição perfeita e fundo levemente desfocado.",
      hints: [
        "Luz controlada permite ISO baixo — mantenha em 100 ou 200.",
        "Abra a abertura para f/2.8 ou f/4 para um bokeh suave.",
        "Velocidade de 1/125s é suficiente para assunto parado.",
      ],
    },
    ideal: {
      iso: 200,
      aperture: 2.8,
      shutterSpeed: 1 / 125,
      toleranceEV: 1,
      requiresShallowDof: true,
      requiresFrozenMotion: false,
      requiresLowNoise: true,
    },
  },
  {
    id: "ambiente-interno",
    title: "Ambiente Interno",
    description:
      "Sala iluminada por janela + luz artificial. Pouca luz disponível.",
    emoji: "🏠",
    imageUrl: "/scenarios/ambiente-interno-normal.jpg",
    imageUrls: {
      under: "/scenarios/ambiente-interno-sub.jpg",
      over: "/scenarios/ambiente-interno-over.jpg",
    },
    ambientLight: 6,
    challenge: {
      description:
        "Fotografe sem tripé. Evite tremido e mantenha o ruído aceitável.",
      hints: [
        "ISO 800 ou 1600 pode ser necessário — aceite um pouco de ruído.",
        "Use a velocidade mínima para segurar na mão: 1/60s.",
        "Abra a abertura para compensar a pouca luz.",
      ],
    },
    ideal: {
      iso: 800,
      aperture: 2.8,
      shutterSpeed: 1 / 60,
      toleranceEV: 1,
      requiresShallowDof: false,
      requiresFrozenMotion: false,
      requiresLowNoise: false,
    },
  },
  {
    id: "campo",
    title: "Campo",
    description:
      "Paisagem aberta, luz natural variável, vegetação com vento suave.",
    emoji: "🌿",
    imageUrl: "/scenarios/campo-normal.jpg",
    imageUrls: {
      under: "/scenarios/campo-sub.jpg",
      over: "/scenarios/campo-over.jpg",
    },
    ambientLight: 13,
    challenge: {
      description:
        "Fotografe a paisagem com tudo em foco — do primeiro plano ao horizonte.",
      hints: [
        "Use abertura fechada (f/11 ou f/16) para maximizar a profundidade de campo.",
        "Com tripé, você pode usar velocidade lenta e ISO baixo.",
        "Cuidado com vento: vegetação pode trepidar com velocidade muito lenta.",
      ],
    },
    ideal: {
      iso: 100,
      aperture: 11,
      shutterSpeed: 1 / 125,
      toleranceEV: 1,
      requiresShallowDof: false,
      requiresFrozenMotion: false,
      requiresLowNoise: true,
    },
  },
  {
    id: "casa",
    title: "Casa",
    description:
      "Sala de estar com luz de abajur e TV. Pouca luz, espaço pequeno.",
    emoji: "🛋️",
    imageUrl: "/scenarios/casa-normal.jpg",
    imageUrls: {
      under: "/scenarios/casa-sub.jpg",
      over: "/scenarios/casa-over.jpg",
    },
    ambientLight: 4,
    challenge: {
      description:
        "Fotografe um objeto doméstico. Equilíbrio entre ruído e tremido.",
      hints: [
        "ISO 1600 ou 3200 pode ser necessário para ter velocidade suficiente.",
        "Apoie a câmera em algo ou use velocidade de ao menos 1/30s.",
        "Abertura aberta (f/1.8 ou f/2.8) ajuda bastante nessa situação.",
      ],
    },
    ideal: {
      iso: 1600,
      aperture: 1.8,
      shutterSpeed: 1 / 60,
      toleranceEV: 1,
      requiresShallowDof: false,
      requiresFrozenMotion: false,
      requiresLowNoise: false,
    },
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
