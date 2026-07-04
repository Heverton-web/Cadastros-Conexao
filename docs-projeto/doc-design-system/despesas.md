# Análise do Design System — Módulo Despesas

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

O módulo **Despesas em Rota** gerencia lançamento, aprovação e reembolso de despesas. Utiliza tokens globais + shadcn/ui + PageHeader.

| Aspecto | Detalhe |
|---|---|
| **Tokens** | Globais `--color-*` |
| **Design Config** | `hasDesignConfig: true` — override via `ModuloDesignPage` em `/empresa/despesas/design` |
| **CSS próprio** | Nenhum |
| **shadcn/ui** | Button, Card, Dialog, Badge |
| **Componente próprio** | `PageHeader`, `DespesaStatusBadge`, `EnvioStatusBadge`, `ComprovanteViewer` |

---

## 2. Arquitetura

```
Preset → Global → Empresa → Módulo Override (despesas)
                                    ↓
                        PageHeader + shadcn/ui + classes Tailwind
```

### Arquivos-Chave

| Arquivo | Função |
|---|---|
| `src/routes/empresa.despesas-design.tsx` | Design config via `ModuloDesignPage` |
| `src/features/despesas/components/colaborador/MinhasDespesasPage.tsx` | Página principal |
| `src/features/despesas/components/shared/StatusBadge.tsx` | Badges de status |
| `src/features/despesas/components/shared/ComprovanteViewer.tsx` | Visualizador de comprovante |

---

## 3. Tokens CSS Utilizados

### Tokens Globais

| Token | Uso |
|---|---|
| `--color-bg` | Fundo da página |
| `--color-card` | Cards de despesas/envios |
| `--color-surface-hover` | Hover de linhas |
| `--color-text-main` | Valores, títulos |
| `--color-text-muted` | Labels, metadados |
| `--color-border` | Bordas de cards e tabela |
| `--color-accent` | Ícones de ação, botão primário |
| `--color-accent-hover` | Hover de botão |
| `--color-accent-fg` | Texto em botão accent |
| `--color-error` | Badge de reprovado |
| `--radius-xl` | Cards arredondados |
| `--radius-lg` | Inputs |

### shadcn/ui Components

| Componente | Uso |
|---|---|
| `Button` | Nova Despesa, Enviar |
| `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` | Detalhes da despesa |

---

## 4. Componentes e Padrões

### MinhasDespesasPage
- **PageHeader**: Título + descrição + ícone
- **Ações**: Botões "Nova Despesa" e "Enviar (X)"
- **Envios**: Cards em grid com valor total e status
- **Lista Mobile**: Cards individuais com tipo, data, valor, badge de status
- **Tabela Desktop**: `<table>` com th, tr, td estilizados
- **Dialog**: Detalhes da despesa com grid de 2 colunas

### Padrões de Estilo
```tsx
// Cards de envio/despesa
className="rounded-xl bg-card border border-border px-3 py-2.5 md:px-4 md:py-3"
// Tabela
className="border border-border rounded-xl overflow-hidden"
// Header da tabela
className="border-b border-border bg-surface-hover/30"
// Linhas da tabela
className="border-b border-border/50 last:border-0 hover:bg-surface-hover/20 transition-colors cursor-pointer"
```

### Status Badges
- Cores por status: rascunho=cinza, enviado=azul, aprovado=verde, reprovado=vermelho, pago=roxo

---

## 5. Personalização Disponível

### ModuloDesignPage (4 tokens)
- `colors.accent`, `colors.surface`, `colors.bg`, `colors.border`

---

## 6. O Que Não É Personalizável

- **PageHeader**: Estrutura fixa do componente
- **StatusBadge**: Cores mapeadas por status fixas
- **Layout responsivo**: Quebras `md:` fixas
- **Tabela vs Cards**: Alternância mobile/desktop fixa

---

## 7. Divergências

1. **PageHeader**: Único módulo que usa este componente —padrão que poderia ser reutilizado
2. **Tabela HTML pura**: Usa `<table>` nativo em vez de shadcn/ui Table — consistente com o padrão do projeto
3. **Padding responsivo manual**: `px-3 py-2.5 md:px-4 md:py-3` em vez de usar tokens de spacing
4. **Sem EmptyState component**: Usa `<div>` com texto simples em vez do componente `EmptyState`
