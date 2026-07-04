# Análise do Design System — Módulo Hub de Engajamento

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura do Design System do Hub](#2-arquitetura-do-design-system-do-hub)
3. [Tokens CSS do Hub — Mapeamento](#3-tokens-css-do-hub--mapeamento)
4. [Classes CSS Exclusivas do Hub](#4-classes-css-exclusivas-do-hub)
5. [Animações Exclusivas](#5-animações-exclusivas)
6. [Componentes do Hub](#6-componentes-do-hub)
7. [Padrões de Aplicação nos Componentes](#7-padrões-de-aplicação-nos-componentes)
8. [Personalização Visual no Hub](#8-personalização-visual-no-hub)
9. [O Que é Customizável vs Não Customizável](#9-o-que-é-customizável-vs-não-customizável)
10. [Comparativo: Hub vs Design System Global](#10-comparativo-hub-vs-design-system-global)
11. [Oportunidades de Melhoria](#11-oportunidades-de-melhoria)

---

## 1. Visão Geral

O **Hub de Engajamento** é o módulo de treinamento e gamificação do ERP Conexão. Diferente dos demais módulos, o Hub possui seu **próprio sistema de design visual** com:

- **Arquivo CSS próprio**: `hub-theme.css` com tokens duplicados e customizações
- **Efeitos visuais exclusivos**: Blobs animados, textura grain, glassmorphism, confete
- **Sistema de gamificação**: Badges, níveis, XP, ranking com animações próprias
- **Theme Editor**: `ThemeEditorPanel.tsx` — editor visual de tema mais completo que o `ModuloDesignPage`
- **Per-environment themes**: Temas diferentes para global, login, cliente, gestor e admin
- **color-mix()**: Uso extensivo da função CSS `color-mix()` para geração dinâmica de cores

### 1.1 Diferenças do Design Global

| Aspecto | Design Global (globals.css) | Hub (hub-theme.css) |
|---|---|---|
| **Arquivo** | `src/styles/globals.css` | `src/features/hub/lib/hub-theme.css` |
| **Aplicação** | Via `@theme` do Tailwind v4 | Via `:root` + classes CSS diretas |
| **Override** | DesignSystemProvider | `--color-*` vars são sobrescritas |
| **Efeitos** | Gradientes, shimmer, glow | Blobs, grain, glass, confete |
| **Personalização** | ModuloDesignPage (4 cores) | ThemeEditorPanel (40+ tokens + sliders) |
| **Escopo** | Global | Escopo do Hub (via HubLayout) |

---

## 2. Arquitetura do Design System do Hub

### 2.1 Camadas

```
┌─────────────────────────────────────────────────────────────────┐
│  src/styles/globals.css (Base Design System)                     │
│  Tokens: --color-bg, --color-accent, --color-surface, etc.      │
│  Classes: bg-surface, text-text-main, border-border, etc.       │
└────────────────────────────────┬────────────────────────────────┘
                                 │ sobrescreve
┌────────────────────────────────▼────────────────────────────────┐
│  src/features/hub/lib/hub-theme.css (Hub Override)              │
│  Mesmos tokens + extras: --env-blob*, --env-grain*, --env-glass*│
│  Classes: .liquid-glass, .icon-box, .animate-blob              │
└────────────────────────────────┬────────────────────────────────┘
                                 │ adiciona
┌────────────────────────────────▼────────────────────────────────┐
│  src/features/hub/lib/badge-animations.css                     │
│  Animações: confete, unlock-glow, badge-pop, border-pulse      │
└─────────────────────────────────────────────────────────────────┘
                                 │ usam
┌─────────────────────────────────────────────────────────────────┐
│  Componentes do Hub                                             │
│  ├── HubLayout (header glass + GlobalEffects)                    │
│  ├── HubDashboardPage (sidebar, filters, level card)            │
│  ├── MaterialCard (per-type coloring + shimmer)                 │
│  ├── CollectionCard (accent gradient + progress bar)            │
│  ├── BadgeDisplay (icon-box + cor dinâmica)                     │
│  ├── RankingBoard (medalhas + level badge)                      │
│  └── ThemeEditorPanel (editor visual completo)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Pipeline de Resolução de Tema do Hub

O Hub tem **dois sistemas de tema paralelos**:

```
Sistema 1 — Design System Global (via DesignSystemProvider):
  Preset → Global Override → Empresa Override → Módulo Override
  Injeta em :root via CSS vars

Sistema 2 — Hub Config (via ThemeEditorPanel):
  HubSystemConfig.theme_dark (salvo no Supabase)
  Aplica tokens manualmente via applyTheme()
  Injeta em :root via style.setProperty()

⚠️ Conflito potencial: Ambos injetam --color-* no :root.
   O último a executar vence.
```

### 2.3 Layout do Hub

O Hub possui um layout próprio (`HubLayout.tsx`) com:

```
┌──────────────────────────────────────────────────┐
│  HubGlobalEffects (blobs + grain — fixed z-[-1]) │
├──────────────────────────────────────────────────┤
│  Header glass (sticky top-0)                     │
│  - Logo CH com gradiente + glow                  │
│  - Seletor de idioma (PT)                        │
│  - User avatar + level + XP + logout             │
├──────────────────────────────────────────────────┤
│  Main (Outlet — conteúdo das páginas)            │
│  - HubDashboardPage                              │
│  - HubConquistasPage                             │
│  - HubRankingPage                                │
│  - Páginas admin                                 │
└──────────────────────────────────────────────────┘
```

---

## 3. Tokens CSS do Hub — Mapeamento

### 3.1 Tokens Duplicados do Global

Presentes tanto em `globals.css` quanto em `hub-theme.css`:

| Token | hub-theme.css | globals.css | Igual? |
|---|---|---|---|
| `--color-bg` | `#0f172a` | `#0f172a` | ✅ |
| `--color-surface` | `#1e293b` | `#1e293b` | ✅ |
| `--color-surface-hover` | `#334155` | `#334155` | ✅ |
| `--color-card` | `#1e293b` | `#1e293b` | ✅ |
| `--color-text-main` | `#f8fafc` | `#f8fafc` | ✅ |
| `--color-text-muted` | `#94a3b8` | `#94a3b8` | ✅ |
| `--color-text-inverted` | `#0f172a` | `#0f172a` | ✅ |
| `--color-accent` | `#c9a655` | `#c9a655` | ✅ |
| `--color-accent-hover` | `#d4b366` | `#d4b366` | ✅ |
| `--color-accent-fg` | `#0f172a` | `#0f172a` | ✅ |
| `--color-accent-muted` | `#c9a65520` | `#c9a65520` | ✅ |
| `--color-gradient-start` | `#c9a655` | `#c9a655` | ✅ |
| `--color-gradient-mid` | `#e8d48b` | `#e8d48b` | ✅ |
| `--color-gradient-end` | `#a8873a` | `#a8873a` | ✅ |
| `--color-success` | `#22c55e` | `#22c55e` | ✅ |
| `--color-warning` | `#eab308` | `#eab308` | ✅ |
| `--color-error` | `#ef4444` | `#ef4444` | ✅ |
| `--color-input-bg` | `#0f172a` | `#0f172a` | ✅ |
| `--color-ring` | `#c9a65580` | `#c9a65580` | ✅ |
| `--color-border` | **`transparent`** | `#334155` | ❌ **Diferente** |
| `--color-scrollbar-thumb` | `#475569` | `#475569` | ✅ |
| `--color-hover-bg` | `#334155` | `#334155` | ✅ |

### 3.2 Tokens Exclusivos do Hub

Tokens que **só existem** no `hub-theme.css`:

| Token | Padrão | Propósito |
|---|---|---|
| `--env-blob1-color` | `#c9a655` | Cor do primeiro blob animado |
| `--env-blob2-color` | `#e8d48b` | Cor do segundo blob |
| `--env-blob3-color` | `#a8873a` | Cor do terceiro blob |
| `--env-blob-opacity` | `0.20` | Transparência dos blobs |
| `--env-blob-size` | `18rem` | Tamanho dos blobs |
| `--env-blob-blur` | `64px` | Desfoque dos blobs |
| `--env-grain-opacity` | `0.20` | Intensidade da textura grain |
| `--env-grain-blend` | `multiply` | Modo de mesclagem do grain |
| `--env-grain-contrast` | `150` | Contraste da textura |
| `--env-glass-blur` | `20px` | Desfoque do efeito glass |
| `--color-hover-scale` | `1.02` | Escala no hover |

### 3.3 Tokens de Componente no Hub

O `ThemeEditorPanel.tsx` define **mais tokens** do que o `ModuloDesignPage` (que só expõe 4). Ele categoriza em 10 grupos:

| Categoria | Tokens | Total |
|---|---|---|
| 🏗️ Estrutura Base | `background`, `surface`, `card` | 3 |
| ✏️ Tipografia | `textMain`, `textMuted`, `textInverted` | 3 |
| 📐 Bordas | `border`, `borderSubtle` | 2 |
| 🎨 Marca / Accent | `accent`, `accentHover`, `accentForeground`, `accentMuted` | 4 |
| 🚦 Feedback | `success`, `successBg`, `warning`, `warningBg`, `error`, `errorBg` | 6 |
| 🧩 Componentes | `inputBg`, `inputBorder`, `inputFocus`, `buttonPrimaryBg`, `buttonPrimaryText`, `badgeBg`, `tooltipBg`, `tooltipText` | 8 |
| 🏛️ Cabeçalho | `headerBg`, `glassTint`, `ring` | 3 |
| 👆 Hover | `surfaceHover`, `hoverBg`, `hoverBorder`, `hoverShadow` | 4 |
| ✨ Efeitos | `overlay`, `shadow`, `scrollbarThumb`, `scrollbarTrack` | 4 |
| 🌈 Gradientes | `gradientStart`, `gradientMid`, `gradientEnd` | 3 |
| | **Total** | **40 tokens** |

---

## 4. Classes CSS Exclusivas do Hub

### 4.1 Glassmorphism

```css
.liquid-glass {
  background: rgba(30, 41, 59, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px) saturate(180%);
}

.liquid-glass-gold {
  background: rgba(201, 166, 85, 0.12);
  border: 1px solid rgba(201, 166, 85, 0.15);
  box-shadow: 0 4px 20px rgba(201, 166, 85, 0.08);
  backdrop-filter: blur(16px) saturate(160%);
}
```

**Uso:** Header do Hub (`HubLayout.tsx`), cards de destaque.
**Diferencial:** Usa `@supports (color: color-mix(...))` para fallback graceful quando `color-mix()` não é suportado.

### 4.2 Icon Boxes

```css
.icon-box        { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; }
.icon-box-sm     { width: 2rem; height: 2rem; border-radius: 0.5rem; }
.icon-box-lg     { width: 3rem; height: 3rem; border-radius: 0.875rem; }
```

**Uso:** Container de ícones com fundo escuro, borda accent e cor accent.
**Presente em:** `BadgeDisplay`, `HubDashboardPage` (menu categories), `HubConquistasPage`.

### 4.3 Globos Animados (Blobs)

```css
.animate-blob {
  animation: blob 7s infinite;
}
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%      { transform: translate(30px, -50px) scale(1.1); }
  66%      { transform: translate(-20px, 20px) scale(0.9); }
}
```

**Uso:** 3 blobs dourados no fundo do Hub via `HubGlobalEffects.tsx`.

### 4.4 Delay de Animação

```css
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
```

**Uso:** Stagger dos blobs (blob 2 atrasa 2s, blob 3 atrasa 4s).

### 4.5 Sem Scrollbar

```css
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

**Uso:** Sidebar de categorias no mobile (scroll horizontal sem barra).

---

## 5. Animações Exclusivas

### 5.1 Confete de Badge (badge-animations.css)

5 partículas que explodem para cima ao desbloquear um badge:

```css
.confete-1 { animation: confete-gold-1 2.5s ease-out forwards; }
.confete-2 { animation: confete-gold-2 1.8s ease-out forwards; }
.confete-3 { animation: confete-gold-3 2.2s ease-out forwards; }
.confete-4 { animation: confete-gold-4 2s ease-out forwards; }
.confete-5 { animation: confete-gold-5 3s ease-out forwards; }
```

Cada partícula tem trajetória diferente (ângulo, distância e rotação variados).

### 5.2 Unlock Glow

```css
.animate-unlock-glow {
  animation: unlock-glow 2s ease-in-out infinite;
}
@keyframes unlock-glow {
  50% { box-shadow: 0 0 30px rgba(201,166,85,0.6), 0 0 60px rgba(201,166,85,0.3); }
}
```

### 5.3 Badge Pop-in

```css
.animate-badge-pop {
  animation: badge-pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes badge-pop-in {
  0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
  50%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
  70%  { transform: scale(0.95) rotate(-2deg); }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
```

Easing `cubic-bezier(0.34, 1.56, 0.64, 1)` = **ease-out com bounce**.

### 5.4 Border Pulse

```css
.animate-border-pulse {
  animation: border-pulse-gold 2s ease-in-out infinite;
}
```

### 5.5 Shimmer Particle

```css
.shimmer-particle {
  animation: shimmer-particle 2s linear infinite;
}
```

---

## 6. Componentes do Hub

### 6.1 `HubLayout` — Layout Principal

**Token CSS:** usa `var(--color-*)` extensivamente via inline styles.

```tsx
// Header glass com gradiente dinâmico baseado no level do usuário
style={{
  background: levelColor
    ? `linear-gradient(135deg, ${levelColor}12 0%, ${colorMix("var(--color-header-bg)", 80, "rgba(15,23,42,0.8)")} 50%, ${levelColor}08 100%)`
    : `linear-gradient(135deg, ${colorMix("var(--color-glass-tint)", 25, "rgba(30,41,59,0.25)")} ...)`,
  backdropFilter: "blur(var(--env-glass-blur, 20px)) saturate(180%)",
  border: levelColor ? `1px solid ${levelColor}25` : `1px solid ${colorMix("...")}`,
}}
```

**Padrão de cores do header:**
- Background: glass com gradiente (usa `--color-glass-tint`, `--color-header-bg`)
- Logo: gradiente dourado (`--color-gradient-start` → `--color-gradient-mid` → `--color-gradient-end`)
- Nível do usuário: cor dinâmica vinda do banco (`level.color`)
- Botão logout: `--color-error-bg` (fundo) + `--color-error` (texto)

### 6.2 `HubDashboardPage` — Página Principal

**Tokens usados:**
- `animate-fade-in` — entrada da página
- `bg-gradient-to-br from-accent/20 via-accent/10 to-transparent` — hero header
- `bg-surface` — containers da sidebar
- `border-border` — bordas
- `text-text-main`, `text-text-muted` — cores de texto
- `bg-accent/15 text-accent border-accent/20` — badges ativos
- `bg-accent/8 text-accent border-accent/10` — badges inativos

**Padrões visuais:**

| Elemento | Classes | Descrição |
|---|---|---|
| Hero Header | `rounded-2xl from-accent/20` | Gradiente de fundo + blob animado |
| Level Card | `from-accent/20 via-accent/10 to-transparent` | Gradiente + progress bar |
| Category Menu | `bg-surface border-border/20 rounded-2xl` | Menu lateral com scroll horizontal |
| Categoria Ativa | `from-accent/20 via-accent/10 to-transparent border-accent/30 md:translate-x-2` | Gradiente + deslocamento |
| Tag Filter | `bg-accent/15 text-accent border-accent/20 rounded-full` | Tags clicáveis |
| Loading | `animate-pulse bg-surface border-border/20 min-h-[320px]` | Skeleton pulsing |
| Empty State | `border-dashed rounded-2xl` | Estado vazio com ícone |
| Dica Pro | `from-yellow-500/20 via-yellow-500/10 border-yellow-500/20` | Card amarelo de destaque |

### 6.3 `MaterialCard` — Card de Material

**Per-type coloring:** Cada tipo de material tem sua própria paleta de cores:

| Tipo | Cor | from | border | iconBg | iconText |
|---|---|---|---|---|---|
| **PDF** | Amber | `from-amber-500/20` | `border-amber-500/20` | `bg-amber-500/15` | `text-amber-400` |
| **Imagem** | Yellow | `from-yellow-500/20` | `border-yellow-500/20` | `bg-yellow-500/15` | `text-yellow-400` |
| **Vídeo** | Orange | `from-orange-500/20` | `border-orange-500/20` | `bg-orange-500/15` | `text-orange-400` |
| **Áudio** | Cyan | `from-cyan-500/20` | `border-cyan-500/20` | `bg-cyan-500/15` | `text-cyan-400` |
| **HTML** | Teal | `from-teal-500/20` | `border-teal-500/20` | `bg-teal-500/15` | `text-teal-400` |

**Estrutura do card:**
```
┌─────────────────────────────────┐
│ 🖼️ Icon (12x12)      [PDF]     │ ← ícone maior + badge de tipo
│                                 │
│ Title (line-clamp-2)            │ ← fonte bold, h fixa
│                                 │
│ [✅ Concluído]                  │ ← status de progresso
│ [tag1] [tag2] [tag3]           │ ← tags
│ ⭐ 15 XP                        │ ← pontos
│                                 │
│ ────────────────                │ ← separador
│ Versões                         │
│ [PT-BR] [EN 🔒] [ES 🔒]        │ ← botões de idioma
└─────────────────────────────────┘
```

**Efeitos:** Shimmer overlay no hover (faixa branca que desliza).

### 6.4 `CollectionCard` — Card de Trilha

**Padrão:** Mesmo do KPI card do Dashboard — `from-accent/20 via-accent/10 to-transparent`.

```
┌─────────────────────────────────┐
│ 📚 Icon (12x12)      [Trilha]   │
│                                 │
│ Title (line-clamp-2)            │
│ Description (line-clamp-2)      │
│                                 │
│ 2 de 5 concluídos      40%      │ ← progress bar
│ ────────────────                │
│ ⭐ 50 XP        Ver trilha →    │
└─────────────────────────────────┘
```

### 6.5 `BadgeDisplay` — Display de Badge

**Tokens dinâmicos:** Usa a cor do badge vinda do banco (`badge.color`).

```tsx
<div style={{ backgroundColor: badge.color + "20", color: badge.color }}>
  <Icon />
</div>
```

**Estados:**
- **Earned (conquistado):** Normal, hover com translateY
- **Not earned:** `opacity-40 grayscale` — escala de cinza + opacidade reduzida

### 6.6 `RankingBoard` — Quadro de Ranking

**Medalhas:**
- #1: `Trophy` com `text-yellow-500`
- #2: `Medal` com `text-gray-400`
- #3: `Medal` com `text-amber-600`
- Demais: `#4+` com `text-text-muted`

**Level badge:** Cor dinâmica vinda de `levelConfig.color`.

---

## 7. Padrões de Aplicação nos Componentes

### 7.1 Estilo Inline vs Classes Tailwind

O Hub é **o único módulo** que usa extensivamente `style={}` com CSS vars:

| Abordagem | Exemplo | % de uso |
|---|---|---|
| **`style={{}}` com CSS var** | `style={{ color: "var(--color-text-main)" }}` | ~40% |
| **Classes Tailwind token** | `className="text-text-main"` | ~35% |
| **Classes Tailwind fixas** | `className="text-green-400"` | ~15% |
| **`colorMix()` helper** | `style={{ background: colorMix("var(--color-accent)", 10, "...") }}` | ~10% |

### 7.2 Helper `colorMix()`

Função utilitária que gera cores dinâmicas:

```typescript
function colorMix(c1: string, w: number, c2: string) {
  return `color-mix(in srgb, ${c1} ${w}%, ${c2})`;
}
```

**Uso:** Gerar variações de cor com opacidade sem depender de tokens pré-definidos.

### 7.3 Padrão de Inline Style com CSS Vars

```tsx
// Em vez de:
<div className="bg-surface text-text-main">

// O Hub usa:
<div style={{
  backgroundColor: "var(--color-bg)",
  color: "var(--color-text-main)"
}}>
```

### 7.4 Padrão Hero Header

Todas as 3 páginas do Hub (Dashboard, Conquistas, Ranking) compartilham o mesmo padrão:

```tsx
<div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
  <div className="absolute inset-0 opacity-60"
    style={{ background: `linear-gradient(to right, ${colorMix("...")}, ...)` }} />
  <div className="relative z-10 p-5 sm:p-8 md:p-10">
    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3"
      style={{ color: "var(--color-text-main)" }}>
      {title}
    </h1>
    <p className="text-sm sm:text-base max-w-lg font-medium"
      style={{ color: "var(--color-text-muted)" }}>
      {description}
    </p>
  </div>
</div>
```

### 7.5 Padrão Empty State

```tsx
<div className="flex flex-col items-center justify-center py-24
            rounded-[2rem] border border-white/5 text-center px-4"
  style={{ backgroundColor: colorMix("var(--color-surface)", 20, "rgba(30,41,59,0.2)") }}>
  <Icon size={48} className="mb-4 opacity-30" style={{ color: "var(--color-text-muted)" }} />
  <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>
    Nenhum resultado
  </h3>
  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
    Mensagem descritiva
  </p>
</div>
```

### 7.6 Padrão Card com Hover

```tsx
// MaterialCard/CollectionCard
className="group relative overflow-hidden rounded-2xl bg-gradient-to-br
          {c.from} via-transparent to-transparent {c.border} border p-5
          transition-all duration-300
          hover:shadow-lg {c.shadow} hover:border-opacity-40"

// RankingBoard items
className="flex items-center gap-3 sm:gap-4 rounded-xl bg-surface border border-border p-3 sm:p-4
          transition-all duration-200
          hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5"
```

### 7.7 Padrão Responsivo do Hub

```tsx
// Grid: 1 → 2 → 3 colunas
grid-cols-1 sm:grid-cols-2 xl:grid-cols-3

// Sidebar: full width mobile → 18rem desktop
w-full md:w-72

// Hero: padding escala
p-5 sm:p-8 md:p-10

// Título: escala
text-2xl sm:text-4xl md:text-5xl

// Header logo: hidden mobile
hidden sm:block

// Input search: escala
py-3 sm:py-4 px-3 sm:px-4

// Animação stagger
style={{ animationDelay: `${index * 70}ms` }}
```

---

## 8. Personalização Visual no Hub

### 8.1 `ThemeEditorPanel` — Editor de Tema do Hub

O Hub possui um **editor visual de tema mais completo** que o `ModuloDesignPage` do sistema.

**Acessado via:** `/hub/admin/dashboard` → Painel admin → ThemeEditorPanel

**Funcionalidades:**

| Funcionalidade | ModuloDesignPage | ThemeEditorPanel |
|---|---|---|
| **Cores editáveis** | 4 (accent, surface, bg, border) | **40+** (10 categorias) |
| **Color picker** | ✅ | ✅ |
| **Input hex** | ✅ | ✅ |
| **Sliders** | ❌ | ✅ (opacidade, blur, tamanho, contraste) |
| **Preview** | ✅ (botões + card) | ❌ (live no :root) |
| **Reset** | ✅ (herdar da empresa) | ✅ (resetar para padrão) |
| **Salvar** | ✅ (design_system_modulo) | ✅ (hub_system_config.theme_dark) |
| **Per-environment** | ❌ | ✅ (global, auth, client, manager, admin) |

**Tokens editáveis por categoria (40+):**

| Aba | Categorias | Total |
|---|---|---|
| **Tokens de Cores** | 10 categorias | 40 tokens |
| **Efeitos por Ambiente** | Blobs (6), Grain (2), Glass (1) | 9 sliders/inputs |

**Ambientes disponíveis:**
- **Global** — tema padrão
- **Login** — tela de autenticação
- **Cliente** — dashboard do cliente
- **Gestor** — dashboard do gestor
- **Admin** — dashboard administrativo

Cada ambiente pode ter:
- Cores dos blobs (3)
- Opacidade, tamanho e blur dos blobs
- Opacidade e contraste do grain
- Blur do glass effect

### 8.2 Persistência

Os temas são salvos em `hub_system_config` no Supabase:

```typescript
interface HubSystemConfig {
  empresa_id: string;
  theme_dark: Record<string, string>;        // tokens de cor
  environment_themes: Record<string, Record<string, string>>;  // temas por ambiente
}
```

### 8.3 Aplicação em Tempo Real

```typescript
const applyTheme = useCallback((t: Record<string, string>) => {
  const root = document.documentElement;
  Object.entries(t).forEach(([k, v]) => {
    const cssVar = `--color-${k.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    root.style.setProperty(cssVar, v);
  });
}, []);
```

---

## 9. O Que é Customizável vs Não Customizável

### ✅ Customizável via ThemeEditorPanel (Hub Admin)

| Categoria | Tokens | Quantidade |
|---|---|---|
| Cores de fundo | `background`, `surface`, `card` | 3 |
| Cores de texto | `textMain`, `textMuted`, `textInverted` | 3 |
| Cores de borda | `border`, `borderSubtle` | 2 |
| Cores de marca | `accent`, `accentHover`, `accentForeground`, `accentMuted` | 4 |
| Cores de feedback | `success`, `successBg`, `warning`, `warningBg`, `error`, `errorBg` | 6 |
| Componentes | `inputBg`, `inputBorder`, `inputFocus`, `buttonPrimaryBg`, `buttonPrimaryText`, `badgeBg`, `tooltipBg`, `tooltipText` | 8 |
| Cabeçalho | `headerBg`, `glassTint`, `ring` | 3 |
| Hover | `surfaceHover`, `hoverBg`, `hoverBorder`, `hoverShadow` | 4 |
| Efeitos | `overlay`, `shadow`, `scrollbarThumb`, `scrollbarTrack` | 4 |
| Gradientes | `gradientStart`, `gradientMid`, `gradientEnd` | 3 |
| **Total cores** | | **40** |

### ✅ Customizável via Sliders (Hub Admin)

| Parâmetro | Range | Ambiente |
|---|---|---|
| Opacidade dos blobs | 0 — 1 | ✅ |
| Tamanho dos blobs | 5rem — 50rem | ✅ |
| Blur dos blobs | 0px — 200px | ✅ |
| Opacidade do grain | 0 — 1 | ✅ |
| Contraste do grain | 0 — 300 | ✅ |
| Blur do glass | 0px — 50px | ✅ |
| Cores dos blobs (3) | color picker | ✅ |

### ✅ Customizável via ModuloDesignPage (Design System Global)

- Apenas 4 cores: `colors.accent`, `colors.surface`, `colors.bg`, `colors.border`

### ❌ Não Customizável

| Item | Onde está definido |
|---|---|
| **Animações** (blob, confete, pop-in, glow) | `hub-theme.css`, `badge-animations.css` |
| **Keyframes** duração e easing | CSS fixo |
| **Classes glass** (liquid-glass) | CSS fixo |
| **Classes icon-box** | CSS fixo |
| **Per-type colors** (amber, orange, cyan, etc.) | `MaterialCard.tsx` — mapa fixo |
| **Efeito shimmer** no hover | CSS fixo |
| **Espaçamentos** dos cards | CSS fixo |
| **Border radius** | `rounded-xl`, `rounded-2xl` fixos |
| **Font family** | Global (`globals.css`) |
| **Scrollbar styling** | `hub-theme.css` |

---

## 10. Comparativo: Hub vs Design System Global

### 10.1 Overlap e Divergências

| Aspecto | Global | Hub |
|---|---|---|
| **--color-border** | `#334155` | **`transparent`** |
| **Modo de aplicar** | Classes Tailwind (`bg-surface`) | `style={}` com CSS vars |
| **Personalização** | 4 cores no ModuloDesignPage | 40+ cores + sliders no ThemeEditorPanel |
| **Persistência** | `design_system_modulo` | `hub_system_config.theme_dark` |
| **Fonte de verdade** | `@theme` no globals.css | `:root` no hub-theme.css (duplicado) |
| **Efeitos visuais** | Gradientes suaves | Blobs + grain + glass + confete |
| **Responsividade** | Mobile-first consistente | Mobile-first com scroll horizontal |

### 10.2 Conflito Potencial

O Hub define `--color-border: transparent` enquanto o global define `#334155`. Quando o Hub está ativo, as bordas ficam invisíveis — o que pode ser intencional (efeito glass) ou um bug.

### 10.3 Duplicação de Tokens

~30 tokens estão definidos **em ambos** os arquivos. Isso significa:
- Se o token global for alterado, o Hub não reflete a mudança
- Se o token do Hub for alterado, pode conflitar com o global
- Manutenção duplicada

---

## 11. Oportunidades de Melhoria

### 11.1 Duplicação de Tokens CSS

O `hub-theme.css` duplica ~30 tokens já definidos em `globals.css`. Se um for alterado no global, o Hub não reflete.

**Solução:** Remover os tokens duplicados do `hub-theme.css` e manter apenas os exclusivos (`--env-blob*`, `--env-grain*`, `--env-glass*`).

### 11.2 `color-mix()` sem Fallback Adequado

O uso de `color-mix()` nos componentes (`style={{ color: colorMix(...) }}`) pode quebrar em navegadores que não suportam (Safari <15, alguns Android WebViews).

**Solução:** Adicionar fallback com cores sólidas via CSS classes, ou usar o `@supports` já presente nas classes `.liquid-glass`.

### 11.3 Dois Sistemas de Tema Concorrentes

O Hub tem `ThemeEditorPanel` (salva em `hub_system_config`) e `ModuloDesignPage` (salva em `design_system_modulo`). Ambos injetam `--color-*` no `:root`.

**Solução:** Unificar em um único sistema. O ideal seria usar apenas o `DesignSystemProvider` com override do módulo Hub, e eliminar o `ThemeEditorPanel`.

### 11.4 `--color-border: transparent` Diferente do Global

O Hub define borda como `transparent`, o que pode causar inconsistência visual ao alternar entre módulos.

**Solução:** Usar o mesmo valor do global (`#334155`) ou documentar a intenção.

### 11.5 Estilo Inline vs. Classes Tailwind

O Hub usa extensivamente `style={}` com CSS vars, enquanto o resto do sistema usa classes Tailwind (`bg-surface`, `text-text-main`). Isso dificulta manutenção e reaproveitamento.

**Solução:** Migrar para classes Tailwind sempre que possível, usando `style={}` apenas para valores dinâmicos.

### 11.6 Per-type Colors Hardcoded

As cores dos tipos de material (PDF = amber, Vídeo = orange, etc.) estão hardcoded no `MaterialCard.tsx`. Não são customizáveis via tema.

**Solução:** Transformar em tokens CSS customizáveis: `--hub-type-pdf-color`, `--hub-type-video-color`, etc.

### 11.7 Animações sem Preferência de Movimento Reduzido

As animações do Hub (blobs, confete, glow) não respeitam `prefers-reduced-motion`.

**Solução:** Adicionar `@media (prefers-reduced-motion: reduce)` para desabilitar animações.

### 11.8 ThemeEditorPanel Fora do Design System Central

O `ThemeEditorPanel.tsx` está dentro de `src/features/hub/components/admin/` em vez de `src/design-system/components/`.

**Solução:** Mover o `ThemeEditorPanel` para o design system central e reutilizar nos demais módulos.

---

## Notas Finais

1. **Design System mais rico do sistema:** O Hub tem o sistema de design mais completo, com blobs animados, glassmorphism, confete e 40+ tokens customizáveis.

2. **Dois sistemas de tema paralelos:** O Hub coexiste com o `DesignSystemProvider` global, mas ambos injetam no `:root` — risco de conflito.

3. **Duplicação de tokens:** ~30 tokens CSS duplicados entre `hub-theme.css` e `globals.css`.

4. **`color-mix()` inovador:** O Hub é o único módulo usando `color-mix()` do CSS — tecnologia moderna que permite geração dinâmica de variações de cor.

5. **Gamificação visual:** Animações de confete, badge pop-in, glow e border pulse são exclusivas do Hub e não existem em nenhum outro módulo.

6. **Per-type coloring:** Materiais têm paleta própria por tipo (PDF, imagem, vídeo, áudio, HTML) — único módulo com essa abordagem.

7. **Personalização mais completa:** O `ThemeEditorPanel` oferece 10x mais opções de personalização que o `ModuloDesignPage` padrão.
