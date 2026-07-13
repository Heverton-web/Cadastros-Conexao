# Análise do Design System — Módulo Global (Infraestrutura)

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura](#2-arquitetura)
3. [Tokens CSS — Referência Completa](#3-tokens-css--referência-completa)
4. [Componentes Compartilhados](#4-componentes-compartilhados)
5. [Classes Utilitárias Globais](#5-classes-utilitárias-globais)
6. [Personalização Disponível](#6-personalização-disponível)
7. [Animações Globais](#7-animações-globais)
8. [Observações](#8-observações)

---

## 1. Visão Geral

O **módulo Global** não é um módulo de negócio — é a **infraestrutura compartilhada** que serve de base para todos os outros módulos. Inclui o design system core, providers, tokens, e componentes compartilhados.

| Aspecto | Detalhe |
|---|---|
| **Tokens** | 85+ tokens CSS no `globals.css` + 85+ tokens TypeScript no design system |
| **Design Config** | Config global via `app_config.design_global` |
| **shadcn/ui** | 30+ componentes registrados |
| **Providers** | DesignSystemProvider, AuthProvider, ThemeProvider |
| **Infraestrutura** | profiles, permissoes, notificacoes, webhooks, form_schema, atividades |

---

## 2. Arquitetura

```
┌─────────────────────────────────────────────────┐
│                   src/styles/                    │
│                 globals.css                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │@theme    │ │ Keyframes│ │Classes Utilitárias││
│  │(85 vars) │ │(8 anim.) │ │(bg-gradient-brand││
│  └──────────┘ └──────────┘ │ .skeleton, etc.) ││
│                            └──────────────────┘│
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│            src/design-system/                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │ tokens/  │ │provider/ │ │ components/      ││
│  │ types.ts │ │DesignSys.│ │ModuloDesignPage  ││
│  │ resolver │ │Provider  │ │                  ││
│  │ presets/ │ │ModuleDes.│ │                  ││
│  │ css-var- │ │Provider  │ │                  ││
│  │ map.ts   │ │          │ │                  ││
│  └──────────┘ └──────────┘ └──────────────────┘│
│  ┌──────────┐ ┌──────────┐                     │
│  │ hooks/   │ │services/ │                     │
│  │ index.ts │ │queries.ts│                     │
│  │          │ │service.ts│                     │
│  └──────────┘ └──────────┘                     │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│         src/components/ui/ (shadcn/ui)          │
│  30+ componentes: Button, Card, Dialog, Input,  │
│  Select, Badge, Avatar, Table, Tabs, Skeleton,  │
│  EmptyState, AlertDialog, Sheet, Accordion...   │
└─────────────────────────────────────────────────┘
```

---

## 3. Tokens CSS — Referência Completa

### 3.1 @theme (Tailwind v4)

Definidos em `src/styles/globals.css` via diretiva `@theme`:

#### Base (4)
`--color-bg: #0f172a`, `--color-surface: #1e293b`, `--color-surface-hover: #334155`, `--color-card: #1e293b`

#### Tipografia (4)
`--color-text-main: #f8fafc`, `--color-text-secondary: #cbd5e1`, `--color-text-muted: #94a3b8`, `--color-text-inverted: #0f172a`

#### Bordas (2)
`--color-border: #334155`, `--color-border-subtle: #1e293b`

#### Accent (4)
`--color-accent: #c9a655`, `--color-accent-hover: #d4b366`, `--color-accent-fg: #0f172a`, `--color-accent-muted: #c9a65520`

#### Gradiente (3)
`--color-gradient-start: #c9a655`, `--color-gradient-mid: #e8d48b`, `--color-gradient-end: #a8873a`

#### Feedback (6)
`--color-success: #22c55e`, `--color-success-bg: #22c55e15`, `--color-warning: #eab308`, `--color-warning-bg: #eab30815`, `--color-error: #ef4444`, `--color-error-bg: #ef444415`

#### Componentes (8)
`--color-input-bg: #0f172a`, `--color-input-border: #475569`, `--color-input-focus: #c9a655`, `--color-btn-primary-bg: #c9a655`, `--color-btn-primary-text: #0f172a`, `--color-badge-bg: #334155`, `--color-tooltip-bg: #f8fafc`, `--color-tooltip-text: #0f172a`

#### Efeitos (7)
`--color-overlay: #00000080`, `--color-shadow: #00000040`, `--color-glass-tint: #ffffff10`, `--color-header-bg: #1e293b`, `--color-scrollbar-thumb: #475569`, `--color-scrollbar-track: transparent`, `--color-ring: #c9a65580`

#### Hover (3)
`--color-hover-bg: #334155`, `--color-hover-border: #c9a65540`, `--color-hover-shadow: #c9a65525`

#### shadcn/ui Aliases (17)
`--color-background`, `--color-foreground`, `--color-card-foreground`, `--color-popover`, `--color-popover-foreground`, `--color-primary`, `--color-primary-foreground`, `--color-secondary`, `--color-secondary-foreground`, `--color-muted`, `--color-muted-foreground`, `--color-accent-foreground`, `--color-destructive`, `--color-destructive-foreground`, `--color-input`, `--color-ring`

#### Border Radius (4)
`--radius-sm: 0.375rem`, `--radius-md: 0.5rem`, `--radius-lg: 0.75rem`, `--radius-xl: 1rem`

#### Shadows (4)
`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`

#### Animations (4)
`--animate-fade-in`, `--animate-slide-up`, `--animate-shimmer`, `--animate-glow`

---

## 4. Componentes Compartilhados

### shadcn/ui (30+ componentes)

| Categoria | Componentes |
|---|---|
| **Layout** | Card, Sheet, ScrollArea, Accordion |
| **Form** | Button, Input, Select, Label, Textarea, Checkbox, RadioGroup |
| **Feedback** | AlertDialog, Dialog, Skeleton, EmptyState, Badge, Toast |
| **Navegação** | Tabs, DropdownMenu, Breadcrumb |
| **Dados** | Table, Avatar, Command, Popover |

### Componentes Próprios

| Componente | Localização | Função |
|---|---|---|
| `PageHeader` | `~/components/ui/page-header` | Header padrão com título + descrição + ícone |
| `EmptyState` | `~/components/ui/empty-state` | Estado vazio com ícone, título e descrição |
| `Skeleton` | `~/components/ui/skeleton` | Loading shimmer |

---

## 5. Classes Utilitárias Globais

### CSS Puras (globals.css)

| Classe | Efeito |
|---|---|
| `.bg-gradient-brand` | Gradiente accent 4-stop |
| `.state-faded` | Opacidade 0.35 |
| `.state-glow` | Filter drop-shadow glow |
| `.skeleton` | Shimmer animation |
| `.nps-no-borders` | Remove todas as bordas |
| `.scrollbar-modal` | Scrollbar fina cinza |
| `.modal-open` | Fixa o body quando modal aberto |
| `.animate-accordion-up` | Accordion close |
| `.animate-accordion-down` | Accordion open |

### Tailwind Custom Utilities (@utility)

| Utility | Efeito |
|---|---|
| `btn-hover-destructive` | Hover vermelho destrutivo |
| `btn-hover-edit` | Hover azul de edição |
| `btn-hover-neutral` | Hover neutro (surface-hover) |

---

## 6. Personalização Disponível

### Nível Global (Super Admin)
- Preset global (`app_config.design_global.preset_key`)
- Override global de tokens (`app_config.design_global.tokens_override`)

### Mecanismo
```typescript
// DesignSystemProvider
const tokens = resolveTokens({
  presetKey: "dark-gold",
  globalOverride: global?.tokens_override,
  empresaOverride: emp?.tokens_override,
});
// Injeta no :root
const cssVars = tokensToCssVars(tokens);
for (const [varName, value] of Object.entries(cssVars)) {
  root.style.setProperty(varName, value);
}
```

---

## 7. Animações Globais

| Animação | Trigger | Uso |
|---|---|---|
| `fade-in` | `animate-fade-in` | Entrada de páginas e seções |
| `slide-up` | `animate-slide-up` | Cards e elementos surgindo |
| `shimmer` | `animate-shimmer` | Skeleton loading |
| `glow` | `animate-glow` | Efeito de glow em accent |
| `accordion-up/down` | Classes específicas | Accordion Radix |
| `pulse-subtle` | (classes Tailwind) | Loading sutil |

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Observações

1. **46 tokens no `@theme` + 39 tokens de design system TypeScript** = 85+ tokens no total
2. **CSS puro vs Tailwind**: Algumas classes (`.skeleton`, `.state-*`) são CSS puro, outras usam Tailwind — inconsistência
3. **shadcn/ui aliases duplicadas**: `--color-accent` e `--color-primary` têm o mesmo valor (`#c9a655`) — redundância
4. **`.nps-no-borders` global**: Classe específica do NPS no CSS global — acoplamento indevido
5. **`--state-*` e `--heat-*` no `:root`**: Variáveis do módulo Mapas no escopo global — vazamento de escopo
6. **Mobile-first**: `html { -webkit-tap-highlight-color: transparent; }` e `font-size: 16px !important` em inputs mobile
7. **Sem theme tokens para print**: Nenhum `@media print` definido
