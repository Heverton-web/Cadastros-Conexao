# Análise do Design System — Módulo Cadastros

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Design System](#1-visão-geral-do-design-system)
2. [Arquitetura do Design System](#2-arquitetura-do-design-system)
3. [Tokens CSS — Mapeamento Completo](#3-tokens-css--mapeamento-completo)
4. [Tokens por Categoria](#4-tokens-por-categoria)
5. [Componentes UI do Módulo Cadastros](#5-componentes-ui-do-módulo-cadastros)
6. [Padrões de Aplicação nos Componentes](#6-padrões-de-aplicação-nos-componentes)
7. [Hierarquia de Temas (Override)](#7-hierarquia-de-temas-override)
8. [O que é Customizável vs Não Customizável](#8-o-que-é-customizável-vs-não-customizável)
9. [Presets de Tema Disponíveis](#9-presets-de-tema-disponíveis)
10. [Fluxo de Personalização no Frontend](#10-fluxo-de-personalização-no-frontend)
11. [Análise das Rotas de Design do Cadastros](#11-análise-das-rotas-de-design-do-cadastros)
12. [Oportunidades de Melhoria](#12-oportunidades-de-melhoria)
13. [Diagrama da Arquitetura de Tema](#13-diagrama-da-arquitetura-de-tema)

---

## 1. Visão Geral do Design System

### 1.1 Stack de Estilização

| Tecnologia | Versão | Propósito |
|---|---|---|
| **Tailwind CSS v4** | `@tailwindcss/v4` (Alpine) | Framework CSS utilitário |
| **CSS Custom Properties** | `--color-*` | Tokens de design reativos |
| **shadcn/ui** | — | Componentes base (Dialog, Button, Input, etc.) |
| **Lucide React** | — | Ícones |
| **Plus Jakarta Sans** | Google Fonts | Tipografia principal |
| **Radix UI** | — | Primitivos de acessibilidade (Dialog, Accordion) |
| **Tailwind v4 @theme** | — | Diretiva que mapeia tokens para utilitários |

### 1.2 Tema Padrão: Dark Gold

O ERP Conexão usa um tema escuro com acento em dourado (`#c9a655`) como padrão. O tema é definido primariamente no arquivo `src/styles/globals.css` via diretiva `@theme` do Tailwind v4.

```
Paleta Base:
  Background:  #0f172a (slate-900)
  Surface:     #1e293b (slate-800)
  Accent:      #c9a655 (gold)
  Text Main:   #f8fafc (slate-50)
  Text Muted:  #94a3b8 (slate-400)
  Border:      #334155 (slate-700)
  Success:     #22c55e (green-500)
  Error:       #ef4444 (red-500)
  Warning:     #eab308 (yellow-500)
```

### 1.3 Estrutura de Diretórios do Design System

```
src/
├── design-system/
│   ├── index.ts                          — Re-exports públicos
│   ├── components/
│   │   └── ModuloDesignPage.tsx          — UI de edição de tokens por módulo
│   ├── hooks/
│   │   └── index.ts                      — useDesignSystem, useModuleDesign, useDesignToken
│   ├── provider/
│   │   ├── DesignSystemContext.ts         — Contextos (global + módulo)
│   │   ├── DesignSystemProvider.tsx       — Provider global (aplica tokens no :root)
│   │   └── ModuleDesignProvider.tsx       — Provider por módulo (aplica override no :root)
│   ├── services/
│   │   ├── design-system.queries.ts       — React Query hooks
│   │   └── design-system.service.ts       — CRUD Supabase (global, empresa, modulo)
│   └── tokens/
│       ├── types.ts                      — Interface DesignTokens completa
│       ├── css-var-map.ts                — Mapeamento token → CSS var
│       ├── resolver.ts                   — Resolução com cascata (preset → override)
│       ├── index.ts                      — Re-exports
│       └── presets/
│           ├── dark-gold.ts             — Tema escuro dourado (padrão)
│           ├── dark-blue.ts             — Tema escuro azul
│           ├── dark-emerald.ts          — Tema escuro esmeralda
│           └── light-clean.ts           — Tema claro limpo
├── styles/
│   └── globals.css                       — CSS global + @theme tokens + keyframes
├── core/
│   └── theme/
│       ├── ThemeProvider.tsx             — Provider legado (sendo substituído)
│       └── useEmpresaTheme.ts           — Hook legado de tema
└── components/
    └── ui/                               — shadcn/ui components
        ├── button.tsx
        ├── input.tsx
        ├── card.tsx
        ├── dialog.tsx
        ├── alert-dialog.tsx
        ├── skeleton.tsx
        ├── empty-state.tsx
        ├── select.tsx
        ├── table.tsx
        └── badge.tsx
```

---

## 2. Arquitetura do Design System

### 2.1 Camadas de Abstração

```
┌──────────────────────────────────────────────────────────┐
│  Tailwind Utility Classes                                 │
│  (bg-surface, text-text-main, border-border, etc.)        │
│  Mapeadas via @theme no globals.css                       │
└────────────────────────────────┬─────────────────────────┘
                                 │ usa
┌────────────────────────────────▼─────────────────────────┐
│  shadcn/ui Components                                     │
│  (Button, Input, Dialog, Card, Badge, AlertDialog, etc.)  │
│  Usam classes Tailwind + variantes                         │
└────────────────────────────────┬─────────────────────────┘
                                 │ compõe
┌────────────────────────────────▼─────────────────────────┐
│  Módulos (features)                                       │
│  Páginas do Cadastros (dashboard, clientes, solicitações) │
│  Usam shadcn/ui + classes Tailwind diretas                │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Pipeline de Resolução de Tokens

```
┌──────────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐
│   Preset     │───►│  Global      │───►│  Empresa   │───►│  Módulo      │
│  (dark-gold) │    │  Override    │    │  Override  │    │  Override    │
│  (fixo)      │    │  (super      │    │  (admin     │    │  (admin      │
│              │    │   admin)     │    │   empresa)  │    │   config)    │
└──────────────┘    └──────────────┘    └────────────┘    └──────────────┘
       │                   │                  │                  │
       └───────────────────┴──────────────────┴──────────────────┘
                                 │
                    deepMerge (cascata)
                                 │
                    ┌────────────▼────────────┐
                    │   DesignTokens final     │
                    │   (resolvido)            │
                    └────────────┬────────────┘
                                 │ tokensToCssVars()
                    ┌────────────▼────────────┐
                    │   CSS Custom Props       │
                    │   --color-accent: ...    │
                    │   Injetado no :root      │
                    └─────────────────────────┘
```

### 2.3 Providers e Ciclo de Vida

1. **DesignSystemProvider** (wrapper global):
   - Carrega preset + global override + empresa override do Supabase
   - Resolve tokens com `resolveTokens()`
   - Injeta CSS vars no `:root` via `tokensToCssVars()`
   - Seta `font-family` no body
   - Gerencia favicon da empresa

2. **ModuleDesignProvider** (wrapper por rota de módulo):
   - Carrega modulo override adicional
   - Re-resolve tokens com cascata de 4 níveis
   - Injeta no `:root` (sobrescreve temporariamente)
   - Ao desmontar, o DesignSystemProvider re-aplica os tokens sem módulo

---

## 3. Tokens CSS — Mapeamento Completo

### 3.1 Mapa Token → CSS Variable

Fonte: `src/design-system/tokens/css-var-map.ts`

| Token Path | CSS Variable | Tipo |
|---|---|---|
| `colors.bg` | `--color-bg` | Cor |
| `colors.surface` | `--color-surface` | Cor |
| `colors.surfaceHover` | `--color-surface-hover` | Cor |
| `colors.card` | `--color-card` | Cor |
| `colors.textMain` | `--color-text-main` | Cor |
| `colors.textSecondary` | `--color-text-secondary` | Cor |
| `colors.textMuted` | `--color-text-muted` | Cor |
| `colors.textInverted` | `--color-text-inverted` | Cor |
| `colors.border` | `--color-border` | Cor |
| `colors.borderSubtle` | `--color-border-subtle` | Cor |
| `colors.accent` | `--color-accent` | Cor |
| `colors.accentHover` | `--color-accent-hover` | Cor |
| `colors.accentFg` | `--color-accent-fg` | Cor |
| `colors.accentMuted` | `--color-accent-muted` | Cor |
| `colors.gradientStart` | `--color-gradient-start` | Cor |
| `colors.gradientMid` | `--color-gradient-mid` | Cor |
| `colors.gradientEnd` | `--color-gradient-end` | Cor |
| `colors.success` | `--color-success` | Cor |
| `colors.successBg` | `--color-success-bg` | Cor |
| `colors.warning` | `--color-warning` | Cor |
| `colors.warningBg` | `--color-warning-bg` | Cor |
| `colors.error` | `--color-error` | Cor |
| `colors.errorBg` | `--color-error-bg` | Cor |
| `colors.info` | `--color-info` | Cor |
| `colors.infoBg` | `--color-info-bg` | Cor |
| `colors.overlay` | `--color-overlay` | Cor |
| `colors.shadow` | `--color-shadow` | Cor |
| `colors.glassTint` | `--color-glass-tint` | Cor |
| `colors.headerBg` | `--color-header-bg` | Cor |
| `colors.scrollbarThumb` | `--color-scrollbar-thumb` | Cor |
| `colors.ring` | `--color-ring` | Cor |
| `colors.hoverBg` | `--color-hover-bg` | Cor |
| `colors.hoverBorder` | `--color-hover-border` | Cor |
| `colors.hoverShadow` | `--color-hover-shadow` | Cor |
| `colors.primary` | `--color-primary` | Cor (alias shadcn) |
| `colors.primaryForeground` | `--color-primary-foreground` | Cor (alias shadcn) |
| `colors.secondary` | `--color-secondary` | Cor (alias shadcn) |
| `colors.secondaryForeground` | `--color-secondary-foreground` | Cor (alias shadcn) |
| `colors.muted` | `--color-muted` | Cor (alias shadcn) |
| `colors.mutedForeground` | `--color-muted-foreground` | Cor (alias shadcn) |
| `colors.destructive` | `--color-destructive` | Cor (alias shadcn) |
| `colors.destructiveForeground` | `--color-destructive-foreground` | Cor (alias shadcn) |
| `colors.popover` | `--color-popover` | Cor (alias shadcn) |
| `colors.popoverForeground` | `--color-popover-foreground` | Cor (alias shadcn) |
| `colors.input` | `--color-input` | Cor (alias shadcn) |
| `colors.inputBg` | `--color-input-bg` | Cor |
| `colors.inputBorder` | `--color-input-border` | Cor |
| `colors.inputFocus` | `--color-input-focus` | Cor |
| `typography.fontFamily` | `--font-family` | Tipografia |
| `typography.fontFamilyMono` | `--font-family-mono` | Tipografia |
| `typography.fontSizeXs` | `--font-size-xs` | Tipografia |
| `typography.fontSizeSm` | `--font-size-sm` | Tipografia |
| `typography.fontSizeMd` | `--font-size-md` | Tipografia |
| `typography.fontSizeLg` | `--font-size-lg` | Tipografia |
| `typography.fontSizeXl` | `--font-size-xl` | Tipografia |
| `typography.fontSize2xl` | `--font-size-2xl` | Tipografia |
| `typography.lineHeightTight` | `--line-height-tight` | Tipografia |
| `typography.lineHeightNormal` | `--line-height-normal` | Tipografia |
| `typography.lineHeightRelaxed` | `--line-height-relaxed` | Tipografia |
| `typography.letterSpacingTight` | `--letter-spacing-tight` | Tipografia |
| `typography.letterSpacingNormal` | `--letter-spacing-normal` | Tipografia |
| `typography.letterSpacingWide` | `--letter-spacing-wide` | Tipografia |
| `borders.radiusSm` | `--radius-sm` | Borda |
| `borders.radiusMd` | `--radius-md` | Borda |
| `borders.radiusLg` | `--radius-lg` | Borda |
| `borders.radiusXl` | `--radius-xl` | Borda |
| `borders.radiusFull` | `--radius-full` | Borda |
| `shadows.sm` | `--shadow-sm` | Sombra |
| `shadows.md` | `--shadow-md` | Sombra |
| `shadows.lg` | `--shadow-lg` | Sombra |
| `shadows.xl` | `--shadow-xl` | Sombra |
| `shadows.glow` | `--shadow-glow` | Sombra |
| `shadows.accentGlow` | `--shadow-accent-glow` | Sombra |
| `animations.durationFast` | `--animate-duration-fast` | Animação |
| `animations.durationNormal` | `--animate-duration-normal` | Animação |
| `animations.durationSlow` | `--animate-duration-slow` | Animação |
| `animations.easingDefault` | `--animate-easing-default` | Animação |
| `animations.easingBounce` | `--animate-easing-bounce` | Animação |
| `spacing.xs` | `--spacing-xs` | Espaçamento |
| `spacing.sm` | `--spacing-sm` | Espaçamento |
| `spacing.md` | `--spacing-md` | Espaçamento |
| `spacing.lg` | `--spacing-lg` | Espaçamento |
| `spacing.xl` | `--spacing-xl` | Espaçamento |
| `spacing.2xl` | `--spacing-2xl` | Espaçamento |
| `components.button.paddingX` | `--comp-btn-px` | Componente |
| `components.button.paddingY` | `--comp-btn-py` | Componente |
| `components.button.fontSize` | `--comp-btn-fs` | Componente |
| `components.button.borderRadius` | `--comp-btn-radius` | Componente |
| `components.input.paddingX` | `--comp-input-px` | Componente |
| `components.input.paddingY` | `--comp-input-py` | Componente |
| `components.input.fontSize` | `--comp-input-fs` | Componente |
| `components.input.borderRadius` | `--comp-input-radius` | Componente |
| `components.card.padding` | `--comp-card-p` | Componente |
| `components.card.borderRadius` | `--comp-card-radius` | Componente |
| `components.card.shadow` | `--comp-card-shadow` | Componente |
| `components.modal.backdropBg` | `--comp-modal-backdrop` | Componente |
| `components.modal.borderRadius` | `--comp-modal-radius` | Componente |
| `components.modal.shadow` | `--comp-modal-shadow` | Componente |
| `components.sidebar.width` | `--comp-sidebar-w` | Componente |
| `components.sidebar.collapsedWidth` | `--comp-sidebar-w-collapsed` | Componente |
| `components.badge.paddingX` | `--comp-badge-px` | Componente |
| `components.badge.paddingY` | `--comp-badge-py` | Componente |
| `components.badge.fontSize` | `--comp-badge-fs` | Componente |
| `components.badge.borderRadius` | `--comp-badge-radius` | Componente |

**Total: ~85 tokens mapeados**

---

## 4. Tokens por Categoria

### 4.1 Cores (46 tokens)

#### Cores de Fundo (5)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--color-bg` | `#0f172a` | Fundo da página (`min-h-screen bg-[var(--color-bg)]`) |
| `--color-surface` | `#1e293b` | Cards, containers secundários (`bg-surface`) |
| `--color-surface-hover` | `#334155` | Hover de containers (`hover:bg-surface-hover`) |
| `--color-card` | `#1e293b` | Fundo de cards (`bg-card`) |
| `--color-header-bg` | `#1e293b` | Cabeçalhos |

#### Cores de Texto (5)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--color-text-main` | `#f8fafc` | Títulos, texto principal (`text-text-main`) |
| `--color-text-secondary` | `#cbd5e1` | Texto secundário, labels |
| `--color-text-muted` | `#94a3b8` | Texto de apoio, metadados (`text-text-muted`) |
| `--color-text-inverted` | `#0f172a` | Texto sobre fundo claro (ex: botão primary) |

#### Cores de Borda (2)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--color-border` | `#334155` | Bordas de containers, inputs (`border-border`) |
| `--color-border-subtle` | `#1e293b` | Bordas sutis, separadores |

#### Cores de Acento (5)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--color-accent` | `#c9a655` | **Cor principal da marca** — botões, links, ícones, destaques |
| `--color-accent-hover` | `#d4b366` | Hover de elementos accent |
| `--color-accent-fg` | `#0f172a` | Texto sobre fundo accent (botões primary) |
| `--color-accent-muted` | `#c9a65520` | Fundo semitransparente de elementos accent |

#### Cores de Gradiente (3)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--color-gradient-start` | `#c9a655` | Início do gradiente |
| `--color-gradient-mid` | `#e8d48b` | Meio do gradiente |
| `--color-gradient-end` | `#a8873a` | Fim do gradiente |

**Uso no Cadastros:** KPI cards usam `bg-gradient-to-br from-accent/20 via-accent/10 to-transparent`

#### Cores de Feedback (8)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--color-success` | `#22c55e` | Status "aprovado" (`text-green-400`, `bg-green-500/10`) |
| `--color-success-bg` | `#22c55e15` | Fundo de status sucesso |
| `--color-warning` | `#eab308` | Status "pendente/análise" (`text-yellow-400`) |
| `--color-warning-bg` | `#eab30815` | Fundo de warning |
| `--color-error` | `#ef4444` | Status "reprovado/exclusão" (`text-error`, `bg-error/15`) |
| `--color-error-bg` | `#ef444415` | Fundo de erro |
| `--color-info` | `#3b82f6` | Informação |
| `--color-info-bg` | `#3b82f615` | Fundo de info |

#### Cores de Efeito (6)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--color-overlay` | `#00000080` | Overlay de modais |
| `--color-shadow` | `#00000040` | Sombras |
| `--color-glass-tint` | `#ffffff10` | Efeito glass |
| `--color-scrollbar-thumb` | `#475569` | Scrollbar |
| `--color-ring` | `#c9a65580` | Focus ring |
| `--color-hover-bg` | `#334155` | Hover de elementos interativos |

### 4.2 Tipografia (17 tokens)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--font-family` | `"Plus Jakarta Sans", system-ui, ...` | Fonte principal |
| `--font-family-mono` | `"JetBrains Mono", monospace` | Código, valores |
| `--font-size-xs` | `0.75rem` | Status badges, metadados |
| `--font-size-sm` | `0.875rem` | Corpo de texto, labels de KPI |
| `--font-size-md` | `1rem` | Texto padrão |
| `--font-size-lg` | `1.125rem` | Subtítulos |
| `--font-size-xl` | `1.25rem` | Seções |
| `--font-size-2xl` | `1.5rem` | Títulos de página |

**Uso real no Cadastros (das páginas):**
- `text-3xl sm:text-4xl` — valores de KPI (não usa token, usa Tailwind direto)
- `text-2xl font-bold` — título da página
- `text-lg font-bold` — título de seção
- `text-sm font-semibold` — labels, itens de lista
- `text-xs font-semibold` — labels de KPI, metadados
- `text-[11px]` — labels compactos (valor fixo, não token)

### 4.3 Bordas (5 tokens)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--radius-sm` | `0.375rem` | Elementos pequenos |
| `--radius-md` | `0.5rem` | Inputs, badges |
| `--radius-lg` | `0.75rem` | Cards, containers |
| `--radius-xl` | `1rem` | Containers grandes, modais |

**Uso real no Cadastros:**
- `rounded-2xl` — KPI cards (não usa token, valor Tailwind fixo)
- `rounded-xl` — cards de lista, containers
- `rounded-lg` — badges, avatares
- `rounded-full` — avatares circulares
- `rounded-2xl` — cards de cliente na página de clientes

### 4.4 Sombras (6 tokens)

| Token | Padrão | Uso no Cadastros |
|---|---|---|
| `--shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.3)` | Elevação baixa |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.3)` | Cards |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.3)` | Modais, dropdowns |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.3)` | Modais grandes |

**Uso real no Cadastros:**
- `hover:shadow-lg hover:shadow-accent/5` — hover de cards
- `shadow-lg shadow-error/25` — botão de exclusão no AlertDialog
- Sombras personalizadas inline são mais comuns que tokens de sombra

### 4.5 Animações (6 tokens + keyframes)

| Animação | Keyframe | Uso no Cadastros |
|---|---|---|
| `animate-fade-in` | `fade-in` 0.3s | Transições de página, containers |
| `animate-slide-up` | `slide-up` 0.3s | Entrada de elementos |
| `animate-shimmer` | `shimmer` 1.5s infinite | Skeleton loading |
| `animate-glow` | `glow` 2s infinite alternate | Destaque |
| `animate-accordion-up` | `accordion-up` | Accordion Radix |
| `animate-accordion-down` | `accordion-down` | Accordion Radix |

**Uso real no Cadastros:**
- `animate-fade-in` — container principal do dashboard (`<div className="space-y-8 animate-fade-in">`)
- Skeleton com `animate-shimmer` via classe `.skeleton` no CSS
- `transition-all duration-300` — transições de hover em cards
- `transition-all duration-200` — transições em elementos secundários
- `active:scale-[0.99]` — feedback de clique

### 4.6 Component Tokens (18 tokens)

| Categoria | Tokens | Status |
|---|---|---|
| **Button** | `paddingX`, `paddingY`, `fontSize`, `borderRadius` | ⚠️ Definidos nos presets, mas **não usados** nos componentes shadcn/ui |
| **Input** | `paddingX`, `paddingY`, `fontSize`, `borderRadius` | ⚠️ Definidos nos presets, mas **não usados** nos componentes shadcn/ui |
| **Card** | `padding`, `borderRadius`, `shadow` | ⚠️ Definidos nos presets, mas **não usados** nos componentes shadcn/ui |
| **Modal** | `backdropBg`, `borderRadius`, `shadow` | ⚠️ Definidos nos presets, mas **não usados** nos componentes shadcn/ui |
| **Sidebar** | `width`, `collapsedWidth` | ⚠️ Definidos nos presets, mas **não usados** |
| **Badge** | `paddingX`, `paddingY`, `fontSize`, `borderRadius` | ⚠️ Definidos nos presets, mas **não usados** |

> **Importante:** Os tokens de componente (`components.*`) estão definidos na interface `DesignTokens` e nos presets, mas **NÃO são referenciados pelos componentes shadcn/ui reais**. Os componentes usam classes Tailwind fixas. A única exceção é o `ModuloDesignPage.tsx` que os usa no preview inline.

---

## 5. Componentes UI do Módulo Cadastros

### 5.1 Componentes shadcn/ui Utilizados

| Componente | Import Path | Uso no Cadastros |
|---|---|---|
| `Button` | `~/components/ui/button` | Ações (salvar, cancelar, editar) |
| `Input` | `~/components/ui/input` | Campos de formulário, busca |
| `Dialog` | `~/components/ui/dialog` | Modal de edição de cliente |
| `DialogContent` | `~/components/ui/dialog` | Corpo do modal |
| `DialogHeader` | `~/components/ui/dialog` | Cabeçalho do modal |
| `DialogTitle` | `~/components/ui/dialog` | Título do modal |
| `DialogDescription` | `~/components/ui/dialog` | Descrição do modal |
| `DialogFooter` | `~/components/ui/dialog` | Rodapé do modal |
| `AlertDialog` | `~/components/ui/alert-dialog` | Confirmação de exclusão |
| `AlertDialogContent` | `~/components/ui/alert-dialog` | Conteúdo do alerta |
| `AlertDialogHeader` | `~/components/ui/alert-dialog` | Cabeçalho do alerta |
| `AlertDialogTitle` | `~/components/ui/alert-dialog` | Título do alerta |
| `AlertDialogDescription` | `~/components/ui/alert-dialog` | Descrição do alerta |
| `AlertDialogFooter` | `~/components/ui/alert-dialog` | Rodapé do alerta |
| `AlertDialogAction` | `~/components/ui/alert-dialog` | Botão de ação |
| `AlertDialogCancel` | `~/components/ui/alert-dialog` | Botão de cancelar |
| `Skeleton` | `~/components/ui/skeleton` | Loading state |
| `EmptyState` | `~/components/ui/empty-state` | Estado vazio |

### 5.2 Padrões Visuais Identificados no Dashboard

#### KPI Card Pattern
```tsx
<div className="group relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-{cor}/20 via-{cor}/10 to-transparent 
            border border-{cor}/20 p-5 
            transition-all duration-300 
            hover:shadow-lg hover:shadow-{cor}/10 hover:border-{cor}/40">
  <div className="absolute top-4 right-4 flex items-center justify-center 
              w-12 h-12 rounded-xl bg-{cor}/15 text-{cor}
              group-hover:scale-110 transition-transform duration-300">
    <Icon size={22} />
  </div>
  <p className="text-xs font-semibold text-{cor}/80 uppercase tracking-wider">
    {label}
  </p>
  <p className="text-3xl sm:text-4xl font-bold text-text-main mt-2">
    {valor}
  </p>
  <p className="text-xs text-text-muted mt-2">
    {descricao}
  </p>
</div>
```

**Cores usadas:** `accent` (total), `yellow-500` (pendentes), `green-500` (aprovados), `blue-500` (taxa)

#### Status Pill Pattern
```tsx
<div className="flex items-center gap-3 rounded-xl 
            bg-{cor}/10 border border-{cor}/20 p-3 
            transition-all duration-200 hover:scale-[1.02]">
  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-{cor}/15">
    <Icon size={16} className="text-{cor}" />
  </div>
  <div>
    <p className="text-lg font-bold text-{cor}">{valor}</p>
    <p className="text-[11px] text-text-muted font-medium">{label}</p>
  </div>
</div>
```

#### Card de Lista (Solicitações Recentes)
```tsx
<div className="group flex items-center gap-4 rounded-xl 
            bg-surface border border-border p-4 
            transition-all duration-200 
            hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 
            hover:-translate-y-0.5">
  {/* Avatar */}
  <div className="flex items-center justify-center w-10 h-10 rounded-full 
              bg-accent/10 text-accent font-bold text-sm shrink-0
              group-hover:bg-accent/20 transition-colors">
    {iniciais}
  </div>
  {/* Info */}
  <div className="flex-1 min-w-0">
    <p className="text-sm font-semibold text-text-main truncate 
               group-hover:text-accent transition-colors">
      {nome}
    </p>
    <p className="text-xs text-text-muted mt-0.5">{subtitulo}</p>
  </div>
  {/* Status */}
  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 
              text-xs font-semibold {STATUS_COLOR}">
    {status}
  </span>
</div>
```

#### Skeleton Loading Pattern
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {Array.from({ length: 4 }).map((_, i) => (
    <Skeleton key={i} className="h-32 rounded-2xl" />
  ))}
</div>
```

#### Empty State Pattern
```tsx
<EmptyState
  icon={<BarChart3 className="w-10 h-10 text-text-muted/30" />}
  title="Nenhuma solicitação recente"
  description="Quando novos cadastros forem criados, eles aparecerão aqui."
/>
```

### 5.3 Padrões Visuais na Página de Clientes

#### Card de Cliente
```tsx
<button className="group flex flex-col gap-4 rounded-2xl 
              bg-surface border border-border/60 p-5 text-left 
              transition-all duration-300 
              hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 
              hover:-translate-y-0.5 active:scale-[0.99]">
```

#### AlertDialog de Exclusão
```tsx
<AlertDialogContent>
  <div className="h-1 w-full bg-gradient-to-r from-error via-error to-error rounded-t-2xl" />
  <div className="p-6 sm:p-8">
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-3 text-lg">
        <div className="w-10 h-10 rounded-xl bg-error/15 flex items-center justify-center">
          <XCircle className="text-error" size={20} />
        </div>
        Confirmar exclusão
      </AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction className="bg-error text-white hover:bg-error/90 shadow-lg shadow-error/25">
        Excluir permanentemente
      </AlertDialogAction>
    </AlertDialogFooter>
  </div>
</AlertDialogContent>
```

#### Actions em Hover (apenas desktop)
```tsx
<div className="flex items-center gap-0.5 
            md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
  <button className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10">
    <Pencil size={14} />
  </button>
  <button className="p-2 rounded-lg text-error hover:bg-error/10">
    <Trash2 size={14} />
  </button>
</div>
```

---

## 6. Padrões de Aplicação nos Componentes

### 6.1 Como as Cores São Aplicadas

O módulo Cadastros usa **3 modos de aplicação de cor**:

| Modo | Exemplo | Ocorrências |
|---|---|---|
| **Classe Token (Tailwind @theme)** | `bg-surface`, `text-text-main`, `border-border`, `text-accent` | ~70% das ocorrências |
| **Classe Direta Tailwind** | `text-green-400`, `bg-green-500/10`, `text-blue-400` | ~25% (status colors) |
| **CSS Var inline** | `style={{ color: resolved.colors.accent }}`, `bg-[var(--color-accent)]` | ~5% (apenas no ModuloDesignPage) |

### 6.2 Padrão de Hover

```tsx
// Cards: levitação + borda accent + sombra
hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5

// Containers: hover simples
hover:bg-surface-hover

// Status pills: escala
hover:scale-[1.02]

// Botões de ação: hover destrutivo/editar
hover:bg-error/10
hover:bg-blue-500/10
```

### 6.3 Padrão de Estados

| Estado | Implementação |
|---|---|
| **Loading** | Grid de `<Skeleton className="h-32 rounded-2xl" />` |
| **Vazio** | `<EmptyState icon title description />` |
| **Erro** | `toast.error()` + console.error |
| **Sucesso** | `toast.success()` |
| **Submissão** | Botão com `loading={true}` + `disabled` |

### 6.4 Padrão Responsivo (Mobile-First)

```tsx
// Grid: 1 coluna mobile, escalando
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6

// KPI: 2 colunas mobile, 4 desktop
grid-cols-2 lg:grid-cols-4

// Header: empilha mobile, linha desktop
flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4

// Input search: full mobile, fit desktop
w-full lg:w-56

// Actions: sempre visível mobile, hover desktop
md:opacity-0 md:group-hover:opacity-100

// Font sizes: escala
text-3xl sm:text-4xl
text-[11px] text-text-muted
```

### 6.5 Animações de Entrada

```tsx
// Page container
<div className="space-y-8 animate-fade-in">

// Card stagger
style={{ animationDelay: `${i * 50}ms` }}
style={{ animationDelay: `${i * 30}ms` }}
```

---

## 7. Hierarquia de Temas (Override)

### 7.1 Cadeia de Resolução

```
Preset (dark-gold) ← Global Override ← Empresa Override ← Módulo Override
   (base)            (super admin)      (admin empresa)    (admin config)
```

Cada nível sobrescreve parcialmente o anterior via `deepMerge`.

### 7.2 Tabelas no Banco de Dados

| Tabela | Chave | Quem Gerencia |
|---|---|---|
| `design_system_global` | Singleton (id) | Super admin |
| `design_system_empresa` | `empresa_id` (1 por empresa) | Admin da empresa |
| `design_system_modulo` | `(empresa_id, modulo_key)` (1 por módulo/empresa) | Admin config |

Cada tabela armazena:
- `tokens_override: Partial<DesignTokens>` — apenas os tokens modificados
- `versao: string` — versão (ex: "1.0.0")

### 7.3 O Que Pode Ser Sobrescrito por Nível

| Token | Preset | Global | Empresa | Módulo |
|---|---|---|---|---|
| `colors.accent` | ✅ Fixo | ✅ Sobrescreve | ✅ Sobrescreve | ✅ Sobrescreve |
| `colors.bg` | ✅ Fixo | ✅ | ✅ | ✅ |
| `colors.surface` | ✅ Fixo | ✅ | ✅ | ✅ |
| `colors.border` | ✅ Fixo | ✅ | ✅ | ✅ |
| `colors.textMain` | ✅ Fixo | ✅ | ✅ | ✅ |
| `colors.success` | ✅ Fixo | ✅ | ✅ | ✅ |
| `colors.error` | ✅ Fixo | ✅ | ✅ | ✅ |
| `colors.*` | ✅ Fixo | ✅ | ✅ | ✅ |
| `typography.*` | ✅ Fixo | ✅ | ✅ | ✅ |
| `borders.*` | ✅ Fixo | ✅ | ✅ | ✅ |
| `shadows.*` | ✅ Fixo | ✅ | ✅ | ✅ |
| `animations.*` | ✅ Fixo | ✅ | ✅ | ✅ |
| `spacing.*` | ✅ Fixo | ✅ | ✅ | ✅ |
| `components.*` | ✅ Fixo | ✅ | ✅ | ✅ |

**Todos os tokens são customizáveis em qualquer nível.**

---

## 8. O Que é Customizável vs Não Customizável

### ✅ Customizável via Interface Visual

| Categoria | O Que | Como |
|---|---|---|
| **Cores** | Accent, Surface, Background, Border | Color picker no ModuloDesignPage |
| **Cores (indireto)** | Success, Error, Warning, Info | Apenas via código/banco |
| **Tipografia** | Font family, sizes, weights | Apenas via código/banco |
| **Bordas** | Border radius (sm, md, lg, xl) | Apenas via código/banco |
| **Sombras** | sm, md, lg, xl, glow | Apenas via código/banco |
| **Componentes** | Button, Input, Card paddings/fonts | Apenas via código/banco |
| **Preset** | Escolher entre 4 temas base | Seletor de preset (futuro) |

### ⚠️ Customizável Apenas via Banco/Código

- Tokens de tipografia (font sizes, line heights, letter spacing)
- Tokens de sombra
- Tokens de espaçamento
- Tokens de animação
- Tokens de componentes (button, input, card, modal)
- Gradientes (start, mid, end)

### ❌ Não Customizável (Fixo no CSS)

| Item | Onde está definido |
|---|---|
| **Font family** | `globals.css` body + `@theme` |
| **Animações keyframes** | `globals.css` @keyframes |
| **Scrollbar styling** | `globals.css` pseudo-elements |
| **Focus ring** | `globals.css` `*:focus-visible` |
| **Select nativo** | `globals.css` select styling |
| **Modal inputs focus** | `globals.css` `[role="dialog"]` |
| **Skeleton shimmer** | `globals.css` `.skeleton` class |
| **Gradiente brand** | `globals.css` `.bg-gradient-brand` |
| **Safe area** | `globals.css` `env(safe-area-inset-*)` |
| **Responsivo (font-size 16px)** | `globals.css` media query mobile |
| **Reduced motion** | `globals.css` `prefers-reduced-motion` |
| **NPS no borders** | `globals.css` `.nps-no-borders` |
| **Mapa colors** | `globals.css` `:root { --state-exclusive: ... }` |
| **Hanburguer icons** | `globals.css` select arrow SVG |
| **Classes utilitárias** | `globals.css` `@utility btn-hover-*` |
| **Componentes shadcn/ui** | `src/components/ui/*.tsx` (classes fixas) |

---

## 9. Presets de Tema Disponíveis

### 9.1 `dark-gold` (Padrão)

Tema escuro com acento dourado — o tema atual do sistema.

| Propriedade | Valor |
|---|---|
| Background | `#0f172a` |
| Surface | `#1e293b` |
| Accent | `#c9a655` |
| Text Main | `#f8fafc` |
| Text Muted | `#94a3b8` |
| Font | Plus Jakarta Sans |

### 9.2 `dark-blue`

Tema escuro com acento azul.

| Propriedade | Valor |
|---|---|
| Background | `#0f172a` |
| Accent | `#3b82f6` (blue-500) |

### 9.3 `dark-emerald`

Tema escuro com acento esmeralda.

| Propriedade | Valor |
|---|---|
| Background | `#0f172a` |
| Accent | `#10b981` (emerald-500) |

### 9.4 `light-clean`

Tema claro.

| Propriedade | Valor |
|---|---|
| Background | `#ffffff` |
| Accent | `#6366f1` (indigo-500) |

### 9.5 Comparação Visual

| Token | dark-gold | dark-blue | dark-emerald | light-clean |
|---|---|---|---|---|
| `bg` | `#0f172a` | `#0f172a` | `#0f172a` | `#ffffff` |
| `surface` | `#1e293b` | `#1e293b` | `#1e293b` | `#f8fafc` |
| `accent` | `#c9a655` | `#3b82f6` | `#10b981` | `#6366f1` |
| `textMain` | `#f8fafc` | `#f8fafc` | `#f8fafc` | `#0f172a` |

---

## 10. Fluxo de Personalização no Frontend

### 10.1 Rota de Design

O módulo Cadastros expõe a rota `/empresa/cadastros/design` que renderiza o componente `ModuloDesignPage`:

```tsx
// src/routes/empresa.cadastros-design.tsx
export const empresaCadastrosDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/cadastros/design",
  component: () => (
    <ModuloDesignPage moduloKey="cadastros" moduloNome="Cadastros" />
  ),
});
```

Há também um redirect da rota antiga `/cadastros/design` para a nova rota.

### 10.2 Interface de Edição

O `ModuloDesignPage` oferece:

1. **Seletor de cores** (color picker) para:
   - Accent
   - Surface
   - Background
   - Border

2. **Preview em tempo real** com:
   - Botão primary e secondary
   - Card com título e descrição
   - As cores mudam instantaneamente via CSS vars no `:root`

3. **Botão "Herdar da Empresa"** — limpa o override do módulo

4. **Botão "Salvar"** — persiste no Supabase via `saveDesignModulo()`

### 10.3 Hooks Disponíveis para Componentes

```tsx
// Hook principal — tokens completos do contexto atual
const { tokens, presetKey, isLoading } = useDesignSystem();

// Hook de módulo — tokens com override do módulo atual
const { moduloKey, tokens } = useModuleDesign();

// Hook de token específico
const accent = useDesignToken("colors.accent", "#c9a655");
const bg = useDesignToken<string>("colors.bg");
```

### 10.4 Como um Componente Deveria Usar os Tokens (ideal)

```tsx
// Usando o hook useDesignToken
const bgColor = useDesignToken("colors.bg");
const textColor = useDesignToken("colors.textMain");

<div style={{ background: bgColor, color: textColor }}>
  {children}
</div>
```

### 10.5 Como os Componentes Realmente Usam (real)

```tsx
// Usando classes Tailwind (o token resolvido já está no :root)
<div className="bg-surface text-text-main border border-border">
  {children}
</div>
```

**OBS:** O Design System foi projetado para funcionar via CSS vars + classes Tailwind. O hook `useDesignToken` existe mas **não é usado** nos componentes do Cadastros — eles dependem das classes `@theme` do Tailwind.

---

## 11. Análise das Rotas de Design do Cadastros

### 11.1 `ModuloDesignPage.tsx` — Página de Design

**Funcionamento:**
1. Carrega global, empresa e modulo overrides via React Query
2. Mantém estado local `override` com os tokens modificados
3. A cada alteração, re-resolve tokens e injeta CSS vars no `:root`
4. Ao salvar, persiste o override no Supabase

**Tokens editáveis na UI:**
- `colors.accent`
- `colors.surface`
- `colors.bg`
- `colors.border`

**Preview mostra:**
- Botão primary (`background: accent, color: accentFg`)
- Botão secondary (`border: accent, color: accent`)
- Card (`background: card, border: border, padding: card.padding`)

**Tokens não expostos na UI (mas salvos):**
- O objeto `override` aceita qualquer token do `DesignTokens` — mas só 4 inputs de cor são renderizados

### 11.2 `ModuleDesignProvider.tsx` — Provider de Módulo

**Funcionamento:**
- Wrapper de layout opcional por módulo
- Aplica o override específico do módulo no `:root`
- Ao desmontar, o `DesignSystemProvider` re-aplica os tokens sem módulo

**Problema:** Remove o `data-module={moduloKey}` do container ao desmontar, mas a limpeza dos tokens é feita pelo re-render do `DesignSystemProvider` — pode causar flicker.

---

## 12. Oportunidades de Melhoria

### 12.1 Component Tokens Não Utilizados

Os tokens de componente (`components.button.*`, `components.input.*`, etc.) estão definidos nos presets mas **não são usados** pelos componentes shadcn/ui reais. Os componentes shadcn/ui usam classes Tailwind fixas.

**Solução:** Modificar os componentes shadcn/ui para usar CSS vars:

```tsx
// Em vez de:
<button className="px-4 py-2 rounded-lg text-sm">

// Usar:
<button style={{
  padding: `${tokens.components.button.paddingY} ${tokens.components.button.paddingX}`,
  borderRadius: tokens.components.button.borderRadius,
  fontSize: tokens.components.button.fontSize,
}}>
```

### 12.2 Apenas 4 Cores Editáveis na UI

A interface `ModuloDesignPage` expõe apenas 4 cores (accent, surface, bg, border). Para editar as demais cores (success, error, warning) é necessário acesso direto ao banco.

**Solução:** Expandir o ModuloDesignPage para incluir todas as cores de feedback.

### 12.3 Inconsistência no Uso de Tokens versus Tailwind Direto

- KPI cards usam `from-accent/20` (token) mas status pills usam `from-green-500/20` (Tailwind direto)
- A página de clientes usa `text-green-400`, `text-yellow-400`, `text-red-400` (cores fixas)

**Impacto:** Se a empresa mudar o preset de `dark-gold` para `dark-blue`, os status de cliente continuarão verdes, amarelos e vermelhos — as cores de feedback não mudam.

### 12.4 Ausência de Tema para Componentes de Feedback

Os status do Cadastros usam cores Tailwind fixas (`green-500`, `yellow-500`, `red-500`, `orange-500`, `blue-500`) em vez dos tokens `--color-success`, `--color-warning`, `--color-error`.

### 12.5 Provider Legado (`ThemeProvider`)

O `ThemeProvider.tsx` em `src/core/theme/` é legado e está sendo substituído pelo `DesignSystemProvider`. No entanto, ele ainda pode estar ativo em partes do sistema.

### 12.6 Token de Sombra Não Utilizado

KPI cards usam `hover:shadow-lg hover:shadow-accent/5` — hardcoded, não usando `--shadow-md` ou `--comp-card-shadow`.

### 12.7 Flicker ao Navegar entre Módulos

O `ModuleDesignProvider` injeta tokens modulares no `:root` e depende do `DesignSystemProvider` para re-aplicar os tokens globais ao desmontar — isso pode causar flicker visual.

**Solução:** Usar escopo CSS por data attribute em vez de injetar no `:root`:
```css
[data-module="cadastros"] {
  --color-accent: ...;
}
```

### 12.8 Sem Suporte a CSS Variables no Tailwind v4 para Component Tokens

Os tokens `--comp-btn-px`, `--comp-input-px`, etc. não são mapeados no `@theme` do `globals.css`, o que significa que não podem ser usados como classes Tailwind (ex: `btn-px`). Eles só podem ser usados via `style={{}}` inline.

---

## 13. Diagrama da Arquitetura de Tema

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        src/styles/globals.css                                 │
│                                                                              │
│  @theme {                                                                     │
│    --color-bg: #0f172a;                                                       │
│    --color-surface: #1e293b;                                                  │
│    --color-accent: #c9a655;                                                   │
│    --color-text-main: #f8fafc;                                                │
│    ... (40+ tokens)                                                           │
│  }                                                                            │
│                                                                              │
│  Classes utilitárias: bg-surface, text-text-main, border-border, text-accent │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ usado por
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    src/components/ui/* (shadcn/ui)                            │
│                                                                              │
│  Button → bg-[var(--color-accent)] text-[var(--color-accent-fg)]            │
│  Input  → border-[var(--color-border)] bg-[var(--color-input-bg)]          │
│  Card   → bg-[var(--color-card)] border-[var(--color-border)]              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ usado por
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              src/routes/cadastros.* (Módulo Cadastros)                        │
│                                                                              │
│  Dashboard:                                                                   │
│  ├── bg-surface, text-text-main (containers)                                  │
│  ├── bg-gradient-to-br from-accent/20 (KPI cards)                            │
│  ├── text-green-400, bg-green-500/10 (status aprovado) — ⚠️ fixo            │
│  ├── text-yellow-400 (status pendente) — ⚠️ fixo                            │
│  └── hover:shadow-lg hover:shadow-accent/5 (hover effects)                   │
│                                                                              │
│  Clientes:                                                                    │
│  ├── bg-surface border-border/60 (cards)                                     │
│  ├── text-error, bg-error/15 (exclusão) — ⚠️ fixo                          │
│  └── text-blue-400, hover:bg-blue-500/10 (botão editar) — ⚠️ fixo          │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ personalizado via
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│            src/design-system/ (Engine de Tokens)                              │
│                                                                              │
│  Presets → dark-gold.ts, dark-blue.ts, dark-emerald.ts, light-clean.ts       │
│                                                                              │
│  Resolver → resolveTokens(preset, global, empresa, modulo)                   │
│                                                                              │
│  Provider → DesignSystemProvider (injeta no :root)                           │
│          → ModuleDesignProvider (injeta override do módulo)                  │
│                                                                              │
│  Queries → React Query com staleTime=5min, cache no cliente                 │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ persistido via
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│            Supabase (design_system_global, _empresa, _modulo)                │
│                                                                              │
│  design_system_global: preset_key + tokens_override (super admin)            │
│  design_system_empresa: preset_key + tokens_override (admin empresa)         │
│  design_system_modulo: tokens_override (admin do módulo)                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Finais

1. **Design System completo**: O ERP Conexão possui um Design System bem estruturado com ~85 tokens, 4 presets, engine de resolução em cascata e interface de edição.

2. **Tailwind v4 + CSS Custom Properties**: A combinação permite que temas sejam alterados em tempo real sem recompilação — as classes `bg-surface`, `text-text-main` etc. refletem automaticamente as novas cores.

3. **Engine de override em 4 níveis**: Preset → Global → Empresa → Módulo — permite personalização progressiva sem conflitos.

4. **Gap entre tokens e componentes**: Os tokens de componente (`components.button.*`) estão definidos mas não são consumidos pelos componentes shadcn/ui reais.

5. **Cores de feedback fixas**: Status de cliente usam cores Tailwind fixas (`green-500`, `yellow-500`, `red-500`) em vez dos tokens de feedback (`--color-success`, `--color-warning`, `--color-error`), o que quebra a troca de preset.

6. **Apenas 4 cores expostas na UI**: O ModuloDesignPage expõe apenas accent, surface, bg e border — as demais cores exigem acesso ao banco.

7. **Migração em andamento**: O `DesignSystemProvider` está substituindo o `ThemeProvider` legado, mas a migração parece incompleta.

8. **Sem escopo de módulo**: Os overrides de módulo são aplicados no `:root` global, não em um container escopado — pode causar conflitos se dois módulos forem carregados simultaneamente.
