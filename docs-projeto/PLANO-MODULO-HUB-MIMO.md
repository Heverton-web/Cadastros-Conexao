# Plano de Correção Visual — Design IDÊNTICO ao Original

## Problema

As cores e design do módulo HUB no ERP não são idênticas ao projeto original (conexao-hub-main). O original usa um design system específico com CSS variables, glassmorphism, blobs animados e grain texture.

## Design System do Original (a replicar EXATAMENTE)

### CSS Variables (prefixo `--color-`)

```
--color-bg: #0f172a
--color-surface: #1e293b
--color-surface-hover: #334155
--color-card: #1e293b
--color-text-main: #f8fafc
--color-text-muted: #94a3b8
--color-text-inverted: #0f172a
--color-border: transparent
--color-border-subtle: #1e293b
--color-accent: #c9a655
--color-accent-hover: #d4b366
--color-accent-fg: #0f172a
--color-accent-muted: #c9a65520
--color-success: #22c55e
--color-success-bg: #22c55e15
--color-warning: #eab308
--color-warning-bg: #eab30815
--color-error: #ef4444
--color-error-bg: #ef444415
--color-input-bg: #0f172a
--color-input-border: #334155
--color-input-focus: #c9a655
--color-btn-primary-bg: #c9a655
--color-btn-primary-text: #0f172a
--color-badge-bg: #334155
--color-overlay: #00000080
--color-shadow: #00000040
--color-glass-tint: #ffffff10
--color-header-bg: #1e293b
--color-scrollbar-thumb: #c9a655
--color-scrollbar-track: transparent
--color-ring: #c9a65580
--color-gradient-start: #c9a655
--color-gradient-mid: #e8d48b
--color-gradient-end: #a8873a
--color-hover-bg: #334155
--color-hover-border: #c9a65540
--color-hover-scale: 1.02
--color-hover-shadow: #c9a65525
```

### Environment Variables (prefixo `--env-`)

```
--env-blob1-color: #c9a655
--env-blob2-color: #e8d48b
--env-blob3-color: #a8873a
--env-blob-opacity: 0.20
--env-blob-size: 18rem
--env-blob-blur: 64px
--env-grain-opacity: 0.20
--env-grain-blend: multiply
--env-grain-contrast: 150
--env-glass-blur: 20px
```

### Classes CSS Obrigatórias

- `.liquid-glass` — glassmorphism padrão
- `.liquid-glass-gold` — glassmorphism dourado (ativo)
- `.icon-box` — container de ícone 2.5rem
- `.icon-box-sm` — container de ícone 2rem
- `.icon-box-lg` — container de ícone 3rem
- `.no-scrollbar` — esconder scrollbar
- `.animation-delay-2000` — delay para blobs

### GlobalEffects (Componente)

- 3 blobs animados (mix-blend-multiply, animate-blob)
- Grain texture (noise.svg, opacity variável)
- Posição: fixed, z-[-1], pointer-events-none

### Scrollbar

- Width: 5px
- Thumb: var(--color-accent)
- Track: transparent

---

## Arquivos a Modificar

| #   | Arquivo                                                          | Ação           | Descrição                                                                                                   |
| --- | ---------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | `src/features/hub/lib/hub-theme.css`                             | **REESCREVER** | CSS vars com prefixo `--color-` + `--env-`, classes `.liquid-glass`, `.icon-box`, scrollbar, animações blob |
| 2   | `src/features/hub/components/shared/GlobalEffects.tsx`           | **REESCREVER** | 3 blobs animados + grain texture (idêntico ao original)                                                     |
| 3   | `src/features/hub/components/layout/HubLayout.tsx`               | **REESCREVER** | Usar classes `.liquid-glass` e vars `--color-*` (não `--hub-*`)                                             |
| 4   | `src/features/hub/components/layout/HubSidebar.tsx`              | **REESCREVER** | Usar classes `.liquid-glass` e vars `--color-*`                                                             |
| 5   | `src/features/hub/components/materials/MaterialCard.tsx`         | **REESCREVER** | Usar `.icon-box-lg`, `.liquid-glass-gold`, vars `--color-*`                                                 |
| 6   | `src/features/hub/components/collections/CollectionCard.tsx`     | **REESCREVER** | Usar `.icon-box-lg`, vars `--color-*`                                                                       |
| 7   | `src/features/hub/pages/HubDashboardPage.tsx`                    | **REESCREVER** | Usar `.liquid-glass-gold`, `.icon-box`, `.no-scrollbar`, vars `--color-*`                                   |
| 8   | `src/features/hub/index.ts`                                      | Editar         | Importar badge-animations.css                                                                               |
| 9   | `src/features/hub/lib/badge-animations.css`                      | **CRIAR**      | Animações de confetti, lock crack, glow, shimmer                                                            |
| 10  | `src/features/hub/components/admin/ThemeEditorPanel.tsx`         | **CRIAR**      | Editor de 42 tokens CSS + environment effects                                                               |
| 11  | `src/features/hub/components/admin/ColorInput.tsx`               | **CRIAR**      | Input de cor com preview                                                                                    |
| 12  | `src/features/hub/components/admin/SliderInput.tsx`              | **CRIAR**      | Slider para valores                                                                                         |
| 13  | `src/features/hub/components/admin/EnvironmentEffectsEditor.tsx` | **CRIAR**      | Editor de blobs/glass/grain                                                                                 |
| 14  | `src/features/hub/pages/HubAdminPage.tsx`                        | **REESCREVER** | 6 sub-abas (Identity, Themes, Integrations, Invites, Gamification, Chatbot)                                 |

