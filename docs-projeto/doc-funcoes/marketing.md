# Análise das Funções — Módulo Marketing

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções por Submódulo](#2-funções-por-submódulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **Marketing** é o maior módulo em número de rotas (20) e submódulos (13). Cada submódulo é independente com seu próprio sistema de permissões. **O módulo principal não tem permissões próprias** — as permissões estão nos submódulos.

| Aspecto | Detalhe |
|---|---|
| **Key** | `marketing` |
| **Descrição** | Módulo de Marketing Digital |
| **Ambientes** | cadastro, tecnologia |
| **Permissões** | Distribuídas nos submódulos |
| **Eventos** | Nenhum |
| **Rotas** | 20 páginas |
| **Design Config** | ❌ Nenhum submódulo tem |

---

## 2. Funções por Submódulo

### 2.1 Função: Dashboard Marketing

**Rota**: `/marketing/dashboard`
**Permissão**: `mktg_dashboard_ver`

KPIs gerais de marketing: campanhas ativas, leads gerados, cliques, taxa de conversão.

---

### 2.2 Função: Landing Pages

**Rota**: `/marketing/landing-pages`
**Permissão**: `mktg_lp_ver`

CRUD de landing pages com versionamento e preview.

---

### 2.3 Função: E-mail Marketing

**Rotas**: `/marketing/email`, `/marketing/email/analytics`, `/marketing/email/campanha`
**Permissão**: `mktg_email_ver`

Campanhas de e-mail marketing com analytics (abertura, cliques, conversão).

---

### 2.4 Função: Meta Ads (Business Manager)

**Rotas**: `/marketing/meta-bm`, `/marketing/meta-bm/campanhas`, `/marketing/meta-bm/posts`
**Permissões**: `mktg_meta_conectar`, `mktg_meta_ver_campanhas`, `mktg_meta_criar_posts`

Integração com Meta Business Manager. Gerenciar contas, campanhas e posts patrocinados.

---

### 2.5 Função: LinkTree Marketing

**Rotas**: `/marketing/linktree`, `/marketing/linktree/design`, `/marketing/linktree/editor`, `/marketing/linktree/tema`
**Permissão**: (função de linktree separada)

Submódulo de LinkTree dentro do Marketing (redundante com módulo LinkTree独立).

---

### 2.6 Função: Calendário Editorial

**Rota**: `/marketing/calendario`
**Permissão**: `mktg_cal_ver`

Calendário para agendamento de conteúdo.

---

### 2.7 Função: Criativos

**Rota**: `/marketing/criativos`
**Permissão**: `mktg_criativo_ver`

Galeria de criativos com upload e preview.

---

### 2.8 Função: Pixels

**Rota**: `/marketing/pixels`
**Permissão**: `mktg_pixel_ver`

Gerenciamento de pixels de rastreamento (Meta, Google Ads, etc.).

---

### 2.9 Função: SEO

**Rota**: `/marketing/seo`
**Permissão**: `mktg_seo_ver`

Ferramentas de SEO: análise de palavras-chave, sugestões de otimização.

---

### 2.10 Função: UTMs

**Rota**: `/marketing/utms`
**Permissão**: `mktg_utm_ver`

Gerenciamento de parâmetros UTM e templates.

---

### 2.11 Função: WhatsApp Marketing

**Rota**: `/marketing/whatsapp`
**Permissão**: `mktg_wpp_ver`

Campanhas de WhatsApp Marketing.

---

### 2.12 Função: Leads

**Rotas**: `/marketing/leads`, `/marketing/leads/$id`
**Permissão**: `mktg_lead_ver`

Gestão de leads capturados: lista com status, origem, detalhes.

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/marketing/module.ts` | Módulo principal (sem permissões) |
| `src/features/marketing/*/module.ts` | Submódulos com permissões individuais |
| `supabase/migrations/20260630100000_marketing_module.sql` | 14 tabelas `mktg_*` |
