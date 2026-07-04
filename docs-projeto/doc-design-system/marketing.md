# Análise do Design System — Módulo Marketing

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura](#2-arquitetura)
3. [Tokens CSS Utilizados](#3-tokens-css-utilizados)
4. [Submódulos e Padrões](#4-submódulos-e-padrões)
5. [Personalização Disponível](#5-personalização-disponível)
6. [O Que Não É Personalizável](#6-o-que-não-é-personalizável)
7. [Divergências e Anomalias](#7-divergências-e-anomalias)

---

## 1. Visão Geral

O módulo **Marketing** é o maior módulo em número de rotas (20) e submódulos (13). **Não tem suporte a design config próprio** e é o único módulo grande sem permissões registradas.

| Aspecto | Detalhe |
|---|---|
| **Tokens** | Apenas globais `--color-*` |
| **Design Config** | `hasDesignConfig: false` — SEM override de módulo |
| **CSS próprio** | Nenhum (arquivos do file-picker não existem) |
| **shadcn/ui** | Extensivo |
| **Submódulos** | 13 (dashboard, email, meta-ads, landing-pages, leads, etc.) |
| **Permissões** | Nenhuma registrada |

---

## 2. Arquitetura

```
Preset → Global → Empresa
                    ↓
     Todos os 13 submódulos usam tokens globais resolvidos
     Nenhum override de módulo disponível
```

### Submódulos

| Submódulo | Rotas |
|---|---|
| Dashboard | `/marketing/dashboard` |
| Landing Pages | `/marketing/landing-pages` |
| E-mail Marketing | `/marketing/email`, `/marketing/email/analytics`, `/marketing/email/campanha` |
| Meta Ads (BM) | `/marketing/meta-bm`, `/marketing/meta-bm/campanhas`, `/marketing/meta-bm/posts` |
| LinkTree Marketing | `/marketing/linktree`, `/marketing/linktree/design`, `/marketing/linktree/editor`, `/marketing/linktree/tema` |
| Calendário Editorial | `/marketing/calendario` |
| Criativos | `/marketing/criativos` |
| Pixels | `/marketing/pixels` |
| SEO | `/marketing/seo` |
| UTMs | `/marketing/utms` |
| WhatsApp | `/marketing/whatsapp` |
| Leads | `/marketing/leads`, `/marketing/leads/$id` |

---

## 3. Tokens CSS Utilizados

Apenas tokens globais do design system:

| Token | Uso Provável |
|---|---|
| `--color-bg` | Fundo da página |
| `--color-surface` | Cards e containers |
| `--color-surface-hover` | Hover de elementos |
| `--color-text-main` | Títulos, labels |
| `--color-text-muted` | Descrições |
| `--color-border` | Bordas de cards, inputs |
| `--color-accent` | Botões primários, links |
| `--color-accent-fg` | Texto em botões |
| `--color-success` | Campanha ativa |
| `--color-warning` | Campanha pausada |
| `--color-error` | Erro |
| `--radius-xl`, `--radius-lg` | Bordas arredondadas |

---

## 4. Submódulos e Padrões

- **Dashboard**: KPIs (campanhas, leads, cliques) com Card shadcn/ui
- **Email Marketing**: Lista de campanhas, analytics com gráficos
- **Meta Ads**: Contas, campanhas, posts com preview
- **Landing Pages**: Cards de preview com métricas
- **Leads**: Tabela com status e ações
- **Calendário**: Grid mensal/semanal com cards de conteúdo
- **Criativos**: Galeria de imagens com upload

---

## 5. Personalização Disponível

- **Nenhuma específica do módulo**: `hasDesignConfig: false`
- Herda completamente da empresa/global
- Único caminho: override no nível empresa

---

## 6. O Que Não É Personalizável

- **Tudo**: Módulo não expõe nenhum token próprio
- Layout de cada submódulo
- Cores de status de campanha

---

## 7. Divergências e Anomalias

1. **Único módulo grande sem `hasDesignConfig`**: Marketing é o maior módulo em rotas (20) mas não suporta override visual — diferentemente de módulos menores como Rotas (4 rotas)
2. **Sem permissões**: `permissions: []` — qualquer usuário autenticado consegue acessar
3. **Sem `hasCredentialScopes`**: Não há suporte a credenciais por escopo
4. **Sem eventos**: `events: []` — sem webhooks
5. **Submódulo LinkTree dentro do Marketing**: Duplicação com o módulo LinkTree independente — conflito de responsabilidade
