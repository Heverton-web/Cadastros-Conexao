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

### 2. MOBILE-FIRST OBRIGATORIO

**TODA referencia de tamanho, espacamento e layout DEVE seguir mobile-first.**

O design system do ERP Conexao e MOBILE-FIRST. Significa:

- Larguras fixas (`w-64`, `w-[140px]`) DEVEM ter variante mobile: `w-full sm:w-64`, `w-full sm:w-[140px]`
- Grids DEVEM comecar com 1 coluna e escalar: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Gap e padding DEVEM ser menores no mobile: `gap-3 sm:gap-4`, `p-3 sm:p-4`
- Font sizes DEVEM ser legiveis em tela pequena: `text-sm` como base, `text-xs` so para labels
- Icones em acoes hover (`group-hover:opacity-100`) DEVEM ser sempre visiveis no mobile (touch nao tem hover)
- Min touch target: `min-h-[44px]` para botoes e links clicaveis
- Headers DEVEM empilhar no mobile: `flex flex-col sm:flex-row`
- Dialogs DEVEM usar `w-[calc(100%-2rem)]` ou `w-[95vw]` para caber no mobile

**Referencia de breakpoints:**
- Base (mobile): sem prefixo — ate 640px
- `sm`: 640px+ (tablet retrato)
- `md`: 768px+ (tablet paisagem)
- `lg`: 1024px+ (desktop)

**Exemplo de como pensar:**
```
NAO: className="w-64"                    (so funciona no desktop)
SIM: className="w-full sm:w-64"          (mobile primeiro, depois fixo)

NAO: className="grid grid-cols-3 gap-4"  (quebra no mobile)
SIM: className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"

NAO: className="opacity-0 group-hover:opacity-100" ( invisivel no mobile)
SIM: className="sm:opacity-0 sm:group-hover:opacity-100" (sempre visivel no mobile)
```

---

## Uso

```
/design <rota>
```

Exemplo: `/design /cadastros/consultor`

## Fluxo

1. Ler o arquivo da rota alvo em `src/routes/`
2. Mapear todos os elementos JSX existentes (headers, cards, botoes, filtros, listas, estados vazios, loading, **modais**)
3. Substituir as classes CSS existentes pelas classes do design system abaixo
4. NUNCA adicionar novos elementos HTML/JSX
5. NUNCA remover elementos existentes
6. NUNCA alterar logica de negocio (state, effects, handlers, funcoes)
7. Remover imports de lucide-react que ficarem sem uso
8. Verificar erros TypeScript

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

### Container Principal

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

### Header (h1 + subtitulo)

```
ANTES: className="text-lg font-bold text-text-main"
DEPOIS: className="text-2xl font-bold text-text-main tracking-tight"
```

```
ANTES: className="text-xs text-text-muted"
DEPOIS (subtitulo): className="text-sm text-text-muted mt-1"
```

### Botoes de Acao

```
ANTES: className="rounded-xl bg-accent p-5 text-white shadow-lg"
DEPOIS: className="flex items-center gap-2 rounded-xl bg-accent text-accent-fg px-5 py-2.5 text-sm font-semibold hover:bg-accent-hover transition-all duration-200 min-h-[44px] shadow-lg shadow-accent/20"
```

```
ANTES: className="rounded-xl border-2 border-accent/50 p-5 text-accent shadow-lg"
DEPOIS: className="flex items-center gap-2 rounded-xl bg-surface border border-border px-4 py-2.5 text-sm text-text-muted hover:text-text-main hover:border-accent/30 transition-all duration-200 min-h-[44px]"
```

### Cards de Metricas / FiltroCard

```
ANTES: className="flex flex-col gap-2 rounded-xl bg-card p-4 shadow-lg"
DEPOIS: className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-{cor}/20 via-{cor}/10 to-transparent border border-{cor}/20 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-{cor}/10 hover:border-{cor}/40"
```

Cores: accent, green-500, yellow-500, blue-500, orange-500, red-500, cyan-500

Para o container dos cards:
```
ANTES: className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
DEPOIS: className="grid grid-cols-2 lg:grid-cols-4 gap-4"
```

#### Barras de Progresso

```
ANTES: className="h-2 rounded-full bg-background/60"
DEPOIS: className="h-2.5 w-full rounded-full bg-surface overflow-hidden"
```

