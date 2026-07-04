# Análise do Banco de Dados — Módulo Funis

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabelas do Submódulo Kanban](#2-tabelas-do-submódulo-kanban)
3. [Tabelas do Submódulo Templates](#3-tabelas-do-submódulo-templates)
4. [RLS Policies](#4-rls-policies)
5. [Permissões do Módulo](#5-permissões-do-módulo)
6. [Rotas do Frontend](#6-rotas-do-frontend)
7. [Migrações Relacionadas](#7-migrações-relacionadas)
8. [Diagrama de Relacionamentos](#8-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Funis** (originalmente "Funis Kanban") oferece um sistema de **gerenciamento visual de fluxos de trabalho** no estilo Kanban no ERP Conexão. Ele permite criar boards (funis) com colunas customizáveis, tarefas com prioridades, atribuição de responsáveis, dependências entre tarefas, templates reutilizáveis e automações.

**Características da Arquitetura:**

- **7 tabelas** divididas em 2 submódulos: Kanban (`funis`, `funis_colunas`, `funis_tarefas`, `funis_permissoes`) e Templates (`funis_templates`, `funis_template_cols`, `funis_template_tasks`)
- **Trigger automático**: ao criar um funil, 4 colunas padrão são geradas (Backlog, Em andamento, Revisão, Concluído) — removido posteriormente na migration `20260624090000`
- **Compartilhamento granular**: permissões por funil (`view`/`edit`) para usuários específicos
- **Auto-referência**: tarefas podem ter dependências (`depende_tarefa_id`) e sub-tarefas (`parent_task_id`)
- **Templates reutilizáveis**: funis inteiros podem ser salvos como template (público ou privado) e instanciados
- **Prioridades**: low, medium, high, urgent
- **Multi-tenant**: todas as tabelas possuem `empresa_id`

---

## 2. Tabelas do Submódulo Kanban

### 2.1 `funis` — Boards (Funis)

Cabeçalho de cada board Kanban.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `titulo` | `text NOT NULL` | Título do funil |
| `descricao` | `text` | Descrição |
| `created_by` | `uuid FK → auth.users.id NOT NULL` | Quem criou |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `created_by`

**Trigger:** `funis_set_updated_at`

---

### 2.2 `funis_colunas` — Colunas do Kanban

Colunas/estágios dentro de cada funil.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `funil_id` | `uuid FK → funis.id ON DELETE CASCADE` | Funil |
| `titulo` | `text NOT NULL` | Título da coluna |
| `posicao` | `integer NOT NULL` | Posição/ordem |
| `created_at` | `timestamptz` | Data de criação |

**Índice:** `(funil_id, posicao)`

**Trigger de criação automática (removido em `20260624090000`):**
```sql
-- Originalmente, ao criar um funil, 4 colunas eram criadas automaticamente:
INSERT INTO funis_colunas (funil_id, titulo, posicao) VALUES
  (NEW.id, 'Backlog', 0),
  (NEW.id, 'Em andamento', 1),
  (NEW.id, 'Revisão', 2),
  (NEW.id, 'Concluído', 3);
```
Este trigger foi removido na migration `20260624090000` para permitir customização total das colunas.

---

### 2.3 `funis_tarefas` — Tarefas

Cards individuais dentro das colunas. É a tabela mais rica do módulo.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `funil_id` | `uuid FK → funis.id ON DELETE CASCADE` | Funil |
| `coluna_id` | `uuid FK → funis_colunas.id ON DELETE CASCADE` | Coluna atual |
| `titulo` | `text NOT NULL` | Título da tarefa |
| `descricao` | `text` | Descrição detalhada |
| `posicao` | `integer NOT NULL` | Posição dentro da coluna |
| `prioridade` | `text DEFAULT 'medium'` | Prioridade: `'low'`, `'medium'`, `'high'`, `'urgent'` |
| `atribuido_para` | `uuid FK → auth.users.id` | Responsável |
| `tools` | `text[]` | Ferramentas/etiquetas |
| `data_inicio` | `date` | Data de início |
| `data_fim` | `date` | Data de fim/vencimento |
| `depende_tarefa_id` | `uuid FK → funis_tarefas.id` | Dependência de outra tarefa |
| `parent_task_id` | `uuid FK → funis_tarefas.id` | Sub-tarefa de outra tarefa |
| `completed_at` | `timestamptz` | Data de conclusão |
| `created_by` | `uuid FK → auth.users.id NOT NULL` | Quem criou |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:**
- `funis_tarefas_coluna_idx` ON `funis_tarefas(coluna_id, posicao)`
- `funis_tarefas_funil_idx` ON `funis_tarefas(funil_id)`

**Auto-referências:**
- `depende_tarefa_id` → outra tarefa (bloqueio/dependência)
- `parent_task_id` → outra tarefa (sub-tarefa)

---

### 2.4 `funis_permissoes` — Permissões por Funil

Permissões granulares para compartilhar funis com outros usuários.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `funil_id` | `uuid FK → funis.id ON DELETE CASCADE` | Funil |
| `user_id` | `uuid FK → auth.users.id NOT NULL` | Usuário |
| `nivel` | `text NOT NULL DEFAULT 'view'` | Nível: `'view'` ou `'edit'` |
| `created_at` | `timestamptz` | Data de criação |

**Constraints:** `UNIQUE(funil_id, user_id)` — uma permissão por usuário/funil

**Índices:** `funil_id`, `user_id`

---

## 3. Tabelas do Submódulo Templates

Introduzido na migração `20260630000001`. Permite salvar e reutilizar estruturas de funis.

### 3.1 `funis_templates` — Templates de Funis

Modelos de funis que podem ser salvos e reaplicados.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `nome` | `text NOT NULL` | Nome do template |
| `descricao` | `text` | Descrição |
| `is_public` | `boolean NOT NULL` | Se é público (visível para outras empresas) |
| `created_by` | `uuid FK → auth.users.id NOT NULL` | Quem criou |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `created_at` | `timestamptz` | Data de criação |

**Índices:** `empresa_id`, `created_by`

---

### 3.2 `funis_template_cols` — Colunas do Template

Estrutura de colunas do template.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `template_id` | `uuid FK → funis_templates.id ON DELETE CASCADE` | Template |
| `titulo` | `text NOT NULL` | Título da coluna |
| `posicao` | `integer NOT NULL` | Posição |

**Índice:** `(template_id, posicao)`

---

### 3.3 `funis_template_tasks` — Tarefas do Template

Estrutura de tarefas pré-definidas do template.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `template_id` | `uuid FK → funis_templates.id ON DELETE CASCADE` | Template |
| `template_col_idx` | `integer NOT NULL` | Índice da coluna de destino |
| `titulo` | `text NOT NULL` | Título da tarefa |
| `descricao` | `text` | Descrição |
| `prioridade` | `text DEFAULT 'medium'` | Prioridade |
| `posicao` | `integer NOT NULL` | Posição |

**Índice:** `template_id`

---

## 4. RLS Policies

### 4.1 `funis`

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `funis_select_auth` | Super admin, criador, ou mesma empresa |
| `INSERT` | `funis_insert_auth` | `created_by = auth.uid()` |
| `UPDATE` | `funis_update_auth` | Super admin ou criador |
| `DELETE` | `funis_delete_auth` | Super admin ou criador |

### 4.2 `funis_colunas`

Herda permissão do funil via EXISTS JOIN.

| Operação | Policy |
|---|---|
| `SELECT` | Qualquer funil existente |
| `INSERT` | Criador do funil |
| `UPDATE` | Criador do funil |
| `DELETE` | Criador do funil |

### 4.3 `funis_tarefas`

Herda permissão via coluna → funil (JOIN duplo).

| Operação | Policy |
|---|---|
| `SELECT` | Qualquer tarefa em funil existente |
| `INSERT` | `created_by = auth.uid()` |
| `UPDATE` | Baseado em funil existente |
| `DELETE` | Criador do funil |

### 4.4 `funis_permissoes`

| Operação | Policy |
|---|---|
| `SELECT` | Próprio usuário, criador do funil, ou super admin |
| `INSERT` | Criador do funil |
| `DELETE` | Criador do funil |

### 4.5 `funis_templates`

| Operação | Policy |
|---|---|
| `SELECT` | Super admin, criador, mesma empresa, ou template público |
| `INSERT` | `created_by = auth.uid()` |
| `UPDATE` | Super admin ou criador |
| `DELETE` | Super admin ou criador |

### 4.6 `funis_template_cols` e `funis_template_tasks`

Herdam do template via EXISTS JOIN. SELECT = qualquer template acessível. INSERT/DELETE = criador do template.

---

## 5. Permissões do Módulo

Definidas em `src/features/funis/permissions.ts`.

### Lista de Permissões (8 principais + várias sub-permissões)

| Chave | Label | Descrição |
|---|---|---|
| `funis_ver_dashboard` | Ver dashboard de funis | Visualizar lista de funis |
| `funis_criar_funil` | Criar funis | Criar novos funis |
| `funis_editar_funil` | Editar funis | Editar titulo/descricao de funis |
| `funis_excluir_funil` | Excluir funis | Excluir funis |
| `funis_gerir_colunas` | Gerir colunas | Adicionar/remover/reordenar colunas |
| `funis_gerir_tarefas` | Gerir tarefas | Criar/editar/mover/excluir tarefas |
| `funis_compartilhar` | Compartilhar funis | Conceder/revogar acesso a outros usuarios |
| `funis_ver_relatorios` | Ver relatorios | Visualizar metricas e relatorios dos funis |

**Permissões estendidas no module.ts** (gerenciadas via permissionDefaults):
`funis_ver_comentarios`, `funis_adicionar_comentario`, `funis_ver_anexos`, `funis_adicionar_anexo`, `funis_gerir_labels`, `funis_ver_atividade`, `funis_criar_template`, `funis_gerir_automacoes`, `funis_exportar_dados`, `funis_acoes_massa`

### Defaults por Ambiente

| Ambiente | Dashboard | Criar/Editar | Excluir | Colunas | Tarefas | Compartilhar | Relatórios | Templates | Automações |
|---|---|---|---|---|---|---|---|---|---|
| `cadastro` | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `consultor` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `tecnologia` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `suporte` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 6. Rotas do Frontend

### Páginas do Módulo (7 rotas)

| Rota | Arquivo | Descrição |
|---|---|---|
| `/funis` | `src/routes/funis.tsx` | Página principal |
| `/funis/dashboard` | `src/routes/funis.dashboard.tsx` | Dashboard com lista de funis |
| `/funis/funil/$funilId` | `src/routes/funis.funil.$funilId.tsx` | Kanban do funil |
| `/funis/funil/$funilId/automations` | `src/routes/funis.funil.$funilId.automations.tsx` | Automações do funil |
| `/funis/templates` | `src/routes/funis.templates.tsx` | Gerenciamento de templates |
| `/funis/design` | `src/routes/funis.design.tsx` | Design config |
| `/empresa/funis-design` | `src/routes/empresa.funis-design.tsx` | Design por empresa |

### Estrutura de Componentes (46 arquivos — o maior do sistema)

```
src/features/funis/
├── components/
│   ├── AutomationBuilder.tsx       — Construtor visual de automações
│   ├── AutomationRules.tsx         — Regras de automação
│   ├── ColumnHeader.tsx            — Cabeçalho da coluna Kanban
│   ├── FunilDetallePage.tsx        — Página de detalhe do funil
│   ├── FunisDashboardPage.tsx      — Dashboard de funis
│   ├── KanbanView.tsx              — Visualização Kanban drag-and-drop
│   ├── NotificationsDropdown.tsx   — Notificações em tempo real
│   ├── RecurringConfig.tsx         — Configuração de tarefas recorrentes
│   ├── ShareModal.tsx              — Modal de compartilhamento
│   ├── SwimlaneGroup.tsx           — Agrupamento por swimlane
│   ├── TaskCard.tsx                — Card de tarefa
│   ├── TaskModal.tsx               — Modal de detalhe da tarefa
│   ├── TemplateManager.tsx         — Gerenciador de templates
│   ├── TemplateSelector.tsx        — Seletor de templates
│   └── WipLimitBadge.tsx           — Badge de limite WIP
├── hooks/            (10 hooks)
├── services/         (12 services)
├── utils/            (3 utils)
├── module.ts
├── permissions.ts
└── types.ts
```

---

## 7. Migrações Relacionadas

| Migration | Data | Descrição |
|---|---|---|
| `00037_funis_module.sql` | — | **CORE (Kanban)**: 4 tabelas (`funis`, `funis_colunas`, `funis_tarefas`, `funis_permissoes`), trigger de colunas padrão, RLS |
| `20260624090000_customize_funis_colunas.sql` | 24/06/2026 | Remove trigger `trg_funis_colunas_padrao` que criava 4 colunas fixas ao inserir funil |
| `20260630000001_create_funis_templates.sql` | 30/06/2026 | **Templates**: 3 tabelas (`funis_templates`, `funis_template_cols`, `funis_template_tasks`), RLS |

---

## 8. Diagrama de Relacionamentos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              empresas                                         │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                               funis   [BOARD]                                 │
│  id (PK) │ titulo │ descricao │ created_by │ empresa_id                       │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                           funis_colunas  [COLUNAS]                            │
│  funil_id │ titulo │ posicao                                                   │
│  (Backlog / Em andamento / Revisão / Concluído — antigamente automático)      │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                          funis_tarefas  [CARDS]                               │
│  funil_id │ coluna_id │ titulo │ descricao │ posicao                          │
│  prioridade (low/medium/high/urgent)                                          │
│  atribuido_para │ tools[] │ data_inicio │ data_fim                            │
│  depende_tarefa_id ──→ funis_tarefas (auto-ref: dependência)                  │
│  parent_task_id ──→ funis_tarefas (auto-ref: sub-tarefa)                      │
│  completed_at │ created_by                                                    │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                        funis_permissoes  [ACESSO]                             │
│  funil_id │ user_id │ nivel (view/edit)                                       │
│  UNIQUE(funil_id, user_id)                                                    │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ ─── SUBMÓDULO TEMPLATES ───                                                    │
│                                                                               │
│  funis_templates                                                              │
│  id (PK) │ nome │ descricao │ is_public (bool) │ created_by │ empresa_id      │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                        funis_template_cols                                    │
│  template_id │ titulo │ posicao                                                │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                        funis_template_tasks                                   │
│  template_id │ template_col_idx │ titulo │ descricao │ prioridade │ posicao   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Finais

1. **Maior Número de Componentes**: Com 46 arquivos, o módulo Funis é o maior em termos de componentes frontend — reflexo da riqueza de features (Kanban drag-and-drop, automações, templates, notificações, swimlanes, limites WIP).

2. **Trigger de Colunas Removido**: Originalmente, criar um funil automaticamente gerava 4 colunas padrão via trigger. Isso foi removido na migration `20260624090000` para dar total liberdade ao usuário.

3. **Auto-referências em Tarefas**: `funis_tarefas` possui duas auto-referências:
   - `depende_tarefa_id`: dependência entre tarefas (ex: tarefa B depende da A)
   - `parent_task_id`: sub-tarefas (checklists aninhados)

4. **Compartilhamento Granular**: `funis_permissoes` permite níveis `view` e `edit` por usuário/funil, diferentemente do CRM que usa hierarquia de equipe.

5. **Templates Públicos**: `funis_templates.is_public` permite criar templates que podem ser usados por outras empresas — o único módulo com essa feature.

6. **RLS Misto**: O módulo combina filtros:
   - `is_super_admin_session()` + `get_current_empresa_id()` para o board
   - `EXISTS JOIN` para colunas e tarefas herdarem permissão do board pai
   - `user_id = auth.uid()` para permissões individuais

7. **Automações e Tarefas Recorrentes**: O módulo possui um motor de automação (`automation-engine.ts`) e scheduler de tarefas recorrentes (`recurring-scheduler.ts`), indicando features avançadas de workflow.

8. **18 Permissões**: O módulo Funis tem o maior conjunto de permissões do sistema (18), cobrindo desde visualização até automações e exportação.
