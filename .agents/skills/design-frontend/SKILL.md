---
name: design-frontend
description: >
  Embeleza o frontend de uma rota do ERP Conexao aplicando classes de estilo do design system do dashboard.
  NAO cria novos elementos — apenas reaplica classes CSS nos elementos que ja existem.
  Trigger: /design <rota> — Exemplo: /design /cadastros/solicitacoes
  Use quando o usuario quiser refatorar o design visual de qualquer pagina frontend do projeto.
---

# Design Frontend — ERP Conexao

Embeleza o frontend de uma rota reaplicando classes CSS no design system do dashboard.
NAO cria novos componentes, NAO adiciona novos elementos, NAO muda a estrutura HTML.
Apenas substitui classes existentes pelas classes do design system.

## Modelo de Excelência

**TODAS as rotas devem seguir o padrão visual de `/cadastros/dashboard` como referência de excelência.**

**ANTES de qualquer alteração, leia `src/routes/cadastros.dashboard.tsx` e copie seus padrões.**

Padrões obrigatórios do modelo:
- KPI cards: `bg-gradient-to-br from-{cor}/20 via-{cor}/10 to-transparent` + ícone flutuante `absolute top-4 right-4 w-12 h-12 rounded-xl bg-{cor}/15`
- Status pills: `flex items-center gap-3 rounded-xl bg-{cor}/10 border border-{cor}/20 p-3`
- Skeleton: `<Skeleton className="h-32 rounded-2xl" />` em grid `grid-cols-2 lg:grid-cols-4 gap-4`
- EmptyState: `<EmptyState icon={<Icone />} title="..." description="..." />`
- Cards recentes: `group flex items-center gap-4 rounded-xl bg-surface border border-border p-4 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5`
- Headers: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`
- Dialogs: header com gradiente `bg-gradient-to-br from-{cor}/20 via-{cor}/10 to-transparent px-6 pt-6 pb-4 border-b border-border/50`
- AlertDialogs: header vermelho `bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent`

---

## REgras INegociaveis

### 1. EMBELEZAMENTO VISUAL EXCLUSIVO

**ESTA SKILL LIDA EXCLUSIVAMENTE COM EMBELEZAMENTO VISUAL.**

- NUNCA alterar logica de negocio
- NUNCA alterar state, effects, handlers, callbacks, funcoes
- NUNCA alterar chamadas a API ou Supabase
- NUNCA alterar regras de permissao ou autenticacao
- NUNCA alterar condicoes de renderizacao (if/ternary que controlam O QUE aparece)
- NUNCA alterar nomes de funcoes ou variaveis
- NUNCA alterar fluxo de dados (props, states, context)
- NUNCA alterar validacoes de formulario
- NUNCA alterar navegacao ou routing

**O UNICO ALTERADO E O className.** Se algo nao e className, NAO TOCAR.

### 2. MOBILE-FIRST OBRIGATORIO (INEGOCIÁVEL)

**TUDO É RESPONSIVO. TUDO É MOBILE-FIRST. SEM EXCEÇÃO.**

**Regras rígidas:**
- Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Gaps: `gap-3 sm:gap-4`
- Padding: `p-3 sm:p-4 lg:p-6`
- Headers: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`
- Touch targets: `min-h-[44px]` em TODOS os botões e links
- Hover effects: `sm:opacity-0 sm:group-hover:opacity-100` (mobile sempre visível)
- Dialogs: `w-[calc(100%-2rem)]` ou `max-w-lg`
- Tabelas: `overflow-x-auto` + grid responsivo `grid-cols-1 md:grid-cols-[...]`
- Títulos: `text-xl sm:text-2xl lg:text-3xl`

**Breakpoints:**
- Base: mobile (até 640px)
- `sm`: 640px+ (tablet retrato)
- `md`: 768px+ (tablet paisagem)
- `lg`: 1024px+ (desktop)

---

## Uso

```
/design <rota>
```

**IMPORTANTE:** Aplica o design system a TODAS as rotas do módulo, não apenas à informada.

Exemplo: `/design /mapas/distribuidores` → atualiza `/mapas/*` + `src/features/mapas/components/*`

## Fluxo (economia de tokens)

1. Ler `cadastros.dashboard.tsx` como referência
2. Listar rotas do módulo: `glob src/routes/<modulo>*`
3. Listar componentes: `glob src/features/<modulo>/components/*`
4. Para CADA arquivo: ler → substituir classes → salvar
5. Verificar mobile-first: TODOS os grids comecam em 1 coluna, TODOS os gaps são menores no mobile
6. Verificar TypeScript: `npx tsc --noEmit 2>&1 | grep <modulo>`
7. Verificar build: `npm run build`

## Mapa de Substituicao de Classes

### PASSO 0: Conversao de Tokens Antigos (FAZER PRIMEIRO)

ANTES de aplicar qualquer substituicao do mapa abaixo, percorra TODO o arquivo e substitua estes tokens antigos pelos tokens do design system. Estes tokens NAO estao no mapa de substituicao porque sao substituicoes globais de tokens.