Barra de progresso interna:
```
ANTES: className={`h-full ${sm.bar} transition-all`}
DEPOIS: className={`h-full rounded-full transition-all duration-500 ${sm.bar}`}
```

### Cards de Lista

```
ANTES: className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg transition active:scale-[0.98]"
DEPOIS: className="group flex items-center gap-4 rounded-xl bg-surface border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5"
```

Para cards com opacidade reduzida:
```
ANTES: className="group p-6 bg-surface/70 border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer relative flex flex-col gap-4"
DEPOIS: className="group flex flex-col gap-4 rounded-xl bg-surface border border-border p-5 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 cursor-pointer"
```

Para cards com avatar (primeiro filho):
```
ANTES: className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10"
DEPOIS: className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0 group-hover:bg-accent/20 transition-colors"
```

Para o titulo dentro do card:
```
ANTES: className="text-sm font-medium text-text-main truncate"
DEPOIS: className="text-sm font-semibold text-text-main truncate group-hover:text-accent transition-colors"
```

```
ANTES: className="font-display text-lg leading-tight min-w-0 truncate"
DEPOIS: className="text-sm font-semibold text-text-main truncate group-hover:text-accent transition-colors"
```

### Botoes de Acao em Cards (hover)

```
ANTES: sem acoes hover
DEPOIS: className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
```

### Skeleton Loading

```
ANTES: <Loader2 size={24} className="animate-spin text-accent" />
DEPOIS: <Skeleton className="h-32 rounded-2xl" /> (para cards)
DEPOIS: <Skeleton className="h-24 rounded-xl" /> (para listas)
```

Para o container do loading:
```
ANTES: className="flex justify-center py-10"
DEPOIS: className="grid grid-cols-2 lg:grid-cols-4 gap-4" (com Skeletons)
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

### Empty State

```
ANTES: <p className="text-center text-sm text-text-muted py-8">Nenhum resultado.</p>
DEPOIS: <EmptyState icon={<Icone className="w-10 h-10 text-text-muted/30" />} title="Nenhum resultado" description="Ajuste os filtros para ver resultados." />
```

### Filtros (select)

```
ANTES: className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm"
DEPOIS: className="w-full lg:w-56 h-12 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
```

### Filtros Pills (botoes de status)

```
ANTES: className="inline-flex items-center gap-2 h-9 rounded-full px-4 text-xs font-semibold"
DEPOIS: className="flex items-center gap-3 rounded-xl bg-{cor}/10 border border-{cor}/20 p-3 transition-all duration-200 hover:scale-[1.02]"
```

### Loading Spinner (em modais)

Nao alterar — manter Loader2 em modais e acoes. Skeleton e apenas para o estado inicial da pagina.

### Modais (Dialog / AlertDialog)

Modais DEVEM seguir o design system para manter consistencia visual com a pagina.
NAO alterar a estrutura HTML dos modais — apenas substituir classes CSS.

#### DialogContent

```
ANTES: className="bg-surface border-border"
DEPOIS: className="bg-card border-border"
```

Se ja usa `bg-card border-border`, manter. O padrao do componente base e `bg-surface` — sempre sobrescrever para `bg-card`.

#### DialogHeader / Titulo / Descricao

```
DialogTitle:       className="text-text-main" (ou manter default do componente)
DialogDescription: className="text-text-muted"
```

#### DialogFooter

```
ANTES: className="pt-4 border-t border-border/30"
DEPOIS: className="pt-4 border-t border-surface"
```

Botoes no footer:
```
Cancelar: variant="secondary" className="rounded-xl"
Salvar:   className="rounded-xl shadow-md shadow-accent/20"
```

#### AlertDialogContent

```
ANTES: className="bg-card border-border"
DEPOIS: manter (ja e o padrao)
```

#### AlertDialogTitle / Descricao

```
AlertDialogTitle:       className="text-text-main"
AlertDialogDescription: className="text-text-muted"
```

#### AlertDialogFooter — Botoes

```
AlertDialogCancel: className="border-border text-text-main rounded-xl"
AlertDialogAction: className="bg-destructive hover:bg-destructive/90 text-white border-0 rounded-xl"
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

### Icones

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
