# Análise do Design System — Módulo CRM

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

O módulo **CRM** gerencia relacionamento com clientes e equipe comercial. É o segundo maior módulo do sistema em número de rotas (13). Utiliza tokens globais + shadcn/ui.

| Aspecto | Detalhe |
|---|---|
| **Tokens** | Globais `--color-*` |
| **Design Config** | `hasDesignConfig: true` — override via `ModuloDesignPage` em `/empresa/crm/design` |
| **CSS próprio** | Nenhum |
| **shadcn/ui** | Extensivo (Card, Button, Dialog, Table, Avatar, Badge, Tabs, Select, Input) |
| **Rotas** | 13 (dashboard, carteira, pipeline, tarefas, equipe, métricas, BI, etc.) |

---

## 2. Arquitetura

```
Preset → Global → Empresa → Módulo Override (crm)
                                    ↓
              Todas as 13 rotas usam tokens globais + shadcn/ui
```

### Arquivos-Chave

| Arquivo | Função |
|---|---|
| `src/routes/empresa.crm-design.tsx` | Design config via `ModuloDesignPage` |
| `src/routes/crm.design.tsx` | Redirect para `/empresa/crm/design` |
| `src/features/crm/components/` | Componentes do CRM |

---

## 3. Tokens CSS Utilizados

### Tokens Globais

| Token | Uso |
|---|---|
| `--color-bg` | Fundo da página |
| `--color-surface` | Cards, containers |
| `--color-surface-hover` | Hover de linhas |
| `--color-text-main` | Nomes, valores |
| `--color-text-muted` | Descrições, metadados |
| `--color-border` | Bordas |
| `--color-accent` | Destaques, badges |
| `--color-accent-hover` | Hover de ações |
| `--color-success` | Cliente ativo |
| `--color-warning` | Pendente |
| `--color-error` | Inativo |
| `--radius-lg`, `--radius-xl` | Bordas |
| `--shadow-md`, `--shadow-lg` | Elevação |

### shadcn/ui Components (estimado)

| Componente | Uso Provável |
|---|---|
| `Card`, `CardHeader`, `CardContent`, `CardTitle` | KPIs do dashboard, cards de cliente |
| `Button` | Ações CRUD |
| `Dialog`, `DialogContent` | Detalhes de cliente |
| `Table` | Listas de clientes |
| `Avatar` | Fotos de perfil |
| `Badge` | Status (ativo/inativo) |
| `Tabs` | Navegação interna (detalhes) |
| `Select`, `Input` | Filtros |

---

## 4. Componentes e Padrões

- **Dashboard**: KPIs com shadcn/ui Card, gráficos (recharts)
- **Carteira**: Tabela de clientes com filtros e busca
- **Pipeline**: Kanban com colunas arrastáveis
- **Tarefas**: Lista de tarefas com checkboxes
- **Equipe**: Cards de membros com Avatar
- **Detalhe do Cliente**: Modal/Dialog com abas

---

## 5. Personalização Disponível

### ModuloDesignPage (4 tokens)
- `colors.accent`, `colors.surface`, `colors.bg`, `colors.border`

---

## 6. O Que Não É Personalizável

- **Layout do Kanban**: Estrutura de colunas fixa
- **Hierarquia de equipe**: Visualização de árvore fixa
- **Tabela de clientes**: Colunas e ordenação

---

## 7. Divergências

1. **Maior módulo sem CSS próprio**: 13 rotas e nenhum arquivo CSS específico — 100% dependente de tokens globais
2. **13 rotas mas apenas 1 design config**: Override visual único para todo o módulo
3. **Pipeline duplicado**: CRM tem pipeline próprio mas Funis é módulo separado — possível overlap visual
4. **Sem tokens de componente**: `--comp-card-*`, `--comp-btn-*` não utilizados
