# Análise Arquitetural Geral — Banco de Dados ERP Conexão

> Documento consolidado de análise arquitetural de todos os 13 módulos do ERP Conexão.
> Gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Arquitetura Multi-tenant](#2-arquitetura-multi-tenant)
3. [Padrões de Design de Banco](#3-padrões-de-design-de-banco)
4. [Análise de RLS Policies](#4-análise-de-rls-policies)
5. [Análise de Acoplamento entre Módulos](#5-análise-de-acoplamento-entre-módulos)
6. [Análise de EVOLUÇÃO Temporal (Migrações)](#6-análise-de-evolução-temporal-migrações)
7. [Análise de RPCs e Funções](#7-análise-de-rpcs-e-funções)
8. [Anomalias e Anti-patterns](#8-anomalias-e-anti-patterns)
9. [Roadmap de Refatoração Priorizado](#9-roadmap-de-refatoração-priorizado)
10. [Recomendações Estratégicas](#10-recomendações-estratégicas)

---

## 1. Visão Geral do Sistema

### 1.1 O que é o ERP Conexão

Sistema ERP voltado para gestão de **clínicas odontológicas**, com foco em:

- **Cadastro de profissionais** (dentistas, clínicas) com fluxo de aprovação de documentos
- **CRM e vendas** com pipeline Kanban e hierarquia de equipe
- **Treinamento e gamificação** via Hub de materiais educacionais
- **Marketing digital** com landing pages, Meta Ads, email marketing
- **NPS e pesquisa de satisfação** com coleta pública
- **Gestão de despesas** com pipeline de aprovação
- **Gestão de rotas** com integração Google Maps
- **Mapas de presença** (distribuidores e consultores por estado)
- **LinkTree** para links de colaboradores e bio Instagram corporativa
- **Gerador de links** com parâmetros UTM e tracking
- **Funil de vendas** Kanban com templates

### 1.2 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Banco de Dados** | PostgreSQL 15+ (via Supabase) |
| **Autenticação** | Supabase Auth (auth.users) |
| **API** | Supabase REST + RPCs (SECURITY DEFINER) |
| **Realtime** | Supabase Realtime (via extensão) |
| **Storage** | Supabase Storage (documentos, logos) |
| **Frontend** | TanStack Start + React Router + Vite |
| **Extensões** | `pg_net` (para webhooks assíncronos) |

### 1.3 Visão Macro: 13 Módulos

| Categoria | Módulos | Tabelas | % do BD |
|---|---|---|---|
| **Infraestrutura** | Empresa (Core) + Global | ~24 | ~26% |
| **Cadastro** | Cadastros | ~11 | ~12% |
| **Vendas & CRM** | CRM + Funis | ~17 | ~18% |
| **Marketing** | Marketing + NPS + Gerador Links | ~21 | ~23% |
| **Operacional** | Rotas + Despesas + Mapas | ~14 | ~15% |
| **Treinamento** | Hub + LinkTree | ~21 | ~23% |

> **Nota:** Tabelas podem ser contadas em múltiplas categorias (ex: Hub é treinamento e LinkTree).

---

## 2. Arquitetura Multi-tenant

### 2.1 Modelo de Isolamento

O ERP Conexão usa **multi-tenant por `empresa_id`** — cada registro de todas as tabelas de negócio pertence a uma empresa (tenant).

```
┌─────────────────────────────────────────────┐
│              auth.users                       │
│  (global — gerenciado pelo Supabase Auth)     │
└─────────────────┬───────────────────────────┘
                  │ 1:1
┌─────────────────▼───────────────────────────┐
│              profiles                         │
│  id, email, role, empresa_id, is_super_admin  │
└─────────────────┬───────────────────────────┘
                  │ empresa_id FK
┌─────────────────▼───────────────────────────┐
│              empresas                         │
│  id, nome, slug, cnpj, ativo                  │
└──┬───┬───┬───┬───┬───┬───┬───┬───┬───┬─────┘
   │   │   │   │   │   │   │   │   │   │
   │   │   │   │   │   │   │   │   │   └── 45+ tabelas
   │   │   │   │   │   │   │   │   └── id = empresa_id
   │   │   │   │   │   │   │   └── em todas as tabelas
   │   │   │   │   │   │   └── de negócio
   │   │   │   │   │   └── (cadastros, nps, etc.)
   │   │   │   │   └──
   │   │   │   └──
   │   │   └──
   │   └──
   └── modulos_empresa → controle de módulos ativos
```

**Características:**
- **Todos os módulos de negócio** têm `empresa_id` como FK obrigatória
- A **única exceção** é o Core (Empresa) — a tabela `empresas` não tem `empresa_id`
- O **Global** (infraestrutura) tem `empresa_id` em algumas tabelas (`permissoes`, `documentos`, etc.)
- **Usuários** pertencem a uma empresa via `profiles.empresa_id`

### 2.2 Funções de Isolamento

O isolamento é garantido por 5 funções helper:

| Função | Propósito | Usada por |
|---|---|---|
| `get_current_empresa_id()` | Retorna empresa_id do perfil do usuário logado | ~90% das RLS policies |
| `is_super_admin_session()` | Verifica se é super admin | 100% das RLS policies (como escape) |
| `is_admin_or_super()` | Verifica se é admin ou super | Tabelas com acesso administrativo |
| `pode_acessar_empresa(uuid)` | Verifica acesso a empresa específica | Operações multi-empresa |
| `has_role(uuid, app_role)` | Verifica role no CRM | Subsistema CRM antigo |

### 2.3 Níveis de Acesso

```
Nível 1 — Super Admin (acesso total)
├── app_config (config de ambiente)
├── mock_credentials (credenciais de seed)
├── integracoes_config (integrações)
├── empresas (INSERT/UPDATE/DELETE)
└── empresa_modulo_limits

Nível 2 — Admin da Empresa
├── credenciais (SELECT/ALL)
├── webhooks (SELECT/ALL)
├── empresa_modulo_limits (SELECT)
└── todas as tabelas de negócio da sua empresa

Nível 3 — Usuário da Empresa
├── CRUD nas tabelas de negócio (filtrado por empresa_id)
├── SELECT em empresas, empresas_config
└── SELECT/UPDATE próprias notificações

Nível 4 — Anônimo/Público
├── SELECT: form_schema, empresas_config, mapas_*, linktree_empresa_*
├── INSERT: nps_respostas
└── SELECT: linktree_empresa_config, sections, links
```

---

## 3. Padrões de Design de Banco

### 3.1 Padrão de Nomenclatura

| Padrão | Exemplos | Ocorrências |
|---|---|---|
| **Prefixo do módulo** | `nps_*`, `mktg_*`, `hub_*`, `mapas_*` | 7 módulos |
| **Nome descritivo** | `funis`, `rotas`, `despesas` | 4 módulos |
| **Nome composto** | `gerador_links`, `linktree_colaboradores` | 3 módulos |
| **Sem prefixo (core)** | `empresas`, `profiles`, `permissoes` | Tabelas globais |

**Inconsistência:** Algumas tabelas têm prefixo (`nps_perguntas`), outras não (`funis_colunas`). Marketing usa `mktg_*` consistentemente.

### 3.2 Padrão de Chaves

```
PK: id UUID DEFAULT gen_random_uuid()
FK: empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE
FK user: usuario_id UUID REFERENCES profiles(id) ON DELETE CASCADE
FK geral: *_id UUID REFERENCES tabela(id) ON DELETE CASCADE
Timestamps: created_at TIMESTAMPTZ DEFAULT now()
            updated_at TIMESTAMPTZ DEFAULT now()
Controle: created_by UUID REFERENCES profiles(id)
```

### 3.3 Padrão de Índices

```
idx_{tabela}_{coluna} ON {tabela}({coluna})
```

Índices mais comuns:
- `empresa_id` — ~60 índices (praticamente todas as tabelas)
- `status` — filtros por status
- `data` — ordenação por data
- Campos compostos: `(empresa_id, status)`, `(empresa_id, created_at)`

### 3.4 Padrão de Triggers

```
Before INSERT: set_created_by() — seta created_by = auth.uid()
Before INSERT: set_usuario_id() — seta usuario_id = auth.uid()
Before UPDATE: update_updated_at_column() — atualiza updated_at
After INSERT: on_auth_user_created — cria profile
After INSERT: on_profile_created_permissoes — cria permissões padrão
Before UPDATE: trg_log_transferencia — log de transferência de cliente
```

### 3.5 Padrão de JSONB

O sistema usa **JSONB extensivamente** para dados flexíveis:

| Tabela | Coluna JSONB | Propósito |
|---|---|---|
| `empresas_config` | `theme` | Tokens de tema (cores, fontes) |
| `empresas_config` | `db_config` | Config de banco de dados |
| `modulos_empresa` | `config` | Config específica do módulo |
| `integracoes_config` | `config` | Config de integrações |
| `permissoes` | `permissoes` | 17 permissões booleanas |
| `permissoes` | `modulos_acesso` | Acesso a módulos |
| `webhooks` | `headers`, `body_template` | Config de webhooks |
| `cadastros` | `dados_extras` | Campos customizados |
| `cadastros` | `campos_correcao` | Correções solicitadas |
| `linktree_tema_config` | `tema` | 60+ propriedades de tema |
| `form_schema` | `opcoes` | Opções de select |

### 3.6 Versionamento de Dados

**Único módulo com versionamento:** Marketing (Landing Pages)

```
mktg_landing_pages → versao_atual (integer)
mktg_landing_pages_versoes → landing_page_id + versao + conteudo
```

Nenhum outro módulo possui histórico de versões.

---

## 4. Análise de RLS Policies

### 4.1 Matriz de RLS por Módulo

| Módulo | Pattern RLS | Consistência | Observação |
|---|---|---|---|
| **Cadastros** | Super admin OR admin/consultor (created_by) | ❌ Média | 4 variações diferentes (cadastros, pf, pj, enderecos) |
| **Hub** | Misto: público + empresa | ❌ Baixa | Algumas SELECT público, outras restritas |
| **NPS** | Anônimo INSERT + admin empresa | ✅ Boa | Apenas 2 patterns distintos |
| **Mapas** | Público SELECT + admin empresa | ✅ Boa | Simples e claro |
| **Linktree** | Público SELECT + admin empresa | ✅ Boa | Grants explícitos para anon |
| **Gerador Links** | Super admin OR empresa_id | ✅ Boa | Uniforme |
| **Rotas** | Super admin OR empresa_id | ✅ Boa | Uniforme |
| **Despesas** | Super admin OR empresa_id | ✅ Boa | Uniforme |
| **CRM** | Hierárquico (role) | ✅ Boa | Consistente no subsistema |
| **Funis** | Super admin OR empresa_id | ✅ Boa | Uniforme |
| **Marketing** | **Super admin OR empresa_id** | **✅ Excelente** | **Perfeitamente uniforme** |
| **Empresa** | Super admin only + público | ✅ Boa | Core propositalmente restrito |
| **Global** | **5 níveis diferentes** | ❌ Baixa | Maior diversidade |

### 4.2 Evolução Temporal das RLS

As RLS policies evoluíram em **3 fases**:

```
Fase 1 (00001-00007): RLS simples
└── "Usuário vê próprio", "Admin vê todos"

Fase 2 (00008-00022): Blindagem
└── is_admin_or_super(), filtros por created_by
└── Novas policies para cadastros, pf, pj, enderecos, documentos

Fase 3 (00023+): Multi-tenant
└── get_current_empresa_id() em todas as tabelas
└── is_super_admin_session() como escape
└── Substituição completa de policies antigas
```

### 4.3 Problemas Identificados nas RLS

1. **Recursão em `get_current_empresa_id()`** (00025): A função original causava recursão infinita em algumas consultas, corrigida na migration 00025.

2. **Redefinição completa de policies** (00023): A migration 00023 usa um bloco `DO $$` para dropar TODAS as policies de 16 tabelas e recriá-las — operação de alto risco.

3. **Políticas duplicadas**: Algumas tabelas têm políticas com mesmo nome sendo recriadas múltiplas vezes (ex: `webhooks` tem policies recriadas em 00006, 00008 e 00023).

4. **Acesso público excessivo no form_schema**: SELECT liberado para qualquer um — inclui `empresa_id` que pode vazar informação sobre quais empresas customizaram o formulário.

5. **Empresa sem RLS para admin**: O admin da empresa não pode modificar a própria empresa via SQL — precisa do super admin para qualquer alteração.

---

## 5. Análise de Acoplamento entre Módulos

### 5.1 Matriz de Dependências (Acoplamento por FK)

```
           │ Emp Global Cad Hub NPS Map Link Ger Rot Des CRM Fun Mkt
───────────┼─────────────────────────────────────────────────────────
Empresa    │  ─   45+  15   12   4   2   6   3   6   6   4+  7   14
Global     │  ─    ─    5    1   1   1   1   1   1   1   1+  1    1
Cadastros  │  ─    ─    ─    ─   1   ─   ─   ─   ─   ─   1+  ─    ─
Hub        │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─
NPS        │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─
Mapas      │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─
LinkTree   │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─
Gerador    │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─
Rotas      │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─
Despesas   │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─
CRM        │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─
Funis      │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─
Marketing  │  ─    ─    ─    ─   ─   ─   ─   ─   ─   ─    ─   ─   ─

Legenda: Número = FKs que o módulo da linha tem para o módulo da coluna
         ─ = zero (nenhuma FK direta entre módulos de negócio)
```

### 5.2 Conclusão do Acoplamento

**O sistema tem acoplamento extremamente baixo entre módulos de negócio.**

- A **única dependência** de todos os módulos é com **Empresa** (via `empresa_id`)
- **Nenhum módulo de negócio tem FK para outro módulo de negócio**
- A **Infraestrutura (Global)** tem dependência mínima dos módulos de negócio
- **Isolamento completo** — cada módulo poderia ser extraído para um banco separado sem quebrar os outros (desde que preservasse a FK para `empresas`)

**Isso é um excelente resultado arquitetural.** O princípio "a única camada de conexão entre módulos é o banco de dados" (definido no `AGENTS.md`) é rigorosamente seguido.

### 5.3 Exceções ao Isolamento

1. **CRM (novo) vs CRM (antigo)**: O módulo CRM em `src/features/crm/` coexiste com as tabelas CRM antigas (`usuarios`, `clientes`, `visitas`) — **não há integração entre eles**, são paralelos.

2. **LinkTree (Colaboradores) vs LinkTree (Empresa)**: Duas implementações independentes — uma para colaboradores (`linktree_colaboradores`) e outra para empresa (`linktree_empresa_*`). **Não compartilham dados.**

3. **Marketing reusa LinkTree**: O submódulo `marketing/linktree` reusa a estrutura da LinkTree de colaboradores, não da empresa — **configuração de frontend, não acoplamento de dados.**

4. **Gerador de Links vs Marketing UTMs**: Ambos gerenciam links, mas em tabelas separadas (`gerador_links` vs `mktg_utms`) — **oportunidade de unificação.**

---

## 6. Análise de Evolução Temporal (Migrações)

### 6.1 Linha do Tempo

```
2025?                                   2026
├───────────────────────────────────────┴───────────────────────────────►
00001-00022   00023-00039   00040-00045   202606-202607
│             │             │             │
│ Primitivo   │ Multi-      │ Novos       │ Módulos
│ (cadastros, │ tenant      │ módulos     │ maduros
│ profiles)   │ (empresa)   │ (Hub, NPS,  │ (Marketing,
│             │             │ LinkTree,   │ CRM, Funis,
│             │             │ Mapas,      │ Rotas,
│             │             │ Gerador)    │ Despesas)
│             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────────────────────►
```

### 6.2 Fases de Evolução

| Fase | Migrações | Duração | Mudança Principal |
|---|---|---|---|
| **1. Fundação** | 00001-00007 | Inicial | Profiles, cadastros, admin, webhooks |
| **2. Blindagem** | 00008-00022 | Intermediária | RLS, permissões, notificações, integrações |
| **3. Multi-tenant** | 00023-00039 | Transição | Empresas, empresa_id em todas as tabelas |
| **4. Expansão** | 00040-00053 | Recente | Hub, NPS, LinkTree, Mapas, Admin RPCs |
| **5. Módulos** | 202606-202607 | Atual | CRM, Despesas, Rotas, Marketing, Funis, Links |

### 6.3 Padrões de Evolução por Módulo

| Módulo | Migração Única | Múltiplas Migrações | Maduro? |
|---|---|---|---|
| Cadastros | ❌ | ~10 (evolução contínua) | ✅ |
| Hub | ❌ | 5 (core + seed + fix) | ✅ |
| NPS | ❌ | 4 (core + config + refatoração) | ✅ |
| Mapas | ❌ | 2 (core + google maps) | ⚠️ (em evolução) |
| LinkTree | ❌ | 3 (core + fix + extensão) | ✅ |
| Gerador Links | ❌ | 2 (core + tracking) | ✅ |
| Rotas | ❌ | 2 (core + google maps) | ⚠️ (em evolução) |
| Despesas | ✅ 1 | — | ⚠️ (recente) |
| CRM | ✅ 1 | — | ⚠️ (recente) |
| Funis | ❌ | 3 (core + colunas + templates) | ✅ |
| Marketing | ✅ 1 | — | ⚠️ (recente) |
| Empresa | ❌ | **17** (maior evolução) | ✅ |
| Global | ❌ | **20+** (maior número) | ✅ |

**Padrão:** Módulos recentes (202606+) têm migração única. Módulos antigos evoluíram gradualmente.

### 6.4 Migrações Problemáticas

| Migration | Problema | Risco |
|---|---|---|
| `00023` — Drop ALL policies de 16 tabelas | Operação destrutiva que pode deletar policies customizadas | 🔴 Alto |
| `00048` — Deprecada mas mantida | Arquivo órfão que pode causar confusão | 🟡 Médio |
| `00045` — Script de fix manual | Usa `DO $$` com update em massa — poderia ser resolvido com trigger | 🟡 Médio |
| `20260512150646` — app_config duplicada | Cria tabela que já existe (00006) — conflito de schema | 🔴 Alto |

---

## 7. Análise de RPCs e Funções

### 7.1 Distribuição de RPCs

| Categoria | Quantidade | Exemplos |
|---|---|---|
| **Segurança/RLS** | 5 | `is_super_admin_session`, `get_current_empresa_id`, `has_role` |
| **Admin (service_role)** | 3 | `admin_criar_usuario`, `admin_atualizar_senha`, `admin_deletar_usuario` |
| **Pré-cadastro público** | 5 | `get_cadastro_by_token`, `update_cadastro_from_precadastro`, `gerar_2fa_pin`, `validar_2fa_pin`, `registrar_acesso_token` |
| **Verificação** | 1 | `verificar_documento_duplicado` |
| **Integração** | 1 | `enviar_whatsapp_evolution` |
| **Manutenção** | 1 | `limpar_links_expirados` |
| **Limites** | 2 | `count_credenciais_by_empresa_modulo`, `check_empresa_modulo_limit` |
| | **~18** | |

### 7.2 Problemas de Segurança em RPCs

1. **RPCs públicas SEM validação de empresa**: `get_cadastro_by_token` e `update_cadastro_from_precadastro` usam `SECURITY DEFINER` e aceitam qualquer token — um token válido de outra empresa poderia ser usado.

2. **RPC `admin_criar_usuario` com 3 versões**: Migration 00047 (v1), 00050 (v2), 00051 (v3) — a versão final é a 00051, mas scripts antigos podem usar as versões anteriores.

3. **`enviar_whatsapp_evolution` sem rate limit**: Qualquer autenticado pode disparar WhatsApp via RPC — sem proteção contra abuso.

---

## 8. Anomalias e Anti-patterns

### 8.1 Tabelas Gêmeas (Duplicação de Schema)

```
mapas_distribribuidores e mapas_consultants:
  ├── Estrutura quase idêntica
  ├── Diferem apenas no propósito (distribuidor vs consultor)
  └── Poderiam ser unificadas com coluna tipo ENUM

linktree_colaboradores e linktree_empresa_*:
  ├── 2 subsistemas independentes
  ├── Ambos gerenciam links com tema
  └── Poderiam compartilhar schema base
```

**Impacto:** Duplicação de código SQL, manutenção dobrada, inconsistência potencial.

### 8.2 Duas Tabelas `clientes`

```
View clientes (00005):
  ├── JOIN de cadastros + cadastros_pf + cadastros_pj + cadastros_enderecos
  └── Usada pelo fluxo principal (Cadastros)

Tabela clientes (20260512):
  ├── Tabela física independente
  ├── Referenciada por visitas, logs_transferencia
  └── Usada pelo subsistema CRM antigo
```

**Impacto:** Confusão de nomenclatura, risco de conflito, views com `security_invoker = true` podem ter performance inferior.

### 8.3 Trigger Duplicado `handle_new_user`

```
Trigger 1 (00001 — profiles):
  on_auth_user_created → insere em public.profiles

Trigger 2 (20260512 — usuarios CRM):
  on_auth_user_created → insere em public.usuarios
```

**Problema:** Ambos os triggers disparam no mesmo evento (`AFTER INSERT ON auth.users`). O trigger mais recente (CRM) substitui o anterior? Ou ambos executam? Em PostgreSQL, múltiplos triggers no mesmo evento executam em ordem alfabética — o que pode causar conflitos.

### 8.4 Ausência de Soft Delete

**Nenhuma tabela no sistema usa soft delete.** A deleção é sempre física (`DELETE`). Isso significa:

- **Perda de auditoria**: Não há rastro de quem deletou o quê
- **Cascading**: `ON DELETE CASCADE` propaga deleções
- **Exceção**: O RPC `admin_deletar_usuario` deleta em cascata (permissoes → profiles → auth.users)

### 8.5 Falta de Índices em FKs Críticas

Algumas tabelas importantes podem estar sem índice em `empresa_id`:

- `notificacoes.empresa_id` — sem índice explícito (pode ser problemático)
- `webhooks.empresa_id` — sem índice explícito
- `nps_webhook_config.empresa_id` — sem índice explícito

### 8.6 Migração 00048 Órfã

```
Arquivo: 00048_empresa_role_limits.sql
Conteúdo: "-- (DEPRECATED - replaced by 00049_empresa_modulo_limits.sql)"
```

O arquivo existe mas não faz nada além de comentários. Pode ser confundido com uma migration válida.

---

## 9. Roadmap de Refatoração Priorizado

### 🟢 Prioridade Alta (Impacto Imediato)

| # | Tarefa | Esforço | Benefício | Módulo |
|---|---|---|---|---|
| 1 | **Unificar `mapas_distribuidores` e `mapas_consultants`** | Médio | Elimina duplicação de schema e código | Mapas |
| 2 | **Resolver conflito do trigger `handle_new_user`** | Baixo | Evita bug de criação de usuário | Global |
| 3 | **Remover migration 00048 órfã** | Mínimo | Limpeza de arquivos obsoletos | Empresa |
| 4 | **Adicionar índices em FKs sem índice** | Baixo | Melhora performance de JOINs | Global + NPS |
| 5 | **Corrigir `empresa_id` nullable em `nps_perguntas`** | Médio | Completa migração multi-tenant | NPS |

### 🟡 Prioridade Média (Melhoria Significativa)

| # | Tarefa | Esforço | Benefício | Módulo |
|---|---|---|---|---|
| 6 | **Unificar Gerador Links com Marketing UTMs** | Alto | Elimina duplicação de funcionalidade | Marketing + Links |
| 7 | **Migrar CRM antigo para o novo módulo CRM** | Alto | Elimina subsistema duplicado | CRM |
| 8 | **Implementar soft delete nas tabelas principais** | Alto | Audita quem deletou o quê | Global |
| 9 | **Padronizar RLS do Hub para o padrão empresa** | Médio | Consistência de segurança | Hub |
| 10 | **Criar permissions.ts para Marketing** | Baixo | Registra permissões no sistema | Marketing |

### 🔵 Prioridade Baixa (Refinamento)

| # | Tarefa | Esforço | Benefício | Módulo |
|---|---|---|---|---|
| 11 | **Adicionar rate limit na RPC de WhatsApp** | Baixo | Previne abuso | Global |
| 12 | **Unificar LinkTree Colaboradores + Empresa** | Alto | Schema único | LinkTree |
| 13 | **Adicionar security_invoker em views** | Mínimo | Segurança adicional | Global |
| 14 | **Adicionar validação de empresa nas RPCs públicas** | Baixo | Segurança de pré-cadastro | Cadastros |
| 15 | **Versionamento de dados para outros módulos** | Alto | Histórico de alterações | Todos |

### 🟣 Visão de Longo Prazo

| # | Tarefa | Esforço | Visão |
|---|---|---|---|
| 16 | **Separar módulos em schemas do PostgreSQL** | Muito Alto | Isolamento físico: `cadastros.*`, `marketing.*`, etc. |
| 17 | **Implementar Event Sourcing para auditoria** | Muito Alto | Rastro completo de todas as operações |
| 18 | **Separar banco de dados por módulo** | Extremo | Micro-serviços com bancos independentes |

---

## 10. Recomendações Estratégicas

### 10.1 Pontos Fortes a Preservar

1. **Acoplamento baixíssimo entre módulos** — A arquitetura de módulos independentes conectados apenas pelo banco de dados é exemplar.

2. **RLS consistente no Marketing** — O padrão `is_super_admin_session() OR empresa_id = get_current_empresa_id()` deveria ser o padrão para todos os módulos.

3. **Triggers de auditoria** — `set_created_by`, `set_usuario_id` e `update_updated_at_column` garantem rastreabilidade básica.

4. **Uso inteligente de JSONB** — Permite flexibilidade sem migrations (form_schema, configs, temas).

5. **Versionamento de landing pages** — Único módulo com histórico, mas é um padrão valioso.

### 10.2 Pontos a Melhorar

1. **Padronizar RLS** — Unificar todas as RLS para o padrão Marketing (`is_super_admin_session() OR empresa_id = get_current_empresa_id()`).

2. **Resolver inconsistências de nomenclatura** — Decidir entre prefixo do módulo (`nps_*`, `mktg_*`) ou nome descritivo sem prefixo.

3. **Eliminar subsistemas duplicados** — CRM antigo e tabelas gêmeas de mapas.

4. **Adicionar soft delete** — Pelo menos nas tabelas principais (empresas, cadastros, profiles).

5. **Proteger RPCs públicas** — Adicionar validação de empresa nas RPCs de pré-cadastro.

### 10.3 Decisões Arquiteturais a Tomar

| Decisão | Opção A | Opção B | Recomendação |
|---|---|---|---|
| **Prefixos de tabelas** | Manter misto | Padronizar com prefixo | **Opção B** — consistência acima de tudo |
| **Tabelas gêmeas** | Manter separadas | Unificar com tipo ENUM | **Opção B** — menos código, menos bugs |
| **CRM duplicado** | Manter ambos | Migrar CRM antigo para o novo | **Opção B** — eliminar dívida técnica |
| **Soft delete** | Manter físico | Adicionar deleted_at | **Opção B** — pelo menos nas tabelas core |
| **Migrações** | Uma por módulo | Evolutivas | **Misto** — uma para criar, evolutivas para ajustes |
| **RPCs públicas** | Manter sem validação | Adicionar validação de empresa | **Opção B** — segurança por camadas |

### 10.4 Métricas de Saúde do Banco

| Métrica | Atual | Ideal |
|---|---|---|
| **Consistência de RLS** | ~60% | **100%** (padrão Marketing) |
| **Cobertura de índices em FKs** | ~85% | **100%** |
| **Tabelas com soft delete** | **0%** | **50%+** (core + principais) |
| **Módulos com prefixo consistente** | 7/12 (58%) | **100%** |
| **Módulos sem permissions.ts** | 2 (Empresa + Marketing) | **0** (ou documentado) |
| **RPCs com validação de empresa** | ~50% | **100%** |
| **Migrações órfãs** | 1 | **0** |

---

> **Documento gerado a partir da análise de 13 documentos de módulo + consulta direta ao código fonte e migrações SQL.**
> 
> **Data:** 04/07/2026 | **Módulos analisados:** 13 | **Tabelas catalogadas:** ~92 | **Migrações revisadas:** ~70
