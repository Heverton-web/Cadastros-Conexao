# Análise do Banco de Dados — Módulo Cadastros

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabelas Principais](#2-tabelas-principais)
3. [Tabelas de Suporte](#3-tabelas-de-suporte)
4. [Multi-Tenancy (Empresas)](#4-multi-tenancy-empresas)
5. [Views e RPCs](#5-views-e-rpcs)
6. [RLS Policies](#6-rls-policies)
7. [Fluxo de Status](#7-fluxo-de-status)
8. [Permissões do Módulo](#8-permissões-do-módulo)
9. [Rotas do Frontend](#9-rotas-do-frontend)
10. [Migrações Relacionadas](#10-migrações-relacionadas)
11. [Diagrama de Relacionamentos](#11-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Cadastros** é o núcleo do ERP Conexão. Ele gerencia o ciclo completo de cadastro de **clientes** (pessoas físicas e jurídicas) no sistema de odontologia, desde a geração do link de pré-cadastro até a aprovação final.

**Arquitetura do Banco:**
- **4 tabelas centrais** normalizadas (mestre `cadastros` + `cadastros_pf`, `cadastros_pj`, `cadastros_enderecos`)
- Tabela de `documentos` vinculada aos cadastros
- Tabela de `form_schema` para formulários dinâmicos
- Tabelas de suporte: `permissoes`, `credenciais`, `atividades`, `notificacoes`
- Multi-tenancy via `empresa_id` em todas as tabelas (introduzido na migração `00023`)

**Modelo de dados inspirado no Bubble.io** — espelha a estrutura legada, com a entidade central "cliente" sendo um cadastro que pode ser PF ou PJ.

---

## 2. Tabelas Principais

### 2.1 `public.cadastros` — Tabela Mestre

A tabela central do módulo. Cada registro representa uma solicitação de cadastro de um cliente.

| Coluna | Tipo | Descrição | Origem |
|---|---|---|---|
| `id` | `uuid PK` | Identificador único | `00004` |
| `codigo_cliente` | `text` | Código do cliente no Protheus (sistema legado) | `00004` |
| `tipo_pessoa` | `text` | `'PF'` ou `'PJ'` | `00004` |
| `colaborador` | `text` | ID do colaborador que criou (legado Bubble) | `00004` |
| `observacoes` | `text` | Observações gerais | `00004` |
| `created_by` | `uuid FK → profiles.id` | Quem criou o registro | `00004` |
| `created_at` | `timestamptz` | Data de criação | `00004` |
| `updated_at` | `timestamptz` | Data da última atualização | `00004` |
| `status` | `text` | Status do fluxo (ver seção 7) | `00005` |
| `token_acesso` | `text UNIQUE` | Token único para acesso ao pré-cadastro | `00005` |
| `nome_temporario` | `text` | Nome temporário para identificação | `00005` |
| `tipo_acao` | `text` | `'solicitar_cadastro'` ou `'atualizar_cadastro'` | `00005` |
| `forma_compartilhamento` | `text` | `'whatsapp'`, `'email'`, `'copiar'` | `00005` |
| `link_expiracao` | `timestamptz` | Data de expiração do link | `00005` |
| `data_criacao_link` | `timestamptz` | Quando o link foi gerado | `00005` |
| `data_finalizacao` | `timestamptz` | Quando o lead concluiu o envio | `00005` |
| `comentario_reprovacao` | `text` | Motivo da reprovação | `00005` |
| `revisado` | `boolean` | Se já foi revisado | `00005` |
| `consulta_cnpj_realizada` | `boolean` | Se CNPJ foi consultado | `00005` |
| `consulta_cro_realizada` | `boolean` | Se CRO foi consultado | `00005` |
| `status_verificacao_token` | `boolean` | Status da verificação 2FA | `00005` |
| `token_gerado` | `text` | Token de verificação | `00005` |
| `token_expiracao` | `timestamptz` | Expiração do token | `00005` |
| `email_token` | `text` | Token de email | `00005` |
| `lead_email` | `text` | Email do lead | `00005` |
| `lead_whatsapp` | `text` | WhatsApp do lead | `00005` |
| `lead_nome` | `text` | Nome do lead | `00005` |
| `data_consulta` | `timestamptz` | Data da consulta | `00005` |
| `link_acessado` | `boolean` | Se o link foi acessado | `00014` |
| `inicio_preenchimento` | `timestamptz` | Quando começou o preenchimento | `00014` |
| `2fa_canal` | `text` | Canal do 2FA (whatsapp/email) | `00014` |
| `2fa_contato` | `text` | Contato para 2FA | `00014` |
| `2fa_token` | `text` | PIN do 2FA | `00014` |
| `2fa_expiracao` | `timestamptz` | Expiração do PIN 2FA | `00014` |
| `dados_extras` | `jsonb` | Campos customizados do formulário | `00019` |
| `campos_correcao` | `jsonb` | Lista de campos que precisam correção | `00021` |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária (multi-tenant) | `00023` |

**Índices:**
- `idx_cadastros_empresa` ON `cadastros(empresa_id)` — `00023`

**Triggers:**
- `trg_cadastros_set_created_by` — seta `created_by = auth.uid()` automaticamente no INSERT

---

### 2.2 `public.cadastros_pf` — Pessoa Física

Relacionamento 1:1 com `cadastros`. Armazena dados de pessoa física.

| Coluna | Tipo | Descrição | Origem |
|---|---|---|---|
| `id` | `uuid PK` | Identificador único | `00004` |
| `cadastro_id` | `uuid FK → cadastros.id` | Vínculo com cadastro (ON DELETE CASCADE) | `00004` |
| `nome` | `text NOT NULL` | Nome completo | `00004` |
| `cpf` | `text` | CPF | `00004` |
| `data_nascimento` | `date` | Data de nascimento | `00004` |
| `cro` | `text` | Número do CRO/TPD | `00004` |
| `cro_uf` | `text` | UF do CRO | `00004` |
| `email_comunicacao` | `text` | Email para comunicação | `00005` |
| `email_nf` | `text` | Email para nota fiscal | `00005` |
| `tel_fixo` | `text` | Telefone fixo | `00005` |
| `celular1` | `text` | Celular principal | `00005` |
| `celular2` | `text` | Celular secundário | `00005` |
| `data_emissao_cro` | `date` | Data de emissão do CRO | `00005` |
| `estado` | `text` | Estado (UF) | `00005` |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária | `00023` |

**Constraints:** `UNIQUE(cadastro_id)` — 1:1 com cadastros

---

### 2.3 `public.cadastros_pj` — Pessoa Jurídica

Relacionamento 1:1 com `cadastros`. Armazena dados de pessoa jurídica.

| Coluna | Tipo | Descrição | Origem |
|---|---|---|---|
| `id` | `uuid PK` | Identificador único | `00004` |
| `cadastro_id` | `uuid FK → cadastros.id` | Vínculo com cadastro (ON DELETE CASCADE) | `00004` |
| `razao_social` | `text NOT NULL` | Razão social | `00004` |
| `nome_fantasia` | `text` | Nome fantasia | `00004` |
| `cro` | `text` | Número do CRO/TPD | `00004` |
| `cro_uf` | `text` | UF do CRO | `00004` |
| `cnpj` | `text` | CNPJ | `00005` |
| `inscricao_estadual` | `text` | Inscrição estadual | `00005` |
| `email_comunicacao` | `text` | Email para comunicação | `00005` |
| `email_nf` | `text` | Email para nota fiscal | `00005` |
| `tel_fixo` | `text` | Telefone fixo | `00005` |
| `celular1` | `text` | Celular principal | `00005` |
| `celular2` | `text` | Celular secundário | `00005` |
| `data_emissao_cro` | `date` | Data de emissão do CRO | `00005` |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária | `00023` |

**Constraints:** `UNIQUE(cadastro_id)` — 1:1 com cadastros

---

### 2.4 `public.cadastros_enderecos` — Endereços

Relacionamento 1:N com `cadastros`. Suporta múltiplos endereços por cadastro (empresa, entrega, cobrança).

| Coluna | Tipo | Descrição | Origem |
|---|---|---|---|
| `id` | `uuid PK` | Identificador único | `00004` |
| `cadastro_id` | `uuid FK → cadastros.id` | Vínculo com cadastro (ON DELETE CASCADE) | `00004` |
| `tipo_endereco` | `tipo_endereco ENUM` | Tipo: `'empresa'`, `'entrega'`, `'cobranca'` | `00009` → `00033` |
| `cep` | `text` | CEP | `00004` |
| `cidade` | `text` | Cidade | `00004` |
| `bairro` | `text` | Bairro | `00004` |
| `complemento` | `text` | Complemento | `00004` |
| `rua` | `text` | Logradouro | `00005` |
| `numero` | `text` | Número | `00005` |
| `estado` | `text` | Estado (UF) | `00005` |
| `endereco_completo` | `text` | Endereço completo (texto livre) | `00009` |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária | `00023` |

**Constraints:**
- `UNIQUE(cadastro_id, tipo_endereco)` — um endereço de cada tipo por cadastro (modificado em `00033`)

**Evolução:**
- Originalmente `UNIQUE(cadastro_id)` — apenas 1 endereço por cadastro
- `00009`: adicionado `tipo_endereco` como `text` com default `'clinica'`
- `00033`: migrado para ENUM (`empresa`, `entrega`, `cobranca`) e constraint única composta

---

## 3. Tabelas de Suporte

### 3.1 `public.documentos`

Documentos anexados aos cadastros (RG, CNH, CRO, comprovante de endereço, etc.).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `cadastro_id` | `uuid FK → cadastros.id` | Vínculo com cadastro (CASCADE) |
| `tipo` | `text NOT NULL` | Tipo do documento (ex: `cro_frente`, `cnh_verso`) |
| `url` | `text NOT NULL` | URL do arquivo |
| `created_at` | `timestamptz` | Data de criação |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária (`00023`) |

**Índices:** `idx_documentos_empresa` ON `documentos(empresa_id)`

---

### 3.2 `public.form_schema`

Esquema dinâmico dos formulários de pré-cadastro. Permite que super admins customizem campos sem deploy.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `tipo_pessoa` | `text` | `'PF'`, `'PJ'` ou `'ambos'` |
| `etapa` | `text` | `'dados'`, `'endereco_empresa'`, `'endereco_entrega'`, `'endereco_cobranca'`, `'documentos'` |
| `campo_key` | `text` | Chave identificadora do campo |
| `label` | `text` | Rótulo do campo |
| `tipo_input` | `text` | Tipo de input (`text`, `date`, `tel`, `email`, `cep`, `documento`) |
| `opcoes` | `jsonb` | Opções (para selects) |
| `obrigatorio` | `boolean` | Se é obrigatório |
| `visivel` | `boolean` | Se é visível |
| `ordem` | `int` | Ordem de exibição |
| `is_custom` | `boolean` | Se é campo customizado criado pelo admin |
| `created_at` | `timestamptz` | Data de criação |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária (`00023`) |

**Constraints:**
- `UNIQUE(tipo_pessoa, etapa, campo_key)` — modificado em `00033`

**Evolução:**
- `00018`: criada com `UNIQUE(tipo_pessoa, campo_key)` e etapa `'dados'|'endereco'|'documentos'`
- `00033`: `UNIQUE(tipo_pessoa, etapa, campo_key)`, etapas expandidas para 3 tipos de endereço
- `00034`: SELECT liberado para público (`TO public`), para funcionar no pré-cadastro sem autenticação

---

### 3.3 `public.permissoes`

Permissões granulares por usuário.

| Coluna | Tipo | Descrição |
|---|---|---|
| `usuario_id` | `uuid PK FK → profiles.id` | Usuário |
| `permissoes` | `jsonb` | JSON com permissões (ex: `{"ver_todos_cadastros": true}`) |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |
| `updated_by` | `uuid FK → auth.users.id` | Quem alterou |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária (`00023`) |

**Trigger:** `on_profile_created_permissoes` — insere permissões padrão ao criar perfil

---

### 3.4 `public.credenciais`

Credenciais de acesso da equipe (funcionários da empresa cliente).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `created_by` | `uuid FK → profiles.id` | Quem criou |
| `nome_completo` | `text NOT NULL` | Nome completo |
| `email_corporativo` | `text NOT NULL` | Email corporativo |
| `whatsapp_corporativo` | `text` | WhatsApp |
| `departamento` | `text` | Departamento |
| `ativo` | `boolean` | Se está ativo |
| `created_at` | `timestamptz` | Data de criação |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária (`00023`) |

---

### 3.5 `public.atividades`

Log de atividades.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `entidade_tipo` | `text` | `'cadastro'` |
| `entidade_id` | `uuid` | ID da entidade |
| `usuario_id` | `uuid FK → profiles.id` | Usuário que executou |
| `acao` | `text` | Ação executada |
| `dados` | `jsonb` | Dados adicionais |
| `created_at` | `timestamptz` | Data de criação |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária (`00023`) |

---

### 3.6 `public.notificacoes` e `public.notificacoes_templates`

Sistema de notificações internas.

**notificacoes_templates** — templates de notificação:
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador |
| `evento` | `text UNIQUE` | Chave do evento |
| `titulo` | `text` | Título do template |
| `corpo_template` | `text` | Corpo com placeholders (`{{lead_nome}}`, `{{motivo}}`) |
| `ativo` | `boolean` | Se está ativo |
| `created_at` / `updated_at` | `timestamptz` | Datas de criação/atualização |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária (`00023`) |

**Templates padrão seed:**
- `cadastro_correcao` — Pendente de Correção
- `cadastro_reprovado` — Cadastro Reprovado
- `cadastro_aprovado` — Cadastro Aprovado!
- `cadastro_em_analise` — Novo Cadastro Enviado
- `criacao_credencial` — Nova Credencial Criada

**notificacoes** — notificações individuais:
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador |
| `usuario_id` | `uuid FK → profiles.id` | Destinatário |
| `titulo` | `text` | Título |
| `mensagem` | `text` | Mensagem |
| `lida` | `boolean` | Se foi lida |
| `dados` | `jsonb` | Dados adicionais |
| `created_at` | `timestamptz` | Data de criação |
| `empresa_id` | `uuid FK → empresas.id` | Empresa proprietária (`00023`) |

---

## 4. Multi-Tenancy (Empresas)

Introduzido na migração `00023_multiempresas.sql`, o sistema é multi-tenant por empresa.

### 4.1 `public.empresas`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador |
| `nome` | `text NOT NULL` | Nome da empresa |
| `slug` | `text UNIQUE NOT NULL` | Slug único |
| `cnpj` | `text` | CNPJ |
| `ativo` | `boolean` | Se está ativa |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data de atualização |

**Colunas adicionadas em `00029`:**
`razao_social`, `nome_app`, `email`, `celular`, `telefone`, `logradouro`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `instagram`, `youtube`, `linkedin`, `site`

### 4.2 `public.empresas_config`

Configuração de branding e tema por empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `empresa_id` | `uuid PK FK → empresas.id` | Empresa (CASCADE) |
| `logo_url` | `text` | URL do logo |
| `theme` | `jsonb` | Configuração de tema (cores, etc.) |
| `updated_at` | `timestamptz` | Data de atualização |
| `logo_index_url` | `text` | Logo para página inicial (`00024`) |
| `logo_app_url` | `text` | Logo para o app (`00024`) |
| `favicon_url` | `text` | Favicon (`00024`) |
| `db_config` | `jsonb` | Configurações de banco (`00029`) |

### 4.3 `public.modulos_empresa`

Ativação de módulos por empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador |
| `empresa_id` | `uuid FK → empresas.id` | Empresa (CASCADE) |
| `modulo_key` | `text NOT NULL` | Chave do módulo |
| `ativo` | `boolean` | Se o módulo está ativo |
| `config` | `jsonb` | Configuração do módulo |
| `created_at` | `timestamptz` | Data de criação |

**Constraint:** `UNIQUE(empresa_id, modulo_key)`

### 4.4 `public.empresa_modulo_limits`

Limites de credenciais por módulo por empresa (migração `00049`).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador |
| `empresa_id` | `uuid FK → empresas.id` | Empresa (CASCADE) |
| `modulo_key` | `text NOT NULL` | Chave do módulo |
| `max_credenciais` | `integer` | Limite máximo de credenciais |
| `created_at` / `updated_at` | `timestamptz` | Datas |

**RPCs auxiliares:**
- `count_credenciais_by_empresa_modulo(p_empresa_id, p_modulo_key)` → conta credenciais ativas com acesso ao módulo
- `check_empresa_modulo_limit(p_empresa_id, p_modulo_key)` → verifica se o limite foi atingido

---

## 5. Views e RPCs

### 5.1 View `public.clientes`

View que consolida dados de `cadastros` + `cadastros_pf`/`cadastros_pj` + `cadastros_enderecos`.

**Evolução:** Foi recriada várias vezes:
- `00004`: primeira versão como `pacientes`
- `00005`: renomeada para `clientes`, com mais campos
- `00014`: adicionadas colunas de 2FA e link_acessado
- `00023`: adicionado `empresa_id` e demais colunas do fluxo
- `00033`: joins separados por tipo de endereço (empresa, entrega, cobrança)

### 5.2 RPCs (Stored Procedures)

| RPC | Descrição | Origem |
|---|---|---|
| `get_cadastro_by_token(token_text)` | Busca cadastro por token de acesso (público) | `00005` |
| `update_cadastro_from_precadastro(...)` | Atualiza cadastro com dados do pré-cadastro | `00005`, atualizado em `00033` |
| `gerar_2fa_pin(token_text, canal_text, contato_text, pin_text)` | Gera PIN 2FA para verificação | `00015` |
| `validar_2fa_pin(token_text, pin_text)` | Valida PIN 2FA e libera preenchimento | `00015` |
| `limpar_links_expirados()` | Remove cadastros com status `link_gerado` expirados | `00014` |
| `registrar_acesso_token(token_text)` | Registra acesso ao link + limpa expirados | `00014` |
| `verificar_documento_duplicado(documento, tipo)` | Verifica CPF/CNPJ duplicado | `00017` |
| `is_admin_or_super()` | Verifica se é admin ou super_admin | `00008`, atualizado em `00012`, `00023`, `00025` |
| `is_super_admin_session()` | Verifica se é super_admin | `00023`, atualizado em `00025` |
| `get_current_empresa_id()` | Retorna empresa_id do usuário logado | `00023`, atualizado em `00025` |
| `admin_criar_usuario(...)` | Cria usuário completo (auth + profile) | `00050` |
| `admin_atualizar_senha(...)` | Atualiza senha de usuário | `00046` |
| `admin_deletar_usuario(...)` | Remove usuário completo | `00052` |

---

## 6. RLS Policies

### 6.1 Helper Functions (SECURITY DEFINER)

| Função | Descrição |
|---|---|
| `is_super_admin_session()` | Verifica se `profiles.is_super_admin = true` |
| `is_admin_or_super()` | Verifica se `role IN ('admin', 'editor')` ou `is_super_admin = true` |
| `get_current_empresa_id()` | Retorna `empresa_id` do usuário atual |
| `pode_acessar_empresa(p_empresa_id)` | Verifica se usuário pode acessar dados de uma empresa |

> **Nota:** Em `00025`, todas as funções auxiliares foram marcadas como `SECURITY DEFINER` para corrigir recursão infinita em RLS.

### 6.2 Políticas por Tabela (pós-00023)

**`cadastros`:**
- `select`: super_admin vê tudo; admin vê da sua empresa; consultor vê apenas os que criou
- `insert`: super_admin ou qualquer usuário na mesma empresa
- `update`: admin ou criador, ambos na mesma empresa
- `delete`: apenas super_admin ou admin da empresa

**`cadastros_pf`, `cadastros_pj`, `cadastros_enderecos`, `documentos`:**
- Mesmo padrão de `cadastros`: acesso via JOIN em `cadastro_id` + verificação de `empresa_id`

**`credenciais`:**
- Apenas super_admin ou admin da empresa podem ver/gerenciar

**`atividades`:**
- Acesso por empresa, sem distinção de role entre admin/consultor

**`permissoes`:**
- Super admin: tudo
- Admin da empresa: vê permissões da empresa
- Usuário: vê própria permissão

**`form_schema`:**
- SELECT: público (`TO public` desde `00034`)
- INSERT/UPDATE/DELETE: apenas super_admin ou admin da empresa

---

## 7. Fluxo de Status

O ciclo de vida de um cadastro segue este fluxo:

```
link_gerado
    │
    ▼
dados_enviados  ← lead preenche formulário
    │
    ▼
em_analise      ← admin revisa dados
    │
    ├──► aprovado        ← código do cliente gerado
    │
    ├──► em_correcao     ← admin solicita correções
    │       │
    │       └──► em_analise  ← lead corrige e reenvia
    │
    └──► reprovado       ← reprovado definitivamente
```

**Status disponíveis (CHECK constraint):**
`'link_gerado'`, `'dados_enviados'`, `'em_analise'`, `'em_correcao'`, `'aprovado'`, `'reprovado'`

---

## 8. Permissões do Módulo

Definidas em `src/features/cadastros/permissions.ts` e sincronizadas via `registerModule`.

### Grupos de Permissões

| Grupo | Chaves | Descrição |
|---|---|---|
| **Escopo de Dados** | `ver_todos_cadastros` | Ver todos os cadastros da empresa |
| **Visualização** | `ver_relatorios`, `visualizar_documento` | Acesso a relatórios e documentos |
| **Aprovação de Cadastro** | `aprovar_cadastro`, `reprovar_cadastro`, `solicitar_correcao_cadastro` | Gerenciar status do cadastro |
| **Aprovação de Documentos** | `aprovar_documento`, `reprovar_documento`, `solicitar_correcao_documento` | Gerenciar documentos |
| **Aprovação de Campos** | `aprovar_campo`, `reprovar_campo`, `solicitar_correcao_campo` | Aprovação granular de campos |
| **Credenciais** | `gerenciar_credenciais`, `gerenciar_credenciais_admin` | Gerenciar acesso de usuários |
| **Administração** | `excluir_cadastro`, `gerenciar_config` | Ações administrativas |
| **Geração de Links** | `gerar_links` | Gerar links de pré-cadastro |

### Ambientes e Defaults

| Ambiente | `ver_todos_cadastros` | `gerar_links` | `gerenciar_credenciais` | `gerenciar_credenciais_admin` |
|---|---|---|---|---|
| `cadastro` | ✅ | ❌ | ❌ | ❌ |
| `consultor` | ❌ | ✅ | ❌ | ❌ |
| `tecnologia` | ❌ | ❌ | ✅ | ✅ |
| `suporte` | ❌ | ❌ | ✅ | ❌ |
| `ambos` (full) | ✅ | ✅ | ✅ | ✅ |

---

## 9. Rotas do Frontend

### Páginas do Módulo

| Rota | Arquivo | Descrição |
|---|---|---|
| `/cadastros/dashboard` | `src/routes/cadastros.dashboard.tsx` | Dashboard com KPIs |
| `/cadastros/solicitacoes` | `src/routes/cadastros.solicitacoes.tsx` | Lista de solicitações |
| `/cadastros/solicitacoes/$id` | `src/routes/cadastros.solicitacoes.$id.tsx` | Detalhe da solicitação |
| `/cadastros/clientes` | `src/routes/cadastros.clientes.tsx` | Gestão de clientes |
| `/cadastros/consultor` | `src/routes/cadastros.consultor.tsx` | Painel do consultor |
| `/cadastros/consultor/clientes` | `src/routes/cadastros.consultor.clientes.tsx` | Clientes do consultor |
| `/cadastros/relatorios` | `src/routes/cadastros.relatorios.tsx` | Relatórios |
| `/cadastros/design` | `src/routes/cadastros.design.tsx` | Design config |

### Navegação (Nav Items)

| ID | Label | Rota | Permissão necessária |
|---|---|---|---|
| `dashboard` | Dashboard | `/cadastros/dashboard` | `ver_todos_cadastros` |
| `solicitacoes` | Solicitações | `/cadastros/solicitacoes` | `ver_todos_cadastros` ou `gerar_links` |
| `clientes` | Clientes | `/cadastros/clientes` | `ver_todos_cadastros` ou `gerar_links` |
| `consultor` | Consultor | `/cadastros/consultor` | `gerar_links` |
| `relatorios` | Relatórios | `/cadastros/relatorios` | `ver_relatorios` |

---

## 10. Migrações Relacionadas

### Migrações Diretamente Relacionadas ao Cadastros

| Migration | Descrição |
|---|---|
| `00001_profiles.sql` | Base: profiles (extends auth.users) |
| `00004_normalize.sql` | **CORE**: cria `cadastros`, `cadastros_pf`, `cadastros_pj`, `cadastros_enderecos`, view `pacientes` |
| `00005_legacy.sql` | Expansão Bubble: status, token_acesso, lead fields, `documentos`, `credenciais`, view `clientes`, RPCs público |
| `00008_rls_blindagem.sql` | RLS policies baseadas em role, triggers `set_created_by` e `set_usuario_id` |
| `00009_endereco_completo.sql` | Coluna `endereco_completo` + `tipo_endereco` |
| `00010_permissoes.sql` | Tabela `permissoes` + função de defaults por ambiente |
| `00012_cadastro_role_permissao.sql` | Adiciona `editor` à função `is_admin_or_super()` |
| `00014_notifications_and_expiry.sql` | Colunas 2FA, `notificacoes`, `notificacoes_templates`, RPCs de expiração |
| `00015_2fa_rpcs.sql` | RPCs `gerar_2fa_pin` e `validar_2fa_pin` |
| `00017_verificar_duplicado.sql` | RPC `verificar_documento_duplicado` |
| `00018_form_schema.sql` | Tabela `form_schema` + seed de campos |
| `00019_dados_extras.sql` | Coluna `dados_extras` (JSONB) em `cadastros` |
| `00021_fluxo_correcao.sql` | Coluna `campos_correcao` (JSONB) em `cadastros` |
| `00023_multiempresas.sql` | **CORE**: multi-tenancy (empresas, empresa_id, novas RLS) |
| `00024_branding_fields.sql` | Branding fields em `empresas_config` |
| `00025_fix_rls_recursion.sql` | Fix recursão RLS (SECURITY DEFINER) |
| `00029_empresa_dados_extras.sql` | Dados extras em `empresas` + `db_config` |
| `00031_admin_celular_profiles.sql` | `celular` em `profiles` |
| `00033_multi_enderecos.sql` | Multi-endereços (ENUM, UNIQUE composto, view atualizada) |
| `00034_fix_form_schema_rls.sql` | SELECT público em `form_schema` |
| `00046_admin_atualizar_senha.sql` | RPC admin_atualizar_senha |
| `00049_empresa_modulo_limits.sql` | Limites de credenciais por módulo |
| `00050_fix_admin_criar_usuario.sql` | RPC admin_criar_usuario (corrigido) |
| `00052_admin_deletar_usuario.sql` | RPC admin_deletar_usuario |
| `20260512144729_*.sql` | Novo schema: `usuarios`, `clientes`, `visitas`, `logs_transferencia` (CRM complementar) |

---

## 11. Diagrama de Relacionamentos

```
┌─────────────────────────────────────────────────────────────────┐
│                        auth.users                               │
└──────────────────┬──────────────────────────────────────────────┘
                   │ 1:1
┌──────────────────▼──────────────────────────────────────────────┐
│                      profiles                                   │
│  id, email, nome, role, ambiente, empresa_id, ativo, celular    │
└──────┬──────────────────────────┬───────────────────────────────┘
       │ 1:N                      │ 1:1
┌──────▼──────────────┐  ┌───────▼───────────────────┐
│    permissoes        │  │     credenciais           │
│  usuario_id (PK)     │  │  id, nome, email, depto   │
│  permissoes (JSONB)  │  │  created_by → profiles    │
└──────────────────────┘  └───────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          empresas                                 │
│  id, nome, slug, cnpj, ativo                                      │
└──┬───────────────┬──────────────────┬─────────────────────────────┘
   │ 1:1           │ 1:N              │ 1:N
┌──▼─────────┐ ┌──▼──────────┐ ┌────▼───────────────┐
│ empresas   │ │ modulos_    │ │ empresa_modulo_    │
│ _config    │ │ empresa     │ │ limits             │
│ tema, logo │ │ modulo_key  │ │ max_credenciais    │
└────────────┘ └─────────────┘ └────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          cadastros  [▲ TABELA MESTRE]            │
│  id (PK) │ codigo_cliente │ tipo_pessoa (PF/PJ)                  │
│  status  │ token_acesso │ created_by → profiles                  │
│  empresa_id → empresas  │ dados_extras (JSONB)                   │
│  campos_correcao (JSONB)│ 2fa_* │ lead_* │ link_*                │
└──┬──────────┬───────────┬──────────┬─────────────────────────────┘
   │ 1:1      │ 1:1       │ 1:N      │ 1:N
┌──▼──────┐ ┌─▼───────┐ ┌─▼──────────┐ ┌─▼──────────┐
│ cadastr │ │cadastr  │ │cadastros_  │ │ documentos  │
│ os_pf   │ │os_pj    │ │enderecos   │ │ tipo, url   │
│ nome,   │ │razao    │ │tipo ENUM   │ │ cadastro_id │
│ cpf, cro│ │cnpj, cro│ │cidade, uf  │ └─────────────┘
└─────────┘ └─────────┘ └────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       form_schema                                 │
│  tipo_pessoa │ etapa │ campo_key │ label │ tipo_input            │
│  is_custom │ empresa_id                                          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐  ┌────────────────────────┐
│  notificacoes_templates              │  │   notificacoes          │
│  evento (UK) │ titulo │ corpo        │  │  usuario_id → profiles │
├──────────────────────────────────────┤  │  titulo, mensagem       │
│  notificacoes                        │  │  lida, dados (JSONB)    │
└──────────────────────────────────────┘  └────────────────────────┘

┌──────────────────────────────────────┐
│           atividades                  │
│  entidade_tipo='cadastro'            │
│  entidade_id, usuario_id, acao       │
└──────────────────────────────────────┘
```

---

## Notas Finais

1. **Padrão de Nomenclatura:** As migrações seguem numeração sequencial (`00001` a `00053`) e posteriormente timestamp-based (`20260512...`).
2. **Herança Bubble:** O schema foi projetado para espelhar a estrutura do Bubble.io, com a view `clientes` mantendo compatibilidade reversa.
3. **Multi-tenancy:** Todas as tabelas do módulo foram atualizadas com `empresa_id` na migração `00023`. Novas tabelas já são criadas com `empresa_id` desde o início.
4. **Formulário Dinâmico:** A tabela `form_schema` permite customização sem deploy — super admins podem adicionar/remover/reordenar campos.
5. **Segurança:** RLS policies com funções SECURITY DEFINER para evitar recursão, combinando verificação de role + empresa.
6. **Público vs Autenticado:** Algumas RPCs (como `get_cadastro_by_token`) são `SECURITY DEFINER` para permitir acesso público ao pré-cadastro sem expor dados de outros cadastros.
