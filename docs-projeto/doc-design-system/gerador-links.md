# Análise do Design System — Módulo Gerador de Links

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

O módulo **Gerador de Links** (exibido como "Links" no frontend) é um módulo utilitário **sem design config próprio**.

| Aspecto | Detalhe |
|---|---|
| **Tokens** | Apenas globais `--color-*` |
| **Design Config** | `hasDesignConfig: false` — sem override de módulo |
| **CSS próprio** | Nenhum |
| **shadcn/ui** | Button, Input, Card, Select, Dialog |
| **Personalização** | Herda completamente da empresa/global |

---

## 2. Arquitetura

```
Preset → Global → Empresa
                    ↓
        Todas as rotas de links usam tokens resolvidos da empresa
```

### Rotas (9 tipos de link + dashboard)

| Rota | Funcionalidade |
|---|---|
| `/ferramentas/links` | Dashboard |
| `/ferramentas/links/whatsapp` | Gerador WhatsApp |
| `/ferramentas/links/utm` | Gerador UTM |
| `/ferramentas/links/google-review` | Google Review |
| `/ferramentas/links/maps` | Google Maps |
| `/ferramentas/links/waze` | Waze |
| `/ferramentas/links/qrcode` | QR Code |
| `/ferramentas/links/templates` | Templates salvos |
| `/ferramentas/links/historico` | Histórico de links |

---

## 3. Tokens CSS Utilizados

### Tokens Globais

| Token | Uso |
|---|---|
| `--color-bg` | Fundo da página |
| `--color-surface` | Cards de formulário |
| `--color-text-main` | Labels, valores |
| `--color-text-muted` | Descrições, placeholders |
| `--color-border` | Inputs, cards |
| `--color-accent` | Botão gerar, destaque |
| `--color-accent-fg` | Texto em botão accent |
| `--radius-lg`, `--radius-xl` | Bordas de inputs, cards |
| `--color-success` | Indicação de link gerado |
| `--color-input-bg` | Fundo de inputs |

### shadcn/ui Components

Provavelmente usa: `Button`, `Input`, `Card`, `Label`, `Select`, `Dialog`, `Tabs`

---

## 4. Componentes e Padrões

- Formulário de geração de link com preview
- Cards por tipo de link (WhatsApp, UTM, etc.)
- Dashboard com contagem de links criados/cliques
- Tabela de histórico com badges de tipo
- QR Code viewer

---

## 5. Personalização Disponível

- **Nenhuma específica do módulo**
- Herda cores da empresa via design system global
- Override possível apenas no nível empresa ou global

---

## 6. O Que Não É Personalizável

- **Nada além do tema global**: Módulo não expõe tokens próprios
- Layout dos formulários de geração
- Preview de links

---

## 7. Divergências

1. **Sem `hasDesignConfig`**: Não tem página de design config — único módulo funcional com esta omissão (junto com Marketing)
2. **Sem permissões de UI**: Não tem `hasCredentialScopes` nem `events`
3. **Dependência total do tema global**: Qualquer customização visual precisa ser no nível empresa