#### Cores / Backgrounds

```
text-muted-foreground    → text-text-muted
text-foreground          → text-text-main
text-foreground/80       → text-text-main/80
bg-muted                 → bg-surface
bg-muted/40              → bg-surface/40
bg-muted/50              → bg-surface/50
bg-secondary             → bg-surface
bg-secondary/50          → bg-surface/50
bg-secondary/60          → bg-surface/60
border-border-subtle     → border-border
text-error               → text-destructive
bg-error                 → bg-destructive
text-primary             → text-accent
bg-primary               → bg-accent
bg-primary/10            → bg-accent/10
bg-primary/20            → bg-accent/20
border-primary           → border-accent
border-primary/40        → border-accent/40
hover:bg-primary/10      → hover:bg-accent/10
hover:border-primary/40  → hover:border-accent/40
hover:shadow-primary/5   → hover:shadow-accent/5
shadow-primary/5         → shadow-accent/5
from-primary             → from-accent
```

#### Gradientes Customizados

```
gradient-gold            → bg-accent (classe morta, nao existe em CSS)
```

#### Tipografia

```
font-display             → font-bold
```

#### Botoes Hover (utility classes)

Se o arquivo usa utility classes `btn-hover-*` definidas no globals.css, MANTEM — elas ja sao do design system. Nao substituir por inline classes.

```
btn-hover-neutral        → MANTER (utility class valida)
btn-hover-edit           → MANTER (utility class valida)
btn-hover-destructive    → MANTER (utility class valida)
```

#### Containers nao mapeados

```
className="max-w-7xl mx-auto"           → MANTER (layout responsivo valido)
className="flex flex-col h-full w-full" → MANTER (layout kanban full-height)
```

---

## Mapa de Substituicao — Elementos

### 1. Container Principal

```
ANTES: className="flex flex-col gap-6 p-4 pb-24 lg:p-8 lg:pb-8"
DEPOIS: className="space-y-8 animate-fade-in"
```

```
ANTES: className="flex flex-col gap-6 md:gap-8 p-4 pb-24"
DEPOIS: className="space-y-8 animate-fade-in"
```

```
ANTES: className="px-5 py-6 sm:px-8 sm:py-10 lg:px-12 max-w-7xl mx-auto"
DEPOIS: className="space-y-8 animate-fade-in"
```

### 2. Header (h1 + subtitulo)

```
ANTES: className="text-lg font-bold text-text-main"
DEPOIS: className="text-2xl font-bold text-text-main tracking-tight"
```

```
ANTES: className="text-xs text-text-muted"
DEPOIS (subtitulo): className="text-sm text-text-muted mt-1"
```

#### Header inline (flex entre titulo e acoes)

```
ANTES: className="flex items-center justify-between"
DEPOIS: className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
```

#### Section header (h2 + link "Ver todas")

```
ANTES: className="text-base font-semibold"
DEPOIS: className="text-lg font-bold text-text-main"
```

Link "Ver todas":
```
DEPOIS: className="flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors font-medium"
```

Container do section header:
```
DEPOIS: className="flex items-center justify-between mb-4"
```

#### Breadcrumbs

```
DEPOIS: className="flex items-center gap-1 text-xs text-text-muted"
```

### 3. KPI Cards / Metricas (COMPLETO)

#### Grid container

```
ANTES: className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
DEPOIS: className="grid grid-cols-2 lg:grid-cols-4 gap-4"
```

#### Card de KPI (container externo)

```
ANTES: className="flex flex-col gap-2 rounded-xl bg-card p-4 shadow-lg"
DEPOIS: className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-{cor}/20 via-{cor}/10 to-transparent border border-{cor}/20 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-{cor}/10 hover:border-{cor}/40"
```

Cores: accent, green-500, yellow-500, blue-500, orange-500, red-500, cyan-500

#### Icone flutuante no KPI (absolute position)

```
ANTES: <div className="...">
         <Icone className="w-5 h-5" />
       </div>
DEPOIS: <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-xl bg-{cor}/15 text-{cor} group-hover:scale-110 transition-transform duration-300">
         <Icone size={22} />
       </div>
```

#### Label do KPI (uppercase com tracking)

```
ANTES: className="text-xs text-text-muted"
DEPOIS: className="text-xs font-semibold text-{cor}/80 uppercase tracking-wider"
```

#### Valor do KPI (grande, responsivo)

```
ANTES: className="text-2xl font-bold text-text-main"
DEPOIS: className="text-3xl sm:text-4xl font-bold text-text-main mt-2"
```

```
ANTES: className="text-lg font-bold"
DEPOIS: className="text-3xl sm:text-4xl font-bold text-text-main mt-2"
```

#### Descricao do KPI (texto abaixo do valor)

```
ANTES: className="text-xs text-text-muted"
DEPOIS: className="text-xs text-text-muted mt-2"
```

#### Barra de progresso inline dentro do KPI

