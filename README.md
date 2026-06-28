# VERSAVISUAL · PhotoLab Simulador

Simulador fotográfico interativo para aprender os fundamentos de exposição — ISO, abertura e velocidade do obturador — com cenários reais e física de câmera baseada na Lei da Reciprocidade.

🔗 **[versa-visual-photolab.vercel.app](https://versa-visual-photolab.vercel.app)**

---

## O que é

Um simulador educacional onde o usuário ajusta os parâmetros de uma câmera (ISO, abertura, velocidade) e vê o resultado em tempo real: brilho da foto, bokeh, grain, e uma pontuação ao fotografar. Cada cenário tem uma configuração ideal e o app ensina por que aquela combinação funciona.

## Cenários disponíveis

| Cenário | Desafio principal |
|---------|-------------------|
| 🏖️ Praia | Congelar onda sem superexpor |
| 🎬 Estúdio | Produto com fundo desfocado |
| 🏠 Ambiente Interno | Sem tripé, sem tremido |
| 🌿 Campo | Tudo em foco do primeiro plano ao horizonte |
| 🛋️ Casa | Objeto doméstico com pouca luz |

Cada cenário tem 3 variantes fotográficas reais (subexposta / normal / superexposta) que trocam dinamicamente com base no EV calculado.

## Motor de física

A exposição é calculada pela Equação de Valor de Exposição:

```
EV = log₂(N² / t) + log₂(ISO / 100)
evDelta = EV - evCena
```

- `evDelta < -1` → subexposto (foto escura) → troca para variante `sub`
- `-1 ≤ evDelta ≤ 1` → exposição correta → variante `normal`
- `evDelta > 1` → superexposto (foto clara) → variante `over`

A função `getBrightness(evDelta)` aplica um filtro CSS `brightness()` para variações finas dentro de cada faixa.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** + paleta VERSAVISUAL (ouro `#C8A96E`, fundo `#0A0A0A`)
- **Supabase** — Auth (Google OAuth) + progresso/XP por usuário
- **Vercel** — deploy automático

## Setup local

```bash
git clone https://github.com/versavisual-vinicius/versa-visual-photolab
cd versa-visual-photolab
npm install
cp .env.local.example .env.local
# preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

O simulador funciona sem Supabase configurado (modo visitante com progresso local no navegador).

## Schema Supabase

```sql
create table attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  scenario_id text not null,
  settings jsonb not null,
  score integer not null,
  feedback jsonb,
  created_at timestamptz default now()
);
alter table attempts enable row level security;
create policy "Users see own attempts" on attempts for all
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create table user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  xp integer default 0,
  scenarios_completed text[] default '{}',
  concepts_read text[] default '{}',
  updated_at timestamptz default now()
);
alter table user_progress enable row level security;
create policy "Users manage own progress" on user_progress for all
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );
```

---

Feito por [VERSAVISUAL](https://versavisual.com.br)
