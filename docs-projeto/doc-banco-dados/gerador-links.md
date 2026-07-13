# Análise do Banco de Dados — Módulo Gerador de Links

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabelas do Módulo](#2-tabelas-do-módulo)
3. [Tipos de Links Gerados](#3-tipos-de-links-gerados)
4. [RLS Policies](#4-rls-policies)
5. [Tracking e Redirecionamento](#5-tracking-e-redirecionamento)
6. [Permissões do Módulo](#6-permissões-do-módulo)
7. [Rotas do Frontend](#7-rotas-do-frontend)
8. [Migrações Relacionadas](#8-migrações-relacionadas)
9. [Diagrama de Relacionamentos](#9-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Gerador de Links** (referenciado como "Links" no frontend e `gerador-links` no código) é uma **central de ferramentas de geração de links** do ERP Conexão. Ele permite criar links personalizados para WhatsApp, UTMs, Google Review, Google Maps, Waze e QR Codes.

**Características da Arquitetura:**

- **3 tabelas**: `gerador_links`, `gerador_templates`, `gerador_link_cliques`
- **5 tipos de link**: WhatsApp, UTM, Google Review, Google Maps, Waze (+ QR Code gerado via frontend)
- **Sistema de templates**: modelos de mensagem WhatsApp e presets UTM
- **Tracking de cliques**: redirecionamento rastreado via RPC `SECURITY DEFINER`
- **Multi-tenant**: todas as tabelas possuem `empresa_id`
- **Histórico**: links gerados podem ser salvos com parâmetros para reuso
- **Dashboard**: métricas de total de links, cliques, cliques hoje/7 dias, cliques por dia

---

## 2. Tabelas do Módulo

### 2.1 `gerador_links` — Links Salvos

Armazena os links gerados que o usuário optou por salvar no histórico.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa proprietária |
| `tipo` | `text NOT NULL` | Tipo: `'whatsapp'`, `'utm'`, `'google_review'`, `'google_maps'`, `'waze'` |
| `titulo` | `text NOT NULL` | Título descritivo do link |
| `url_gerada` | `text NOT NULL` | URL gerada completa |
| `params` | `jsonb` | Parâmetros utilizados na geração |
| `ultimo_clique` | `timestamptz` | Data do último clique (adicionado posteriormente) |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Constraints:** `CHECK (tipo IN ('whatsapp','utm','google_review','google_maps','waze'))`

---

### 2.2 `gerador_templates` — Templates de Mensagem/Presets

Modelos reutilizáveis de mensagens WhatsApp e presets de parâmetros UTM.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa proprietária |
| `tipo` | `text NOT NULL` | Tipo: `'whatsapp_msg'` ou `'utm_preset'` |
| `nome` | `text NOT NULL` | Nome do template |
| `conteudo` | `jsonb NOT NULL` | Conteúdo do template (mensagem ou params UTM) |
| `created_at` | `timestamptz` | Data de criação |

**Constraints:** `CHECK (tipo IN ('whatsapp_msg','utm_preset'))`

**Estrutura do JSONB `conteudo`:**

| Tipo | Estrutura |
|---|---|
| `whatsapp_msg` | `{"mensagem": "Olá {{nome}}, tudo bem?"}` |
| `utm_preset` | `{"utm_source": "instagram", "utm_medium": "social", "utm_campaign": "lancamento"}` |

---

### 2.3 `gerador_link_cliques` — Tracking de Cliques

Registra cada clique nos links gerados, permitindo analytics de desempenho.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `link_id` | `uuid FK → gerador_links.id ON DELETE CASCADE` | Link clicado |
| `clique_em` | `timestamptz` | Data/hora do clique |
| `user_agent` | `text` | User agent do navegador |
| `ip` | `text` | Endereço IP (anonimizado?) |
| `ref` | `text` | Referer/URL de origem |

**Índices:**
- `idx_gerador_link_cliques_link_id` ON `gerador_link_cliques(link_id)`
- `idx_gerador_link_cliques_clique_em` ON `gerador_link_cliques(clique_em)`

---

## 3. Tipos de Links Gerados

O módulo suporta **6 tipos de links/ferramentas** (5 salvos no banco + QR Code gerado em tempo real):

| Tipo | Descrição | Parâmetros salvos (params JSONB) |
|---|---|---|
| **WhatsApp** | Link `wa.me` com mensagem pré-preenchida | `{ telefone, mensagem }` |
| **UTM** | URL com parâmetros de tracking | `{ url, utm_source, utm_medium, utm_campaign, utm_term?, utm_content? }` |
| **Google Review** | Link direto para avaliação no Google | `{ placeId }` |
| **Google Maps** | Link para localização no Maps | `{ lat, lng, nome? }` |
| **Waze** | Link para navegação no Waze | `{ lat, lng }` |
| **QR Code** | QR Code gerado via frontend (não salvo) | — (somente imagem) |

---

## 4. RLS Policies

### 4.1 `gerador_links`

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `gerador_links_select_empresa` | Super admin ou mesma empresa |
| `INSERT` | `gerador_links_insert_empresa` | `empresa_id = get_current_empresa_id()` |
| `UPDATE` | `gerador_links_update_empresa` | Super admin ou mesma empresa |
| `DELETE` | `gerador_links_delete_empresa` | Super admin ou mesma empresa |

### 4.2 `gerador_templates`

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `gerador_templates_select_empresa` | Super admin ou mesma empresa |
| `INSERT` | `gerador_templates_insert_empresa` | `empresa_id = get_current_empresa_id()` |
| `UPDATE` | `gerador_templates_update_empresa` | Super admin ou mesma empresa |
| `DELETE` | `gerador_templates_delete_empresa` | Super admin ou mesma empresa |

### 4.3 `gerador_link_cliques`

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `empresa ve cliques dos seus links` | Links da empresa do usuário |
| `SELECT` | `super_admin ve todos cliques` | Super admin via JWT |

> **Nota:** O INSERT é feito via RPC `registrar_clique()` que é `SECURITY DEFINER`, bypassando RLS.

---

## 5. Tracking e Redirecionamento

### RPC: `registrar_clique`

Função `SECURITY DEFINER` que:
1. Insere um registro em `gerador_link_cliques` com user agent, IP e referer
2. Atualiza `ultimo_clique` em `gerador_links`
3. Retorna a URL de redirecionamento e o tipo do link

```sql
CREATE OR REPLACE FUNCTION registrar_clique(
  p_link_id uuid,
  p_user_agent text DEFAULT NULL,
  p_ip text DEFAULT NULL,
  p_ref text DEFAULT NULL
)
RETURNS TABLE(redirect_url text, tipo_link text)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO gerador_link_cliques (link_id, user_agent, ip, ref)
  VALUES (p_link_id, p_user_agent, p_ip, p_ref);

  UPDATE gerador_links SET ultimo_clique = now() WHERE id = p_link_id;

  RETURN QUERY SELECT url, tipo FROM gerador_links WHERE id = p_link_id;
END;
$$;
```

**Fluxo de redirecionamento:**
1. Usuário acessa `/r/:linkId`
2. O frontend chama a RPC `registrar_clique(linkId, userAgent, ip, ref)`
3. A RPC registra o clique e retorna a URL de destino
4. O navegador redireciona para a URL final

---

## 6. Permissões do Módulo

Definidas em `src/features/gerador-links/permissions.ts`.

### Lista de Permissões

| Chave | Label | Descrição |
|---|---|---|
| `lk_ver` | Ver módulo | Visualizar o módulo de links |
| `lk_gerar` | Gerar links | Gerar qualquer tipo de link |
| `lk_salvar` | Salvar links | Salvar links no histórico |
| `lk_editar` | Editar links | Editar links salvos no histórico |
| `lk_excluir` | Excluir links | Excluir links do histórico |
| `lk_gerenciar_templates` | Gerenciar templates | CRUD de templates de mensagem/UTM |

### Defaults por Ambiente

| Ambiente | Ver | Gerar | Salvar | Editar | Excluir | Templates |
|---|---|---|---|---|---|---|
| `cadastro` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `tecnologia` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `consultor` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `suporte` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 7. Rotas do Frontend

### Páginas do Módulo (9 rotas)

| Rota | Arquivo | Descrição |
|---|---|---|
| `/ferramentas/links` | `src/routes/ferramentas.links.tsx` | Dashboard do módulo |
| `/ferramentas/links/historico` | `src/routes/ferramentas.links.historico.tsx` | Histórico de links salvos |
| `/ferramentas/links/templates` | `src/routes/ferramentas.links.templates.tsx` | Gerenciamento de templates |
| `/ferramentas/links/whatsapp` | `src/routes/ferramentas.links.whatsapp.tsx` | Gerador de link WhatsApp |
| `/ferramentas/links/utm` | `src/routes/ferramentas.links.utm.tsx` | Gerador de link UTM |
| `/ferramentas/links/google-review` | `src/routes/ferramentas.links.google-review.tsx` | Gerador de link Google Review |
| `/ferramentas/links/maps` | `src/routes/ferramentas.links.maps.tsx` | Gerador de link Google Maps |
| `/ferramentas/links/waze` | `src/routes/ferramentas.links.waze.tsx` | Gerador de link Waze |
| `/ferramentas/links/qrcode` | `src/routes/ferramentas.links.qrcode.tsx` | Gerador de QR Code |
| `/r/$linkId` | `src/routes/r.$linkId.tsx` | **Rota de redirect** (tracking de clique) |

### Estrutura de Componentes (22 arquivos)

```
src/features/gerador-links/
├── components/
│   ├── DashboardPage.tsx
│   ├── HistoricoList.tsx
│   ├── LinkSavedDialog.tsx
│   ├── TemplateManager.tsx
│   └── sections/
│       ├── GoogleMapsGenerator.tsx
│       ├── GoogleReviewGenerator.tsx
│       ├── QrCodeGenerator.tsx
│       ├── UtmGenerator.tsx
│       ├── WazeGenerator.tsx
│       └── WhatsappGenerator.tsx
├── hooks/
│   ├── useDashboard.ts
│   ├── useLinks.ts
│   └── useTemplates.ts
├── services/
│   ├── geradores.service.ts
│   ├── links.service.ts
│   ├── templates.service.ts
│   └── tracking.service.ts
├── utils/
│   ├── csv.ts
│   └── userAgent.ts
├── module.ts
├── permissions.ts
└── types.ts
```

---

## 8. Migrações Relacionadas

| Migration | Data | Descrição |
|---|---|---|
| `20260701000000_gerador_links_module.sql` | 01/07/2026 | **CORE**: `gerador_links`, `gerador_templates` + RLS + grants |
| `20260701000001_gerador_links_tracking.sql` | 01/07/2026 | **Tracking**: `gerador_link_cliques`, RPC `registrar_clique()`, coluna `ultimo_clique` |

---

## 9. Diagrama de Relacionamentos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              empresas                                         │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                          gerador_links                                        │
│  id (PK) │ empresa_id                                                        │
│  tipo (whatsapp/utm/google_review/google_maps/waze)                          │
│  titulo │ url_gerada │ params (JSONB) │ ultimo_clique?                       │
│  created_at │ updated_at                                                     │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                      gerador_link_cliques  [LOG]                              │
│  id (PK) │ link_id │ clique_em                                                │
│  user_agent │ ip │ ref                                                       │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                        gerador_templates                                      │
│  id (PK) │ empresa_id                                                        │
│  tipo (whatsapp_msg/utm_preset)                                              │
│  nome │ conteudo (JSONB) │ created_at                                        │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                        6 GERADORES (Frontend)                                 │
│                                                                               │
│  ┌──────────┐ ┌─────┐ ┌─────────────┐ ┌───────────┐ ┌──────┐ ┌──────────┐   │
│  │ WhatsApp │ │ UTM │ │ Google      │ │ Google    │ │ Waze │ │ QR Code  │   │
│  │ wa.me    │ │ utm │ │ Review      │ │ Maps      │ │ waze │ │ (img)    │   │
│  └──────────┘ └─────┘ └─────────────┘ └───────────┘ └──────┘ └──────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                  FLUXO DE REDIRECIONAMENTO                                    │
│                                                                               │
│  /r/:linkId                                                                    │
│       │                                                                       │
│       ▼                                                                       │
│  registrar_clique(link_id, user_agent, ip, ref)  ◄── SECURITY DEFINER        │
│       │                                                                       │
│       ├── INSERT gerador_link_cliques                                         │
│       ├── UPDATE gerador_links SET ultimo_clique = now()                      │
│       └── RETURN url_gerada                                                   │
│                                                                               │
│       ▼                                                                       │
│  Redirect para destino (whatsapp://, https://maps, etc.)                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Finais

1. **Módulo de Ferramentas**: Diferente dos outros módulos que gerenciam dados de negócio, o Gerador de Links é um módulo de **ferramentas utilitárias** — gera links, não gerencia entidades persistentes complexas.

2. **QR Code é Frontend-only**: QR Code não tem tabela própria — é gerado via biblioteca no frontend e pode ser baixado como PNG. Não é salvo no banco.

3. **Rota de Redirect com Tracking**: A rota `/r/:linkId` é a única rota pública de redirect do sistema. Ela registra o clique via RPC `SECURITY DEFINER` (bypassa RLS) antes de redirecionar.

4. **Ambientes Restritos**: O módulo só está disponível para `cadastro` e `tecnologia` (diferente de outros módulos que incluem `consultor` e `suporte`).

5. **Permissões Simples**: Possui apenas 6 permissões (o menor conjunto do sistema), sendo que `lk_ver` e `lk_gerar` são as mais permissivas.

6. **Templates Reutilizáveis**: Os templates (`gerador_templates`) permitem que a equipe salve mensagens WhatsApp padrão e presets UTM, acelerando a geração de links recorrentes.

7. **Dashboard com Métricas**: O dashboard mostra total de links, total de cliques, média de cliques, cliques hoje, cliques nos últimos 7 dias, distribuição por tipo de link e cliques por dia.

8. **Ordem dos Nav Items**: As ferramentas aparecem na ordem: Dashboard → Histórico → Templates → WhatsApp → UTM → Google Review → Google Maps → Waze → QR Code (ordem: 10 a 70).
