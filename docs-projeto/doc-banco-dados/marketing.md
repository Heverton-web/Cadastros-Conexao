# Análise do Banco de Dados — Módulo Marketing

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabelas do Submódulo Tracking e Eventos](#2-tabelas-do-submódulo-tracking-e-eventos)
3. [Tabelas de Landing Pages](#3-tabelas-de-landing-pages)
4. [Tabelas de Meta Ads (Facebook/Instagram)](#4-tabelas-de-meta-ads)
5. [Tabelas de Email Marketing](#5-tabelas-de-email-marketing)
6. [Tabelas de Conteúdo e Calendário](#6-tabelas-de-conteúdo-e-calendário)
7. [Tabelas de Leads e Pixels](#7-tabelas-de-leads-e-pixels)
8. [RLS Policies](#8-rls-policies)
9. [Rotas do Frontend](#9-rotas-do-frontend)
10. [Migrações Relacionadas](#10-migrações-relacionadas)
11. [Diagrama de Relacionamentos](#11-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Marketing** é o **maior módulo do ERP Conexão em número de tabelas** (14 tabelas). Ele oferece um conjunto completo de ferramentas de marketing digital:

- **Landing Pages**: criação e versionamento
- **Meta Ads (Facebook/Instagram)**: conexão de contas, campanhas, posts e insights
- **Email Marketing**: campanhas com disparo e tracking
- **UTMs**: gerenciamento de links com parâmetros
- **Criativos**: galeria de peças (imagem, vídeo, carrossel)
- **Calendário Editorial**: planejamento de conteúdo
- **Leads**: captura e qualificação
- **Pixels**: configuração de tracking
- **Eventos**: tracking central de eventos

**Características da Arquitetura:**

- **14 tabelas** com prefixo `mktg_*`, a maior quantidade do sistema
- **Todos os dados por empresa**: `empresa_id` obrigatório em todas as tabelas
- **RLS uniforme**: todas seguem o padrão `is_super_admin_session()` OR `empresa_id = get_current_empresa_id()`
- **Triggers `update_updated_at_column()`**: 9 triggers de updated_at
- **Integração com APIs externas**: Meta Ads, disparo de email
- **Frontend modular**: 20+ submódulos independentes (dashboard, landing-pages, meta-bm, email-marketing, etc.)
- **58 arquivos frontend**: o módulo com a maior estrutura de componentes

---

## 2. Tabelas do Submódulo Tracking e Eventos

### 2.1 `mktg_eventos` — Eventos de Tracking

Tabela central de tracking de eventos de usuários (visualizações, cliques, scroll, etc.).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `modulo` | `text NOT NULL` | Módulo de origem |
| `tipo` | `text NOT NULL` | Tipo: `'visualizacao'`, `'clique'`, `'scroll'`, `'conversao'`, `'form_submit'`, `'permanencia'` |
| `metadata` | `jsonb` | Metadados adicionais |
| `page_url` | `text` | URL da página |
| `user_id` | `uuid` | ID do usuário (opcional) |
| `session_id` | `text` | ID da sessão |
| `created_at` | `timestamptz` | Data de criação |

**Índices:** `empresa_id`, `tipo`, `created_at`

---

## 3. Tabelas de Landing Pages

### 3.1 `mktg_landing_pages` — Landing Pages

Páginas de destino criadas no sistema.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `titulo` | `text NOT NULL` | Título |
| `slug` | `text NOT NULL` | Slug para URL |
| `status` | `text NOT NULL DEFAULT 'rascunho'` | Status: `'rascunho'`, `'publicado'`, `'arquivado'` |
| `conteudo` | `jsonb NOT NULL` | Conteúdo estruturado da página |
| `versao_atual` | `integer NOT NULL DEFAULT 1` | Versão atual |
| `template` | `text` | Template base |
| `publicado_em` | `timestamptz` | Data de publicação |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `slug`, `status`

---

### 3.2 `mktg_landing_pages_versoes` — Versões de Landing Pages

Histórico de versões do conteúdo das landing pages.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `landing_page_id` | `uuid FK → mktg_landing_pages.id ON DELETE CASCADE` | Landing page |
| `versao` | `integer NOT NULL` | Número da versão |
| `conteudo` | `jsonb NOT NULL` | Conteúdo naquela versão |
| `criado_por` | `uuid` | Quem criou |
| `created_at` | `timestamptz` | Data de criação |

**Índice:** `landing_page_id`

---

## 4. Tabelas de Meta Ads (Facebook/Instagram)

### 4.1 `mktg_meta_contas` — Contas do Meta

Conexão com contas do Meta Business (Facebook/Instagram).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `meta_user_id` | `text NOT NULL` | ID do usuário Meta |
| `meta_page_id` | `text` | ID da página |
| `meta_ad_account_id` | `text` | ID da conta de anúncios |
| `access_token` | `text NOT NULL` | Token de acesso |
| `token_expires_at` | `timestamptz NOT NULL` | Data de expiração do token |
| `status` | `text NOT NULL DEFAULT 'desconectado'` | Status: `'conectado'`, `'expirado'`, `'desconectado'` |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índice:** `empresa_id`

---

### 4.2 `mktg_meta_campanhas` — Campanhas Meta

Campanhas de anúncios sincronizadas do Meta Ads.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `meta_campanha_id` | `text NOT NULL` | ID da campanha no Meta |
| `nome` | `text NOT NULL` | Nome da campanha |
| `status` | `text NOT NULL DEFAULT 'ACTIVE'` | Status: `'ACTIVE'`, `'PAUSED'`, `'DELETED'`, `'ARCHIVED'`, `'IN_MODERATION'` |
| `orcamento_diario` | `numeric(12,2)` | Orçamento diário |
| `orcamento_total` | `numeric(12,2)` | Orçamento total |
| `plataforma` | `text NOT NULL DEFAULT 'both'` | Plataforma: `'facebook'`, `'instagram'`, `'both'` |
| `data_inicio` | `date NOT NULL` | Data de início |
| `data_fim` | `date` | Data de fim |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `status`

---

### 4.3 `mktg_meta_posts` — Posts Meta

Posts criados e/ou sincronizados do Meta.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `meta_post_id` | `text` | ID do post no Meta |
| `conteudo` | `text NOT NULL` | Conteúdo do post |
| `midia_url` | `text` | URL da mídia |
| `plataforma` | `text NOT NULL DEFAULT 'both'` | `'facebook'`, `'instagram'`, `'both'` |
| `status` | `text NOT NULL DEFAULT 'rascunho'` | Status: `'rascunho'`, `'agendado'`, `'publicado'`, `'erro'` |
| `agendado_para` | `timestamptz` | Data agendada |
| `publicado_em` | `timestamptz` | Data de publicação |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `status`

---

### 4.4 `mktg_meta_insights` — Insights de Campanhas

Métricas de desempenho das campanhas, coletadas diariamente.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `campanha_id` | `uuid FK → mktg_meta_campanhas.id ON DELETE CASCADE NOT NULL` | Campanha |
| `impressoes` | `integer NOT NULL` | Impressões |
| `cliques` | `integer NOT NULL` | Cliques |
| `ctr` | `numeric(5,2)` | CTR (Click Through Rate) |
| `gasto` | `numeric(12,2)` | Gasto |
| `conversoes` | `integer NOT NULL` | Conversões |
| `cpc` | `numeric(8,2)` | CPC (Custo Por Clique) |
| `data` | `date NOT NULL` | Data da coleta |
| `created_at` | `timestamptz` | Data de criação |

**Índices:** `empresa_id`, `campanha_id`, `data`

---

## 5. Tabelas de Email Marketing

### 5.1 `mktg_campanhas_email` — Campanhas de Email

Campanhas de email marketing com métricas agregadas.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `nome` | `text NOT NULL` | Nome da campanha |
| `assunto` | `text NOT NULL` | Assunto do email |
| `remetente` | `text NOT NULL DEFAULT 'noreply@conexaosistema.com.br'` | Email remetente |
| `conteudo_html` | `text` | HTML do email |
| `status` | `text NOT NULL DEFAULT 'rascunho'` | Status: `'rascunho'`, `'agendado'`, `'enviado'`, `'pausado'` |
| `agendado_para` | `timestamptz` | Data agendada |
| `enviado_em` | `timestamptz` | Data de envio |
| `total_enviados` | `integer NOT NULL` | Total de envios |
| `total_abertos` | `integer NOT NULL` | Total de aberturas |
| `total_cliques` | `integer NOT NULL` | Total de cliques |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `status`

---

### 5.2 `mktg_disparos_email` — Disparos Individuais

Registro individual de cada email enviado.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `campanha_id` | `uuid FK → mktg_campanhas_email.id ON DELETE CASCADE NOT NULL` | Campanha |
| `email` | `text NOT NULL` | Email do destinatário |
| `enviado_em` | `timestamptz` | Data de envio |
| `aberto_em` | `timestamptz` | Data de abertura |
| `clicado_em` | `timestamptz` | Data de clique |
| `status` | `text NOT NULL DEFAULT 'pendente'` | Status: `'pendente'`, `'enviado'`, `'aberto'`, `'clicado'`, `'falhou'` |
| `created_at` | `timestamptz` | Data de criação |

**Índices:** `empresa_id`, `campanha_id`, `status`

---

## 6. Tabelas de Conteúdo e Calendário

### 6.1 `mktg_utms` — Links UTM

Gerenciamento de links com parâmetros UTM.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `nome` | `text NOT NULL` | Nome do link |
| `url_destino` | `text NOT NULL` | URL de destino |
| `utm_source` | `text NOT NULL` | Fonte |
| `utm_medium` | `text NOT NULL` | Meio |
| `utm_campaign` | `text NOT NULL` | Campanha |
| `utm_term` | `text` | Termo |
| `utm_content` | `text` | Conteúdo |
| `cliques` | `integer NOT NULL` | Total de cliques |
| `created_at` | `timestamptz` | Data de criação |

**Índice:** `empresa_id`

---

### 6.2 `mktg_criativos` — Criativos/Galeria de Mídia

Galeria de peças criativas para uso em campanhas.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `nome` | `text NOT NULL` | Nome do criativo |
| `descricao` | `text` | Descrição |
| `tipo` | `text NOT NULL DEFAULT 'imagem'` | Tipo: `'imagem'`, `'video'`, `'carrossel'`, `'texto'` |
| `arquivo_url` | `text` | URL do arquivo |
| `preview_url` | `text` | URL de preview |
| `tags` | `text[]` | Tags |
| `status` | `text NOT NULL DEFAULT 'rascunho'` | Status: `'rascunho'`, `'aprovado'`, `'arquivado'` |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `tipo`

---

### 6.3 `mktg_calendario` — Calendário Editorial

Calendário de conteúdo e eventos de marketing.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `titulo` | `text NOT NULL` | Título |
| `descricao` | `text` | Descrição |
| `data` | `date NOT NULL` | Data |
| `hora` | `time` | Hora |
| `tipo` | `text NOT NULL DEFAULT 'post'` | Tipo: `'post'`, `'reuniao'`, `'deadline'`, `'evento'`, `'lancamento'` |
| `plataforma` | `text` | Plataforma |
| `status` | `text NOT NULL DEFAULT 'pendente'` | Status: `'pendente'`, `'em_andamento'`, `'concluido'`, `'cancelado'` |
| `responsavel` | `text` | Responsável |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `data`, `status`

---

## 7. Tabelas de Leads e Pixels

### 7.1 `mktg_leads` — Leads

Leads capturados por landing pages e outras fontes.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `nome` | `text NOT NULL` | Nome |
| `email` | `text NOT NULL` | Email |
| `telefone` | `text` | Telefone |
| `origem` | `text` | Origem (ex: landing page, formulário) |
| `fonte` | `text` | Fonte (ex: organico, pago, indicação) |
| `score` | `integer NOT NULL DEFAULT 0` | Score de qualificação |
| `status` | `text NOT NULL DEFAULT 'novo'` | Status: `'novo'`, `'qualificado'`, `'convertido'`, `'perdido'` |
| `tags` | `text[]` | Tags |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `status`, `score`

---

### 7.2 `mktg_pixels` — Pixels de Tracking

Configuração de pixels para tracking de conversões.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `nome` | `text NOT NULL` | Nome do pixel |
| `pixel_id` | `text NOT NULL` | ID do pixel |
| `tipo` | `text NOT NULL DEFAULT 'meta'` | Tipo: `'meta'`, `'google'`, `'tiktok'`, `'custom'` |
| `ativo` | `boolean NOT NULL DEFAULT true` | Se está ativo |
| `config` | `jsonb DEFAULT '{}'` | Configurações adicionais |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `tipo`

---

## 8. RLS Policies

Todas as **14 tabelas** seguem o **mesmo padrão uniforme**:

```sql
is_super_admin_session() OR empresa_id = get_current_empresa_id()
```

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `mktg_eventos` | ✅ (filtro empresa) | ✅ (filtro empresa) | — | — |
| `mktg_landing_pages` | ✅ | ✅ | ✅ | ✅ |
| `mktg_landing_pages_versoes` | ✅ (via LP) | ✅ (via LP) | — | — |
| `mktg_meta_contas` | ✅ | ✅ | ✅ | ✅ |
| `mktg_meta_campanhas` | ✅ | ✅ | ✅ | ✅ |
| `mktg_meta_posts` | ✅ | ✅ | ✅ | ✅ |
| `mktg_meta_insights` | ✅ | ✅ | — | — |
| `mktg_utms` | ✅ | ✅ | ✅ | ✅ |
| `mktg_criativos` | ✅ | ✅ | ✅ | ✅ |
| `mktg_campanhas_email` | ✅ | ✅ | ✅ | ✅ |
| `mktg_disparos_email` | ✅ | ✅ | ✅ | ✅ |
| `mktg_calendario` | ✅ | ✅ | ✅ | ✅ |
| `mktg_leads` | ✅ | ✅ | ✅ | ✅ |
| `mktg_pixels` | ✅ | ✅ | ✅ | ✅ |

**Diferenciais do Marketing:**
- **Único módulo** com RLS **perfeitamente uniforme** em todas as tabelas
- Usa o padrão `is_super_admin_session()` + `get_current_empresa_id()` — o padrão mais equilibrado do sistema
- Nenhuma tabela tem acesso anônimo
- Tabelas de log (eventos, insights) não têm UPDATE/DELETE

---

## 9. Rotas do Frontend

### Páginas do Módulo (20 rotas)

| Rota | Submódulo | Descrição |
|---|---|---|
| `/marketing/dashboard` | Dashboard | Visão geral do marketing |
| `/marketing/landing-pages` | Landing Pages | Gerenciamento de landing pages |
| `/marketing/meta-bm` | Meta BM | Conexão Meta Business |
| `/marketing/meta-bm/campanhas` | Meta BM | Campanhas de anúncios |
| `/marketing/meta-bm/posts` | Meta BM | Posts do Meta |
| `/marketing/email` | Email Marketing | Campanhas de email |
| `/marketing/email/campanha` | Email Marketing | Criação de campanha |
| `/marketing/email/analytics` | Email Marketing | Analytics de email |
| `/marketing/utms` | UTMs | Links UTM |
| `/marketing/criativos` | Criativos | Galeria de mídia |
| `/marketing/calendario` | Calendário | Calendário editorial |
| `/marketing/leads` | Leads | Leads capturados |
| `/marketing/leads/$id` | Leads | Detalhe do lead |
| `/marketing/seo` | SEO | Auditoria SEO |
| `/marketing/pixels` | Pixels | Tracking pixels |
| `/marketing/whatsapp` | WhatsApp | Marketing WhatsApp |
| `/marketing/linktree` | LinkTree | LinkTree marketing |
| `/marketing/linktree/editor` | LinkTree | Editor LinkTree |
| `/marketing/linktree/tema` | LinkTree | Tema LinkTree |
| `/marketing/linktree/design` | LinkTree | Design LinkTree |

### Estrutura de Componentes (58 arquivos — o maior do sistema)

```
src/features/marketing/
├── dashboard/                        — Dashboard principal
├── landing-pages/                    — Landing pages
├── meta-bm/                          — Meta Ads (conta, campanhas, posts)
├── email-marketing/                  — Email marketing
├── utms/                             — Links UTM
├── criativos/                        — Galeria de criativos
├── calendario-editorial/             — Calendário editorial
├── leads/                            — Gestão de leads
├── seo/                              — SEO auditoria
├── pixels/                           — Tracking pixels
├── whatsapp/                         — WhatsApp marketing
├── linktree/                         — LinkTree (reutilizado)
├── lib/                              — analytics, constants, tracking
├── module.ts
└── types.ts
```

---

## 10. Migrações Relacionadas

| Migration | Data | Descrição |
|---|---|---|
| `20260630100000_marketing_module.sql` | 30/06/2026 | **CORE**: 14 tabelas (`mktg_eventos`, `mktg_landing_pages`, `mktg_landing_pages_versoes`, `mktg_meta_contas`, `mktg_meta_campanhas`, `mktg_meta_posts`, `mktg_meta_insights`, `mktg_utms`, `mktg_criativos`, `mktg_campanhas_email`, `mktg_disparos_email`, `mktg_calendario`, `mktg_leads`, `mktg_pixels`), RLS uniforme, 9 triggers |

---

## 11. Diagrama de Relacionamentos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              empresas                                         │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │
   ├── mktg_eventos ─── tracking central de eventos
   │
   ├── mktg_landing_pages ── 1:N ── mktg_landing_pages_versoes
   │
   ├── mktg_meta_contas
   │       │
   │       └── mktg_meta_campanhas ── 1:N ── mktg_meta_insights
   │               │
   │               └── mktg_meta_posts
   │
   ├── mktg_utms ─── links UTM
   │
   ├── mktg_criativos ─── galeria de mídia
   │
   ├── mktg_campanhas_email ── 1:N ── mktg_disparos_email
   │
   ├── mktg_calendario ─── calendário editorial
   │
   ├── mktg_leads ─── leads capturados
   │
   └── mktg_pixels ─── pixels de tracking
```

---

## Notas Finais

1. **Maior Módulo em Tabelas**: Com 14 tabelas, o Marketing é o módulo com maior quantidade de entidades no banco de dados — quase o dobro do Funis (7) e Rotas (7).

2. **Maior Módulo em Frontend**: 58 arquivos de componentes + 20 rotas, tornando-o também o maior em estrutura frontend.

3. **RLS Mais Consistente**: O Marketing é o único módulo com RLS perfeitamente uniforme em todas as tabelas — usando exclusivamente `is_super_admin_session()` OR `empresa_id = get_current_empresa_id()`.

4. **Submódulos Independentes**: Diferente de outros módulos centralizados, o Marketing é uma coleção de submódulos fracamente acoplados que compartilham apenas o prefixo `mktg_*` e o `empresa_id`.

5. **Integração com APIs Externas**: Meta Ads (Facebook/Instagram) via OAuth com refresh token, disparo de email via provedor externo.

6. **Versionamento de Conteúdo**: `mktg_landing_pages_versoes` permite rollback e histórico de alterações — o único módulo com versionamento.

7. **Tracking de Conversões**: O marketing possui uma pipeline completa de conversão:
   - `mktg_pixels` → tracking no site
   - `mktg_eventos` → captura de eventos
   - `mktg_leads` → leads gerados
   - `mktg_utms` → atribuição de fontes
   - `mktg_meta_insights` → dados de mídia paga

8. **Submódulos sem Module Próprio**: Apesar de terem pastas separadas (`landing-pages/`, `meta-bm/`, `leads/`, etc.), esses submódulos não possuem `module.ts` no registry — são registrados apenas via nav items agrupados sob o módulo `marketing`.

9. **Remetente Fixo**: As campanhas de email usam `noreply@conexaosistema.com.br` como remetente padrão, indicando um provedor de email transacional integrado.
