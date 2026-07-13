# Análise do Banco de Dados — Módulo Global (Infraestrutura Compartilhada)

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabela Profiles (Usuários)](#2-tabela-profiles-usuários)
3. [Tabela Permissões](#3-tabela-permissões)
4. [Tabela Atividades (Timeline/Logs)](#4-tabela-atividades-timelinelogs)
5. [Tabela Documentos](#5-tabela-documentos)
6. [Tabela Credenciais](#6-tabela-credenciais)
7. [Tabelas de Notificações](#7-tabelas-de-notificações)
8. [Tabelas de Webhooks](#8-tabelas-de-webhooks)
9. [Tabela App Config](#9-tabela-app-config)
10. [Tabela Mock Credentials](#10-tabela-mock-credentials)
11. [Tabela Integrações Config](#11-tabela-integrações-config)
12. [Tabela Form Schema](#12-tabela-form-schema)
13. [Tabela API Connectors](#13-tabela-api-connectors)
14. [Tabelas do Subsistema CRM Antigo](#14-tabelas-do-subsistema-crm-antigo)
15. [Tabelas Legadas (Pacientes, Contratos, Leads)](#15-tabelas-legadas-pacientes-contratos-leads)
16. [RPCs Globais](#16-rpcs-globais)
17. [Triggers e Funções Globais](#17-triggers-e-funções-globais)
18. [RLS Policies — Sumário](#18-rls-policies--sumário)
19. [Views — Sumário](#19-views--sumário)
20. [Rotas do Frontend Global](#20-rotas-do-frontend-global)
21. [Arquitetura do Código Frontend](#21-arquitetura-do-código-frontend)
22. [Migrações Relacionadas](#22-migrações-relacionadas)
23. [Diagrama de Relacionamentos](#23-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Global** não é um módulo de negócio, mas sim o conjunto de **tabelas de infraestrutura compartilhada** que dão suporte a todos os outros módulos. Estas tabelas não são propriedade de nenhuma feature específica — são serviços de plataforma que cruzam todo o sistema.

**O que compõe o módulo Global:**

| Categoria | Tabelas | Propsósito |
|---|---|---|
| **Usuários** | `profiles` | Extensão do `auth.users` do Supabase |
| **Permissões** | `permissoes` | Permissões granulares + modulos_acesso |
| **Timeline** | `atividades` | Log de atividades/eventos |
| **Documentos** | `documentos` | Upload e gestão de documentos |
| **Credenciais** | `credenciais` | Credenciais de acesso da equipe |
| **Notificações** | `notificacoes`, `notificacoes_templates` | Notificações in-app + templates |
| **Webhooks** | `webhooks`, `webhook_logs` | Integração via webhooks |
| **Config** | `app_config` | Configurações de ambiente no banco |
| **Mock** | `mock_credentials` | Credenciais de teste/seed |
| **Integrações** | `integracoes_config` | Config de integrações (WhatsApp, CEP, etc.) |
| **Formulário** | `form_schema` | Schema dinâmico do formulário de cadastro |
| **API Connectors** | `api_connectors` | Conectores de API para workflow |
| **CRM Antigo** | `usuarios`, `clientes`, `visitas`, `logs_transferencia`, `convites_acesso`, `logs_transferencia_consultor` | Subsistema de CRM legado |
| **Legado** | ~~`pacientes`~~, ~~`contratos`~~, ~~`leads`~~ | Tabelas removidas (migration 00005) |

**Total: ~20 tabelas ativas** — o maior conjunto de tabelas não-feature do sistema.

---

## 2. Tabela Profiles (Usuários)

### `public.profiles` — Extensão de `auth.users`

Tabela que estende o usuário de autenticação do Supabase com dados de perfil, role, empresa e permissões.

| Coluna | Tipo | Origem | Descrição |
|---|---|---|---|
| `id` | `uuid PK FK → auth.users.id ON DELETE CASCADE` | 00001 | ID do usuário (mesmo do auth) |
| `email` | `text NOT NULL` | 00001 | Email |
| `nome` | `text NOT NULL DEFAULT ''` | 00001 | Nome |
| `role` | `text NOT NULL DEFAULT 'viewer' CHECK(admin, editor, viewer)` | 00001 | Role de acesso |
| `avatar_url` | `text` | 00001 | URL do avatar |
| `ambiente` | `text NOT NULL DEFAULT 'ambos' CHECK(cadastro, consultor, tecnologia, ambos, suporte)` | 00005 | Ambiente de trabalho |
| `departamento` | `text` | 00005 | Departamento |
| `ativo` | `boolean DEFAULT true` | 00005 | Se está ativo |
| `is_super_admin` | `boolean DEFAULT false` | 00006 | Flag de super admin |
| `celular` | `text` | 00031 | Celular |
| `empresa_id` | `uuid FK → empresas.id ON DELETE SET NULL` | 00023 | Empresa (multi-tenant) |
| `hub_points` | `integer DEFAULT 0` | 00042 | Pontos de gamificação (Hub) |
| `hub_status` | `hub_app_status DEFAULT 'pending'` | 00042 | Status no Hub |
| `hub_allowed_types` | `hub_material_type[]` | 00042 | Tipos de material permitidos |
| `hub_preferences` | `jsonb DEFAULT '{"theme":"dark","language":"pt-br"}'` | 00042 | Preferências do Hub |
| `created_at` | `timestamptz DEFAULT now()` | 00001 | Data de criação |

**Total de colunas:** 16

**Trigger:** `on_auth_user_created` (SECURITY DEFINER) — cria profile automaticamente ao criar usuário em `auth.users`.

**Índices:** `profiles_hub_points_idx`, `profiles_hub_status_idx`

**RLS (evolução):**
- **Antes de 00023:** Usuário vê próprio perfil; admin vê todos
- **Após 00023:** `is_super_admin_session()` OR `empresa_id = get_current_empresa_id()` OR `id = auth.uid()` (SELECT); apenas super admin INSERT/UPDATE/DELETE

---

## 3. Tabela Permissões

### `public.permissoes` — Permissões Granulares

| Coluna | Tipo | Descrição |
|---|---|---|
| `usuario_id` | `uuid PK FK → profiles.id ON DELETE CASCADE` | Usuário |
| `permissoes` | `jsonb NOT NULL DEFAULT '{}'` | Permissões em JSON |
| `modulos_acesso` | `jsonb DEFAULT '{}'` | Acesso a módulos (add posteriormente) |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |
| `updated_by` | `uuid FK → auth.users.id` | Quem atualizou |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa (add 00023) |

**17 chaves de permissão no JSONB:**

| Chave | Descrição |
|---|---|
| `ver_todos_cadastros` | Ver todos os cadastros |
| `aprovar_cadastro` | Aprovar cadastro |
| `reprovar_cadastro` | Reprovar cadastro |
| `solicitar_correcao_cadastro` | Solicitar correção |
| `aprovar_documento` | Aprovar documento |
| `reprovar_documento` | Reprovar documento |
| `solicitar_correcao_documento` | Solicitar correção de documento |
| `aprovar_campo` | Aprovar campo |
| `reprovar_campo` | Reprovar campo |
| `solicitar_correcao_campo` | Solicitar correção de campo |
| `visualizar_documento` | Visualizar documento |
| `excluir_cadastro` | Excluir cadastro |
| `gerenciar_credenciais` | Gerenciar credenciais |
| `gerenciar_credenciais_admin` | Gerenciar credenciais admin |
| `gerenciar_config` | Gerenciar configurações |
| `gerar_links` | Gerar links |
| `ver_relatorios` | Ver relatórios |

**Permissões padrão por ambiente:**
- **consultor:** apenas `gerar_links` e `ver_relatorios`
- **cadastro:** quase tudo, exceto `excluir_cadastro`, `gerenciar_credenciais`, `gerenciar_config`
- **tecnologia:** apenas `gerenciar_credenciais` e `gerenciar_credenciais_admin`
- **suporte:** apenas `gerenciar_credenciais`
- **ambos:** tudo exceto `excluir_cadastro` e `gerenciar_config`

**Trigger:** `on_profile_created_permissoes` — insere permissões padrão baseadas no `ambiente` ao criar profile.

**RLS (evolução):**
- **00010 original:** Super admin ALL, usuário vê própria
- **00023 (multiempresa):** Adiciona `empresa_id`; admin da empresa vê todas da empresa

---

## 4. Tabela Atividades (Timeline/Logs)

### `public.atividades` — Timeline de Eventos

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `entidade_tipo` | `text NOT NULL CHECK(cadastro)` | Tipo da entidade (apenas 'cadastro') |
| `entidade_id` | `uuid NOT NULL` | ID da entidade |
| `acao` | `text NOT NULL` | Ação realizada |
| `descricao` | `text DEFAULT ''` | Descrição |
| `usuario_id` | `uuid FK → profiles.id` | Usuário executor |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa (add 00023) |

**Evolução do CHECK:**
- Original: `CHECK(lead, contrato, paciente)`
- 00005: alterado para `CHECK(cadastro)` — as entidades legadas (lead, contrato) foram removidas

**Triggers:**
- `trg_atividades_set_usuario_id` — seta `usuario_id = auth.uid()` automaticamente no INSERT

**RLS:**
- Admin vê todas, consultor vê próprias, todos podem inserir

---

## 5. Tabela Documentos

### `public.documentos` — Documentos de Cadastro

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `cadastro_id` | `uuid FK → cadastros.id ON DELETE CASCADE NOT NULL` | Cadastro |
| `tipo` | `text NOT NULL` | Tipo (ex: cro_frente, cnh_frente) |
| `url` | `text NOT NULL` | URL do arquivo |
| `status` | `text DEFAULT 'pendente'` | Status (pendente, ok, reprovado, em_correcao) |
| `comentario_reprovacao` | `text` | Motivo da reprovação (add posteriormente) |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa (add 00023) |

**Armazenamento:** Os arquivos ficam no bucket `documentos` do Supabase Storage.

**Tipos de documentos:**
- PF: cro_frente, cro_verso, cnh_frente, cnh_verso, comprovante_endereco
- PJ: mesmos + contrato_social, declaracao_prestacao_servico

**RLS:** Admin vê todos, consultor vê próprios, todos podem inserir

---

## 6. Tabela Credenciais

### `public.credenciais` — Credenciais de Acesso da Equipe

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `created_by` | `uuid FK → profiles.id` | Quem criou |
| `nome_completo` | `text NOT NULL` | Nome |
| `email_corporativo` | `text NOT NULL` | Email |
| `whatsapp_corporativo` | `text` | WhatsApp |
| `departamento` | `text` | Departamento |
| `ativo` | `boolean DEFAULT true` | Se está ativo |
| `escopos` | `jsonb DEFAULT '[]'` | Escopos de acesso (add posteriormente) |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa (add 00023) |

**RLS:** Admin/super admin apenas (SELECT e ALL)

---

## 7. Tabelas de Notificações

### 7.1 `public.notificacoes` — Notificações Individuais

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `usuario_id` | `uuid FK → profiles.id ON DELETE CASCADE NOT NULL` | Destinatário |
| `titulo` | `text NOT NULL` | Título |
| `mensagem` | `text NOT NULL` | Mensagem |
| `lida` | `boolean DEFAULT false` | Se foi lida |
| `dados` | `jsonb` | Dados adicionais |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa (add 00023) |

**RLS:** Usuário vê/atualiza próprias notificações; todos autenticados podem criar

### 7.2 `public.notificacoes_templates` — Templates

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `evento` | `text UNIQUE NOT NULL` | Evento disparador |
| `titulo` | `text NOT NULL` | Título do template |
| `corpo_template` | `text NOT NULL` | Corpo com placeholders `{{var}}` |
| `ordem` | `integer DEFAULT 0` | Ordem |
| `destinatario_tipo` | `text` | Tipo de destinatário |
| `ativo` | `boolean DEFAULT true` | Se está ativo |
| `empresa_id` | `uuid` | Empresa (add posteriormente) |
| `modulo_key` | `text` | Módulo associado |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |

**Templates padrão seed:**
- `cadastro_correcao` — Pendente de Correção
- `cadastro_reprovado` — Cadastro Reprovado
- `cadastro_aprovado` — Cadastro Aprovado!
- `cadastro_em_analise` — Novo Cadastro Enviado
- `criacao_credencial` — Nova Credencial Criada

**RLS:** Todos autenticados SELECT; super admin ALL

---

## 8. Tabelas de Webhooks

### 8.1 `public.webhooks` — Configuração de Webhooks

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `nome` | `text NOT NULL` | Nome |
| `evento` | `text NOT NULL` | Evento disparador |
| `tipo_evento` | `text NOT NULL DEFAULT 'button_action' CHECK(status_change, button_action)` | Tipo de evento |
| `url` | `text NOT NULL` | URL de destino |
| `metodo` | `text NOT NULL DEFAULT 'POST'` | Método HTTP |
| `headers` | `jsonb DEFAULT '{}'` | Headers customizados |
| `body_template` | `jsonb DEFAULT '{}'` | Template do body |
| `ordem` | `integer DEFAULT 0` | Ordem de execução |
| `ativo` | `boolean DEFAULT true` | Se está ativo |
| `modulo_key` | `text` | Módulo associado |
| `evento_key` | `text` | Chave do evento |
| `evento_custom` | `text` | Evento customizado |
| `empresa_id` | `uuid FK → empresas.id` | Empresa (add posteriormente) |
| `created_at` | `timestamptz DEFAULT now()` | Data de criação |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |

**RLS (evolução):**
- **00006 original:** Apenas super admin
- **00008 (blindagem):** Qualquer autenticado SELECT (para disparar); super admin CRUD
- **00023 (multiempresa):** Admin da empresa + super admin

### 8.2 `public.webhook_logs` — Logs de Execução

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `webhook_id` | `uuid FK → webhooks.id` | Webhook |
| `evento` | `text` | Evento |
| `url` | `text` | URL chamada |
| `status_code` | `int` | Código HTTP |
| `resposta` | `text` | Resposta (truncada 2000) |
| `sucesso` | `boolean` | Se foi sucesso |
| `payload_enviado` | `jsonb` | Payload enviado |
| `empresa_id` | `uuid` | Empresa |
| `created_at` | `timestamptz DEFAULT now()` | Data |

**RLS:** Qualquer autenticado pode ver e inserir

---

## 9. Tabela App Config

### `public.app_config` — Configurações de Ambiente

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `key` | `text UNIQUE NOT NULL` | Chave da config |
| `value` | `text NOT NULL` | Valor |
| `description` | `text` | Descrição |
| `type` | `text NOT NULL DEFAULT 'env' CHECK(env, internal)` | Tipo |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |
| `updated_by` | `uuid FK → profiles.id` | Quem atualizou |

**Seeds (migration 00006):**
- `VITE_SUPABASE_URL` — URL do Supabase
- `VITE_SUPABASE_ANON_KEY` — Chave anônima
- `SUPABASE_DB_PASSWORD` — Senha do banco

**RLS:** Apenas super admin

---

## 10. Tabela Mock Credentials

### `public.mock_credentials` — Credenciais de Teste

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `identifier` | `text UNIQUE NOT NULL` | Identificador |
| `email` | `text NOT NULL` | Email |
| `password` | `text NOT NULL` | Senha |
| `role` | `text NOT NULL CHECK(admin, editor, viewer)` | Role |
| `ambiente` | `text CHECK(cadastro, consultor, tecnologia, ambos, suporte)` | Ambiente |
| `ativo` | `boolean DEFAULT true` | Ativo |
| `created_at` | `timestamptz DEFAULT now()` | Data |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |

**Seeds (migration 00006):**
- `SUPER_ADMIN` — hevertoneduardoperes@gmail.com
- `CADASTRO` — cadastro@conexao.com.br
- `CONSULTOR` — consultor@conexao.com.br
- `TI` — ti@conexao.com.br

**RLS:** Apenas super admin

---

## 11. Tabela Integrações Config

### `public.integracoes_config` — Configurações de Serviços Externos

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `chave` | `text UNIQUE NOT NULL` | Chave da integração |
| `nome` | `text NOT NULL` | Nome |
| `ativo` | `boolean DEFAULT false` | Se está ativa |
| `config` | `jsonb DEFAULT '{}'` | Configurações |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa (add 00023) |
| `created_at` | `timestamptz DEFAULT now()` | Data |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |

**Integrações padrão seed:**
| Chave | Nome | Config Padrão |
|---|---|---|
| `evolution_api` | Evolution API (WhatsApp) | `base_url`, `api_key`, `instancia` |
| `cep_api` | CEP Resiliente (BrasilAPI/ViaCEP) | `provider` |
| `google_sheets` | Google Sheets (Exportação) | `spreadsheet_id`, `client_email`, `private_key` |
| `google_drive` | Google Drive (Armazenamento) | `folder_id`, `client_email`, `private_key` |
| `google_maps` | Google Maps (Geolocalização) | `api_key` |
| `gmail_smtp` | SMTP/E-mail (Notificações) | `host`, `port`, `user`, `pass`, `secure` |

**RPC associada:** `public.enviar_whatsapp_evolution(contato text, mensagem text)` — dispara WhatsApp via Evolution API usando `pg_net` de forma assíncrona.

**RLS:** Apenas super admin

---

## 12. Tabela Form Schema

### `public.form_schema` — Schema Dinâmico do Formulário

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `tipo_pessoa` | `text NOT NULL CHECK(PF, PJ, ambos)` | Tipo de pessoa |
| `etapa` | `text NOT NULL CHECK(dados, endereco, documentos)` | Etapa do formulário |
| `campo_key` | `text NOT NULL` | Chave do campo |
| `label` | `text NOT NULL` | Label |
| `tipo_input` | `text NOT NULL DEFAULT 'text'` | Tipo de input |
| `opcoes` | `jsonb DEFAULT '[]'` | Opções (select) |
| `obrigatorio` | `bool NOT NULL DEFAULT true` | Se é obrigatório |
| `visivel` | `bool NOT NULL DEFAULT true` | Se é visível |
| `ordem` | `int NOT NULL DEFAULT 0` | Ordem |
| `is_custom` | `bool NOT NULL DEFAULT false` | Se é campo customizado |
| `empresa_id` | `uuid FK → empresas.id` | Empresa (add 00023) |
| `created_at` | `timestamptz DEFAULT now()` | Data |

**Restrições:** `UNIQUE(tipo_pessoa, campo_key)`

**Seeds:** ~33 campos para PF, PJ, endereço (ambos) e documentos

**RLS:**
- SELECT: todos — leitura pública
- INSERT/UPDATE/DELETE: apenas super admin

---

## 13. Tabela API Connectors

### `public.api_connectors` — Conectores de API

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `name` | `text NOT NULL` | Nome |
| `type` | `text` | Tipo (api_call, webhook) |
| `method` | `text NOT NULL` | Método HTTP |
| `url` | `text NOT NULL` | URL |
| `headers` | `jsonb DEFAULT '{}'` | Headers |
| `query_params` | `jsonb DEFAULT '{}'` | Query params |
| `body_template` | `text` | Template do body |
| `response_schema` | `jsonb` | Schema de resposta |
| `evento` | `text` | Evento disparador |
| `tipo_evento` | `text` | Tipo |
| `is_active` | `boolean DEFAULT true` | Ativo |
| `ordem` | `integer DEFAULT 0` | Ordem |
| `empresa_id` | `uuid FK → empresas.id` | Empresa |
| `modulo_key` | `text` | Módulo |
| `created_at` | `timestamptz DEFAULT now()` | Data |
| `updated_at` | `timestamptz DEFAULT now()` | Última atualização |

**RPC associada:** `executar_api_connector_server` (chamada server-side)

---

## 14. Tabelas do Subsistema CRM Antigo

Estas tabelas foram criadas na migration `20260512144729_cc13f5b1-7d42-4bd9-a87d-9816c73d87ac.sql` como um subsistema de CRM independente com sua própria hierarquia de usuários (`usuarios`) e gestão de clientes separada. Este subsistema coexiste com o módulo CRM mais recente (`src/features/crm/`).

### 14.1 `public.usuarios` — Usuários do CRM

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK FK → auth.users.id ON DELETE CASCADE` | ID do auth |
| `nome_completo` | `varchar(255) NOT NULL` | Nome |
| `email_corporativo` | `varchar(255) UNIQUE NOT NULL` | Email |
| `role` | `app_role NOT NULL DEFAULT 'consultor'` | Role (super_admin, gestor, consultor) |
| `gestor_id` | `uuid FK → usuarios.id ON DELETE SET NULL` | Gestor (auto-referência) |
| `ativo` | `boolean NOT NULL DEFAULT true` | Ativo |
| `criado_em` | `timestamptz NOT NULL DEFAULT now()` | Data |

### 14.2 `public.clientes` — Clientes do CRM

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador |
| `nome_doutor` | `varchar(255) NOT NULL` | Nome |
| `nome_clinica` | `varchar(255)` | Clínica |
| `telefone_contato` | `varchar(20)` | Telefone |
| `consultor_atual_id` | `uuid FK → usuarios.id ON DELETE SET NULL` | Consultor atual |
| `criado_em` | `timestamptz DEFAULT now()` | Data |
| `atualizado_em` | `timestamptz` | Última atualização |

### 14.3 `public.visitas` — Visitas Comerciais

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador |
| `cliente_id` | `uuid FK → clientes.id ON DELETE CASCADE NOT NULL` | Cliente |
| `consultor_executor_id` | `uuid FK → usuarios.id NOT NULL` | Consultor |
| `data_visita` | `date NOT NULL` | Data |
| `atendente` | `varchar(255) NOT NULL` | Atendente |
| `cargo_atendente` | `cargo_atendente NOT NULL` | Cargo |
| `tipo_visita` | `tipo_visita NOT NULL` | Tipo |
| `gerou_orcamento` | `boolean DEFAULT false` | Orçamento |
| `gerou_pedido` | `boolean DEFAULT false` | Pedido |
| `valor_estimado` | `decimal(10,2)` | Valor |
| `interesse_escala` | `integer CHECK(1-5)` | Interesse |
| `temperatura_vendedor` | `temperatura_vendedor NOT NULL` | Temperatura |
| `probabilidade_fechamento` | `probabilidade_fechamento` | Probabilidade |
| `feedback_cliente` | `text` | Feedback |
| `observacoes_vendedor` | `text` | Observações |
| `data_proximo_contato` | `date` | Próximo contato |
| `acao_prevista` | `varchar(255)` | Ação |
| `criado_em` | `timestamptz DEFAULT now()` | Data |

### 14.4 `public.logs_transferencia` — Logs de Transferência de Clientes

Trigger automático no UPDATE de `clientes.consultor_atual_id`.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador |
| `cliente_id` | `uuid FK → clientes.id ON DELETE CASCADE` | Cliente |
| `de_consultor_id` | `uuid FK → usuarios.id` | Consultor anterior |
| `para_consultor_id` | `uuid FK → usuarios.id` | Novo consultor |
| `transferido_por_id` | `uuid FK → usuarios.id` | Quem transferiu |
| `data_transferencia` | `timestamptz DEFAULT now()` | Data |

### 14.5 `public.convites_acesso` — Convites

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador |
| `email_destino` | `varchar(255) NOT NULL` | Email |
| `token_hash` | `varchar(255) UNIQUE NOT NULL` | Token |
| `role_atribuida` | `app_role NOT NULL` | Role |
| `gestor_vinculado_id` | `uuid FK → usuarios.id` | Gestor |
| `data_expiracao` | `timestamptz NOT NULL` | Expiração |
| `status` | `convite_status DEFAULT 'pendente'` | Status |
| `criado_por_id` | `uuid FK → usuarios.id` | Criador |
| `criado_em` | `timestamptz DEFAULT now()` | Data |

### 14.6 `public.logs_transferencia_consultor` (migration 20260512155159)

Tabela adicional de log de transferências de consultores.

---

## 15. Tabelas Legadas

### Tabelas Removidas

| Tabela | Criada em | Removida em | Motivo |
|---|---|---|---|
| `public.pacientes` | 00002 | 00005 | Substituída pelo schema de cadastros |
| `public.contratos` | 00002 | 00005 | Substituída pelo schema de cadastros |
| `public.leads` | 00002 | 00005 | Substituída pelo schema de cadastros |

### Tabela Deprecada

| Tabela | Criada em | Situação |
|---|---|---|
| `public.empresa_role_limits` | 00048 | **Removida** em 00049, substituída por `empresa_modulo_limits` |

---

## 16. RPCs Globais

### De Segurança

| RPC | Descrição | Security |
|---|---|---|
| `is_super_admin_session()` | Verifica se usuário é super admin | SQL STABLE |
| `is_admin_or_super()` | Verifica se é admin/super | SQL STABLE, SECURITY DEFINER |
| `get_current_empresa_id()` | Retorna empresa_id do profile | SQL STABLE |
| `pode_acessar_empresa(uuid)` | Verifica acesso à empresa | SQL STABLE |
| `has_role(uuid, app_role)` | Verifica role do usuário no CRM | SQL STABLE, SECURITY DEFINER |
| `is_gestor_de(uuid, uuid)` | Verifica hierarquia gestor-consultor | SQL STABLE, SECURITY DEFINER |
| `current_role()` | Retorna role do CRM atual | SQL STABLE, SECURITY DEFINER |

### De Negócio

| RPC | Descrição | Security |
|---|---|---|
| `verificar_documento_duplicado(text, text)` | Verifica CPF/CNPJ duplicado | SECURITY DEFINER |
| `get_cadastro_by_token(text)` | Busca cadastro por token | SECURITY DEFINER |
| `update_cadastro_from_precadastro(...)` | Atualiza cadastro via pré-cadastro | SECURITY DEFINER |
| `registrar_acesso_token(text)` | Registra acesso via token | SECURITY DEFINER |
| `limpar_links_expirados()` | Limpa links expirados | SECURITY DEFINER |
| `gerar_2fa_pin(text, text, text, text)` | Gera PIN 2FA | SECURITY DEFINER |
| `validar_2fa_pin(text, text)` | Valida PIN 2FA | SECURITY DEFINER |
| `enviar_whatsapp_evolution(text, text)` | Dispara WhatsApp | SECURITY DEFINER |
| `admin_criar_usuario(...)` | Cria usuário (admin) | SECURITY DEFINER (service_role) |
| `admin_atualizar_senha(uuid, text)` | Atualiza senha | SECURITY DEFINER (service_role) |
| `admin_deletar_usuario(uuid)` | Deleta usuário | SECURITY DEFINER (service_role) |
| `count_credenciais_by_empresa_modulo(uuid, text)` | Conta credenciais | SECURITY DEFINER |
| `check_empresa_modulo_limit(uuid, text)` | Verifica limite | SECURITY DEFINER |

---

## 17. Triggers e Funções Globais

| Trigger | Tabela | Função | Descrição |
|---|---|---|---|
| `on_auth_user_created` | `auth.users` (AFTER INSERT) | `handle_new_user()` | Cria profile ao criar usuário |
| `on_profile_created_permissoes` | `profiles` (AFTER INSERT) | `handle_new_profile_permissoes()` | Cria permissões padrão ao criar profile |
| `trg_cadastros_set_created_by` | `cadastros` (BEFORE INSERT) | `set_created_by()` | Seta created_by = auth.uid() |
| `trg_atividades_set_usuario_id` | `atividades` (BEFORE INSERT) | `set_usuario_id()` | Seta usuario_id = auth.uid() |
| `trg_log_transferencia` | `clientes` (BEFORE UPDATE) | `log_transferencia_cliente()` | Registra transferência |

---

## 18. RLS Policies — Sumário

### Por Nível de Acesso

| Nível | Tabelas | Quem Acessa |
|---|---|---|
| **🔴 Super Admin Only** | `app_config`, `mock_credentials`, `integracoes_config` | Apenas super admin |
| **🟡 Super Admin + Admin Empresa** | `webhooks`, `credenciais`, `permissoes` (após 00023) | Super admin ou admin da empresa |
| **🟢 Autenticados (com filtro)** | `profiles`, `atividades`, `notificacoes`, `documentos` | Todos autenticados, filtrados por empresa/usuário |
| **🔵 Público (SELECT)** | `form_schema`, `empresas_config` | Qualquer um (inclusive anônimo) |
| **⚪ Grants explícitos** | `linktree_empresa_*` | Grants específicos para anon e authenticated |

### Padrão Mais Comum

```
is_super_admin_session() OR empresa_id = get_current_empresa_id()
```

Este padrão é usado por ~90% das tabelas do sistema, mas **não está presente** nas tabelas de infraestrutura mais sensíveis (`app_config`, `mock_credentials`), que permanecem exclusivas do super admin.

---

## 19. Views — Sumário

| View | Criada em | Descrição |
|---|---|---|
| `public.clientes` | 00005 | Join de cadastros + cadastros_pf + cadastros_pj + enderecos |
| `public.clientes` (recriada) | 00014 | Mesma view com colunas adicionais de 2FA |
| `public.clientes` (recriada) | 00023 | Mesma view com `empresa_id` |
| ~~`public.pacientes`~~ | 00001 | Removida em 00005 |

**Todas as views têm `security_invoker = true`** (definido em 00008), garantindo que respeitem as RLS policies das tabelas base.

---

## 20. Rotas do Frontend Global

### Rotas Super Admin

| Rota | Descrição |
|---|---|
| `/global/empresas` | Listagem de empresas |
| `/global/empresas/$id` | Detalhe da empresa |
| `/global/permissoes` | Gerenciamento de permissões |
| `/global/modulos` | Módulos do sistema |
| `/global/modulos/$key` | Detalhe do módulo |
| `/global/integracoes` | Integrações nativas |
| `/global/banco` | Banco de dados |
| `/global/design` | Design global |
| `/global/limites` | Limites de credenciais |
| `/global/acoes` | Ações/webhooks globais |
| `/global/demos` | Demonstrações |
| `/global/hub` | Hub global |
| `/global/laboratorio` | Laboratório |
| `/global/nps` | NPS global |
| `/global/testes` | Testes |

### Estrutura de Código

```
src/
├── core/
│   ├── permissions/                    — Sistema de permissões
│   │   ├── constants.ts               — Registro central de permissões
│   │   ├── services.ts                — CRUD de permissões + modulos_acesso
│   │   └── types.ts                   — Tipos (Permissoes, ModulosAcesso, Ambiente)
│   └── services/                      — Serviços de infraestrutura
│       ├── notificacoes.ts            — Notificações + templates + disparo
│       ├── webhooks.ts                — Webhooks + workflow engine
│       └── atividades.ts              — Timeline/atividades
├── features/
│   ├── api-connectors/index.ts        — Conectores de API
│   ├── credenciais/index.ts           — Credenciais da equipe
│   ├── documentos/index.ts            — Upload + status de documentos
│   ├── form-schema/index.ts           — Schema dinâmico do formulário
│   └── integracoes/index.ts           — Integrações (WhatsApp, CEP, etc.)
├── registry/
│   └── permissions-registry.ts        — Registry central de permissões
└── routes/
    ├── global.acoes.tsx               — Ações globais
    ├── global.banco.tsx               — Banco de dados global
    ├── global.demos.tsx               — Demonstrações
    ├── global.design.tsx              — Design global
    ├── global.empresas.tsx            — Empresas
    ├── global.empresas.$id.tsx        — Detalhe empresa
    ├── global.hub.tsx                 — Hub global
    ├── global.integracoes.tsx         — Integrações
    ├── global.laboratorio.tsx         — Laboratório
    ├── global.limits.tsx              — Limites
    ├── global.modulos.tsx             — Módulos
    ├── global.modulos.$key.tsx        — Detalhe módulo
    ├── global.nps.tsx                 — NPS global
    ├── global.permissoes.tsx          — Permissões
    └── global.testes.tsx              — Testes
```

---

## 21. Arquitetura do Código Frontend

O módulo Global possui uma arquitetura diferente dos módulos de negócio:

1. **`src/core/services/`** — Serviços de infraestrutura (notificações, webhooks, atividades) que podem ser importados por qualquer módulo
2. **`src/core/permissions/`** — Sistema de permissões com registry centralizado
3. **`src/features/{feature}/index.ts`** — Features de infraestrutura (documentos, credenciais, form-schema, integrações, api-connectors) — cada uma exporta funções de CRUD + tipos
4. **`src/registry/permissions-registry.ts`** — Registry central onde módulos registram suas definições de permissão
5. **`src/routes/global.*.tsx`** — 15 rotas de super admin para gerenciamento global

**Diferenças Cruciais:**
- Não possuem `module.ts` — não são registradas como módulo no registry
- Não possuem `permissions.ts` — permissões são gerenciadas via RLS e registry central
- A maioria não possui React Context próprio — usam hooks diretos do Supabase
- O sistema de webhooks funciona como um **workflow engine** que orquestra: notificações → webhooks → api_connectors em ordem

---

## 22. Migrações Relacionadas

| Migration | Data | Descrição |
|---|---|---|
| `00001_profiles.sql` | — | **Cria profiles** + trigger handle_new_user |
| `00002_tables.sql` | — | Cria pacientes, contratos, leads, atividades |
| `00005_legacy.sql` | — | **Remove pacientes/contratos/leads**, cria view clientes, cria documentos, credenciais |

| `00006_admin.sql` | — | **Super admin + app_config + mock_credentials + webhooks + webhook_logs + seeds** |
|---|---|---|
| `00008_rls_blindagem.sql` | — | **Blinda RLS** de cadastros, documentos, credenciais, atividades; cria is_admin_or_super |
| `00009_endereco_completo.sql` | — | Colunas endereco_completo, tipo_endereco |
| `00010_permissoes.sql` | — | **Cria permissoes** + get_permissoes_padrao + triggers |
| `00012_cadastro_role_permissao.sql` | — | Ajusta is_admin_or_super para incluir editor |
| `00014_notifications_and_expiry.sql` | — | **Cria notificacoes + notificacoes_templates** + RPCs de 2FA |
| `00015_2fa_rpcs.sql` | — | RPCs gerar_2fa_pin + validar_2fa_pin |
| `00016_integracoes_nativas.sql` | — | **Cria integracoes_config** + seeds + RPC enviar_whatsapp_evolution |
| `00017_verificar_duplicado.sql` | — | RPC verificar_documento_duplicado |
| `00018_form_schema.sql` | — | **Cria form_schema** + seed de 33 campos |
| `00019_dados_extras.sql` | — | Coluna dados_extras em cadastros |
| `00021_fluxo_correcao.sql` | — | Coluna campos_correcao em cadastros |
| `00023_multiempresas.sql` | — | Adiciona empresa_id em profiles, permissoes, documentos, etc. |
| `00025_fix_rls_recursion.sql` | — | Corrige recursão em get_current_empresa_id |
| `00031_admin_celular_profiles.sql` | — | Coluna celular em profiles |
| `20260512144729` | 26/05 | Subsistema CRM (usuarios, clientes, visitas, logs_transferencia) |
| `20260512150646` | 26/05 | app_config duplicada (conflito) |
| `20260512155159` | 26/05 | logs_transferencia_consultor |

---

## 23. Diagrama de Relacionamentos

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              auth.users                                  │
│    (autenticação — gerenciado pelo Supabase Auth)                         │
└──┬──────────────────────────────────────────────────────────────────────┘
   │ 1:1
┌──▼──────────────────────────────────────────────────────────────────────┐
│                               profiles                                    │
│    id, email, nome, role, ambiente, is_super_admin, empresa_id, ...       │
└──┬──────┬──────────┬──────────┬──────────┬──────────┬───────────────────┘
   │      │          │          │          │          │
   │ 1:1  │ 1:N      │ 1:N      │ 1:N      │ 1:N      │ 1:N
   │      │          │          │          │          │
┌──▼──┐ ┌▼────────┐ ┌▼───────┐ ┌▼────────┐ ┌▼──────────┐ ┌▼──────────────┐
│per- │ │notifica-│ │ativa-  │ │documentos│ │credenciais│ │webhook_logs   │
│mis- │ │coes     │ │dades   │ │          │ │          │ │(events)       │
│soes │ │         │ │        │ │          │ │          │ │              │
└─────┘ └─────────┘ └────────┘ └──────────┘ └──────────┘ └──────────────┘
                                                                 │
                                                  ┌──────────────┘
                                                  ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                               webhooks                                      │
│    Configuração de webhooks + templates de notificação + api_connectors      │
│    (orquestrador de workflow: notificações → webhooks → api_connectors)      │
└──────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                         Subsistema CRM Antigo                                │
│                                                                              │
│  usuarios  ──1:N──  clientes  ──1:N──  visitas                              │
│     │                    │                                                    │
│     └── auto-ref         └── trigger log →  logs_transferencia              │
│                                                                              │
│  convites_acesso (independente)                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                         Tabelas de Config                                   │
│                                                                              │
│  app_config ─── Config de ambiente (env)                                    │
│  mock_credentials ─── Seeds de credenciais                                  │
│  integracoes_config ─── Config de serviços externos                         │
│  form_schema ─── Schema dinâmico do formulário                              │
│  api_connectors ─── Conectores de API para workflow                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Finais

1. **Arquitetura híbrida**: O módulo Global combina tabelas modernas (criadas em 2026) com tabelas legadas do CRM antigo que coexistem sem integração. Isso reflete a evolução incremental do sistema.

2. **Workflow engine**: O sistema de webhooks + notificações + api_connectors forma um workflow engine completo que dispara em cascata: notificações internas → webhooks HTTP → API connectors, tudo ordenado por `ordem`.

3. **Três níveis de RLS**: As tabelas globais demonstram os três níveis de segurança do sistema:
   - **Super admin exclusivo**: app_config, mock_credentials, integracoes_config
   - **Multi-tenant**: profiles, permissoes, documentos (via empresa_id)
   - **Usuário individual**: notificacoes (via usuario_id)

4. **Duplicação de funcionalidades**: O subsistema CRM antigo (tabelas `usuarios`, `clientes`, `visitas`) replica funcionalidades do módulo CRM (`src/features/crm/`), indicando uma migração em andamento ou convivência de dois sistemas.

5. **Camada de serviços centralizada**: Diferente dos módulos de negócio que têm seus próprios services, as operações globais de notificações, webhooks e atividades ficam em `src/core/services/` — acessíveis a qualquer módulo sem dependência circular.

6. **Registry de permissões**: O sistema de permissões usa um registry centralizado onde cada módulo registra suas permissões, permitindo que o Super Admin gerencie tudo em uma única interface (`/global/permissoes`).

7. **Schema dinâmico**: O `form_schema` permite que o formulário de cadastro seja customizado sem deploy — incluindo campos customizados com `is_custom = true` e personalização por empresa.

8. **Maior variedade de RLS**: Nenhum outro módulo tem tanta diversidade de padrões de RLS quanto o Global — desde público (form_schema) até super admin exclusivo (app_config, mock_credentials).

9. **Integrações com serviços externos**: As integrações configuradas em `integracoes_config` (Evolution API, BrasilAPI, Google APIs, SMTP) mostram que o sistema foi projetado para se conectar a múltiplos serviços externos, gerenciados via interface de super admin.

10. **11 RPCs SECURITY DEFINER**: O Global concentra a maioria das RPCs do sistema, muitas delas `SECURITY DEFINER`, o que exige cuidado especial com segurança e validação de entrada.
