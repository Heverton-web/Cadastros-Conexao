# Análise do Design System — Módulo NPS

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura do Design System](#2-arquitetura-do-design-system)
3. [Tokens CSS — Mapeamento Completo](#3-tokens-css--mapeamento-completo)
4. [Tokens Exclusivos do NPS](#4-tokens-exclusivos-do-nps)
5. [Como os Tokens São Aplicados](#5-como-os-tokens-são-aplicados)
6. [Componentes e Padrões de Estilo](#6-componentes-e-padrões-de-estilo)
7. [Personalização Disponível](#7-personalização-disponível)
8. [O Que Não É Personalizável](#8-o-que-não-é-personalizável)
9. [Divergências e Anomalias](#9-divergências-e-anomalias)
10. [Recomendações](#10-recomendações)

---

## 1. Visão Geral

O módulo **NPS** possui um sistema de design **híbrido**:

- **Dashboard/Admin**: Usa tokens globais do design system (`--color-*`, Tailwind CSS) + shadcn/ui
- **Survey/Página Pública**: Usa sistema próprio de CSS variables (`--nps-*`) com 58 tokens específicos
- **Design Config**: Suporta override via `ModuloDesignPage` em `/empresa/nps/design` (`hasDesignConfig: true`)

| Aspecto | Dashboard Admin | Survey Público |
|---|---|---|
| **Tokens** | Globais `--color-*` | Exclusivos `--nps-*` |
| **Tema** | Herdado da empresa | Configurável por empresa no `theme.nps_survey` |
| **RLS de tema** | N/A | Lido de `empresas_config.theme.nps_survey` (JSONB) |
| **Personalização** | Via ModuloDesignPage | 58 propriedades + background com blobs |
| **Bordas** | Normais | Classe `.nps-no-borders` pode remover todas |

---

## 2. Arquitetura do Design System

### Pipeline de Tema

```
Preset (dark-gold) → Global Override → Empresa Override → Módulo Override (ModuloDesignPage)
                                                              ↓
                                                    Dashboard NPS usa tokens resolvidos
                                                    
Survey Público (fora do escopo do dash):
empresas_config.theme.nps_survey (JSONB) → getNpsThemeVars() → CSS vars --nps-* injetadas no DOM
```

### Arquivos-Chave

| Arquivo | Função |
|---|---|
| `src/features/nps/theme.ts` | Definição de 58+ defaults + funções `getNpsThemeVars()`, `getNpsBackgroundStyle()`, helpers de blob/blur |
| `src/features/nps/NpsBackground.tsx` | Componente de fundo com blobs decorativos |
| `src/routes/empresa.nps-design.tsx` | Rota de design config via `ModuloDesignPage` |
| `src/routes/nps.design.tsx` | Redirect para `/empresa/nps/design` |

---

## 3. Tokens CSS — Mapeamento Completo

### 3.1 Tokens Globais Utilizados (Dashboard NPS)

O dashboard NPS usa extensivamente tokens globais do design system:

| Token CSS | Onde é usado |
|---|---|
| `--color-bg` | Fundo da página (`bg-bg`, `bg-[var(--color-bg)]`) |
| `--color-surface` | Cards, containers (`bg-surface`, `bg-[var(--color-surface)]`) |
| `--color-surface-hover` | Hover de elementos (`hover:bg-surface-hover`) |
| `--color-card` | Cards de conteúdo |
| `--color-text-main` | Texto principal (`text-text-main`) |
| `--color-text-muted` | Texto secundário (`text-text-muted`) |
| `--color-border` | Bordas (`border-border`, `border-[var(--color-border)]`) |
| `--color-accent` | Cor de destaque (`text-accent`, `bg-accent`, `border-accent/20`) |
| `--color-accent-hover` | Hover de botões (`hover:bg-accent-hover`) |
| `--color-accent-fg` | Texto em botões accent (`text-accent-fg`) |
| `--color-success` | Verde para promotores NPS (`text-green-400`, `bg-green-500/15`) |
| `--color-warning` | Amarelo para neutros (`text-yellow-400`, `bg-yellow-500/15`) |
| `--color-error` | Vermelho para detratores (`text-red-400`, `bg-red-500/15`) |
| `--radius-xl` | Bordas arredondadas (`rounded-xl`) |
| `--radius-lg` | Bordas de cards (`rounded-lg`) |

### 3.2 shadcn/ui Components Usados

| Componente | Uso |
|---|---|
| `Card`, `CardHeader`, `CardContent`, `CardTitle` | KPIs, gráficos, seções |
| `Button` | Ações (Atualizar, Exportar, Excluir) |
| `Input` | Filtros de data, busca |
| `Label` | Rótulos de formulário |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | Filtros (vendedor, NPS, empresa) |
| `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` | Detalhes da resposta |
| `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription` | Confirmação de exclusão |

---

## 4. Tokens Exclusivos do NPS

### 4.1 Prefixo `--nps-*`

58 tokens injetados via `getNpsThemeVars()` para a survey pública:

#### Cores Principais (6)
| Token | Exemplo | Propósito |
|---|---|---|
| `--nps-accent` | `#C5A880` | Cor de destaque da survey |
| `--nps-accent-hover` | `#b0946d` | Hover do accent |
| `--nps-bg` | `#09090b` | Fundo da página |
| `--nps-surface` | `#18181b` | Superfície/card |
| `--nps-text` | `#fafafa` | Texto principal |
| `--nps-text-muted` | `#71717a` | Texto secundário |

#### Variações Alpha (5)
| Token | Exemplo |
|---|---|
| `--nps-accent-10` | `rgba(197,168,128,0.1)` |
| `--nps-accent-20` | `rgba(197,168,128,0.2)` |
| `--nps-accent-5` | `rgba(197,168,128,0.05)` |
| `--nps-surface-50` | `rgba(24,24,27,0.5)` |
| `--nps-bg-50` | `rgba(9,9,11,0.5)` |

#### Survey Detalhados (47)
Grupos de tokens (prefixo `--nps-` + kebab-case):

| Grupo | Tokens | Qtde |
|---|---|---|
| Fundo e Card | `survey-bg`, `survey-accent`, `survey-accent-hover`, `survey-glow`, `card-bg`, `card-border` | 6 |
| Cabeçalho | `header-logo-text`, `header-divider` | 2 |
| Textos | `step-text`, `question-text` | 2 |
| Botões NPS (0–10) | `nps-btn-bg`, `nps-btn-text`, `nps-btn-hover-bg`, `nps-btn-hover-text`, `nps-btn-selected-bg`, `nps-btn-selected-text` | 6 |
| Opções | `option-bg`, `option-border`, `option-hover-border`, `option-selected-bg`, `option-selected-border`, `option-text`, `option-text-selected`, `option-hover-text`, `radio-border`, `radio-hover-border`, `radio-selected` | 11 |
| Input | `input-bg`, `input-border`, `input-focus-border`, `input-text`, `input-placeholder` | 5 |
| Footer/Navegação | `divider-footer`, `btn-back-text`, `btn-back-hover-bg`, `btn-next-bg`, `btn-next-hover`, `btn-next-text` | 6 |
| Conclusão | `complete-icon-bg`, `complete-icon-border`, `complete-icon-color`, `complete-title`, `complete-subtitle` | 5 |
| Modal | `modal-overlay`, `modal-bg`, `modal-border`, `modal-icon-bg`, `modal-icon-border`, `modal-icon-color`, `modal-title`, `modal-subtitle`, `modal-btn-bg`, `modal-btn-hover`, `modal-btn-text` | 11 |

### 4.2 Background Config

Propriedades de fundo (não são CSS vars, são lidas do JSONB):

| Propriedade | Tipo | Default |
|---|---|---|
| `bg_type` | `solid` / `gradient-2` / `gradient-3` | `solid` |
| `bg_color` | hex | `#09090b` |
| `bg_gradient_1` | hex | `#0c162c` |
| `bg_gradient_2` | hex | `#192539` |
| `bg_gradient_3` | hex | `#0c162c` |
| `bg_gradient_angle` | number | `180` |
| `bg_blobs_enabled` | boolean string | `true` |
| `bg_blobs` | JSON string | Array de blobs |

---

## 5. Como os Tokens São Aplicados

### Dashboard Admin

```tsx
// Tokens globais via Tailwind (classes utilitárias)
className="bg-surface border border-border rounded-xl"
className="text-text-main text-text-muted"
className="bg-accent hover:bg-accent-hover text-accent-fg"
className="border-accent/20 bg-accent/10"

// Cores de feedback fixas para NPS
className={
  score >= 9 ? "bg-green-500/15 text-green-400" :
  score >= 7 ? "bg-yellow-500/15 text-yellow-400" :
               "bg-red-500/15 text-red-400"
}
```

### Survey Público

As CSS vars são injetadas programaticamente via `getNpsThemeVars()` e usadas inline:

```tsx
style={{ backgroundColor: "var(--nps-bg)" }}
style={{ color: "var(--nps-text)" }}
```

---

## 6. Componentes e Padrões de Estilo

### 6.1 Dashboard

- **MetricCard**: KPI com gradiente `from-{cor}/20 via-{cor}/10 to-transparent`, ícone flutuante, valor grande, indicador de tendência
- **SectionNav**: Navegação por abas horizontal
- **DetectorAlerts**: Alerta crítico em vermelho para detratores
- **Tabela de Respostas**: Linhas com hover `hover:bg-accent/10`, badges de score com cor por categoria
- **Filtros**: Grid responsivo `grid-cols-1 sm:grid-cols-3 md:flex`, inputs com Label
- **Gráficos Recharts**: Tooltip com fundo `--color-surface` e borda `--color-border`

### 6.2 Survey

- **NpsBackground**: Container com blobs decorativos (bolhas com blur radial)
- Botões NPS 0–10 com estados normal, hover e selecionado
- Opções de múltipla escolha com rádio customizado
- Modal de alerta (survey abandonada)
- Tela de conclusão com ícone de check

---

## 7. Personalização Disponível

### Pelo Dashboard (ModuloDesignPage)
- Override de tokens no nível do módulo NPS
- 4 tokens expostos: `colors.accent`, `colors.surface`, `colors.bg`, `colors.border`

### Pela Config da Empresa (`theme.nps_survey`)
- 58 propriedades CSS da survey pública
- Background type (solid, gradient-2, gradient-3)
- Blobs decorativos (até 9 posições, cor, tamanho, opacidade customizáveis)
- `no_borders` flag
- `show_company_name`, `logo_height`, `header_align`

---

## 8. O Que Não É Personalizável

- **Estrutura HTML do dashboard**: Não há suporte a customização de layout
- **Componentes de gráfico**: Recharts com estilo inline fixo
- **Cores de feedback NPS**: Verde/amarelo/vermelho fixos para promotor/neutro/detrator
- **Animações**: `animate-fade-in`, `animate-in fade-in slide-in-from-top-2` fixas
- **Responsividade**: Quebras `md:` fixas no código

---

## 9. Divergências e Anomalias

1. **Sistema dual de tema**: Dashboard usa tokens globais, survey usa sistema `--nps-*` isolado — sem fallback entre eles
2. **`--nps-*` tokens não seguem design system global**: Cores como `survey_accent: #C5A880` diferem do `--color-accent: #c9a655`
3. **Classe `.nps-no-borders`**: Remove bordas via CSS global, afetando todos os elementos dentro do container — abordagem agressiva
4. **Blobs com hardcoded filter: blur(60px)**: Não configurável
5. **Tooltips mockados**: `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` são implementações vazias — tooltips não funcionam no dashboard
6. **Cores de feedback hardcoded**: `text-green-400`, `text-yellow-400`, `text-red-400` fixas em vez de usar tokens

---

## 10. Recomendações

1. **Unificar sistema de tema**: Survey deveria herdar do design system global com fallback
2. **Migrar survey para tokens globais**: Usar `--color-accent` em vez de `--nps-accent` separado
3. **Remover `.nps-no-borders`**: Usar tokens `--color-border: transparent` no nível do módulo
4. **Implementar Tooltips**: Substituir mocks por implementação real de shadcn/ui Tooltip
5. **Tokenizar cores de feedback**: Criar tokens `--color-promoter`, `--color-passive`, `--color-detractor`
6. **Documentar gap de versões**: `--nps-` tokens vs CSS vars do design system global
