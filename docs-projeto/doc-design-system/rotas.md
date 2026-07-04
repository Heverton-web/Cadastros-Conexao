# Análise do Design System — Módulo Rotas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura](#2-arquitetura)
3. [Tokens CSS Utilizados](#3-tokens-css-utilizados)
4. [Componentes e Padrões](#4-componentes-e-padrões)
5. [Personalização Disponível](#5-personalização-disponível)
6. [O Que Não É Personalizável](#6-o-que-não-é-personalizável)
7. [Divergências](#7-divergências)

---

## 1. Visão Geral

O módulo **Rotas de Visitas** gerencia planejamento e execução de rotas. Utiliza shadcn/ui components + tokens globais do design system.

| Aspecto | Detalhe |
|---|---|
| **Tokens** | Globais `--color-*` |
| **Design Config** | `hasDesignConfig: true` — override via `ModuloDesignPage` em `/empresa/rotas/design` |
| **CSS próprio** | Nenhum |
| **shadcn/ui** | Card, Button, Badge, Input, Select |
| **Abordagem** | shadcn/ui + classes Tailwind utilitárias |

---

## 2. Arquitetura

```
Preset → Global → Empresa → Módulo Override (rotas)
                                    ↓
                        Componentes usam tokens globais
                        shadcn/ui components estilizados com Tailwind
```

### Arquivos-Chave

| Arquivo | Função |
|---|---|
| `src/routes/empresa.rotas-design.tsx` | Design config via `ModuloDesignPage` |
| `src/features/rotas/components/PlanejamentoRotasPage.tsx` | Página principal de rotas |
| `src/features/rotas/hooks/useRotas.ts` | Hook de dados |

---

## 3. Tokens CSS Utilizados

### Tokens Globais

| Token | Uso |
|---|---|
| `--color-bg` | Fundo |
| `--color-surface` | Cards |
| `--color-text-main` | Títulos, valores |
| `--color-text-muted` | Descrições, labels |
| `--color-border` | Bordas de cards |
| `--color-accent` / `--color-primary` | Badges de status, ícones |
| `--radius-xl`, `--radius-lg` | Bordas |

### shadcn/ui Components

| Componente | Uso |
|---|---|
| `Card`, `CardHeader`, `CardContent`, `CardTitle` | KPIs (total clientes, rotas planejadas, rotas hoje), cards de rota |
| `Button` | Nova Rota, Criar Rota |
| `Badge` | Status da rota |
| `Input` | Filtros |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | Filtro por status |

### Classes Tailwind

```tsx
// Padrão de cards
className="bg-surface border border-border rounded-xl"
// Padrão de hover
className="cursor-pointer hover:border-primary/50 transition-colors"
// Padding responsivo
className="p-4"
// Loading state
className="animate-pulse"
```

---

## 4. Componentes e Padrões

### PlanejamentoRotasPage
- **Header**: Título + descrição + botão "Nova Rota"
- **KPI Cards**: Grid `grid-cols-1 md:grid-cols-3` com shadcn/ui Card
- **Filtro Status**: Select com Filter icon
- **Lista de Rotas**: Grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` com cards clicáveis
- **Empty State**: Card com ícone centralizado + mensagem + CTA
- **NovaRotaModal**: Modal para criação

### Padrões de Status
```tsx
// Badges coloridos por status (definido em ROTA_STATUS_COLOR)
// provavelmente: planejada=blue, em_execucao=yellow, realizada=green, nao_realizada=red
```

---

## 5. Personalização Disponível

### ModuloDesignPage (4 tokens)
- `colors.accent`, `colors.surface`, `colors.bg`, `colors.border`

---

## 6. O Que Não É Personalizável

- **Estrutura dos cards KPI**: shadcn/ui Card com layout fixo
- **Cores de status**: Mapeamento `ROTA_STATUS_COLOR` fixo
- **Animação de loading**: `animate-pulse` fixo

---

## 7. Divergências

1. **shadcn/ui puro**: Diferente de módulos como Cadastros e Mapas que usam gradientes e ícones flutuantes, Rotas usa shadcn/ui Card padrão sem adornos visuais elaborados
2. **Sem tokens de componente**: `--comp-card-*` não são usados — estilização via Tailwind direto
3. **Cores de status não tokenizadas**: Cores de badge (`ROTA_STATUS_COLOR`) são hardcoded em vez de usar variáveis CSS
