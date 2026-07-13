# Análise do Design System — Módulo Funis

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

O módulo **Funis** (Kanban + Templates) é o maior módulo do sistema em número de arquivos (46 componentes). Utiliza tokens globais + shadcn/ui com extenso uso de Drag & Drop.

| Aspecto | Detalhe |
|---|---|
| **Tokens** | Globais `--color-*` |
| **Design Config** | `hasDesignConfig: true` — override via `ModuloDesignPage` em `/empresa/funis/design` |
| **CSS próprio** | Nenhum |
| **shadcn/ui** | Extensivo (Card, Button, Dialog, Badge, Avatar, Select, Input, Textarea, ScrollArea) |
| **Dependências** | @dnd-kit (Drag & Drop) |
| **Rotas** | 4 (dashboard, funil, templates, automations) |

---

## 2. Arquitetura

```
Preset → Global → Empresa → Módulo Override (funis)
                                    ↓
              Componentes Kanban usam tokens globais + dnd-kit
              shadcn/ui components estilizados com Tailwind
```

### Arquivos-Chave

| Arquivo | Função |
|---|---|
| `src/routes/empresa.funis-design.tsx` | Design config via `ModuloDesignPage` |
| `src/routes/funis.design.tsx` | Redirect para `/empresa/funis/design` |
| `src/features/funis/components/` | 46 componentes |

---

## 3. Tokens CSS Utilizados

### Tokens Globais

| Token | Uso |
|---|---|
| `--color-bg` | Fundo do board |
| `--color-surface` | Colunas do Kanban |
| `--color-card` | Cards de tarefa |
| `--color-surface-hover` | Hover de cards |
| `--color-text-main` | Títulos, descrições |
| `--color-text-muted` | Metadados, prazos |
| `--color-border` | Bordas de colunas e cards |
| `--color-accent` | Labels, badges, ícones |
| `--color-accent-hover` | Hover de ações |
| `--color-success` | Tarefa concluída |
| `--color-warning` | Tarefa em andamento |
| `--color-error` | Tarefa atrasada |
| `--radius-lg`, `--radius-xl` | Cards e modais |

---

## 4. Componentes e Padrões

### Kanban Board
- **Colunas**: `bg-surface` com scroll vertical
- **Cards de Tarefa**: `bg-card` com borda, hover sutil, sombra
- **Drag Handle**: Ícone de arrasto
- **Labels**: Badges coloridos por categoria
- **Avatar**: Atribuição a membros
- **Prazo**: Texto em vermelho se atrasado

### Dashboard
- KPIs com shadcn/ui Card
- Gráficos de distribuição

### Templates
- Cards de template com preview
- Modal de criação a partir de template

---

## 5. Personalização Disponível

### ModuloDesignPage (4 tokens)
- `colors.accent`, `colors.surface`, `colors.bg`, `colors.border`

---

## 6. O Que Não É Personalizável

- **Layout do Kanban**: Colunas em scroll horizontal fixo
- **Comportamento de Drag & Drop**: @dnd-kit com configuração fixa
- **Cores de label**: Mapa de cores para labels hardcoded
- **Animações de transição**: Transições de card entre colunas

---

## 7. Divergências

1. **Maior número de componentes (46)**: Nenhum tem CSS modular — 100% Tailwind + tokens globais
2. **Sem tokens de cor para labels**: Labels coloridas devem usar cores fixas em vez de tokens do tema
3. **Colunas com `max-h` fixo**: Altura máxima das colunas pode não se adaptar ao viewport
4. **Duplicação com CRM Pipeline**: Ambos têm conceito de pipeline/Kanban
