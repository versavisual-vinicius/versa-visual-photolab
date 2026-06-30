@AGENTS.md

## Engine de Exposição
- Fórmula CORRETA: `ev100 = log2(aperture²/shutterSpeed)` → `evRequired = evScene + log2(iso/100)` → `evDelta = evRequired - ev100`
- NÃO usar `evDelta = ev - evScene` (fórmula antiga, sinal invertido para ISO/abertura)
- evDelta > 0 = superexposta (clara); evDelta < 0 = subexposta (escura)
- Engine: `src/lib/exposure-engine.ts`; testes: `src/lib/__tests__/exposure-engine.test.ts`
- Com ambient=14: f/2.8 1/500 ISO100 → evDelta≈+2.06 (superexposta); f/16 1/500 ISO100 → evDelta≈−2.97 (subexposta)
- Fotos de cenário: `public/scenarios/` (82 arquivos); referência original: `../versa-visual-photolab - cópia/public/scenarios/` (21 arquivos)