Container:
```
ANTES: className="h-2 rounded-full bg-background/60 mt-2"
DEPOIS: className="mt-2 h-1.5 w-full rounded-full bg-{cor}/10 overflow-hidden"
```

Fill:
```
ANTES: className="h-full rounded-full transition-all"
DEPOIS: className="h-full rounded-full bg-gradient-to-r from-{cor} to-{cor-lighter} transition-all duration-1000"
```

Exemplo real: `bg-gradient-to-r from-blue-500 to-blue-400`

#### Skeleton do KPI

```
DEPOIS: <Skeleton className="h-32 rounded-2xl" />
```

Container do skeleton KPI:
```
DEPOIS: className="grid grid-cols-2 lg:grid-cols-4 gap-4"
```

#### Mapeamento de cores por contexto KPI

| Contexto | from | border | shadow | icon-bg | icon-text | label |
|----------|------|--------|--------|---------|-----------|-------|
| accent | accent/20 | accent/20 | accent/10 | accent/15 | accent | accent/80 |
| amarelo | yellow-500/20 | yellow-500/20 | yellow-500/10 | yellow-500/15 | yellow-400 | yellow-400/80 |
| verde | green-500/20 | green-500/20 | green-500/10 | green-500/15 | green-400 | green-400/80 |
| azul | blue-500/20 | blue-500/20 | blue-500/10 | blue-500/15 | blue-400 | blue-400/80 |
| laranja | orange-500/20 | orange-500/20 | orange-500/10 | orange-500/15 | orange-400 | orange-400/80 |
| vermelho | red-500/20 | red-500/20 | red-500/10 | red-500/15 | red-400 | red-400/80 |
| ciano | cyan-500/20 | cyan-500/20 | cyan-500/10 | cyan-500/15 | cyan-400 | cyan-400/80 |

### 4. Status Breakdown Pills (cards clicaveis de status)

#### Card de status (pequeno, clicavel)

```
ANTES: className="flex items-center gap-2 rounded-lg bg-surface p-3"
DEPOIS: className="flex items-center gap-3 rounded-xl {bg} border {border} p-3 transition-all duration-200 hover:scale-[1.02]"
```

Onde `{bg}` = `bg-{cor}/10` e `{border}` = `border-{cor}/20`

Quando ativo/selecionado, adicionar:
```
+ className="ring-2 ring-accent/50"
```

#### Icone dentro do card de status

```
DEPOIS: className="flex items-center justify-center w-9 h-9 rounded-lg {bg}"
```

#### Valor dentro do card de status

```
DEPOIS: className="text-lg font-bold {color}"
```

Exemplo: `text-blue-400`, `text-green-400`, `text-red-400`

#### Label do card de status

```
DEPOIS: className="text-[11px] text-text-muted font-medium"
```

#### Grid de status breakdown

```
DEPOIS: className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3"
```

### 5. Cards de Lista

#### Card horizontal (lista simples)

```
ANTES: className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg transition active:scale-[0.98]"
DEPOIS: className="group flex items-center gap-4 rounded-xl bg-surface border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5"
```

Com stagger animation:
```
+ style={{ animationDelay: `${index * 50}ms` }}
```

#### Card vertical (grid de cards)

```
ANTES: className="flex flex-col gap-4 rounded-xl bg-card p-4"
DEPOIS: className="group flex flex-col gap-4 rounded-2xl bg-surface border border-border/60 p-5 text-left transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 active:scale-[0.99]"
```

Com stagger:
```
+ style={{ animationDelay: `${index * 30}ms` }}
```

#### Card com opacidade reduzida

```
ANTES: className="group p-6 bg-surface/70 border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer relative flex flex-col gap-4"
DEPOIS: className="group flex flex-col gap-4 rounded-xl bg-surface border border-border p-5 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 cursor-pointer"
```

#### Avatar no card (primeiro filho)

Padrao accent:
```
ANTES: className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10"
DEPOIS: className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0 group-hover:bg-accent/20 transition-colors"
```

Variante com hover mais forte:
```
DEPOIS: className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/15 text-accent font-bold text-sm shrink-0 group-hover:bg-accent/25 transition-colors"
```

Variante verde:
```
DEPOIS: className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/15 text-green-400 font-bold text-sm shrink-0 group-hover:bg-green-500/25 transition-colors"
```

#### Titulo dentro do card

```
ANTES: className="text-sm font-medium text-text-main truncate"
DEPOIS: className="text-sm font-semibold text-text-main truncate group-hover:text-accent transition-colors"
```

```
ANTES: className="font-display text-lg leading-tight min-w-0 truncate"
DEPOIS: className="text-sm font-semibold text-text-main truncate group-hover:text-accent transition-colors"
```

#### Footer do card (borda separadora)

```
DEPOIS: className="flex items-center justify-between pt-2 border-t border-border/30"
```

#### Grid de cards de lista

```
ANTES: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
DEPOIS: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
```

Compacto:
```
DEPOIS: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
```

### 6. Botoes de Acao

