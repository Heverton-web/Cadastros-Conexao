# Análise do Banco de Dados — Módulo Empresa (Core)

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabelas Core](#2-tabelas-core)
3. [Tabelas de Suporte e Limites](#3-tabelas-de-suporte-e-limites)
4. [Tabelas Derivadas — Linktree Empresa](#4-tabelas-derivadas--linktree-empresa)
5. [Extensão da Tabela Profiles](#5-extensão-da-tabela-profiles)
6. [Tabela Permissões](#6-tabela-permissões)
7. [Funções Helper (RLS Foundation)](#7-funções-helper-rls-foundation)
8. [RPCs de Administração](#8-rpcs-de-administração)
9. [RLS Policies](#9-rls-policies)
10. [Rotas do Frontend](#10-rotas-do-frontend)
11. [Arquitetura do Módulo](#11-arquitetura-do-módulo)
12. [Migrações Relacionadas](#12-migrações-relacionadas)
13. [Diagrama de Relacionamentos](#13-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Empresa** é o **coração da arquitetura multi-tenant** do ERP Conexão. Diferente dos demais módulos que são features de negócio, o módulo Empresa é **infraestrutura** — ele fornece:

- A entidade central `empresas` que isola dados de cada tenant
- As funções RLS que permitem o isolamento multi-tenant
- A configuração de each empresa (tema, branding, logos)
- O controle de módulos ativos por empresa
- Os limites de credenciais por módulo
- As RPCs de administração de usuários

**Características da Arquitetura:**

- **4 tabelas core** (`empresas`, `empresas_config`, `modulos_empresa`, `empresa_modulo_limits`)
- **4 tabelas derivadas** (`linktree_empresa_config`, `linktree_empresa_sections`, `linktree_empresa_links`, `linktree_empresa_clicks`)
- **~45+ tabelas referenciam** `empresas.id` via FK — é o módulo mais referenciado do sistema
- **3 funções RLS essenciais** que são a base de segurança de todo o sistema
- **3 RPCs de admin** para criar, atualizar senha e deletar usuários
- **Três camadas de código**: `src/core/empresa/` (Context React), `src/shared/empresas/` (serviços compartilhados), `src/features/empresas/` (UI administrativa)
- **27 rotas** — muitas delas são portais de design/config para outros módulos

---

## 2. Tabelas Core

### 2.1 `empresas` — Empresas (Tenants)

A tabela central do sistema. Cada registro representa um tenant (empresa/cliente).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `nome` | `text NOT NULL` | Nome da empresa |
| `slug` | `text NOT NULL UNIQUE` | Slug para URL |
| `cnpj` | `text` | CNPJ |
| `razao_social` | `text` | Razão social (add em 00029) |
| `nome_app` | `text` | Nome exibido no app (add em 00029) |
| `email` | `text` | Email de contato (add em 00029) |
| `celular` | `text` | Celular (add em 00029) |
| `telefone` | `text` | Telefone fixo (add em 00029) |
| `logradouro` | `text` | Endereço (add em 00029) |
| `numero` | `text` | Número (add em 00029) |
| `bairro` | `text` | Bairro (add em 00029) |
| `cidade` | `text` | Cidade (add em 00029) |
| `estado` | `text` | Estado (add em 00029) |
| `cep` | `text` | CEP (add em 00029) |
| `instagram` | `text` | Instagram (add em 00029) |
| `youtube` | `text` | YouTube (add em 00029) |
| `linkedin` | `text` | LinkedIn (add em 00029) |
| `site` | `text` | Site (add em 00029) |
| `ativo` | `boolean DEFAULT true` | Se a empresa está ativa |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |

**Evolução das colunas:**
- **Criação** (00023): `id`, `nome`, `slug`, `cnpj`, `ativo`, `created_at`, `updated_at` (7 colunas)
- **Extensão** (00029): `razao_social`, `nome_app`, `email`, `celular`, `telefone`, `logradouro`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `instagram`, `youtube`, `linkedin`, `site` (+15 colunas = 22 totais)

**Total de colunas:** 22

**RLS:**
- Super admin: ALL (insert, select, update, delete)
- Autenticados: apenas SELECT (todos podem ver empresas)

---

### 2.2 `empresas_config` — Configuração Visual da Empresa

Configuração de tema, branding e banco de dados por empresa (1:1 com empresas).

| Coluna | Tipo | Descrição |
|---|---|---|
| `empresa_id` | `uuid PK FK → empresas.id ON DELETE CASCADE` | Empresa (PK) |
| `logo_url` | `text` | URL do logo original (legado) |
| `logo_index_url` | `text` | URL do logo para index/login (add 00024) |
| `logo_app_url` | `text` | URL do logo para o app (add 00024) |
| `favicon_url` | `text` | URL do favicon (add 00024) |
| `db_config` | `jsonb DEFAULT '{}'` | Configuração de banco de dados (add 00029) |
| `theme` | `jsonb DEFAULT '{}'` | Tokens de tema (cores, fontes, etc.) |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |

**Total de colunas:** 8

**RLS:**
- Super admin: ALL
- Autenticados: SELECT (todos podem ver)
- **Anônimos: SELECT** — única tabela core com acesso anônimo (necessário para páginas públicas como NPS survey)

---

### 2.3 `modulos_empresa` — Módulos Ativos por Empresa

Controla quais módulos estão ativos para cada empresa (N:N entre empresas e módulos).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `modulo_key` | `text NOT NULL` | Chave do módulo (ex: `hub-conexao`, `nps`) |
| `ativo` | `boolean DEFAULT true` | Se o módulo está ativo |
| `config` | `jsonb DEFAULT '{}'` | Configuração específica do módulo |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |

**Restrições:** `UNIQUE(empresa_id, modulo_key)`

**RLS:** Mesmo padrão — super admin ALL, autenticados apenas SELECT.

---

## 3. Tabelas de Suporte e Limites

### 3.1 `empresa_modulo_limits` — Limites de Credenciais por Módulo

Define o número máximo de credenciais (usuários) que cada módulo pode ter por empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `modulo_key` | `text NOT NULL` | Chave do módulo |
| `max_credenciais` | `integer NOT NULL DEFAULT 0` | Máximo de credenciais permitidas |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |

**Restrições:** `UNIQUE(empresa_id, modulo_key)`

**Histórico:** Substituiu `empresa_role_limits` (migration 00048 foi deprecada)

**RPCs associadas:**
- `count_credenciais_by_empresa_modulo(p_empresa_id, p_modulo_key)` → conta quantas credenciais têm acesso ao módulo
- `check_empresa_modulo_limit(p_empresa_id, p_modulo_key)` → verifica se a empresa ainda pode adicionar credenciais

**RLS:**
- Super admin: ALL
- Admin da empresa: apenas SELECT (filtro por `profiles.empresa_id` e `profiles.role = 'admin'`)

---

## 4. Tabelas Derivadas — Linktree Empresa

O módulo Empresa também gerencia o subsistema **Linktree da Empresa** (Bio Instagram corporativo), registrado como parte da migration `00053_empresa_linktree.sql`.

### 4.1 `linktree_empresa_config` — Config da Bio Instagram

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE UNIQUE` | Empresa (1:1) |
| `slug` | `text UNIQUE NOT NULL` | Slug da página pública |
| `bio` | `text` | Biografia |
| `banner_url` | `text` | URL do banner |
| `theme` | `jsonb DEFAULT '{}'` | Tema visual |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |
| `updated_by` | `uuid FK → auth.users.id ON DELETE SET NULL` | Quem atualizou |

### 4.2 `linktree_empresa_sections` — Seções da Bio

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `titulo` | `text NOT NULL` | Título da seção |
| `ordem` | `int NOT NULL DEFAULT 0` | Ordem de exibição |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |

### 4.3 `linktree_empresa_links` — Links da Bio

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `section_id` | `uuid FK → linktree_empresa_sections.id ON DELETE CASCADE` | Seção |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `titulo` | `text NOT NULL` | Título do link |
| `url` | `text NOT NULL` | URL de destino |
| `icone` | `text` | Ícone |
| `destaque` | `boolean NOT NULL DEFAULT false` | Se é destaque |
| `ativo` | `boolean NOT NULL DEFAULT true` | Se está ativo |
| `agendado_inicio` | `timestamptz` | Início de agendamento |
| `agendado_fim` | `timestamptz` | Fim de agendamento |
| `ordem` | `int NOT NULL DEFAULT 0` | Ordem de exibição |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |

### 4.4 `linktree_empresa_clicks` — Analytics de Cliques

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `link_id` | `uuid FK → linktree_empresa_links.id ON DELETE CASCADE` | Link |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `clicked_at` | `timestamptz DEFAULT now()` | Data do clique |
| `ip_hash` | `text` | Hash do IP (anonimizado) |
| `user_agent` | `text` | User Agent |

**RLS da Linktree Empresa:**
- Config, Sections, Links: SELECT público (página pública)
- Config, Sections, Links: INSERT/UPDATE/DELETE autenticado com `is_super_admin_session() OR empresa_id = get_current_empresa_id()`
- Clicks: INSERT público, SELECT autenticado com filtro de empresa

**Grants especiais:** `GRANT SELECT TO anon` em config, sections e links — única estrutura do sistema com grants explícitos para anônimos.

---

## 5. Extensão da Tabela Profiles

O módulo Empresa estende `public.profiles` com colunas essenciais para o multi-tenant:

| Coluna | Origem | Descrição |
|---|---|---|
| `empresa_id` | 00023 (multiempresas) | FK → empresas.id, ON DELETE SET NULL |
| `celular` | 00031 | Celular do admin |
| `hub_points` | 00042 | Pontos de gamificação (módulo Hub) |
| `hub_status` | 00042 | Status no Hub |
| `hub_allowed_types` | 00042 | Tipos de material permitidos |
| `hub_preferences` | 00042 | Preferências do Hub |

**Perfis originais** (migration 00001):
| Coluna | Descrição |
|---|---|
| `id` | PK, FK → auth.users.id ON DELETE CASCADE |
| `email` | Email do usuário |
| `nome` | Nome |
| `role` | `'admin'`, `'editor'`, `'viewer'` |
| `avatar_url` | URL do avatar |
| `is_super_admin` | Boolean (add posteriormente) |
| `ativo` | Se está ativo |
| `created_at` | Data de criação |

O trigger `handle_new_user()` foi atualizado na migration 00023 para incluir `empresa_id` na criação do profile.

---

## 6. Tabela Permissões

### `public.permissoes` — Permissões Granulares

| Coluna | Tipo | Descrição |
|---|---|---|
| `usuario_id` | `uuid PK FK → profiles.id ON DELETE CASCADE` | Usuário |
| `permissoes` | `jsonb NOT NULL DEFAULT '{}'` | Permissões em JSON |
| `modulos_acesso` | `jsonb DEFAULT '{}'` | Módulos de acesso (add posteriormente) |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |
| `updated_by` | `uuid FK → auth.users.id` | Quem atualizou |

**Trigger:** `handle_new_profile_permissoes()` insere permissões padrão baseadas no `ambiente` do profile automaticamente.

**RLS (após multiempresa - 00023):**
- Super admin: ALL
- Usuário: SELECT própria permissão
- Admin da empresa: SELECT de todas da empresa

---

## 7. Funções Helper (RLS Foundation)

Estas funções são a **base de segurança** de todo o sistema multi-tenant, definidas na migration 00023.

### `public.is_super_admin_session()`
```sql
SELECT EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND is_super_admin = true
);
```
Retorna `true` se o usuário logado é super admin. Usada em **todas** as RLS policies do sistema para dar acesso irrestrito.

### `public.get_current_empresa_id()`
```sql
SELECT empresa_id FROM public.profiles WHERE id = auth.uid();
```
Retorna o `empresa_id` do perfil do usuário logado. Usada por **~90%** das tabelas para filtrar por empresa.

### `public.is_admin_or_super()`
```sql
SELECT EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND (role = 'admin' OR is_super_admin = true)
);
```
Retorna `true` se é admin da empresa ou super admin. Usada em operações que exigem privilégio administrativo.

### `public.pode_acessar_empresa(p_empresa_id)`
```sql
is_super_admin_session()
OR EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND empresa_id = p_empresa_id
);
```
Verifica se o usuário pode acessar uma empresa específica. Usada em operações multi-empresa.

---

## 8. RPCs de Administração

### `admin_criar_usuario(p_email, p_senha, p_nome, p_empresa_id, p_is_super_admin)`
Cria um usuário completo (auth.users + profiles) com email já confirmado.
- **Versões:** 3 (00047 → 00050 → 00051)
- **Evolução:** 
  - v1 (00047): inseria diretamente em profiles
  - v2 (00050): adicionou verificação de email duplicado
  - v3 - final (00051): passou a usar trigger `handle_new_user()` e depois atualizar profiles com UPDATE
- **Security:** `SECURITY DEFINER`, concedido apenas a `service_role`

### `admin_atualizar_senha(p_user_id, p_nova_senha)`
Atualiza a senha de um usuário diretamente em `auth.users.encrypted_password`.
- **Security:** `SECURITY DEFINER`, concedido apenas a `service_role`

### `admin_deletar_usuario(p_user_id)`
Remove completamente um usuário: permissoes → profiles → auth.users (em cascata).
- **Security:** `SECURITY DEFINER`, concedido apenas a `service_role`

### `count_credenciais_by_empresa_modulo(p_empresa_id, p_modulo_key)`
Conta quantas credenciais têm acesso a um módulo em uma empresa.

### `check_empresa_modulo_limit(p_empresa_id, p_modulo_key)`
Verifica se a empresa ainda pode adicionar credenciais ao módulo (não atingiu o limite).

---

## 9. RLS Policies

### Tabelas Core

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `empresas` | ✅ (todos autenticados) | ✅ (super admin) | ✅ (super admin) | ✅ (super admin) |
| `empresas_config` | ✅ (todos, inclusive anônimos) | ✅ (super admin) | ✅ (super admin) | ✅ (super admin) |
| `modulos_empresa` | ✅ (todos autenticados) | ✅ (super admin) | ✅ (super admin) | ✅ (super admin) |
| `empresa_modulo_limits` | ✅ (super admin + admin empresa) | ✅ (super admin) | ✅ (super admin) | ✅ (super admin) |

### Tabelas Derivadas (Linktree Empresa)

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `linktree_empresa_config` | ✅ **público (anon)** | ✅ (admin empresa) | ✅ (admin empresa) | — |
| `linktree_empresa_sections` | ✅ **público (anon)** | ✅ (admin empresa) | ✅ (admin empresa) | ✅ (admin empresa) |
| `linktree_empresa_links` | ✅ **público (anon)** | ✅ (admin empresa) | ✅ (admin empresa) | ✅ (admin empresa) |
| `linktree_empresa_clicks` | ✅ (admin empresa) | ✅ **público (anon)** | — | — |

### Padrão de RLS do módulo Empresa

O módulo Empresa é **o mais restritivo** do sistema para as tabelas core — apenas super admin pode modificar dados. Isso é proposital: a configuração da empresa (ativação, módulos) é sensível e não deve ser alterada por admins comuns.

Para as tabelas derivadas (Linktree Empresa), o padrão é mais permissivo, permitindo que o admin da empresa gerencie seu próprio conteúdo.

---

## 10. Rotas do Frontend

### Páginas Administrativas (27 rotas)

| Rota | Descrição |
|---|---|
| `/global/empresas` | Listagem de empresas (super admin) |
| `/global/empresas/$id` | Detalhe da empresa (super admin) |
| `/empresa` | Dados da empresa |
| `/empresa/banco` | Banco de dados |
| `/empresa/permissoes` | Permissões |
| `/empresa/design` | Design central |
| `/empresa/branding` | Branding (logo, favicon) |
| `/empresa/acoes` | Central de ações/webhooks |
| `/empresa/despesas-config` | Configuração de despesas |
| `/empresa/rotas/config` | Configuração de rotas |
| `/empresa/nps/tema` | Tema NPS |
| `/empresa/nps/design` | Design NPS |
| `/empresa/linktree/tema` | Tema Linktree |
| `/empresa/linktree/design` | Design Linktree |
| `/empresa/hub/chatbot` | Chatbot do Hub |
| `/empresa/hub/design` | Design do Hub |
| `/empresa/mapas/design` | Design Mapas |
| `/empresa/funis/design` | Design Funis |
| `/empresa/crm/design` | Design CRM |
| `/empresa/cadastros/design` | Design Cadastros |
| `/empresa/despesas/design` | Design Despesas |
| `/empresa/rotas/design` | Design Rotas |
| `/hub/cliente/dashboard/$empresaId` | Dashboard do cliente no Hub |
| `/linktree/empresa` | Linktree da empresa (público) |
| `/linktree/empresa/editor` | Editor do Linktree |
| `/cadastros/solicitacoes` (via empresa) | Solicitações (filtro empresa) |

### Estrutura de Código

```
src/
├── core/empresa/                        — Camada core (infraestrutura)
│   ├── EmpresaContext.tsx               — Context React para dados da empresa
│   ├── useEmpresa.ts                    — Hook useEmpresa
│   ├── types.ts                         — Tipos Empresa, EmpresaConfig, ModuloEmpresa
│   └── index.ts                         — Re-exports
├── shared/empresas/                     — Camada compartilhada (serviços)
│   ├── types.ts                         — Tipos (mesmo que core/empresa)
│   ├── service.ts                       — CRUD: listar, buscar, criar, atualizar, deletar
│   ├── index.ts                         — Re-exports
├── features/empresas/                   — Camada de UI
│   ├── module.ts                        — Definição do módulo (nav items + setup)
│   ├── components.tsx                   — Componentes auxiliares
│   └── index.ts                         — Re-export de shared/empresas (compatibilidade)
└── routes/
    ├── global.empresas.tsx              — Rota super admin
    ├── global.empresas.$id.tsx          — Rota super admin (detalhe)
    ├── empresa.tsx                      — Dados da empresa
    ├── empresa.acoes.tsx                — Webhooks
    ├── empresa.banco.tsx                — Banco de dados
    ├── empresa.branding.tsx             — Branding
    ├── empresa.permissoes.tsx           — Permissões
    ├── empresa.design.tsx               — Design central
    ├── empresa.*.tsx                    — Design + config de cada módulo
    ├── hub.cliente.dashboard.$empresaId.tsx
    └── linktree.empresa*.tsx            — Linktree público
```

---

## 11. Arquitetura do Módulo

### Estrutura em Três Camadas

```
┌──────────────────────────────────────────────────────────────┐
│                   features/empresas/                          │
│   (UI administrativa — rotas /global/empresas e /empresa)     │
│   module.ts, components.tsx                                    │
└──────────────────────┬───────────────────────────────────────┘
                       │ re-exporta (ponte compatibilidade)
┌──────────────────────▼───────────────────────────────────────┐
│                    shared/empresas/                           │
│   (Serviços de dados — pode ser importado por qualquer mód.) │
│   service.ts, types.ts                                        │
└──────────────────────┬───────────────────────────────────────┘
                       │ importado por EmpresaContext
┌──────────────────────▼───────────────────────────────────────┐
│                    core/empresa/                               │
│   (Infraestrutura — Context + hooks + types base)              │
│   EmpresaContext.tsx, useEmpresa.ts, types.ts                  │
└──────────────────────────────────────────────────────────────┘
```

### Relação com Outros Módulos

O módulo Empresa é **transversal** — ele não depende de nenhum módulo, mas **todos os módulos dependem dele**:

- **BD**: Toda tabela com `empresa_id` (45+ tabelas) referencia `empresas.id`
- **RLS**: Todas as policies usam `get_current_empresa_id()` e `is_super_admin_session()`
- **Context**: `useEmpresa()` é usado por praticamente todas as páginas
- **Nav Items**: O módulo registra nav items de design/config para todos os outros módulos

### Abas do Módulo

O módulo possui 5 abas definidas em `module.ts`:
1. **Banco de Dados** — Configurações de banco
2. **Dados da Empresa** — Perfil da empresa
3. **Permissões** — Gerenciamento de credenciais
4. **Design** — Tema visual (cores, fontes)
5. **Branding** — Marca (logo, favicon)

### Permissões

O módulo não possui permissões específicas no sistema de `permissions.ts` — o acesso é controlado exclusivamente por **RLS do Supabase** e pela lógica de role do profile (`is_super_admin`, `role = 'admin'`).

---

## 12. Migrações Relacionadas

| Migration | Data | Descrição |
|---|---|---|
| `00001_profiles.sql` | — | Criação da tabela profiles + trigger handle_new_user |
| `00010_permissoes.sql` | — | Criação da tabela permissoes + RLS + triggers |
| `00023_multiempresas.sql` | — | **CORE**: Cria `empresas`, `empresas_config`, `modulos_empresa`, funções helper, empresa_id em 15+ tabelas, novas RLS policies |
| `00024_branding_fields.sql` | — | Adiciona `logo_index_url`, `logo_app_url`, `favicon_url` em `empresas_config` |
| `00025_fix_rls_recursion.sql` | — | Corrige recursão em `get_current_empresa_id()` |
| `00029_empresa_dados_extras.sql` | — | +15 colunas em `empresas` (endereço, redes sociais), `db_config` em `empresas_config` |
| `00031_admin_celular_profiles.sql` | — | Adiciona `celular` em `profiles` |
| `00038_nps_empresas_config_public.sql` | — | Permite SELECT anônimo em `empresas_config` |
| `00046_admin_atualizar_senha.sql` | — | RPC `admin_atualizar_senha()` |
| `00047_admin_criar_usuario.sql` | — | RPC `admin_criar_usuario()` (v1) |
| `00048_empresa_role_limits.sql` | — | **(DEPRECATED)** Limits por role |
| `00049_empresa_modulo_limits.sql` | — | Tabela `empresa_modulo_limits` + RPCs `count_credenciais_by_empresa_modulo` e `check_empresa_modulo_limit` |
| `00050_fix_admin_criar_usuario.sql` | — | Fix v2: verificação de email duplicado |
| `00051_fix_admin_criar_usuario_v2.sql` | — | Fix v3: usa trigger handle_new_user + UPDATE |
| `00052_admin_deletar_usuario.sql` | — | RPC `admin_deletar_usuario()` |
| `00053_empresa_linktree.sql` | — | Linktree Empresa (Bio Instagram) |

---

## 13. Diagrama de Relacionamentos

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              auth.users                                             │
│  (autenticação — Supabase Auth)                                                     │
└──┬─────────────────────────────────────────────────────────────────────────────────┘
   │ 1:1
┌──▼─────────────────────────────────────────────────────────────────────────────────┐
│                           profiles                                                   │
│  id, email, nome, role, empresa_id, is_super_admin, ativo, celular, hub_*           │
└──┬─────────────────────────────────────────────────────────────────────────────────┘
   │ FK empresa_id
   │
┌──▼─────────────────────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════════════════════════════╗  │
│  ║                        empresas                                                 ║  │
│  ║  id | nome | slug | cnpj | razao_social | nome_app | email | celular |        ║  │
│  ║  telefone | endereco_completo | redes_sociais | ativo                          ║  │
│  ╚═══════════════════════════════════════════════════════════════════════════════╝  │
└──┬──────────────────────────────────────────────────────────────────────────────────┘
   │
   ├── 1:1 ── empresas_config ─── logo_url, logo_*_url, favicon_url, theme, db_config
   │
   ├── 1:N ── modulos_empresa ─── controle de módulos ativos
   │
   ├── 1:N ── empresa_modulo_limits ─── limites de credenciais por módulo
   │
   ├── 1:N ── permissoes ─── permissões dos usuários da empresa (via profiles)
   │
   ├── 1:1 ── linktree_empresa_config ─── bio Instagram
   │               │
   │               └── 1:N ── linktree_empresa_sections
   │                               │
   │                               └── 1:N ── linktree_empresa_links
   │                                              │
   │                                              └── 1:N ── linktree_empresa_clicks
   │
   ├── 1:N ── cadastros ─── (via empresa_id em 00023)
   ├── 1:N ── cadastros_pf ─── (via empresa_id)
   ├── 1:N ── cadastros_pj ─── (via empresa_id)
   ├── 1:N ── cadastros_enderecos ─── (via empresa_id)
   ├── 1:N ── documentos ─── (via empresa_id)
   ├── 1:N ── credenciais ─── (via empresa_id)
   ├── 1:N ── atividades ─── (via empresa_id)
   ├── 1:N ── notificacoes ─── (via empresa_id)
   ├── 1:N ── webhooks ─── (via empresa_id)
   ├── 1:N ── form_schema ─── (via empresa_id)
   ├── 1:N ── integracoes_config ─── (via empresa_id)
   ├── 1:N ── api_connectors ─── (via empresa_id)
   ├── 1:N ── mapas_distributors ─── (via empresa_id)
   ├── 1:N ── mapas_consultants ─── (via empresa_id)
   ├── 1:N ── nps_* ─── (via empresa_id, 4 tabelas)
   ├── 1:N ── funis_* ─── (via empresa_id, 4+ tabelas)
   ├── 1:N ── hub_* ─── (via empresa_id, 12+ tabelas)
   ├── 1:N ── mktg_* ─── (via empresa_id, 14 tabelas)
   ├── 1:N ── rotas_* ─── (via empresa_id)
   ├── 1:N ── despesas_* ─── (via empresa_id)
   ├── 1:N ── linktree_colaboradores ─── (via empresa_id)
   ├── 1:N ── gerador_links* ─── (via empresa_id)
   └── 1:N ── + muitas outras tabelas
```

---

## Notas Finais

1. **Módulo mais referenciado do sistema**: a tabela `empresas` é referenciada por **45+ tabelas** através de `empresa_id` — todo o modelo de dados depende dela.

2. **Três camadas de código**: O módulo possui uma arquitetura incomum com três camadas separadas (`core/`, `shared/`, `features/`), refletindo seu papel como infraestrutura compartilhada e não apenas uma feature de negócio.

3. **RLS mais restritivo**: As tabelas core do módulo Empresa são as únicas onde **apenas super admin** pode fazer INSERT/UPDATE/DELETE — nem mesmo admin da empresa pode modificar a configuração da própria empresa via SQL direto.

4. **Funções RLS como backbone de segurança**: `get_current_empresa_id()` e `is_super_admin_session()` são as funções mais usadas do sistema, aparecendo em praticamente todas as RLS policies.

5. **RPCs SECURITY DEFINER**: As 3 RPCs de admin (`admin_criar_usuario`, `admin_atualizar_senha`, `admin_deletar_usuario`) operam com `SECURITY DEFINER` e são concedidas apenas a `service_role` — não podem ser chamadas diretamente pelo frontend.

6. **Evolução gradual**: O schema da tabela `empresas` evoluiu de 7 colunas (migration 00023) para 22 colunas (migration 00029), mostrando uma abordagem evolutiva.

7. **Ponte de compatibilidade**: `src/features/empresas/index.ts` existe apenas como ponte — re-exporta de `~/shared/empresas`. Novos imports devem usar `~/shared/empresas` diretamente.

8. **Design config central**: O módulo serve como hub de configuração visual para todos os outros módulos do sistema, com rotas de design específicas para cada um (cadastros, crm, funis, hub, mapas, nps, linktree, despesas, rotas).

9. **Único módulo com dados públicos**: Através de `empresas_config` (SELECT anônimo) e `linktree_empresa_*` (SELECT público), o módulo Empresa é o único que expõe dados para usuários não autenticados.

10. **Sem permissions.ts**: Diferente de todos os outros módulos, o módulo Empresa não possui um arquivo `permissions.ts` — o controle de acesso é feito exclusivamente pelo RLS e pela role do profile.
