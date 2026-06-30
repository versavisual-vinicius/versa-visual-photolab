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
    learningOrder: 1,
    coursePillar: "Exposição",
    courseModule: "Triângulo da exposição em alta luminosidade",
    intention: "Congelar movimento em luz intensa sem superexpor",
    professionalUse: "Fotografia de esportes aquáticos, lifestyle praia",
    lightType: "Natural direta",
    lightDirection: "Frontal-lateral",
    lightChallenge: "Alta dinâmica: reflexos de areia e água + sombras fortes",
    feedback: {
      underexposed:
        "A praia com tanta luz deveria estar bem exposta. Tente aumentar o ISO, abrir a abertura ou usar velocidade mais lenta.",
      overexposed:
        "Areia e água refletiram muito! Reduza o ISO, feche a abertura ou use um filtro ND.",
      noisy:
        "Com tanta luz na praia, ISO 100 é suficiente — não há necessidade de ISO alto aqui.",
      motionBlur:
        "A onda não ficou congelada. Use 1/500s ou mais para capturar o impacto.",
      perfect:
        "Exposição perfeita! A onda está nítida e a luz da praia está equilibrada.",
      nextAttempt:
        "Tente 1/1000s para congelar spray da onda. Compare com 1/250s para ver a diferença.",
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
    learningOrder: 2,
    coursePillar: "Profundidade de campo",
    courseModule: "Bokeh controlado em estúdio",
    intention: "Separar produto do fundo com abertura aberta",
    professionalUse: "Fotografia de produto, e-commerce, still life",
    lightType: "Artificial — softbox",
    lightDirection: "Lateral 45°",
    lightChallenge:
      "Luz plana de estúdio — domínio de abertura para criar profundidade",
    feedback: {
      underexposed:
        "O estúdio tem luz controlada — aumente um pouco o ISO ou abra a abertura.",
      overexposed:
        "Reduza a potência do flash ou feche a abertura para proteger os detalhes claros.",
      noisy:
        "Em estúdio você controla a luz — ISO 200 é suficiente. Evite ISO alto aqui.",
      shallowDofMissed:
        "Abra mais a abertura (f/2.8 ou f/1.8) para desfocar o fundo e destacar o produto.",
      perfect:
        "Produto bem exposto com fundo suavemente desfocado. Resultado profissional!",
      nextAttempt:
        "Tente f/1.8 e veja como o bokeh isola ainda mais o produto do fundo neutro.",
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
    learningOrder: 3,
    coursePillar: "ISO e ruído",
    courseModule: "Fotografar na mão em ambiente de baixa luz",
    intention: "Equilibrar ISO, abertura e velocidade sem tripé",
    professionalUse: "Fotografia de interiores, lifestyle indoor, retratos",
    lightType: "Mista — janela + artificial",
    lightDirection: "Lateral difusa",
    lightChallenge:
      "Baixa luminosidade + mistura de temperaturas de cor — desafio de equilíbrio",
    feedback: {
      underexposed:
        "Pouca luz aqui. Aumente o ISO para 800 ou mais, ou abra a abertura para f/2.8.",
      overexposed:
        "Raro em ambiente interno assim. Feche a abertura ou reduza o ISO.",
      noisy:
        "ISO elevado gerou ruído visível. Em ambientes internos é um trade-off — reduza se puder abrir mais a abertura.",
      motionBlur:
        "Tremido! Mantenha ao menos 1/60s ao fotografar na mão. Segure a respiração.",
      perfect:
        "Equilíbrio perfeito para baixa luz sem tripé. A exposição e nitidez estão ótimas.",
      nextAttempt:
        "Experimente ISO 1600 com 1/125s e compare o ruído com o tremido — qual você prefere?",
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
    learningOrder: 4,
    coursePillar: "Profundidade de campo",
    courseModule: "Hiperfocal e profundidade máxima em paisagem",
    intention: "Maximizar foco do primeiro plano ao infinito",
    professionalUse: "Fotografia de paisagem, natureza, imobiliária outdoor",
    lightType: "Natural indireta",
    lightDirection: "Ampla / difusa",
    lightChallenge:
      "Luz variável de céu nublado — exposição consistente sem stourar nuvens",
    feedback: {
      underexposed:
        "A paisagem merece exposição generosa. Abra um pouco a abertura ou use velocidade mais lenta com tripé.",
      overexposed:
        "O céu estourou! Feche a abertura ou use velocidade mais rápida para preservar as nuvens.",
      noisy:
        "Com luz natural e tripé, ISO 100 é o ideal para paisagem. Não há motivo para ISO alto.",
      perfect:
        "Paisagem do primeiro plano ao horizonte, tudo em foco. Exposição equilibrada!",
      nextAttempt:
        "Tente f/16 com tripé e compare com f/8. Qual mantém melhor foco no primeiro plano?",
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
    learningOrder: 5,
    coursePillar: "Baixa luz",
    courseModule: "Limite de ISO em ambiente noturno indoor",
    intention: "Fotografar em luz mínima aceitando ruído como trade-off",
    professionalUse: "Fotografia de interiores à noite, lifestyle doméstico",
    lightType: "Artificial — tungstênio + LED",
    lightDirection: "Pontual / abajur",
    lightChallenge:
      "Luz mínima e quente — equilíbrio extremo entre ISO, abertura e velocidade",
    feedback: {
      underexposed:
        "Muito escuro! Com tão pouca luz, suba o ISO para 1600 ou 3200 e abra ao máximo a abertura.",
      overexposed:
        "A luz do abajur enganou? Reduza o ISO ou feche levemente a abertura.",
      noisy:
        "O ruído em ISO 3200 aqui é esperado e aceitável. O importante é ter uma foto exposta.",
      motionBlur:
        "Tremido! Apoie a câmera em algo ou use 1/30s no mínimo mesmo com abertura bem aberta.",
      perfect:
        "Exposição impressionante com tão pouca luz. Domínio total do triângulo da exposição!",
      nextAttempt:
        "Compare ISO 3200/f1.8/1/60s com ISO 6400/f2.8/1/60s. Qual tem menos ruído total?",
    },
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
