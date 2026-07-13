# Análise do Design System — Módulo Mapas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura do Design System](#2-arquitetura-do-design-system)
3. [Tokens CSS — Mapeamento](#3-tokens-css--mapeamento)
4. [Tokens Exclusivos do Mapa SVG](#4-tokens-exclusivos-do-mapa-svg)
5. [Como os Tokens São Aplicados](#5-como-os-tokens-são-aplicados)
6. [Componentes e Padrões de Estilo](#6-componentes-e-padrões-de-estilo)
7. [Personalização Disponível](#7-personalização-disponível)
8. [O Que Não É Personalizável](#8-o-que-não-é-personalizável)
9. [Divergências e Anomalias](#9-divergências-e-anomalias)

---

## 1. Visão Geral

O módulo **Mapas** é o mais enxuto em termos de design system. Utiliza **apenas tokens globais** do design system + variáveis CSS específicas para o mapa SVG do Brasil.

| Aspecto | Detalhe |
|---|---|
| **Tokens** | Globais `--color-*` + variáveis de mapa `--state-*`, `--heat-*`, `--grad-*` |
| **Design Config** | `hasDesignConfig: true` — override via `ModuloDesignPage` em `/empresa/mapas/design` |
| **shadcn/ui** | Dialog, Button, Badge, Skeleton, EmptyState |
| **CSS próprio** | Classes globais em `src/styles/globals.css` (`.state-faded`, `.state-glow`) |
| **Customização** | Override de 4 tokens no ModuloDesignPage (accent, surface, bg, border) |

---

## 2. Arquitetura do Design System

### Pipeline de Tema

```
Preset → Global Override → Empresa Override → Módulo Override (mapas)
                                                    ↓
                                        Componentes do mapa usam tokens resolvidos
                                        Mapa SVG usa variáveis --state-*, --heat-*
```

### Arquivos-Chave

| Arquivo | Função |
|---|---|
| `src/styles/globals.css` | Variáveis `--state-*`, `--heat-*`, `--map-stroke*`, classes `.state-faded`, `.state-glow` |
| `src/routes/empresa.mapas-design.tsx` | Design config via `ModuloDesignPage` |
| `src/routes/mapas.design.tsx` | Redirect para `/empresa/mapas/design` |
| `src/features/mapas/components/PublicMapShell.tsx` | Shell do mapa público |
| `src/features/mapas/components/StateDetailSheet.tsx` | Sheet de detalhe do estado |
| `src/features/mapas/components/EntityDetailDialog.tsx` | Dialog de detalhe da entidade |

---

## 3. Tokens CSS — Mapeamento

### 3.1 Tokens Globais Utilizados

| Token CSS | Onde é usado |
|---|---|
| `--color-bg` | Fundo da página |
| `--color-surface` | Containers, cards |
| `--color-surface-hover` | Hover de elementos |
| `--color-text-main` | Texto principal |
| `--color-text-muted` | Texto secundário |
| `--color-border` | Bordas |
| `--color-accent` | Destaques (`text-accent`, `bg-accent`) |
| `--color-accent-fg` | Texto em botões accent |
| `--color-accent-muted` | Fundos sutis de accent |
| `--color-success` | Badges de status |
| `--color-warning` | Badges de status |
| `--color-error` | Badges de status |
| `--radius-xl` | Bordas de cards e dialogs |
| `--radius-lg` | Bordas de botões e badges |
| `--shadow-lg`, `--shadow-xl` | Sombras de cards e dialogs |
| `--animate-fade-in`, `--animate-slide-up` | Animações de entrada |

### 3.2 shadcn/ui Components

| Componente | Uso |
|---|---|
| `Dialog`, `DialogContent` | Detalhes da entidade (distribuidor/consultor) |
| `Button` | Ações (Ver no Mapa, Abrir Rota, Fechar) |
| `Badge` | Status de categoria |
| `Skeleton` | Loading state |
| `EmptyState` | Estado vazio |

---

## 4. Tokens Exclusivos do Mapa SVG

Definidos em `:root` no `globals.css`:

| Token | Exemplo | Propósito |
|---|---|---|
| `--state-exclusive` | `#d4a843` | Cor de distribuidores exclusivos |
| `--state-nonexclusive` | `#b8944a` | Cor de distribuidores não-exclusivos |
| `--state-empty` | `#0f1724` | Cor de estados sem presença |
| `--state-empty-fg` | `#3b5998` | Texto em estados vazios |
| `--map-stroke` | `#1e2d45` | Stroke das bordas dos estados |
| `--map-stroke-selected` | `#f0d080` | Stroke quando selecionado |
| `--state-glow` | `drop-shadow(...)` | Efeito de glow no estado |
| `--grad-exclusive-1` | `#d4a843` | Gradiente 1 para exclusivo |
| `--grad-exclusive-2` | `#b8862e` | Gradiente 2 para exclusivo |
| `--grad-partial-1` | `#b8944a` | Gradiente 1 para parcial |
| `--grad-partial-2` | `#9a7a3a` | Gradiente 2 para parcial |
| `--heat-1` | `#0f1724` | Heatmap nível 1 |
| `--heat-2` | `#1a3a6a` | Heatmap nível 2 |
| `--heat-3` | `#2563a0` | Heatmap nível 3 |
| `--heat-4` | `#3b82f6` | Heatmap nível 4 |
| `--heat-5` | `#60a5fa` | Heatmap nível 5 |

### Classes CSS Exclusivas

```css
.state-faded { opacity: 0.35; }
.state-glow { filter: var(--state-glow); }
```

---

## 5. Como os Tokens São Aplicados

### Mapa SVG
```tsx
// Cores aplicadas inline via style no SVG
style={{
  fill: cor_state,       // lógica que escolhe entre --state-exclusive, --state-nonexclusive, etc.
  stroke: "--map-stroke",
  filter: selected ? "--state-glow" : undefined,
}}
```

### Cards e Layout
```tsx
// Tokens globais via Tailwind
className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent"
className="bg-surface border border-border rounded-xl"
className="text-text-main text-text-muted"
```

---

## 6. Componentes e Padrões de Estilo

### PublicMapShell
- **Header**: Título + navegação entre distribuidores/consultores (toggle button group)
- **KPI Cards**: Grid `grid-cols-2 lg:grid-cols-4`, gradiente com ícone flutuante
- **Status Pills**: `rounded-xl bg-{cor}/10 border border-{cor}/20 p-3`
- **Mapa SVG**: Interativo com hover/click nos estados
- **Accordion**: Estados listados em accordion com contagem

### EntityDetailDialog
- **Header**: Gradiente baseado na cor do pin (`pinColor`)
- **Campos**: Inputs read-only estilizados com `rounded-xl border border-border bg-background`
- **Botões**: Grid de 2 colunas (Ver no Mapa, Abrir Rota)

---

## 7. Personalização Disponível

### ModuloDesignPage (4 tokens)
- `colors.accent` — Cor de destaque do módulo
- `colors.surface` — Cor de superfície
- `colors.bg` — Cor de fundo
- `colors.border` — Cor de borda

### Variáveis de Mapa (fixas no globals.css)
- `--state-*` e `--heat-*` são hardcoded no CSS global — **não personalizáveis via design system**

---

## 8. O Que Não É Personalizável

- **Cores do mapa SVG** (`--state-*`, `--heat-*`, `--map-stroke-*`): Hardcoded no `globals.css`
- **Opacidade do estado vazio** (`.state-faded`): Fixa em 0.35
- **Intensidade do glow** (`.state-glow`): Fixa
- **Estrutura do SVG do Brasil**: Mapas de estados fixos
- **Layout do mapa**: Grid responsivo fixo

---

## 9. Divergências e Anomalias

1. **Variáveis de mapa no `:root` global**: 17 variáveis específicas do módulo Mapas estão no CSS global em vez de no módulo
2. **Sem arquivo CSS modular**: Diferente de outros módulos (Hub, NPS), Mapas não tem `src/features/mapas/styles/*.css`
3. **Cores de estado hardcoded**: `--state-exclusive: #d4a843` não segue o accent do design system
4. **Heatmap com azuis fixos**: `--heat-1` a `--heat-5` são variações de azul — não respeitam tema da empresa
