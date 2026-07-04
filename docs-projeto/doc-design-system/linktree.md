# Análise do Design System — Módulo LinkTree

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

O módulo **LinkTree** possui **2 submódulos independentes** com abordagens de design distintas:

| Submódulo | Público-Alvo | Design System |
|---|---|---|
| **Colaboradores** | Colaboradores individuais (cartão digital + QR Code) | Tokens globais apenas |
| **Empresa Bio Instagram** | Página institucional da empresa | Tokens globais + tema rico em JSONB |

| Aspecto | Detalhe |
|---|---|
| **Tokens** | Globais `--color-*` |
| **Design Config** | `hasDesignConfig: true` — override via `ModuloDesignPage` em `/empresa/linktree/design` |
| **CSS próprio** | Nenhum arquivo CSS específico do módulo |
| **shadcn/ui** | Dialog, Button, Input, Select, Card |
| **Personalização** | Override de 4 tokens + tema via `linktree_tema_config` (60+ propriedades JSONB) |

---

## 2. Arquitetura

```
Preset → Global → Empresa → Módulo Override (linktree)
                                    ↓
                          Dashboard/CRUD usa tokens globais

Página Pública (Colaborador):
linktree_tema_config (JSONB) → Inline styles no card digital

Página Bio Instagram:
linktree_empresa_config (JSONB) → Tema com 60+ props
```

### Arquivos-Chave

| Arquivo | Função |
|---|---|
| `src/routes/empresa.linktree-design.tsx` | Design config via `ModuloDesignPage` |
| `src/routes/linktree.design.tsx` | Redirect para `/empresa/linktree/design` |
| `src/features/linktree/components/` | Componentes do módulo |

---

## 3. Tokens CSS Utilizados

### Tokens Globais

| Token | Uso |
|---|---|
| `--color-bg` | Fundo da página admin |
| `--color-surface` | Cards, containers de lista |
| `--color-text-main` | Nomes, títulos |
| `--color-text-muted` | Descrições, metadados |
| `--color-border` | Bordas de cards e tabelas |
| `--color-accent` | Links, badges, ações principais |
| `--color-accent-hover` | Hover de botões |
| `--radius-xl` | Cards arredondados |
| `--shadow-lg` | Cards |

### shadcn/ui Components

| Componente | Uso Provável |
|---|---|
| `Card`, `CardHeader`, `CardContent` | Listas de colaboradores |
| `Button` | Ações CRUD |
| `Dialog` | Modais de criação/edição |
| `AlertDialog` | Confirmação de exclusão |

---

## 4. Componentes e Padrões

- **ColaboradorCard**: Card com avatar, nome, status, links
- **LinktreeCard**: Preview do cartão digital
- **Tema Editor**: Formulário de configuração visual
- Tabela de colaboradores com badges de status

---

## 5. Personalização Disponível

### ModuloDesignPage (4 tokens)
- `colors.accent`, `colors.surface`, `colors.bg`, `colors.border`

### Tema do Colaborador (JSONB)
- Aproximadamente 60 propriedades no `linktree_tema_config`
- Cores, fontes, layout, efeitos visuais

### Tema da Empresa Bio (JSONB)
- Configuração separada em `linktree_empresa_config`
- Suporte a múltiplas seções e links

---

## 6. O Que Não É Personalizável

- **Estrutura dos cards de colaborador**: Layout fixo
- **Componentes de QR Code**: Renderização fixa
- **Animações de transição**: Padrão do shadcn/ui

---

## 7. Divergências

1. **Design config apenas no nível módulo**: Não há página de design específica dentro da rota `/linktree/*`
2. **Tema do colaborador desacoplado**: Tema JSONB do colaborador não segue tokens do design system
3. **Sem CSS modular**: Diferente de NPS e Hub, não há arquivo CSS específico
