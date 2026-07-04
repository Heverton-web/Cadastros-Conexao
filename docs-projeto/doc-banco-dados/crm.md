# Análise do Banco de Dados — Módulo CRM

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabelas do Módulo](#2-tabelas-do-módulo)
3. [Tabelas Compartilhadas com Outros Módulos](#3-tabelas-compartilhadas-com-outros-módulos)
4. [RLS Policies](#4-rls-policies)
5. [Permissões do Módulo](#5-permissões-do-módulo)
6. [Rotas do Frontend](#6-rotas-do-frontend)
7. [Migrações Relacionadas](#7-migrações-relacionadas)
8. [Diagrama de Relacionamentos](#8-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **CRM** (Customer Relationship Management) gerencia o relacionamento com clientes e a equipe comercial no ERP Conexão. Ele oferece pipeline de vendas (Kanban), carteira de clientes, tarefas, visitas, transferências e uma visão de diretoria com hierarquia de equipe (super admin → diretor → gestor → consultor).

**Características da Arquitetura:**

- **4 tabelas próprias**: `pipeline_estagios`, `tarefas`, `templates_mensagem`, `metas`
- **Compartilha tabelas** com o módulo Cadastros: `clientes`, `visitas`, `usuarios`, `logs_transferencia`, `convites_acesso`
- **Pipeline Kanban**: 6 estágios padrão (Prospecção → Qualificação → Proposta → Negociação → Fechamento → Perdido)
- **Hierarquia de equipe**: super_admin > diretor > gestor > consultor (roles: `super_admin`, `gestor`, `consultor`)
- **Metas configuráveis**: por consultor, por período, com valor meta e valor atingido
- **Templates de mensagem**: modelos reutilizáveis para comunicação com clientes
- **RLS por empresa_id**: diferentemente de outros módulos, o CRM filtra RLS pelo `empresa_id` do profile

---

## 2. Tabelas do Módulo

### 2.1 `pipeline_estagios` — Estágios do Pipeline

Define as colunas do Kanban de vendas. Configurável por empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `nome` | `varchar(100) NOT NULL` | Nome do estágio |
| `descricao` | `text` | Descrição |
| `ordem` | `integer NOT NULL` | Ordem no pipeline |
| `cor` | `varchar(7)` | Cor hexadecimal (ex: `#6366f1`) |
| `icone` | `varchar(50)` | Nome do ícone Lucide |
| `ativo` | `boolean DEFAULT true` | Se está ativo |
| `criado_em` | `timestamptz` | Data de criação |
| `atualizado_em` | `timestamptz` | Data da última atualização |

**Índices:**
- `idx_pipeline_estagios_empresa` ON `pipeline_estagios(empresa_id)`
- `idx_pipeline_estagios_ordem` ON `pipeline_estagios(empresa_id, ordem)`

**Trigger:** `trigger_pipeline_estagios_atualizado` — atualiza `atualizado_em`

**Estágios Padrão (Seed):**

| Ordem | Nome | Cor | Ícone |
|---|---|---|---|
| 1 | Prospecção | `#3b82f6` | Search |
| 2 | Qualificação | `#8b5cf6` | UserCheck |
| 3 | Proposta | `#f59e0b` | FileText |
| 4 | Negociação | `#f97316` | MessageSquare |
| 5 | Fechamento | `#10b981` | CheckCircle |
| 6 | Perdido | `#ef4444` | XCircle |

> Os estágios são inseridos automaticamente para toda empresa ativa na migração.

---

### 2.2 `tarefas` — Tarefas

Tarefas associadas a clientes ou genéricas, com responsável, prioridade e vencimento.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `cliente_id` | `uuid FK → clientes.id ON DELETE CASCADE` | Cliente vinculado (opcional) |
| `responsavel_id` | `uuid FK → auth.users.id ON DELETE CASCADE NOT NULL` | Responsável pela tarefa |
| `criador_id` | `uuid FK → auth.users.id ON DELETE CASCADE NOT NULL` | Quem criou |
| `titulo` | `varchar(255) NOT NULL` | Título |
| `descricao` | `text` | Descrição |
| `tipo` | `varchar(50) DEFAULT 'geral'` | Tipo (ex: ligação, reunião) |
| `prioridade` | `varchar(20) DEFAULT 'media'` | Prioridade |
| `status` | `varchar(20) DEFAULT 'pendente'` | Status |
| `data_vencimento` | `date` | Data de vencimento |
| `data_conclusao` | `timestamptz` | Data de conclusão |
| `lembrete_enviado` | `boolean DEFAULT false` | Se o lembrete foi enviado |
| `criado_em` | `timestamptz` | Data de criação |
| `atualizado_em` | `timestamptz` | Data da última atualização |

**Índices:**
- `idx_tarefas_empresa` ON `tarefas(empresa_id)`
- `idx_tarefas_responsavel` ON `tarefas(responsavel_id)`
- `idx_tarefas_cliente` ON `tarefas(cliente_id)`
- `idx_tarefas_status` ON `tarefas(empresa_id, status)`
- `idx_tarefas_vencimento` ON `tarefas(data_vencimento)` WHERE `status = 'pendente'`

**Trigger:** `trigger_tarefas_atualizado`

---

### 2.3 `templates_mensagem` — Templates de Mensagem

Modelos de mensagens reutilizáveis para comunicação com clientes.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `nome` | `varchar(100) NOT NULL` | Nome do template |
| `tipo` | `varchar(20) NOT NULL DEFAULT 'whatsapp'` | Tipo de mensagem |
| `assunto` | `varchar(255)` | Assunto (para email) |
| `corpo` | `text NOT NULL` | Corpo da mensagem |
| `variaveis` | `jsonb DEFAULT '[]'` | Variáveis disponíveis para placeholder |
| `ativo` | `boolean DEFAULT true` | Se está ativo |
| `criado_em` | `timestamptz` | Data de criação |
| `atualizado_em` | `timestamptz` | Data da última atualização |

**Índice:** `idx_templates_mensagem_empresa` ON `templates_mensagem(empresa_id)`

**Trigger:** `trigger_templates_mensagem_atualizado`

---

### 2.4 `metas` — Metas Comerciais

Metas de vendas/configuração por consultor e período.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa |
| `consultor_id` | `uuid FK → auth.users.id ON DELETE CASCADE` | Consultor alvo |
| `periodo` | `varchar(20) DEFAULT 'mensal'` | Período (mensal, trimestral, etc.) |
| `data_inicio` | `date NOT NULL` | Data de início |
| `data_fim` | `date NOT NULL` | Data de fim |
| `tipo` | `varchar(50) NOT NULL DEFAULT 'vendas'` | Tipo de meta |
| `valor_meta` | `decimal(15,2) NOT NULL` | Valor da meta |
| `valor_atingido` | `decimal(15,2) DEFAULT 0` | Valor já atingido |
| `criado_em` | `timestamptz` | Data de criação |
| `atualizado_em` | `timestamptz` | Data da última atualização |

**Índices:**
- `idx_metas_empresa` ON `metas(empresa_id)`
- `idx_metas_consultor` ON `metas(consultor_id)`
- `idx_metas_periodo` ON `metas(empresa_id, data_inicio, data_fim)`

**Trigger:** `trigger_metas_atualizado`

---

## 3. Tabelas Compartilhadas com Outros Módulos

O CRM **não cria** estas tabelas, mas **depende delas** (criadas no schema de usuários/CRM em `20260512144729`):

### 3.1 `usuarios` — Usuários do CRM (Schema de Roles)

Tabela de usuários com hierarquia de equipe. Criada junto com o módulo de CRM.

| Coluna | Tipo |
|---|---|
| `id` | `uuid PK FK → auth.users.id ON DELETE CASCADE` |
| `nome_completo` | `varchar(255) NOT NULL` |
| `email_corporativo` | `varchar(255) UNIQUE NOT NULL` |
| `role` | `app_role NOT NULL` (`super_admin`, `gestor`, `consultor`) |
| `gestor_id` | `uuid FK → usuarios.id ON DELETE SET NULL` |
| `ativo` | `boolean NOT NULL DEFAULT true` |
| `criado_em` | `timestamptz` |

**Trigger:** `on_auth_user_created` — cria registro automaticamente ao criar auth.user

### 3.2 `clientes` — Clientes do CRM

Tabela de clientes com vínculo ao consultor e estágio do pipeline.

| Coluna | Tipo |
|---|---|
| `id` | `uuid PK` |
| `nome_doutor` | `varchar(255) NOT NULL` |
| `nome_clinica` | `varchar(255)` |
| `telefone_contato` | `varchar(20)` |
| `consultor_atual_id` | `uuid FK → usuarios.id ON DELETE SET NULL` |
| `estagio_id` | `uuid FK → pipeline_estagios.id ON DELETE SET NULL` (adicionado pelo CRM) |
| `criado_em` | `timestamptz` |
| `atualizado_em` | `timestamptz` |

**Trigger:** `trg_log_transferencia` — registra transferência quando `consultor_atual_id` muda

### 3.3 `visitas` — Visitas a Clientes

Registro de visitas realizadas a clientes.

| Coluna | Tipo |
|---|---|
| `id` | `uuid PK` |
| `cliente_id` | `uuid FK → clientes.id ON DELETE CASCADE` |
| `consultor_executor_id` | `uuid FK → usuarios.id NOT NULL` |
| `data_visita` | `date NOT NULL` |
| `atendente` | `varchar(255) NOT NULL` |
| `cargo_atendente` | `cargo_atendente` (Secretária/Dentista/Outro) |
| `tipo_visita` | `tipo_visita` (Prospecção/Relacionamento/Pós-venda) |
| `gerou_orcamento` | `boolean DEFAULT false` |
| `gerou_pedido` | `boolean DEFAULT false` |
| `valor_estimado` | `decimal(10,2)` |
| `interesse_escala` | `integer (1-5)` |
| `temperatura_vendedor` | `temperatura_vendedor` (Frio/Morno/Quente) |
| `probabilidade_fechamento` | `probabilidade_fechamento` (Baixa/Média/Alta) |
| `feedback_cliente` | `text` |
| `observacoes_vendedor` | `text` |
| `data_proximo_contato` | `date` |
| `acao_prevista` | `varchar(255)` |
| `criado_em` | `timestamptz` |

### 3.4 `logs_transferencia` — Logs de Transferência

Registra cada transferência de cliente entre consultores.

| Coluna | Tipo |
|---|---|
| `id` | `uuid PK` |
| `cliente_id` | `uuid FK → clientes.id ON DELETE CASCADE` |
| `de_consultor_id` | `uuid FK → usuarios.id` |
| `para_consultor_id` | `uuid FK → usuarios.id` |
| `transferido_por_id` | `uuid FK → usuarios.id` |
| `data_transferencia` | `timestamptz NOT NULL DEFAULT now()` |

### 3.5 `logs_transferencia_consultor` — Logs de Transferência de Consultor

Registra transferências de consultor entre gestores (migração `20260512155159`).

| Coluna | Tipo |
|---|---|
| `id` | `uuid PK` |
| `consultor_id` | `uuid NOT NULL` |
| `de_gestor_id` | `uuid` |
| `para_gestor_id` | `uuid` |
| `transferido_por_id` | `uuid` |
| `data_transferencia` | `timestamptz` |

### 3.6 `convites_acesso` — Convites de Acesso

Convites para novos usuários se registrarem no sistema.

| Coluna | Tipo |
|---|---|
| `id` | `uuid PK` |
| `email_destino` | `varchar(255) NOT NULL` |
| `token_hash` | `varchar(255) UNIQUE NOT NULL` |
| `role_atribuida` | `app_role NOT NULL` |
| `gestor_vinculado_id` | `uuid FK → usuarios.id` |
| `data_expiracao` | `timestamptz NOT NULL` |
| `status` | `convite_status` (pendente/utilizado/expirado) |
| `criado_por_id` | `uuid FK → usuarios.id` |
| `criado_em` | `timestamptz` |

---

## 4. RLS Policies

### 4.1 Tabelas Próprias do Módulo

`pipeline_estagios`, `tarefas`, `templates_mensagem`, `metas`:

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `*_select` | `empresa_id` está no profile do usuário |
| `INSERT` | `*_insert` | `empresa_id` está no profile do usuário |
| `UPDATE` | `*_update` | `empresa_id` está no profile do usuário |
| `DELETE` | `*_delete` | `empresa_id` está no profile do usuário |

**Padrão RLS utilizado:**
```sql
empresa_id IN (SELECT empresa_id FROM profiles WHERE id = auth.uid())
```

> **Diferente dos outros módulos:** O CRM não usa as funções `is_super_admin_session()` ou `get_current_empresa_id()`. Em vez disso, faz uma subquery direta em `profiles`. Isso é mais simples porém menos performático em tabelas com muitos acessos.

### 4.2 Tabelas Compartilhadas

As RLS das tabelas `usuarios`, `clientes`, `visitas`, `logs_transferencia` e `convites_acesso` (definidas em `20260512144729`) usam um padrão diferente baseado em funções `has_role()`, `is_gestor_de()` e `current_role()`.

---

## 5. Permissões do Módulo

Definidas em `src/features/crm/permissions.ts`.

### Lista de Permissões

| Chave | Label | Descrição |
|---|---|---|
| `crm_dashboard` | Acessar dashboard CRM | Visualizar dashboard do CRM |
| `crm_carteira` | Visualizar carteira | Visualizar carteira de clientes |
| `crm_pipeline` | Acessar pipeline | Visualizar pipeline de vendas |
| `crm_tarefas` | Gerenciar tarefas | Criar e gerenciar tarefas |
| `crm_cliente_detalhe` | Ver detalhes do cliente | Visualizar detalhes do cliente |
| `crm_equipe` | Visualizar equipe | Visualizar equipe de vendas |
| `crm_metricas` | Acessar métricas | Visualizar métricas avançadas |
| `crm_bi` | Acessar BI | Acessar Business Intelligence |
| `crm_transferencia` | Gerenciar transferências | Gerenciar transferências de clientes |
| `crm_diretoria` | Acessar diretoria | Acessar visão da diretoria |

### Defaults por Ambiente

| Ambiente | Dashboard | Carteira | Pipeline | Tarefas | Cliente | Equipe | Métricas | BI | Transf. | Diretoria |
|---|---|---|---|---|---|---|---|---|---|---|
| `cadastro` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `consultor` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `tecnologia` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `suporte` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 6. Rotas do Frontend

### Páginas do Módulo (16 rotas)

| Rota | Arquivo | Descrição |
|---|---|---|
| `/crm/dashboard` | `_auth.crm.dashboard.tsx` | Dashboard principal |
| `/crm/carteira` | `_auth.crm.carteira.tsx` | Carteira de clientes |
| `/crm/pipeline` | `_auth.crm.pipeline.tsx` | Pipeline Kanban |
| `/crm/tarefas` | `_auth.crm.tarefas.tsx` | Gerenciamento de tarefas |
| `/crm/metricas` | `_auth.crm.metricas.tsx` | Métricas avançadas |
| `/crm/cliente/$id` | `_auth.crm.cliente.$id.tsx` | Detalhe do cliente |
| `/crm/equipe` | `_auth.crm.equipe.tsx` | Visualização da equipe |
| `/crm/bi` | `_auth.crm.bi.tsx` | Business Intelligence |
| `/crm/transferencia` | `_auth.crm.transferencia.tsx` | Transferência de clientes |
| `/crm/transferencia/consultores` | `_auth.crm.transferencia.consultores.tsx` | Transferência de consultores |
| `/crm/diretoria` | `_auth.crm.diretoria.index.tsx` | Visão da diretoria |
| `/crm/diretoria/gestor/$id` | `_auth.crm.diretoria.gestor.$id.tsx` | Detalhe do gestor |
| `/crm/aceitar-convite/$token` | `crm.aceitar-convite.$token.tsx` | Aceitar convite |
| `/crm/design` | `crm.design.tsx` | Design config |
| `/empresa/crm-design` | `empresa.crm-design.tsx` | Design por empresa |

### Estrutura de Componentes (18 arquivos)

```
src/features/crm/
├── components/
│   ├── BuscaGlobal.tsx               — Busca global de clientes
│   ├── ClientePickerModal.tsx        — Modal seletor de clientes
│   ├── KanbanAvancado.tsx            — Kanban drag-and-drop
│   ├── Logo.tsx                      — Logo do CRM
│   ├── MetricasAvancadas.tsx         — Métricas gráficas
│   ├── NovaTarefaModal.tsx           — Modal de nova tarefa
│   ├── NovaVisitaModal.tsx           — Modal de nova visita
│   ├── TarefasList.tsx               — Lista de tarefas
│   └── VisitaDetalheModal.tsx        — Modal de detalhe da visita
├── hooks/
│   └── use-mobile.tsx
├── lib/
│   ├── comercial.ts                  — Lógica comercial
│   ├── demo.ts                       — Dados de demonstração
│   ├── error-capture.ts              — Captura de erros
│   ├── error-page.ts                 — Página de erro
│   └── visitas.functions.ts          — Funções de visita
├── module.ts
├── permissions.ts
└── index.ts
```

---

## 7. Migrações Relacionadas

### Migrações Próprias do CRM

| Migration | Data | Descrição |
|---|---|---|
| `20260629120000_crm_pipeline_tarefas.sql` | 29/06/2026 | 4 tabelas (`pipeline_estagios`, `tarefas`, `templates_mensagem`, `metas`), RLS, seed de 6 estágios padrão |

### Migrações Compartilhadas (Schema de Usuários)

| Migration | Data | Descrição |
|---|---|---|
| `20260512144729_cc13f5b1...sql` | 12/05/2026 | **CORE**: `usuarios`, `clientes`, `visitas`, `logs_transferencia`, `convites_acesso` — ENUMs (`app_role`, `cargo_atendente`, `tipo_visita`, `temperatura_vendedor`, etc.) |
| `20260512150646_8cfeab6e...sql` | 12/05/2026 | Ajustes em `app_config` e role defaults |
| `20260512150829_d7b1242d...sql` | 12/05/2026 | Seed de dados demo (usuários, clientes, visitas) |
| `20260512155100_d343a4d9...sql` | 12/05/2026 | Funções de hierarquia (`is_diretor_de_gestor`, `is_gestor_de_consultor`) |
| `20260512155159_41412b31...sql` | 12/05/2026 | `logs_transferencia_consultor`, function `is_diretor_de_consultor` |
| `20260512155804_1b3c13c9...sql` | 12/05/2026 | Metas para gestores (RPCs `definir_meta_consultor`, `listar_metas_equipe`) |
| `20260512160820_80285dab...sql` | 12/05/2026 | Funções de suporte para hierarquia |
| `20260512161955_312604a1...sql` | 12/05/2026 | Ajustes finos RLS |

---

## 8. Diagrama de Relacionamentos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              empresas                                         │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                    pipeline_estagios   [KANBAN]                               │
│  nome │ descricao │ ordem │ cor │ icone │ ativo                               │
│  6 estágios padrão seed                                                     │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         auth.users                                           │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:1
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                     usuarios  [HIERARQUIA]                                    │
│  role (super_admin/gestor/consultor)                                         │
│  gestor_id → usuarios.id (auto-referência)                                   │
│  super_admin > diretor > gestor > consultor                                  │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N (consultor_atual_id)
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                     clientes  [ENTIDADE CENTRAL]                              │
│  nome_doutor │ nome_clinica │ telefone_contato                                │
│  consultor_atual_id → usuarios                                               │
│  estagio_id → pipeline_estagios  (adicionado pelo CRM)                       │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                     visitas   [REGISTRO]                                      │
│  cliente_id │ consultor_executor_id │ data_visita                             │
│  tipo (Prospecção/Relacionamento/Pós-venda)                                  │
│  temperatura_vendedor (Frio/Morno/Quente)                                     │
│  gerou_orcamento │ gerou_pedido │ valor_estimado                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                     tarefas   [CRM]                                           │
│  cliente_id? │ responsavel_id │ criador_id                                    │
│  titulo │ prioridade │ status │ data_vencimento                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                     templates_mensagem   [CRM]                                │
│  nome │ tipo (whatsapp) │ corpo │ variaveis (JSONB)                           │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                     metas   [CRM]                                             │
│  consultor_id │ periodo │ data_inicio │ data_fim                              │
│  valor_meta │ valor_atingido                                                  │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                 logs_transferencia   [LOG]                                     │
│  cliente_id │ de_consultor_id │ para_consultor_id │ transferido_por_id         │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│            logs_transferencia_consultor   [LOG]                                │
│  consultor_id │ de_gestor_id │ para_gestor_id                                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                 convites_acesso                                                │
│  email_destino │ token_hash │ role_atribuida │ gestor_vinculado_id             │
│  data_expiracao │ status (pendente/utilizado/expirado)                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Finais

1. **CRM Híbrido**: O módulo CRM é dividido entre duas migrações principais que coexistem:
   - `20260512*`: Schema de Usuários/CRM com hierarquia de equipe (`usuarios`, `clientes`, `visitas`)
   - `20260629*`: Pipeline e tarefas (`pipeline_estagios`, `tarefas`, `metas`, `templates_mensagem`)

2. **Hierarquia de Equipe**: O CRM implementa uma hierarquia real de equipe usando auto-referência (`usuarios.gestor_id`), com funções auxiliares como `is_gestor_de()`, `is_diretor_de_consultor()`, permitindo que gestores vejam dados de seus subordinados.

3. **Pipeline Kanban com 6 Estágios Padrão**: Os estágios são inseridos automaticamente via `CROSS JOIN` com `empresas` na migração, garantindo que toda empresa nova já tenha o pipeline configurado.

4. **CLient Transfer com Trigger**: A transferência de clientes entre consultores é registrada automaticamente via trigger `trg_log_transferencia` sempre que `consultor_atual_id` é alterado.

5. **RLS por Subquery**: Diferente dos outros módulos que usam `get_current_empresa_id()` ou filtros amplos, o CRM usa `empresa_id IN (SELECT empresa_id FROM profiles WHERE id = auth.uid())`, que é mais restritivo e não permite que super_admin veja dados de outras empresas a menos que o profile esteja configurado.

6. **Schema de Roles Próprio**: Usa `app_role` (`super_admin`, `gestor`, `consultor`) em vez dos ambientes do sistema (`cadastro`, `consultor`, `tecnologia`, `suporte`), indicando que o schema de usuários do CRM é anterior/separado do sistema de módulos.

7. **Tipos ENUM Ricos**: As visitas possuem tipos ENUM bem definidos (`cargo_atendente`, `tipo_visita`, `temperatura_vendedor`, `probabilidade_fechamento`), permitindo análises e filtros estruturados.

8. **Desnormalização Parcial**: `templates_mensagem` armazena `variaveis` como JSONB para placeholders no corpo do template, permitindo templates dinâmicos sem alteração de schema.
