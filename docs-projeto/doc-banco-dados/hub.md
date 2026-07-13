# Análise do Banco de Dados — Módulo Hub

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [ENUMs](#2-enums)
3. [Tabelas Principais (Conteúdo)](#3-tabelas-principais-conteúdo)
4. [Tabelas de Progresso e Gamificação](#4-tabelas-de-progresso-e-gamificação)
5. [Tabelas de Configuração](#5-tabelas-de-configuração)
6. [Extensão do Profiles](#6-extração-do-profiles)
7. [RLS Policies](#7-rls-policies)
8. [Permissões do Módulo](#8-permissões-do-módulo)
9. [Rotas do Frontend](#9-rotas-do-frontend)
10. [Migrações Relacionadas](#10-migrações-relacionadas)
11. [Diagrama de Relacionamentos](#11-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Hub** é uma plataforma de **treinamento e gamificação** do ERP Conexão. Ele permite criar e gerenciar materiais de treinamento (PDFs, vídeos, HTML), organizá-los em trilhas de aprendizado, e engajar usuários através de um sistema de níveis, badges (conquistas), ranking e pontos.

**Características da Arquitetura:**

- **15 tabelas Hub-specific** em esquema próprio (namespace `hub_*`)
- **7 ENUMs** tipados para roles, status, tipos de material e triggers de badge
- **Multi-idioma nativo**: todos os conteúdos suportam `pt-br`, `en-us`, `es-es` via JSONB
- **Multi-tenant**: todas as tabelas possuem `empresa_id`
- **Roles específicas do Hub**: `client`, `distributor`, `consultant`, `manager`, `super_admin`
- **Sistema de gamificação** com progress tracking, níveis, badges e ranking
- **Integrações AI**: suporte a Gemini, OpenAI, Groq e OpenRouter para funções como tradução e chatbot
- **Migrações seed** com dados iniciais: 8 níveis, 10 badges, 25 materiais e 3 trilhas

---

## 2. ENUMs

Criados na migração `00041_hub_module.sql`:

| Enum | Valores | Uso |
|---|---|---|
| `hub_app_role` | `'client'`, `'distributor'`, `'consultant'`, `'manager'`, `'super_admin'` | Roles dos usuários no Hub |
| `hub_app_status` | `'pending'`, `'active'`, `'inactive'`, `'rejected'` | Status de aprovação de usuário |
| `hub_app_language` | `'pt-br'`, `'en-us'`, `'es-es'` | Idiomas suportados |
| `hub_material_type` | `'image'`, `'pdf'`, `'video'`, `'audio'`, `'html'` | Tipos de material |
| `hub_translation_status` | `'draft'`, `'review'`, `'published'` | Status de tradução |
| `hub_progress_status` | `'started'`, `'completed'` | Status de progresso |
| `hub_badge_trigger` | `'material_completed'`, `'collection_completed'`, `'points_reached'`, `'streak_days'`, `'ranking_position'`, `'login_count'` | Eventos que disparam badges |

---

## 3. Tabelas Principais (Conteúdo)

### 3.1 `hub_materials` — Materiais de Treinamento

Tabela central de conteúdo. Cada registro é um material (PDF, vídeo, etc.) que pode ser disponibilizado para diferentes roles.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `title` | `jsonb NOT NULL` | Título multi-idioma `{"pt-br":"", "en-us":"", "es-es":""}` |
| `type` | `hub_material_type NOT NULL` | Tipo do material (`pdf`, `video`, `html`, etc.) |
| `allowed_roles` | `hub_app_role[]` | Roles que podem acessar (ex: `{client,distributor,consultant}`) |
| `active` | `boolean NOT NULL` | Se está ativo/visível |
| `points` | `integer NOT NULL DEFAULT 10` | Pontos concedidos ao concluir |
| `tags` | `text[]` | Tags para busca/filtro |
| `category` | `text` | Categoria (ex: `'odontologia'`, `'vendas'`, `'gestao'`) |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária |
| `created_by` | `uuid FK → auth.users.id NOT NULL` | Quem criou |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `created_by`, `type`

**Trigger:** `hub_materials_updated_at` — atualiza `updated_at` automaticamente

---

### 3.2 `hub_material_assets` — Arquivos dos Materiais

Assets (arquivos) de cada material, organizados por idioma. Um material pode ter múltiplos assets (um para cada idioma).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `material_id` | `uuid FK → hub_materials.id ON DELETE CASCADE` | Material pai |
| `language` | `hub_app_language NOT NULL` | Idioma do asset |
| `url` | `text NOT NULL` | URL do arquivo |
| `subtitle_url` | `text` | URL da legenda (para vídeos) |
| `status` | `hub_translation_status NOT NULL` | Status da tradução |
| `created_at` | `timestamptz` | Data de criação |

**Índices:** `material_id`, `language`

---

### 3.3 `hub_collections` — Trilhas de Aprendizado (Coleções)

Agrupam materiais em trilhas temáticas.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `title` | `jsonb NOT NULL` | Título multi-idioma |
| `description` | `jsonb` | Descrição multi-idioma |
| `cover_image` | `text` | URL da imagem de capa |
| `allowed_roles` | `hub_app_role[]` | Roles que podem acessar |
| `active` | `boolean NOT NULL` | Se está ativa |
| `points` | `integer NOT NULL DEFAULT 50` | Pontos ao concluir a trilha |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária |
| `created_by` | `uuid FK → auth.users.id NOT NULL` | Quem criou |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `created_by`

---

### 3.4 `hub_collection_items` — Itens da Trilha

Relacionamento N:N entre coleções e materiais, com ordenação.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `collection_id` | `uuid FK → hub_collections.id ON DELETE CASCADE` | Coleção |
| `material_id` | `uuid FK → hub_materials.id ON DELETE CASCADE` | Material |
| `order_index` | `integer NOT NULL` | Ordem dentro da trilha |
| `created_at` | `timestamptz` | Data de criação |

**Constraints:** `UNIQUE(collection_id, material_id)`

**Índices:** `(collection_id, order_index)`, `material_id`

---

## 4. Tabelas de Progresso e Gamificação

### 4.1 `hub_user_progress` — Progresso em Materiais

Rastreia o progresso individual de cada usuário em cada material.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `user_id` | `uuid FK → auth.users.id ON DELETE CASCADE` | Usuário |
| `material_id` | `uuid FK → hub_materials.id ON DELETE CASCADE` | Material |
| `collection_id` | `uuid FK → hub_collections.id ON DELETE SET NULL` | Coleção (se fez parte de uma trilha) |
| `status` | `hub_progress_status NOT NULL` | Status (`started` / `completed`) |
| `completed_at` | `timestamptz` | Data de conclusão |
| `empresa_id` | `uuid FK → empresas.id` | Empresa |
| `created_at` | `timestamptz` | Data de criação |

**Constraints:** `UNIQUE(user_id, material_id)` — um progresso por usuário/material

**Índices:** `user_id`, `material_id`, `empresa_id`

---

### 4.2 `hub_collection_progress` — Progresso em Trilhas

Rastreia o progresso do usuário em trilhas completas.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `user_id` | `uuid FK → auth.users.id ON DELETE CASCADE` | Usuário |
| `collection_id` | `uuid FK → hub_collections.id ON DELETE CASCADE` | Coleção |
| `status` | `hub_progress_status NOT NULL` | Status |
| `started_at` | `timestamptz NOT NULL` | Data de início |
| `completed_at` | `timestamptz` | Data de conclusão |
| `empresa_id` | `uuid FK → empresas.id` | Empresa |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data de atualização |

**Constraints:** `UNIQUE(user_id, collection_id)`

**Índices:** `user_id`, `collection_id`

---

### 4.3 `hub_access_logs` — Logs de Acesso (Imutável)

Registro imutável de acessos a materiais. Apenas INSERT e SELECT são permitidos.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `material_id` | `uuid FK → hub_materials.id ON DELETE CASCADE` | Material acessado |
| `material_title` | `text` | Título no momento do acesso (desnormalizado) |
| `user_id` | `uuid FK → auth.users.id` | Usuário (sem CASCADE) |
| `user_name` | `text` | Nome no momento do acesso (desnormalizado) |
| `user_role` | `hub_app_role` | Role do usuário |
| `language` | `hub_app_language NOT NULL` | Idioma usado |
| `timestamp` | `timestamptz NOT NULL` | Data/hora do acesso |
| `empresa_id` | `uuid FK → empresas.id` | Empresa |

**Índices:** `material_id`, `user_id`, `empresa_id`, `timestamp`

---

### 4.4 `hub_gamification_levels` — Níveis de Gamificação

Níveis/patentes que os usuários podem alcançar baseado em pontos.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `name` | `text NOT NULL` | Nome do nível |
| `min_points` | `integer NOT NULL` | Pontos mínimos para atingir |
| `order_index` | `integer NOT NULL` | Ordem de exibição |
| `color` | `text NOT NULL` | Cor hexadecimal para exibição |
| `empresa_id` | `uuid FK → empresas.id` | Empresa |
| `created_at` | `timestamptz` | Data de criação |

**Seed (`00043`):** 8 níveis — Iniciante (0), Aprendiz (100), Estudante (300), Especialista (600), Mestre (1000), Líder (2000), Grão-Mestre (5000), Lendário (10000)

---

### 4.5 `hub_badges` — Badges/Conquistas

Badges que são automaticamente concedidos quando um trigger é atingido.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `name` | `text NOT NULL` | Nome do badge |
| `description` | `text` | Descrição |
| `icon_name` | `text NOT NULL` | Nome do ícone (Lucide) |
| `trigger_type` | `hub_badge_trigger NOT NULL` | Evento que dispara |
| `trigger_value` | `integer NOT NULL` | Valor do trigger (ex: 10 materiais) |
| `points_reward` | `integer NOT NULL` | Pontos extras ao conquistar |
| `color` | `text NOT NULL` | Cor hexadecimal |
| `empresa_id` | `uuid FK → empresas.id` | Empresa |
| `created_at` | `timestamptz` | Data de criação |

**Índices:** `empresa_id`, `trigger_type`

**Seed (`00043`):** 10 badges — Descobridor, Leitor Compromissado, Mestre do Conhecimento, Primeiro Passo, Caçador de Trilhas, Diamante, Líder, Sequência de Ouro, Veterano, Colecionador XP

---

### 4.6 `hub_user_badges` — Badges Conquistados

Relacionamento N:N entre usuários e badges.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `user_id` | `uuid FK → auth.users.id ON DELETE CASCADE` | Usuário |
| `badge_id` | `uuid FK → hub_badges.id ON DELETE CASCADE` | Badge |
| `earned_at` | `timestamptz NOT NULL` | Data da conquista |
| `empresa_id` | `uuid FK → empresas.id` | Empresa |

**Constraints:** `UNIQUE(user_id, badge_id)` — cada badge só pode ser conquistado uma vez

**Índices:** `user_id`, `badge_id`

---

### 4.7 `hub_invite_tokens` — Tokens de Convite

Sistema de convites para novos usuários se registrarem no Hub.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `token` | `text UNIQUE NOT NULL` | Token único do convite |
| `role` | `hub_app_role NOT NULL` | Role que será atribuída |
| `status` | `text NOT NULL` | `'pending'`, `'used'`, `'expired'` |
| `used_by` | `uuid FK → auth.users.id` | Quem usou o convite |
| `used_at` | `timestamptz` | Quando foi usado |
| `expires_at` | `timestamptz` | Data de expiração |
| `created_by` | `uuid FK → auth.users.id NOT NULL` | Quem criou |
| `empresa_id` | `uuid FK → empresas.id` | Empresa |
| `created_at` | `timestamptz` | Data de criação |
| `share_whatsapp_message` | `text` | Mensagem para compartilhar no WhatsApp |
| `share_link` | `text` | Link de compartilhamento |

**Índices:** `empresa_id`, `token`, `status`

---

## 5. Tabelas de Configuração

### 5.1 `hub_user_roles` — Roles dos Usuários

Define qual role cada usuário tem dentro do Hub, por empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `user_id` | `uuid FK → auth.users.id ON DELETE CASCADE` | Usuário |
| `role` | `hub_app_role NOT NULL` | Role no Hub |
| `empresa_id` | `uuid FK → empresas.id` | Empresa |
| `created_at` | `timestamptz` | Data de criação |

**Constraints:** `UNIQUE(user_id, empresa_id)` — uma role por usuário/empresa

**Índices:** `user_id`, `empresa_id`

---

### 5.2 `hub_system_config` — Configuração do Sistema (Singleton por Empresa)

Apenas um registro por empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id NOT NULL` | Empresa (UNIQUE) |
| `app_name` | `text NOT NULL` | Nome do app (ex: "Conexão Hub") |
| `logo_url` | `text` | URL do logo |
| `theme_dark` | `jsonb` | Tema dark (cores, etc.) |
| `environment_themes` | `jsonb` | Temas por ambiente |
| `show_mock_login_cards` | `boolean` | Exibir cards de login mock |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data de atualização |

**Trigger:** `hub_system_config_updated_at`

---

### 5.3 `hub_system_integrations` — Integrações AI (Singleton por Empresa)

Apenas um registro por empresa. Armazena chaves de API para serviços de IA.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id NOT NULL` | Empresa (UNIQUE) |
| `gemini_api_key` | `text` | Chave Gemini API |
| `openai_api_key` | `text` | Chave OpenAI API |
| `groq_api_key` | `text` | Chave Groq API |
| `openrouter_api_key` | `text` | Chave OpenRouter API |
| `gemini_function` | `text` | Função Gemini habilitada |
| `openai_function` | `text` | Função OpenAI habilitada |
| `groq_function` | `text` | Função Groq habilitada |
| `openrouter_function` | `text` | Função OpenRouter habilitada |
| `gemini_active` | `boolean` | Se Gemini está ativo |
| `openai_active` | `boolean` | Se OpenAI está ativo |
| `groq_active` | `boolean` | Se Groq está ativo |
| `openrouter_active` | `boolean` | Se OpenRouter está ativo |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data de atualização |

**Trigger:** `hub_system_integrations_updated_at`

---

### 5.4 `hub_chatbot_config` — Configuração do Chatbot (Singleton por Empresa)

Apenas um registro por empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id NOT NULL` | Empresa (UNIQUE) |
| `enabled` | `boolean` | Se o chatbot está habilitado |
| `webhook_url` | `text` | URL do webhook |
| `allowed_roles` | `hub_app_role[]` | Roles que podem usar o chatbot |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data de atualização |

**Trigger:** `hub_chatbot_config_updated_at`

---

## 6. Extensão do Profiles

Migração `00042` adicionou colunas Hub-specific à tabela `public.profiles`:

| Coluna | Tipo | Descrição |
|---|---|---|
| `hub_points` | `integer DEFAULT 0` | Pontos acumulados no Hub |
| `hub_status` | `hub_app_status DEFAULT 'pending'` | Status no Hub |
| `hub_allowed_types` | `hub_material_type[]` | Tipos de material permitidos |
| `hub_preferences` | `jsonb` | Preferências: `{"theme":"dark", "language":"pt-br"}` |

**Índices:**
- `profiles_hub_points_idx` ON `profiles(hub_points DESC)` — para ranking
- `profiles_hub_status_idx` ON `profiles(hub_status)` — para filtros

---

## 7. RLS Policies

Todas as 15 tabelas do Hub têm RLS ativado. O padrão geral é:

| Operação | Padrão de Acesso |
|---|---|
| `SELECT` | `is_super_admin_session()` OU `empresa_id = get_current_empresa_id()` |
| `INSERT` | `is_super_admin_session()` OU baseado em `created_by = auth.uid()` |
| `UPDATE` | `is_super_admin_session()` OU `created_by = auth.uid()` (ou `user_id = auth.uid()`) |
| `DELETE` | `is_super_admin_session()` (ou `created_by = auth.uid()` em alguns casos) |

### Policies por Grupo:

**Conteúdo** (`hub_materials`, `hub_collections`):
- SELECT: empresa_id match
- INSERT/UPDATE/DELETE: `created_by = auth.uid()` (criador pode gerenciar)

**Assets e Itens** (`hub_material_assets`, `hub_collection_items`):
- SELECT: qualquer um que acesse o material pai
- INSERT/UPDATE/DELETE: apenas se for o criador do material/coleção pai (via EXISTS)

**Progresso** (`hub_user_progress`, `hub_collection_progress`):
- SELECT: super_admin, próprio usuário, ou admin da empresa
- INSERT/UPDATE: apenas próprio usuário

**Logs** (`hub_access_logs`):
- SELECT: super_admin, próprio usuário, ou admin da empresa
- INSERT: apenas próprio usuário (log imutável)

**Gamificação** (`hub_gamification_levels`, `hub_badges`):
- SELECT: empresa_id match
- INSERT/UPDATE/DELETE: apenas super_admin

**Badges de Usuário** (`hub_user_badges`):
- SELECT: super_admin, próprio, ou admin da empresa
- INSERT: super_admin ou próprio usuário

**Convites** (`hub_invite_tokens`):
- SELECT: super_admin, criador, ou admin da empresa
- INSERT/UPDATE/DELETE: super_admin ou criador

**Config** (`hub_system_config`, `hub_system_integrations`, `hub_chatbot_config`):
- SELECT: empresa_id match
- INSERT/UPDATE: apenas super_admin

---

## 8. Permissões do Módulo

Definidas em `src/features/hub/permissions.ts`, registradas via `registerModule` em `module.ts`.

### Grupos de Permissões

| Grupo | Permissões | Descrição |
|---|---|---|
| **Hub - Materiais** | `hub_ver_materiais`, `hub_criar_material`, `hub_editar_material`, `hub_excluir_material`, `hub_gerenciar_assets`, `hub_publicar_material`, `hub_ver_acessos_material`, `hub_exportar_materiais` | Gestão completa de materiais |
| **Hub - Trilhas** | `hub_ver_trilhas`, `hub_criar_trilha`, `hub_editar_trilha`, `hub_excluir_trilha`, `hub_gerenciar_itens_trilha`, `hub_compartilhar_trilha` | Gestão de trilhas de aprendizado |
| **Hub - Gamificação** | `hub_ver_ranking`, `hub_gerenciar_badges`, `hub_gerenciar_niveis`, `hub_ver_conquistas` | Ranking, badges e níveis |
| **Hub - Usuários** | `hub_ver_usuarios`, `hub_editar_usuario`, `hub_aprovar_usuario`, `hub_gerenciar_convites` | Gestão de usuários do Hub |
| **Hub - Admin** | `hub_ver_analytics`, `hub_gerenciar_config`, `hub_gerenciar_integracoes`, `hub_gerenciar_chatbot`, `hub_gerenciar_webhooks_hub` | Configurações avançadas |

### Defaults por Ambiente

| Ambiente | Acesso |
|---|---|
| `cadastro` | **Tudo ativo** (full access) |
| `consultor` | Apenas `hub_ver_materiais`, `hub_ver_ranking`, `hub_ver_conquistas` |
| `tecnologia` | **Tudo ativo** (full access) |
| `suporte` | Tudo desativado |

---

## 9. Rotas do Frontend

### 21 rotas registradas no módulo:

| Rota | Arquivo | Perfil |
|---|---|---|
| `/global/hub` | `src/routes/global.hub.tsx` | Dashboard global |
| `/hub/admin/dashboard` | `src/routes/hub.admin.dashboard.tsx` | Admin |
| `/hub/admin/materiais` | `src/routes/hub.admin.materiais.tsx` | Admin |
| `/hub/admin/trilhas` | `src/routes/hub.admin.trilhas.tsx` | Admin |
| `/hub/admin/analytics` | `src/routes/hub.admin.analytics.tsx` | Admin |
| `/hub/admin/badges` | `src/routes/hub.admin.badges.tsx` | Admin |
| `/hub/admin/chatbot` | `src/routes/hub.admin.chatbot.tsx` | Admin |
| `/hub/gestor/dashboard` | `src/routes/hub.gestor.dashboard.tsx` | Gestor |
| `/hub/gestor/analytics` | `src/routes/hub.gestor.analytics.tsx` | Gestor |
| `/hub/gestor/ranking` | `src/routes/hub.gestor.ranking.tsx` | Gestor |
| `/hub/gestor/conquistas` | `src/routes/hub.gestor.conquistas.tsx` | Gestor |
| `/hub/consultor/dashboard` | `src/routes/hub.consultor.dashboard.tsx` | Consultor |
| `/hub/consultor/ranking` | `src/routes/hub.consultor.ranking.tsx` | Consultor |
| `/hub/consultor/conquistas` | `src/routes/hub.consultor.conquistas.tsx` | Consultor |
| `/hub/distribuidor/dashboard` | `src/routes/hub.distribuidor.dashboard.tsx` | Distribuidor |
| `/hub/distribuidor/conquistas` | `src/routes/hub.distribuidor.conquistas.tsx` | Distribuidor |
| `/hub/cliente/dashboard/$empresaId` | `src/routes/hub.cliente.dashboard.$empresaId.tsx` | Cliente |
| `/empresa/hub/tema` | `src/routes/empresa.hub.tema.tsx` | Admin (config tema) |
| `/empresa/hub/chatbot` | `src/routes/empresa.hub-chatbot.tsx` | Admin (config chatbot) |
| `/hub/design` | `src/routes/hub.design.tsx` | Admin (design config) |
| `/empresa/hub-design` | `src/routes/empresa.hub-design.tsx` | Admin |

### Estrutura de Components (36 arquivos)

```
src/features/hub/
├── components/
│   ├── admin/       ThemeEditorPanel.tsx
│   ├── chat/        ChatWidget.tsx
│   ├── collections/ CollectionCard.tsx, CollectionFormModal.tsx
│   ├── gamification/ BadgeDisplay.tsx, BadgeFormModal.tsx, RankingBoard.tsx
│   ├── layout/      HubLayout.tsx, HubSidebar.tsx
│   ├── materials/   MaterialCard.tsx, MaterialFormModal.tsx
│   └── shared/      GlobalEffects.tsx
├── pages/
│   ├── admin/       AdminAnalyticsPage, AdminBadgesPage, AdminChatbotPage,
│   │                AdminMateriaisPage, AdminTrilhasPage
│   ├── HubConquistasPage.tsx
│   ├── HubDashboardPage.tsx
│   └── HubRankingPage.tsx
├── services/        chatbot, collections, config, gamification,
│                    integrations, invites, materials, progress
├── hooks/           useHubGamification.ts
├── lib/             badge-animations.css, hub-theme.css
├── module.ts
├── permissions.ts
├── types.ts
├── constants.ts
└── index.ts
```

---

## 10. Migrações Relacionadas

| Migration | Descrição |
|---|---|
| `00041_hub_module.sql` | **CORE**: 15 tabelas, 7 ENUMs, RLS, índices, triggers |
| `00042_hub_profiles_extension.sql` | Extensão `profiles`: `hub_points`, `hub_status`, `hub_allowed_types`, `hub_preferences` |
| `00043_hub_seed_data.sql` | Seed: 8 níveis de gamificação + 10 badges padrão |
| `00044_hub_seed_materials.sql` | Seed: 25 materiais (clientes, consultores, distribuidores, gestores) + 3 trilhas |
| `00045_fix_hub_materials_empresa.sql` | Fix: corrige `empresa_id` dos materiais seed para a empresa do primeiro usuário |
| `00049_empresa_modulo_limits.sql` | Limites de credenciais: sistema de modulação por `modulo_key` (referencia `hub-conexao`) |

---

## 11. Diagrama de Relacionamentos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               public.profiles                                │
│  hub_points (INT), hub_status, hub_allowed_types[], hub_preferences (JSONB)  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              hub_user_roles                                  │
│  user_id │ role (hub_app_role) │ empresa_id                                   │
│  UNIQUE(user_id, empresa_id)                                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              hub_materials                                    │
│  id (PK) │ title (JSONB i18n) │ type │ allowed_roles[] │ points │ tags[]      │
│  empresa_id │ created_by                                                      │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                          hub_material_assets                                  │
│  material_id │ language │ url │ subtitle_url │ status                         │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              hub_collections                                  │
│  id (PK) │ title (JSONB i18n) │ description │ points │ allowed_roles[]        │
│  empresa_id │ created_by                                                      │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N             ┌─────────────────────────────────────────────────────────┐
┌──▼─────────────────▼────────────────────┐                                    │
│          hub_collection_items            │                                    │
│  collection_id │ material_id │ order_idx │                                    │
│  UNIQUE(collection_id, material_id)      │                                    │
└──────────────────────────────────────────┘                                    │
                                                                                │
   ┌───────────────────────────────────────────────────────────────────────────┘
   │
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                          hub_user_progress                                    │
│  user_id │ material_id │ collection_id? │ status │ completed_at               │
│  UNIQUE(user_id, material_id)                                                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        hub_collection_progress                                │
│  user_id │ collection_id │ status │ started_at │ completed_at                 │
│  UNIQUE(user_id, collection_id)                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          hub_access_logs  [IMUTÁVEL]                          │
│  material_id │ user_id │ user_role │ language │ timestamp                     │
│  material_title (desnormalizado) │ user_name (desnormalizado)                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐
│ hub_gamification_    │  │     hub_badges        │  │   hub_user_badges      │
│ levels               │  │ trigger_type          │  │ user_id │ badge_id     │
│ name │ min_points    │  │ trigger_value         │  │ UNIQUE(user,badge)     │
│ order │ color        │  │ points_reward         │  └────────────────────────┘
└──────────────────────┘  └──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          hub_invite_tokens                                    │
│  token (UNIQUE) │ role │ status │ used_by? │ expires_at │ share_link          │
│  created_by │ empresa_id                                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐
│   hub_system_config   │  │  hub_system_         │  │   hub_chatbot_config   │
│  (singleton/empresa)  │  │  integrations         │  │  (singleton/empresa)   │
│  app_name │ logo_url  │  │  (singleton/empresa)  │  │  enabled │ webhook_url │
│  theme_dark │ ...     │  │  gemini_api_key ...   │  │  allowed_roles[]       │
└──────────────────────┘  └──────────────────────┘  └────────────────────────┘
```

---

## Notas Finais

1. **Independência do Módulo:** O Hub é o módulo mais isolado do ERP — suas tabelas raramente referenciam tabelas de outros módulos (apenas `empresas` e `profiles`/`auth.users`).

2. **Sistema de Roles Próprio:** Diferente do resto do ERP que usa `app_role` (`super_admin`, `gestor`, `consultor`), o Hub tem suas próprias roles: `client`, `distributor`, `consultant`, `manager`, `super_admin`. Isso permite que clientes finais e distribuidores usem o Hub sem precisar de contas de administrador do ERP.

3. **Multi-idioma Nativo:** Todos os conteúdos textuais (títulos, descrições) usam `jsonb` com chaves `pt-br`, `en-us`, `es-es` em vez de colunas separadas. Assets também são organizados por idioma.

4. **Singleton por Empresa:** As tabelas `hub_system_config`, `hub_system_integrations` e `hub_chatbot_config` têm `UNIQUE(empresa_id)`, garantindo exatamente um registro por empresa.

5. **Logs Imutáveis:** `hub_access_logs` é uma tabela de append-only — apenas INSERT e SELECT. Dados como `material_title` e `user_name` são desnormalizados para preservar o histórico mesmo se o material ou usuário for alterado.

6. **Gamificação Automática:** Badges são concedidos por triggers predefinidos (conclusão de materiais, pontos acumulados, dias de streak, posição no ranking). O sistema verifica e concede automaticamente.

7. **Seed Robusto:** 25 materiais pré-cadastrados divididos por role (6 para clientes, 7 para consultores, 6 para distribuidores, 6 para gestores) + 3 trilhas de aprendizado + 10 badges + 8 níveis de gamificação.