#### Botao CTA primario

```
ANTES: className="rounded-xl bg-accent p-5 text-white shadow-lg"
DEPOIS: className="flex items-center gap-2 rounded-xl bg-accent text-accent-fg px-5 py-2.5 text-sm font-semibold hover:bg-accent-hover transition-all duration-200 min-h-[44px] shadow-lg shadow-accent/20"
```

#### Botao outline/secundario

```
ANTES: className="rounded-xl border-2 border-accent/50 p-5 text-accent shadow-lg"
DEPOIS: className="flex items-center gap-2 rounded-xl bg-surface border border-border px-4 py-2.5 text-sm text-text-muted hover:text-text-main hover:border-accent/30 transition-all duration-200 min-h-[44px]"
```

#### Variantes completas de botoes

| Variante | className |
|----------|-----------|
| default (primary) | `bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:brightness-110` |
| destructive | `bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 hover:brightness-110` |
| outline | `border-2 border-border bg-transparent text-text-main hover:bg-surface-hover hover:border-accent/40` |
| secondary | `bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80` |
| ghost | `hover:bg-surface-hover hover:text-text-main rounded-xl` |
| ghost-edit | `text-blue-400 hover:bg-blue-500/10 hover:text-blue-400` |
| ghost-destructive | `text-error hover:bg-error/10 hover:text-error` |
| link | `text-primary underline-offset-4 hover:underline` |

Base comum (adicionar em qualquer botao):
```
inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 active:scale-[0.97] disabled:opacity-50
```

#### Tamanhos de botoes

| Tamanho | className |
|---------|-----------|
| xs | `h-8 rounded-lg px-2.5` |
| sm | `h-9 rounded-lg px-3.5` |
| default | `h-11 px-5 py-2` |
| lg | `h-12 rounded-xl px-8` |
| icon | `h-10 w-10` |

#### Botao de acao em cards (hover)

```
ANTES: sem acoes hover
DEPOIS: className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
```

### 7. Botoes de Acao em Massa

| Acao | className |
|------|-----------|
| Aprovar | `rounded-lg bg-green-500/10 p-2 text-green-500 hover:bg-green-500/20 transition` |
| Reprovar | `rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20 transition` |
| Corrigir | `rounded-lg bg-orange-500/10 p-2 text-orange-500 hover:bg-orange-500/20 transition` |
| Revisar | `rounded-lg bg-accent/10 p-2 text-accent hover:bg-accent/20 transition` |

### 8. Tabelas

#### Wrapper da tabela

```
ANTES: className="w-full"
DEPOIS: className="relative w-full overflow-x-auto rounded-xl border border-border"
```

Nativo (sem shadcn):
```
DEPOIS: className="hidden md:block border border-border rounded-xl overflow-hidden"
```

#### Table header (thead)

shadcn:
```
ANTES: (sem classes ou classes padrao)
DEPOIS: th com className="h-11 px-4 font-semibold text-text-secondary sticky top-0 bg-surface z-10"
```

Nativo:
```
DEPOIS: thead className="bg-surface-hover/30"
DEPOIS: th className="text-xs font-semibold text-text-muted uppercase"
```

#### Table rows (tr)

```
ANTES: className=""
DEPOIS: className="border-b border-border hover:bg-surface-hover/50"
```

Nativo:
```
DEPOIS: className="border-b border-border/50 last:border-0 hover:bg-surface-hover/20 cursor-pointer"
```

#### Table cells (td)

```
DEPOIS: className="px-4 py-3"
```

### 9. Filtros

#### Search input com icone

Container:
```
DEPOIS: className="relative flex-1"
```

Icone:
```
DEPOIS: className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
```

Input:
```
DEPOIS: className="pl-11 h-12 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
```

Botao clear:
```
DEPOIS: className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover"
```

#### Select filter

```
ANTES: className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm"
DEPOIS: className="w-full lg:w-56 h-12 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
```

#### Filtros Pills (botoes de status)

```
ANTES: className="inline-flex items-center gap-2 h-9 rounded-full px-4 text-xs font-semibold"
DEPOIS: className="flex items-center gap-3 rounded-xl bg-{cor}/10 border border-{cor}/20 p-3 transition-all duration-200 hover:scale-[1.02]"
```

### 10. Modais (Dialog / AlertDialog)

Modais DEVEM seguir o design system para manter consistencia visual com a pagina.
NAO alterar a estrutura HTML dos modais — apenas substituir classes CSS.

#### DialogContent

```
ANTES: className="bg-surface border-border"
DEPOIS: className="fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] bg-surface border border-border/50 rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-8"
```

Se ja usa `bg-card border-border`, manter. O padrao do componente base e `bg-surface` — sempre sobrescrever para `bg-card`.

#### DialogHeader / Titulo / Descricao

```
DialogHeader:     className="flex flex-col gap-1 text-center sm:text-left mb-4"
DialogTitle:       className="text-xl font-bold text-text-main tracking-tight"
DialogDescription: className="text-sm text-text-muted leading-relaxed"
```

