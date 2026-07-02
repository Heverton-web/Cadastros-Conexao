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

## Uso

```
/design <rota>
```

Exemplo: `/design /cadastros/consultor`

## Fluxo

1. Ler o arquivo da rota alvo em `src/routes/`
2. Mapear todos os elementos JSX existentes (headers, cards, botoes, filtros, listas, estados vazios, loading)
3. Substituir as classes CSS existentes pelas classes do design system abaixo
4. NUNCA adicionar novos elementos HTML/JSX
5. NUNCA remover elementos existentes
6. NUNCA alterar logica de negocio (state, effects, handlers, funcoes)
7. Remover imports de lucide-react que ficarem sem uso
8. Verificar erros TypeScript

## Mapa de Substituicao de Classes

### Container Principal

```
ANTES: className="flex flex-col gap-6 p-4 pb-24 lg:p-8 lg:pb-8"
DEPOIS: className="space-y-8 animate-fade-in"
```

```
ANTES: className="flex flex-col gap-6 md:gap-8 p-4 pb-24"
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

### Cards de Lista

```
ANTES: className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg transition active:scale-[0.98]"
DEPOIS: className="group flex items-center gap-4 rounded-xl bg-surface border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5"
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

## Regras

1. NUNCA criar novos elementos JSX — apenas reaplicar classes nos existentes
2. NUNCA remover elementos existentes
3. NUNCA alterar logica de negocio
4. NUNCA alterar nomes de funcoes ou variaveis
5. NUNCA remover imports de UI components (AlertDialog, Dialog, Input, Button, Skeleton, EmptyState)
6. Manter todos os modais inalterados
7. Manter todos os handlers e callbacks intactos
8. Remover imports de lucide-react sem uso apos a refatoracao
9. Se o arquivo ja nao usa Skeleton ou EmptyState, adicionar o import
