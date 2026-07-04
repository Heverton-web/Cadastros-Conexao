# Análise do Design System — Módulo Empresa

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura do Design System](#2-arquitetura-do-design-system)
3. [Tokens CSS — Mapeamento](#3-tokens-css--mapeamento)
4. [Componentes e Padrões](#4-componentes-e-padrões)
5. [Personalização Disponível](#5-personalização-disponível)
6. [O Que Não É Personalizável](#6-o-que-não-é-personalizável)
7. [Divergências](#7-divergências)

---

## 1. Visão Geral

O módulo **Empresa** é o **núcleo do multi-tenancy** e também o **centro do sistema de design**: é nele que o tema global da empresa é configurado. A rota `/empresa/design` é onde o usuário escolhe preset e faz override de cores.

| Aspecto | Detalhe |
|---|---|
| **Tokens** | Globais `--color-*` — resolve preset + overrides |
| **Design Config** | Página própria em `/empresa/design` (não ModuloDesignPage) |
| **Presets** | 4 (dark-gold, dark-blue, light-clean, dark-emerald) |
| **Pipeline** | Preset → Global → Empresa → Módulo |
| **Camadas** | 3 camadas: `src/core/empresa/`, `src/features/empresas/`, `src/shared/empresas/` |

---

## 2. Arquitetura do Design System

### Pipeline de Resolução

```
┌──────────┐    ┌────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Preset   │ → │  Global Config │ → │  Empresa Config  │ → │  Módulo Config  │
│ (fixo)    │    │ (app_config)   │    │ (empresas_config)│    │ (db design sys) │
└──────────┘    └────────────────┘    └──────────────────┘    └─────────────────┘
                                                     ↓
                                            CSS vars injetadas no :root
                                            via DesignSystemProvider
```

### Caminho de Resolução (resolveTokens)

```typescript
// src/design-system/tokens/resolver.ts
resolveTokens({
  presetKey,          // dark-gold | dark-blue | light-clean | dark-emerald
  globalOverride,     // app_config.design_global (super admin)
  empresaOverride,    // empresas_config.tokens_override (admin empresa)
  moduloOverride,     // design_system_modulos.tokens_override (opcional)
})
```

### Arquivos-Chave

| Arquivo | Função |
|---|---|
| `src/routes/empresa.design.tsx` | Página de design da empresa — Preset + Cores + Preview |
| `src/design-system/provider/DesignSystemProvider.tsx` | Provider que injeta CSS vars no :root |
| `src/design-system/tokens/resolver.ts` | Resolvedor de tokens com deep merge |
| `src/design-system/tokens/presets/dark-gold.ts` | Preset Dark Gold (padrão) |
| `src/design-system/tokens/presets/dark-blue.ts` | Preset Dark Blue |
| `src/design-system/tokens/presets/light-clean.ts` | Preset Light Clean |
| `src/design-system/tokens/presets/dark-emerald.ts` | Preset Dark Emerald |
| `src/core/empresa/EmpresaContext.tsx` | Contexto da empresa ativa |
| `src/design-system/services/design-system.service.ts` | Serviço de save/load do design |

---

## 3. Tokens CSS — Mapeamento

### Presets (4 temas)

| Preset | Accent | Bg | Surface | Público |
|---|---|---|---|---|
| Dark Gold | `#c9a655` | `#0f172a` | `#1e293b` | Padrão |
| Dark Blue | `#3b82f6` | `#0f172a` | `#1e293b` | Alternativo |
| Dark Emerald | `#10b981` | `#0f172a` | `#1e293b` | Alternativo |
| Light Clean | `#6366f1` | Branco | `#f8fafc` | Light mode |

### Tokens por Categoria

#### Cores (48 tokens)
- **Base**: bg, surface, surfaceHover, card
- **Texto**: textMain, textSecondary, textMuted, textInverted
- **Bordas**: border, borderSubtle
- **Accent**: accent, accentHover, accentFg, accentMuted
- **Gradiente**: gradientStart, gradientMid, gradientEnd
- **Feedback**: success, successBg, warning, warningBg, error, errorBg, info, infoBg
- **Efeitos**: overlay, shadow, glassTint, headerBg, scrollbarThumb, ring
- **Hover**: hoverBg, hoverBorder, hoverShadow
- **shadcn aliases**: primary, primaryForeground, secondary, secondaryForeground, muted, mutedForeground, destructive, destructiveForeground, popover, popoverForeground, input, inputBg, inputBorder, inputFocus

#### Tipografia (18 tokens)
fontFamily, fontFamilyMono, fontSizeXs~2xl, fontWeightLight~Bold, lineHeightTight~Relaxed, letterSpacingTight~Wide

#### Spacing (8 tokens)
xs~4xl

#### Borders (5 tokens)
radiusSm, radiusMd, radiusLg, radiusXl, radiusFull

#### Shadows (6 tokens)
sm, md, lg, xl, glow, accentGlow

#### Animações (5 tokens)
durationFast, durationNormal, durationSlow, easingDefault, easingBounce

#### Componentes (23 tokens)
button (px, py, fs, radius), input (px, py, fs, radius), card (padding, radius, shadow), modal (backdropBg, radius, shadow), sidebar (width, collapsedWidth), badge (px, py, fs, radius)

---

## 4. Componentes e Padrões

### EmpresaDesignPage (rota `/empresa/design`)
- **Seletor de Preset**: 4 opções + "Herdar do Global"
- **Override de Cores**: Color picker + input hex para accent, accentHover, bg, surface
- **Preview em tempo real**: Botões, card, gradiente — atualizam live via `resolveTokens` + `tokensToCssVars`
- **Botão Reset**: "Herdar do Global"
- **Botão Salvar**: Persiste no Supabase `empresas_config`

### DesignSystemProvider
- Carrega `design_global` (app_config) + `empresas_config.design`
- Injeta CSS vars no `:root` via `useEffect`
- Atualiza `document.body.style.fontFamily`
- Gerencia favicon da empresa

---

## 5. Personalização Disponível

### Nível Global (Super Admin)
- `app_config.design_global.preset_key`
- `app_config.design_global.tokens_override`

### Nível Empresa (Admin)
- `empresas_config.design.preset_key` (4 presets)
- `empresas_config.design.tokens_override` (cores, tipografia, etc.)

### Nível Módulo (Admin)
- `design_system_modulos.tokens_override` (via ModuloDesignPage)
- Sobrescreve apenas tokens específicos do módulo

---

## 6. O Que Não É Personalizável

- **Presets fixos**: Apenas 4 presets — não é possível criar novos
- **Estrutura de tokens**: Schema `DesignTokens` fixo em TypeScript
- **Ordem de precedência**: Preset → Global → Empresa → Módulo (fixa)
- **CSS vars mapeadas**: Apenas tokens mapeados em `CSS_VAR_MAP` são injetados
- **Fontes**: `--font-family` é injetado mas não exposto no seletor de preset

---

## 7. Divergências

1. **Código duplicado**: `EmpresaDesignPage` e `ModuloDesignPage` têm ~70% de código igual — poderiam compartilhar componente base
2. **CSS `--font-family` não exposto**: O token `typography.fontFamily` existe e é injetado no body, mas não há UI para alterá-lo
3. **Apenas 4 cores no override**: A UI do `/empresa/design` só expõe 4 cores (accent, accentHover, bg, surface), mas o sistema de tokens permite override de todas as 48
4. **Sem preview de componentes**: Preview mostra apenas botões e card — não mostra tabela, input, badge, dialog
5. **Presets não extensíveis**: Adicionar novo preset exige código TypeScript + build