#### DialogFooter

```
ANTES: className="pt-4 border-t border-border/30"
DEPOIS: className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 mt-6 pt-4 border-t border-border/50"
```

Botoes no footer:
```
Cancelar: variant="secondary" className="rounded-xl"
Salvar:   className="rounded-xl shadow-md shadow-accent/20"
```

#### Botao de fechar (X)

```
DEPOIS: className="absolute right-4 top-5 rounded-lg p-1.5 text-text-muted hover:text-text-main hover:bg-surface-hover"
```

#### AlertDialogContent

```
ANTES: className="bg-card border-border"
DEPOIS: manter (ja e o padrao)
```

Variante de exclusao (barra vermelha no topo):
```
DEPOIS: antes do content, div className="h-1 w-full bg-gradient-to-r from-error via-error to-error rounded-t-2xl"
```

#### AlertDialogTitle / Descricao

```
AlertDialogTitle:       className="text-text-main"
AlertDialogDescription: className="text-text-muted"
```

#### AlertDialogFooter — Botoes

```
AlertDialogCancel: className="border-border text-text-main rounded-xl"
AlertDialogAction: className="bg-destructive hover:bg-destructive/90 text-white border-0 rounded-xl shadow-lg shadow-error/25"
```

#### Labels dentro de modais

```
ANTES: className="text-xs text-muted-foreground"
DEPOIS: className="text-xs text-text-muted font-medium"
```

#### Inputs dentro de modais

```
ANTES: className="bg-secondary border-border text-text-main"
DEPOIS: className="h-11 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
```

#### Textarea dentro de modais

```
ANTES: className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
DEPOIS: className="flex w-full rounded-xl border border-border bg-input-bg px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
```

#### SelectTrigger dentro de modais

```
ANTES: className="bg-secondary border-border text-text-main"
DEPOIS: className="h-11 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
```

#### Cards de informacao dentro de modais (detalhes, grids)

```
ANTES: className="bg-secondary/50 rounded-lg p-3 border border-border/30"
DEPOIS: className="bg-surface border border-border rounded-xl p-3"
```

Labels nos cards:
```
ANTES: className="text-xs text-muted-foreground block mb-1"
DEPOIS: className="text-xs text-text-muted font-medium block mb-1"
```

Valores nos cards:
```
ANTES: className="text-sm font-medium text-foreground"
DEPOIS: className="text-sm font-medium text-text-main"
```

#### Secoes dentro de modais (h3 de agrupamento)

```
ANTES: className="text-sm font-semibold text-primary mb-3"
DEPOIS: className="text-sm font-semibold text-accent mb-3"
```

#### Itens de lista/opcoes dentro de modais

```
ANTES: className="flex items-center gap-2 bg-secondary/60 border border-border/40 rounded-md px-3 py-2"
DEPOIS: className="group/opt flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5 transition-all duration-200 hover:border-accent/30"
```

Botao X de remover:
```
ANTES: className="text-muted-foreground hover:text-red-400"
DEPOIS: className="text-text-muted hover:text-destructive transition-colors rounded-md hover:bg-destructive/10 p-0.5 opacity-0 group-hover/opt:opacity-100"
```

#### Botoes de acao contextual dentro de modais

| Acao | className |
|------|-----------|
| Revisar | `rounded-lg px-2 py-1 text-xs font-medium text-accent hover:bg-accent/10 border border-accent/20` |
| Aprovar | `text-green-400 hover:bg-green-500/10` |
| Reprovar | `text-red-400 hover:bg-red-500/10` |
| Corrigir | `text-orange-400 hover:bg-orange-500/10` |

### 11. Skeleton Loading

```
ANTES: <Loader2 size={24} className="animate-spin text-accent" />
DEPOIS: <Skeleton className="h-32 rounded-2xl" /> (para cards/KPI)
DEPOIS: <Skeleton className="h-24 rounded-xl" /> (para listas)
DEPOIS: <Skeleton className="h-36 rounded-2xl" /> (para cards grandes)
```

Para o container do loading:
```
ANTES: className="flex justify-center py-10"
DEPOIS: className="grid grid-cols-2 lg:grid-cols-4 gap-4" (com Skeletons de KPI)
```

```
ANTES: className="text-muted-foreground py-10 text-center"
DEPOIS: className="grid grid-cols-2 lg:grid-cols-4 gap-4" (com Skeletons)
```

Se o loading e texto simples, manter — e leve e funcional.

Se o loading e texto simples (ex: `<div className="...">Carregando...</div>`), substituir por Skeleton:
```
ANTES: <div className="p-6 text-center text-text-muted">Carregando...</div>
DEPOIS: <div className="p-6 text-center text-text-muted">Carregando...</div> (manter, e leve)
```

LoadingState (spinner centralizado):
```
DEPOIS: className="flex flex-col items-center justify-center py-12 gap-3"
DEPOIS: Loader2 className="w-8 h-8 animate-spin text-primary"
```