---

## Detalhes de Cada Arquivo

### 1. hub-theme.css

- Renomear todas as variáveis `--hub-*` → `--color-*`
- Adicionar variáveis `--env-*` para blobs/glass/grain
- Adicionar classes `.liquid-glass`, `.liquid-glass-gold` com fallbacks
- Adicionar `.icon-box`, `.icon-box-sm`, `.icon-box-lg`
- Adicionar scrollbar customizada
- Adicionar `.animation-delay-2000`, `.no-scrollbar`
- Adicionar `@keyframes blob` para animação dos blobs

### 2. GlobalEffects.tsx

- Componente idêntico ao original
- 3 divs blobs com `animate-blob`, `mix-blend-multiply`
- Grain texture com noise.svg
- Usar vars `--env-blob1-color`, `--env-blob-size`, etc.

### 3-7. Componentes

- Substituir todas as refs `var(--hub-*)` por `var(--color-*)`
- Usar classes CSS existentes (`.liquid-glass`, `.icon-box-lg`, etc.)
- Manter a lógica de `colorMix()` mas com vars corretas

### 9. badge-animations.css

- Copiar do original: confetti particles, lock crack, unlock glow, badge pop, shimmer particles

---

## Feature Adicional — ThemeEditorPanel (Personalização de Cores)

O Hub original possui uma rota `/admin` → aba **Settings** → sub-aba **Themes** com um editor completo de personalização visual:

### ThemeEditorPanel (449 linhas)

- **10 categorias de tokens** (42+ tokens CSS):
  - Estrutura Base (background, surface, card)
  - Tipografia (textMain, textMuted, textInverted)
  - Bordas (border, borderSubtle)
  - Marca/Accent (accent, accentHover, accentForeground, accentMuted)
  - Gradientes (gradientStart, gradientMid, gradientEnd)
  - Cabeçalho (headerBg, glassTint, ring)
  - Efeitos de Hover (surfaceHover, hoverBg, hoverBorder, hoverShadow)
  - Feedback/Status (success, successBg, warning, warningBg, error, errorBg)
  - Componentes (inputBg, inputBorder, inputFocus, buttonPrimaryBg, buttonPrimaryText, badgeBg, tooltipBg, tooltipText)
  - Efeitos & UI (overlay, shadow, scrollbarThumb, scrollbarTrack)

- **Environment Effects Editor** por ambiente (global, auth, client, manager, admin):
  - Background da página
  - 3 Blobs animados (cor, opacidade, tamanho, blur)
  - Grain texture (opacidade, blend mode, contraste)
  - Glass effects (opacidade, blur, borda)

- **Preview em tempo real** das mudanças
- **Salva no banco** via `hub_system_config.theme_dark` e `hub_system_config.environment_themes`

### Arquivos a criar para ThemeEditorPanel

| Arquivo                                                          | Descrição                                          |
| ---------------------------------------------------------------- | -------------------------------------------------- |
| `src/features/hub/components/admin/ThemeEditorPanel.tsx`         | Editor completo (copiar do original, adaptar vars) |
| `src/features/hub/components/admin/ColorInput.tsx`               | Input de cor com preview                           |
| `src/features/hub/components/admin/SliderInput.tsx`              | Slider para valores numéricos                      |
| `src/features/hub/components/admin/EnvironmentEffectsEditor.tsx` | Editor de blobs/glass/grain                        |

### Integração no Admin

A rota `/hub/admin/config` deve ter 6 sub-abas:

1. **Identity** — nome do app, logo
2. **Themes** — ThemeEditorPanel (42 tokens + environment effects)
3. **Integrations** — chaves AI (Gemini, OpenAI, Groq, OpenRouter)
4. **Invites** — gerenciar convites
5. **Gamification** — gerenciar levels e badges
6. **Chatbot** — config do chatbot

---

## Ordem de Execução

1. `hub-theme.css` — Base de tudo (vars `--color-*` + `--env-*` + classes)
2. `badge-animations.css` — Animações de confetti/glow/shimmer
3. `GlobalEffects.tsx` — Background effects (blobs + grain)
4. `HubLayout.tsx` — Header glassmorphism
5. `HubSidebar.tsx` — Sidebar gamificada
6. `MaterialCard.tsx` — Cards com glassmorphism
7. `CollectionCard.tsx` — Cards de trilhas
8. `HubDashboardPage.tsx` — Layout sidebar+main
9. `ThemeEditorPanel.tsx` — Editor de personalização visual
10. `HubAdminPage.tsx` — Aba Settings com 6 sub-abas
11. `index.ts` — Imports

## Verificação

```bash
npm run build  # Sem erros
npm run dev    # Verificar visual em /hub/*
```

Checklist visual:

- [ ] Background com blobs animados dourados
- [ ] Grain texture sutil
- [ ] Header com glassmorphism e gradiente
- [ ] Cards com backdrop-blur e hover animation
- [ ] Scrollbar dourada de 5px
- [ ] Icon boxes com fundo escuro e borda dourada
- [ ] Cores: accent #c9a655, bg #0f172a, surface #1e293b
- [ ] ThemeEditorPanel funcional com 42+ tokens
- [ ] Environment effects editor (blobs, glass, grain)
- [ ] Admin page com 6 sub-abas
- [ ] Preview em tempo real no ThemeEditor