### 12. Empty State

```
ANTES: <p className="text-center text-sm text-text-muted py-8">Nenhum resultado.</p>
DEPOIS: <EmptyState icon={<Icone className="w-10 h-10 text-text-muted/30" />} title="Nenhum resultado" description="Ajuste os filtros para ver resultados." />
```

Padrao do componente EmptyState:
```
className="flex flex-col items-center justify-center py-12 px-4 text-center"
icone container: className="w-16 h-16 rounded-full bg-surface mb-4"
titulo: className="text-lg font-semibold text-text-main mb-1"
```

### 13. Badges / Tags

#### Badge base

```
DEPOIS: className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold"
```

#### Variantes de badge

| Variante | className |
|----------|-----------|
| default | `bg-primary/15 text-primary border border-primary/20` |
| secondary | `bg-secondary text-secondary-foreground border border-border/50` |
| destructive | `bg-error/15 text-error border border-error/20` |
| success | `bg-success/15 text-success border border-success/20` |
| warning | `bg-warning/15 text-warning border border-warning/20` |
| outline | `border-2 border-border text-text-secondary` |

#### Status badge (inline-flex com icone)

```
DEPOIS: className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR}"
```

Com icone:
```
DEPOIS: className="flex items-center gap-1 self-start rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLOR}"
```

### 14. Tabs

#### TabsList desktop

```
ANTES: (sem estilo ou padrao shadcn)
DEPOIS: className="inline-flex h-11 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
```

#### TabsTrigger

```
ANTES: (sem estilo ou padrao shadcn)
DEPOIS: className="rounded-md px-3 py-1 text-sm font-medium cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
```

#### Mobile tabs (alternativa para telas pequenas)

Container:
```
DEPOIS: className="flex md:hidden gap-1 rounded-xl bg-card p-1"
```

Item ativo:
```
DEPOIS: className="bg-accent text-white"
```

Item inativo:
```
DEPOIS: className="text-text-muted hover:text-text-main"
```

#### Sub-tabs

```
DEPOIS: className="flex gap-1 rounded-lg bg-bg-dark p-1 mb-4"
```

Ativo:
```
DEPOIS: className="rounded-md py-1.5 text-xs font-medium bg-accent text-white"
```

### 15. Form Layouts

#### FormItem wrapper

```
DEPOIS: className="space-y-2"
```

#### Label de campo

```
DEPOIS: className="block text-sm font-semibold text-text-secondary"
```

Minusculo:
```
DEPOIS: className="mb-1 text-xs font-medium text-text-muted"
```

#### Input padrao

```
DEPOIS: className="h-11 rounded-xl border border-border bg-input-bg px-4 py-2.5 text-sm text-text-main font-medium shadow-sm transition-all duration-200 placeholder:text-text-muted/60 hover:border-accent/30 focus-visible:shadow-[0_0_0_0.5px_var(--color-accent-muted)]"
```

#### Textarea

```
DEPOIS: className="min-h-[60px] rounded-md border border-border/70 bg-surface/60 px-3.5 py-2.5 text-base shadow-sm hover:border-border focus-visible:shadow-[0_0_0_0.5px_var(--color-accent-muted)]"
```

Textarea modal:
```
DEPOIS: className="resize-none rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent"
```

#### Grid de 2 colunas

```
DEPOIS: className="grid grid-cols-2 gap-3"
```

#### Upload dashed

```
DEPOIS: className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/50"
```

#### Info box

```
DEPOIS: className="rounded-lg bg-accent/5 border border-accent/20 px-3 py-2"
```

Label:
```
DEPOIS: className="text-xs font-semibold text-accent uppercase"
```

#### Error box

```
DEPOIS: className="rounded-lg bg-error/5 border border-error/20 p-3"
```

### 16. Select (Radix)

#### SelectTrigger

```
ANTES: className=""
DEPOIS: className="h-11 w-full rounded-md border border-border/70 bg-surface/60 px-3.5 py-2 text-sm shadow-sm cursor-pointer hover:border-border focus:shadow-[0_0_0_0.5px_var(--color-accent-muted)]"
```

#### SelectContent

```
DEPOIS: className="z-50 min-w-[8rem] rounded-md border bg-popover text-popover-foreground shadow-md"
```

#### SelectItem

```
DEPOIS: className="rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
```

### 17. Dividers / Separators

#### Separator generico

```
DEPOIS: className="shrink-0 bg-border h-[1px] w-full"
```

#### Dentro de cards

```
DEPOIS: className="border-t border-border/30"
```

#### Dialog footer

```
DEPOIS: className="mt-6 pt-4 border-t border-border/50"
```

### 18. Tooltips / Popovers

#### Tooltip

```
DEPOIS: className="z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95"
```

#### Popover

```
DEPOIS: className="z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
```

### 19. Checkbox / Switch

#### Checkbox

```
DEPOIS: className="grid place-content-center h-4 w-4 rounded-sm border border-primary shadow cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
```

#### Switch

```
DEPOIS: className="inline-flex h-5 w-9 rounded-full border-2 border-transparent shadow-sm transition-colors data-[state=checked]:bg-primary"
```

Thumb:
```
DEPOIS: className="h-4 w-4 rounded-full bg-background shadow-lg data-[state=checked]:translate-x-4"
```

### 20. Accordion

#### Trigger

```
DEPOIS: className="flex items-center justify-between py-4 text-sm font-medium cursor-pointer hover:underline [&[data-state=open]>svg]:rotate-180"
```

#### Content

```
DEPOIS: className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
```

### 21. Cards (shadcn base)

#### Card wrapper

```
ANTES: className="rounded-lg border bg-card text-card-foreground shadow-sm"
DEPOIS: className="rounded-2xl border border-border/60 bg-card text-card-foreground shadow-md transition-all duration-300"
```

#### CardHeader

```
DEPOIS: className="flex flex-col space-y-1.5 p-6 pb-4"
```

#### CardTitle

```
DEPOIS: className="text-lg font-bold leading-none tracking-tight text-text-main"
```

#### CardDescription

```
DEPOIS: className="text-sm text-text-muted leading-relaxed"
```

#### CardContent

```
DEPOIS: className="p-6 pt-0"
```

#### CardFooter

```
DEPOIS: className="flex items-center p-6 pt-0 gap-3"
```

### 22. Loading Spinner (em modais)

Nao alterar — manter Loader2 em modais e acoes. Skeleton e apenas para o estado inicial da pagina.

### 23. Icones

Icones lucide-react devem seguir o padrao visual do design system. Substituir classes nos proprio elementos `<Icone>`.

#### Icone de Titulo / Header (ex: icone ao lado do h1)

```
ANTES: <Icone className="w-5 h-5 text-primary" />
DEPOIS: <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent shrink-0"><Icone className="w-5 h-5" /></span>
```

#### Icones de Acao (edit, delete, etc) dentro de botoes

```
ANTES (no Button): <Icone className="w-4 h-4" />
DEPOIS (no Button): manter w-4 h-4, adicionar className no Button pai:
  ghost-edit:      className="hover:bg-accent/10"
  ghost-destructive: className="hover:bg-destructive/10"
```

#### Icones de Navegacao (setas up/down, filtros)

```
ANTES: className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10"
DEPOIS: className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
```

#### Icones de Fechar / Remover (X em listas, tags, opcoes)

```
ANTES: className="text-muted-foreground hover:text-red-400"
DEPOIS: className="text-text-muted hover:text-destructive transition-colors rounded-md hover:bg-destructive/10 p-0.5"
```

#### Icone de Status / Badge

```
ANTES: <Icone className="w-4 h-4" />
DEPOIS: <Icone className="w-4 h-4 shrink-0" />
```

#### Regra geral para icones

- NAO trocar o icone (manter o mesmo lucide-react)
- NAO adicionar novos icones
- Apenas ajustar tamanho, cor e efeitos hover via className
- Usar cores do design system: `text-accent`, `text-text-muted`, `text-destructive`, `text-green-500`
- Transicoes: sempre incluir `transition-colors` em icones com hover

### 24. Animacoes

#### Stagger animation (cards em grid)

```
style={{ animationDelay: `${index * 50}ms` }}
```

Para grids grandes:
```
style={{ animationDelay: `${index * 30}ms` }}
```

#### fade-in (container principal)

```
className="animate-fade-in"
```

#### slide-up

```
className="animate-slide-up"
```

### 25. Tipografia (referencia rapida)

| Elemento | Classes |
|----------|---------|
| Titulo pagina | `text-2xl font-bold text-text-main tracking-tight` |
| Subtitulo pagina | `text-sm text-text-muted mt-1` |
| Secao (h2) | `text-lg font-bold text-text-main` |
| Card titulo | `text-sm font-semibold text-text-main truncate` |
| Label campo | `block text-sm font-semibold text-text-secondary` |
| Label minusculo | `mb-1 text-xs font-medium text-text-muted` |
| Descricao | `text-sm text-text-muted leading-relaxed` |
| Meta | `text-[10px] text-text-muted` |
| Uppercase label | `text-xs font-semibold uppercase tracking-wider` |

### 26. Cores (referencia rapida de STATUS_COLOR)

| Status | Cor |
|--------|-----|
| aprovado / success | `bg-green-500/15 text-green-400 border border-green-500/20` |
| em_analise / pending | `bg-yellow-500/15 text-yellow-400 border border-yellow-500/20` |
| reprovado / error | `bg-red-500/15 text-red-400 border border-red-500/20` |
| em_correcao / warning | `bg-orange-500/15 text-orange-400 border border-orange-500/20` |
| link_gerado / info | `bg-blue-500/15 text-blue-400 border border-blue-500/20` |
| dados_enviados / ciano | `bg-cyan-500/15 text-cyan-400 border border-cyan-500/20` |

---

## Regras

1. NUNCA criar novos elementos JSX — apenas reaplicar classes nos existentes
2. NUNCA remover elementos existentes
3. NUNCA alterar logica de negocio
4. NUNCA alterar nomes de funcoes ou variaveis
5. NUNCA remover imports de UI components (AlertDialog, Dialog, Input, Button, Skeleton, EmptyState)
6. Modais DEVEM seguir o design system — aplicar substituicoes de classes conforme secao Modais
7. Manter todos os handlers e callbacks intactos
8. Remover imports de lucide-react sem uso apos a refatoracao
9. Se o arquivo ja nao usa Skeleton ou EmptyState, adicionar o import
10. Para icones de titulo/header: PERMITIDO envolver o icone em um `<span>` com bg colorido (padrao visual do design system). Icones dentro de botoes NUNCA devem ser envolvidos em novos elementos.
11. NUNCA alterar a estrutura HTML dos modais (nao adicionar/remover wrapper divs), apenas substituir classes CSS
12. TODA refatoracao DEVE seguir mobile-first: larguras com w-full + sm:, gaps menores no mobile, touch targets min-h-[44px]
13. Acoes hover em cards DEVEM usar `sm:opacity-0 sm:group-hover:opacity-100` (visivel no mobile, oculto ate hover no desktop)
14. Tabelas DEVEM ter `overflow-x-auto` para scroll horizontal no mobile
15. Botoes de acao em massa (aprovar, reprovar, corrigir, revisar) DEVEM seguir o padrao de cores da secao 7

---

## Referência Rápida de Padrões

### KPI Card
```jsx
<div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-{cor}/20 via-{cor}/10 to-transparent border border-{cor}/20 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-{cor}/10 hover:border-{cor}/40">
  <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-xl bg-{cor}/15 text-{cor} group-hover:scale-110 transition-transform duration-300">
    <Icone size={22} />
  </div>
  <p className="text-xs font-semibold text-{cor}/80 uppercase tracking-wider">{label}</p>
  <p className="text-3xl sm:text-4xl font-bold text-text-main mt-2">{valor}</p>
  <p className="text-xs text-text-muted mt-2">{descricao}</p>
</div>
```

### Status Pill
```jsx
<div className="flex items-center gap-3 rounded-xl bg-{cor}/10 border border-{cor}/20 p-3 transition-all duration-200 hover:scale-[1.02]">
  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-{cor}/15">
    <Icone size={16} className="text-{cor}" />
  </div>
  <div>
    <p className="text-lg font-bold text-{cor}">{valor}</p>
    <p className="text-[11px] text-text-muted font-medium">{label}</p>
  </div>
</div>
```

### Card de Lista
```jsx
<div className="group flex items-center gap-4 rounded-xl bg-surface border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5">
  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0 group-hover:bg-accent/20 transition-colors">
    {avatar}
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-semibold text-text-main truncate group-hover:text-accent transition-colors">{titulo}</p>
    <p className="text-xs text-text-muted mt-0.5">{subtitulo}</p>
  </div>
  <div className="flex flex-col items-end gap-1 shrink-0">
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold {status_color}">{status}</span>
  </div>
</div>
```

### Dialog (Header Gradiente)
```jsx
<DialogContent className="max-w-lg bg-card border-border/50 rounded-2xl shadow-2xl shadow-black/40 p-0 overflow-hidden">
  <div className="bg-gradient-to-br from-{cor}/20 via-{cor}/10 to-transparent px-6 pt-6 pb-4 border-b border-border/50">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-{cor}/15 text-{cor}">
        <Icone className="h-6 w-6" />
      </div>
      <div>
        <DialogTitle className="text-xl font-bold text-text-main tracking-tight">{titulo}</DialogTitle>
        <p className="text-sm text-text-muted mt-0.5">{subtitulo}</p>
      </div>
    </div>
  </div>
  {/* Corpo do dialog */}
</DialogContent>
```

### AlertDialog (Exclusão)
```jsx
<AlertDialogContent className="bg-card border-border/50 rounded-2xl shadow-2xl shadow-black/40 p-0 overflow-hidden max-w-sm">
  <div className="bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent px-6 pt-6 pb-4 border-b border-red-500/20">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
        <Trash2 className="h-6 w-6" />
      </div>
      <div>
        <AlertDialogTitle className="text-lg font-bold text-text-main">{titulo}</AlertDialogTitle>
        <AlertDialogDescription className="text-sm text-text-muted mt-0.5">{subtitulo}</AlertDialogDescription>
      </div>
    </div>
  </div>
  <div className="px-6 py-4">
    <p className="text-sm text-text-muted">{mensagem}</p>
  </div>
  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end px-6 pb-6 pt-2 border-t border-border">
    <AlertDialogCancel className="rounded-xl px-6 border-border text-text-main hover:bg-surface-hover">Cancelar</AlertDialogCancel>
    <AlertDialogAction className="rounded-xl px-6 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200">{acao}</AlertDialogAction>
  </div>
</AlertDialogContent>
```
