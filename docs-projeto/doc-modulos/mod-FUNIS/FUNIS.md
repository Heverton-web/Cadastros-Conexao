# Funis

> Gerenciamento de funis Kanban para fluxos de trabalho

**Key:** `funis` | **Ícone:** `GitBranch` | **Ambientes:** `cadastro, consultor, tecnologia`

---

## 1. Core do Módulo

O módulo Funis permite criar e gerenciar quadros Kanban para organizar fluxos de trabalho em colunas (Backlog, Em andamento, Revisão, Concluído). Cada funil contém colunas ordenadas e tarefas que podem ser movidas entre elas via drag-and-drop. Tarefas suportam prioridades, atribuição a usuários, datas de início/fim, dependências, sub-tarefas, labels coloridos, comentários e anexos. O consultor visualiza o dashboard e movimenta tarefas, enquanto o cadastro e tecnologia configuram funis, colunas, templates, automações e permissões granulares. O módulo inclui sistema de notificações, log de atividades, recorrência de tarefas, exportação (CSV/JSON/PDF) e regras de automação acionadas por eventos.

---

## 2. Estrutura do Módulo

```
src/features/funis/
├── module.ts
├── permissions.ts
├── index.ts
├── types.ts
├── components/
│   ├── AutomationBuilder.tsx
│   ├── AutomationRules.tsx
│   ├── ColumnHeader.tsx
│   ├── FunilDetallePage.tsx
│   ├── FunisDashboardPage.tsx
│   ├── KanbanView.tsx
│   ├── NotificationsDropdown.tsx
│   ├── RecurringConfig.tsx
│   ├── ShareModal.tsx
│   ├── SwimlaneGroup.tsx
│   ├── TaskCard.tsx
│   ├── TaskModal.tsx
│   ├── TemplateManager.tsx
│   ├── TemplateSelector.tsx
│   └── WipLimitBadge.tsx
├── hooks/
│   ├── useAttachments.ts
│   ├── useAutomations.ts
│   ├── useBulkActions.ts
│   ├── useComments.ts
│   ├── useFunisData.ts
│   ├── useFunisFilters.tsx
│   ├── useKeyboardShortcuts.ts
│   ├── useLabels.ts
│   ├── useNotifications.ts
│   ├── useRecurring.ts
│   └── useTemplates.ts
├── services/
│   ├── activity.ts
│   ├── attachments.ts
│   ├── automations.ts
│   ├── colunas.ts
│   ├── comments.ts
│   ├── funis.ts
│   ├── index.ts
│   ├── labels.ts
│   ├── notifications.ts
│   ├── permissoes.ts
│   ├── recurring.ts
│   ├── tarefas.ts
│   └── templates.ts
└── utils/
    ├── automation-engine.ts
    ├── export.ts
    └── recurring-scheduler.ts
```

| Diretório | Arquivos | Descrição |
|-----------|----------|-----------|
| `components/` | 15 | Componentes React (páginas, modais, cards, views) |
| `hooks/` | 11 | Hooks React (React Query wrappers) |
| `services/` | 13 | Camada de acesso ao Supabase |
| `utils/` | 3 | Utilitários (automação, exportação, recorrência) |
| `types/` | 1 | Definições TypeScript (types.ts) |

---

## 3. Rotas

| Rota | Componente | Descrição | Acesso |
|------|-----------|-----------|--------|
| `/funis` | `Navigate` | Redireciona para `/funis/dashboard` | Todos autenticados |
| `/funis/dashboard` | `FunisDashboardPage` | Dashboard com lista de funis | `funis_ver_dashboard` |
| `/funis/funil/$funilId` | `FunilDetallePage` | Detalhe do funil (Kanban) | `funis_ver_dashboard` |
| `/funis/templates` | `TemplateManager` | Gerenciador de templates | `funis_criar_template` |
| `/funis/funil/$funilId/automations` | `AutomationRules` | Regras de automação do funil | `funis_gerir_automacoes` |
| `/funis/design` | `Redirect` | Redireciona para `/empresa/funis/design` | Todos autenticados |
| `/empresa/funis/design` | `ModuloDesignPage` | Configurações de design do módulo | Todos autenticados |

---

## 4. Permissões

| Chave | Label | Descrição | Grupo |
|-------|-------|-----------|-------|
| `funis_ver_dashboard` | Ver dashboard de funis | Visualizar lista de funis | Funis |
| `funis_criar_funil` | Criar funis | Criar novos funis | Funis |
| `funis_editar_funil` | Editar funis | Editar titulo/descricao de funis | Funis |
| `funis_excluir_funil` | Excluir funis | Excluir funis | Funis |
| `funis_gerir_colunas` | Gerir colunas | Adicionar/remover/reordenar colunas | Funis |
| `funis_gerir_tarefas` | Gerir tarefas | Criar/editar/mover/excluir tarefas | Funis |
| `funis_compartilhar` | Compartilhar funis | Conceder/revogar acesso a outros usuarios | Funis |
| `funis_ver_relatorios` | Ver relatorios | Visualizar metricas e relatorios dos funis | Funis |

> Nota: O `registerPermissionDefaults` em module.ts referencia 18 permissões, mas apenas 8 estão definidas em `permissions.ts`. As permissões adicionais (`funis_ver_comentarios`, `funis_adicionar_comentario`, `funis_ver_anexos`, `funis_adicionar_anexo`, `funis_gerir_labels`, `funis_ver_atividade`, `funis_criar_template`, `funis_gerir_automacoes`, `funis_exportar_dados`, `funis_acoes_massa`) são usadas nos defaults mas não registradas via `registerPermission`.

---

## 5. Defaults por Papel

| Permissão | Cadastro | Consultor | Tecnologia | Suporte |
|-----------|----------|-----------|------------|---------|
| `funis_ver_dashboard` | ✅ | ✅ | ✅ | ❌ |
| `funis_criar_funil` | ✅ | ❌ | ✅ | ❌ |
| `funis_editar_funil` | ✅ | ❌ | ✅ | ❌ |
| `funis_excluir_funil` | ❌ | ❌ | ✅ | ❌ |
| `funis_gerir_colunas` | ✅ | ❌ | ✅ | ❌ |
| `funis_gerir_tarefas` | ✅ | ✅ | ✅ | ❌ |
| `funis_compartilhar` | ✅ | ❌ | ✅ | ❌ |
| `funis_ver_relatorios` | ✅ | ❌ | ✅ | ❌ |
| `funis_ver_comentarios` | ✅ | ✅ | ✅ | ❌ |
| `funis_adicionar_comentario` | ✅ | ✅ | ✅ | ❌ |
| `funis_ver_anexos` | ✅ | ✅ | ✅ | ❌ |
| `funis_adicionar_anexo` | ✅ | ❌ | ✅ | ❌ |
| `funis_gerir_labels` | ✅ | ❌ | ✅ | ❌ |
| `funis_ver_atividade` | ✅ | ✅ | ✅ | ❌ |
| `funis_criar_template` | ✅ | ❌ | ✅ | ❌ |
| `funis_gerir_automacoes` | ✅ | ❌ | ✅ | ❌ |
| `funis_exportar_dados` | ✅ | ❌ | ✅ | ❌ |
| `funis_acoes_massa` | ✅ | ❌ | ✅ | ❌ |

---

## 6. Navegação (Sidebar)

| Label | Rota | Ícone | Permissão | Ordem |
|-------|------|-------|-----------|-------|
| Dashboard Funis | `/funis/dashboard` | `LayoutDashboard` | `funis_ver_dashboard` | 20 |
| Templates | `/funis/templates` | `FileText` | `funis_criar_template` | 25 |

---

## 7. Eventos / Webhooks

| Chave | Label | Descrição | Tipo |
|-------|-------|-----------|------|
| `funil.criado` | Funil Criado | Quando um novo funil é criado | `status_change` |
| `funil.atualizado` | Funil Atualizado | Quando um funil é editado | `status_change` |
| `funil.excluido` | Funil Excluído | Quando um funil é removido | `status_change` |
| `tarefa.criada` | Tarefa Criada | Quando uma nova tarefa é adicionada | `status_change` |
| `tarefa.concluida` | Tarefa Concluída | Quando uma tarefa é marcada como concluída | `button_action` |
| `tarefa.movida` | Tarefa Movida | Quando uma tarefa é movida entre colunas | `button_action` |
| `tarefa.comentario_adicionado` | Comentário Adicionado | Quando um comentário é adicionado a uma tarefa | `status_change` |
| `tarefa.anexo_adicionado` | Anexo Adicionado | Quando um anexo é adicionado a uma tarefa | `status_change` |
| `tarefa.label_adicionado` | Label Adicionado | Quando um label é adicionado a uma tarefa | `status_change` |
| `tarefa.atrasada` | Tarefa Atrasada | Quando uma tarefa ultrapassa a data fim | `status_change` |
| `funil.criado_template` | Funil Criado via Template | Quando um funil é criado a partir de template | `status_change` |
| `automacao.executada` | Automação Executada | Quando uma regra de automação é executada | `button_action` |

---

## 8. Funcionalidades

| Flag | Ativo | Detalhe |
|------|-------|---------|
| Design Config | ✅ | `/empresa/funis/design` |
| Credenciais | ✅ | |
| Laboratório | ❌ | |
| Formulário | ❌ | |
| Ações Customizadas | ❌ | |
| API Connectors | ❌ | |

---

## 9. Dependências

### Tabelas Supabase

| Tabela | Uso |
|--------|-----|
| `funis` | Boards Kanban (título, descrição, criador, empresa) |
| `funis_colunas` | Colunas de cada funil (título, posição) |
| `funis_tarefas` | Tarefas dentro das colunas (título, prioridade, atribuição, datas) |
| `funis_permissoes` | Acesso granular por funil (view/edit por usuário) |
| `funis_templates` | Templates de funis reutilizáveis |
| `funis_template_cols` | Colunas dos templates |
| `funis_template_tasks` | Tarefas pré-definidas dos templates |
| `funis_comments` | Comentários nas tarefas |
| `funis_attachments` | Anexos/links nas tarefas |
| `funis_labels` | Labels coloridos para categorizar tarefas |
| `funis_tarefas_labels` | Relação N:N entre tarefas e labels |
| `funis_activity_log` | Log de atividades do funil |
| `funis_automations` | Regras de automação (triggers + ações) |
| `funis_notifications` | Notificações push do módulo |
| `funis_recurring` | Configurações de tarefas recorrentes |
| `profiles` | Consulta de usuários (via FK em comments/activity/permissoes) |
| `empresas` | FK empresa_id em funis, templates, automações, notificações |

### Módulos Relacionados

| Módulo | Tipo de Relação |
|--------|-----------------|
| `cadastros` | Herança de ambiente (cadastro tem acesso total) |
| `consultor` | Herança de ambiente (consultor tem acesso parcial) |
| `tecnologia` | Herança de ambiente (tecnologia tem acesso total) |

---

## 10. Schema das Tabelas

> Schema SQL consolidado das tabelas exclusivas do módulo. Colunas adicionadas via migrations estão incluídas.

### `funis`

```sql
CREATE TABLE IF NOT EXISTS funis (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT NOT NULL,
  descricao   TEXT,
  created_by  UUID NOT NULL REFERENCES auth.users(id),
  empresa_id  UUID REFERENCES empresas(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `titulo` | `text` | NOT NULL | Título do funil |
| `descricao` | `text` | | Descrição do funil |
| `created_by` | `uuid` | NOT NULL, FK → auth.users | Criador do funil |
| `empresa_id` | `uuid` | FK → empresas, ON DELETE CASCADE | Empresa dona do funil |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Data de criação |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Última atualização (trigger) |

### `funis_colunas`

```sql
CREATE TABLE IF NOT EXISTS funis_colunas (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funil_id  UUID NOT NULL REFERENCES funis(id) ON DELETE CASCADE,
  titulo    TEXT NOT NULL,
  posicao   INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `funil_id` | `uuid` | NOT NULL, FK → funis, ON DELETE CASCADE | Funil pai |
| `titulo` | `text` | NOT NULL | Nome da coluna |
| `posicao` | `integer` | NOT NULL, default `0` | Ordem da coluna no funil |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Data de criação |

### `funis_tarefas`

```sql
CREATE TABLE IF NOT EXISTS funis_tarefas (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funil_id           UUID NOT NULL REFERENCES funis(id) ON DELETE CASCADE,
  coluna_id          UUID NOT NULL REFERENCES funis_colunas(id) ON DELETE CASCADE,
  titulo             TEXT NOT NULL,
  descricao          TEXT,
  posicao            INTEGER NOT NULL DEFAULT 0,
  prioridade         TEXT CHECK (prioridade IN ('low','medium','high','urgent')) DEFAULT 'medium',
  atribuido_para     UUID REFERENCES auth.users(id),
  tools              TEXT[] DEFAULT '{}',
  data_inicio        DATE,
  data_fim           DATE,
  depende_tarefa_id  UUID REFERENCES funis_tarefas(id),
  parent_task_id     UUID REFERENCES funis_tarefas(id),
  completed_at       TIMESTAMPTZ,
  created_by         UUID NOT NULL REFERENCES auth.users(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `funil_id` | `uuid` | NOT NULL, FK → funis, ON DELETE CASCADE | Funil pai |
| `coluna_id` | `uuid` | NOT NULL, FK → funis_colunas, ON DELETE CASCADE | Coluna atual |
| `titulo` | `text` | NOT NULL | Título da tarefa |
| `descricao` | `text` | | Descrição detalhada |
| `posicao` | `integer` | NOT NULL, default `0` | Ordem dentro da coluna |
| `prioridade` | `text` | CHECK IN ('low','medium','high','urgent'), default 'medium' | Prioridade |
| `atribuido_para` | `uuid` | FK → auth.users | Responsável |
| `tools` | `text[]` | default `'{}'` | Ferramentas/tools da tarefa |
| `data_inicio` | `date` | | Data de início |
| `data_fim` | `date` | | Data de vencimento |
| `depende_tarefa_id` | `uuid` | FK → funis_tarefas | Tarefa da qual depende |
| `parent_task_id` | `uuid` | FK → funis_tarefas | Tarefa pai (sub-tarefa) |
| `completed_at` | `timestamptz` | | Data de conclusão |
| `created_by` | `uuid` | NOT NULL, FK → auth.users | Criador |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Data de criação |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Última atualização (trigger) |

### `funis_permissoes`

```sql
CREATE TABLE IF NOT EXISTS funis_permissoes (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funil_id  UUID NOT NULL REFERENCES funis(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES auth.users(id),
  nivel     TEXT CHECK (nivel IN ('view','edit')) NOT NULL DEFAULT 'view',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(funil_id, user_id)
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `funil_id` | `uuid` | NOT NULL, FK → funis, ON DELETE CASCADE | Funil |
| `user_id` | `uuid` | NOT NULL, FK → auth.users | Usuário com acesso |
| `nivel` | `text` | CHECK IN ('view','edit'), NOT NULL, default 'view' | Nível de acesso |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Data de criação |

### `funis_templates`

```sql
CREATE TABLE IF NOT EXISTS funis_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  descricao   TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT false,
  created_by  UUID NOT NULL REFERENCES auth.users(id),
  empresa_id  UUID REFERENCES empresas(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `nome` | `text` | NOT NULL | Nome do template |
| `descricao` | `text` | | Descrição |
| `is_public` | `boolean` | NOT NULL, default `false` | Visível para outras empresas |
| `created_by` | `uuid` | NOT NULL, FK → auth.users | Criador |
| `empresa_id` | `uuid` | FK → empresas, ON DELETE CASCADE | Empresa dona |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Data de criação |

### `funis_template_cols`

```sql
CREATE TABLE IF NOT EXISTS funis_template_cols (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  UUID NOT NULL REFERENCES funis_templates(id) ON DELETE CASCADE,
  titulo       TEXT NOT NULL,
  posicao      INTEGER NOT NULL DEFAULT 0
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `template_id` | `uuid` | NOT NULL, FK → funis_templates, ON DELETE CASCADE | Template pai |
| `titulo` | `text` | NOT NULL | Nome da coluna |
| `posicao` | `integer` | NOT NULL, default `0` | Ordem |

### `funis_template_tasks`

```sql
CREATE TABLE IF NOT EXISTS funis_template_tasks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id      UUID NOT NULL REFERENCES funis_templates(id) ON DELETE CASCADE,
  template_col_idx INTEGER NOT NULL DEFAULT 0,
  titulo           TEXT NOT NULL,
  descricao        TEXT,
  prioridade       TEXT CHECK (prioridade IN ('low','medium','high','urgent')) DEFAULT 'medium',
  posicao          INTEGER NOT NULL DEFAULT 0
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `template_id` | `uuid` | NOT NULL, FK → funis_templates, ON DELETE CASCADE | Template pai |
| `template_col_idx` | `integer` | NOT NULL, default `0` | Índice da coluna no template |
| `titulo` | `text` | NOT NULL | Título da tarefa |
| `descricao` | `text` | | Descrição |
| `prioridade` | `text` | CHECK IN ('low','medium','high','urgent'), default 'medium' | Prioridade |
| `posicao` | `integer` | NOT NULL, default `0` | Ordem |

### Tabelas inferidas dos services (sem migration encontrada)

> As tabelas abaixo são usadas nos services mas não possuem migration SQL no repositório. Foram criadas diretamente no Supabase ou via mecanismo externo.

| Tabela | Inferida de |
|--------|-------------|
| `funis_comments` | `services/comments.ts` |
| `funis_attachments` | `services/attachments.ts` |
| `funis_labels` | `services/labels.ts` |
| `funis_tarefas_labels` | `services/labels.ts` |
| `funis_activity_log` | `services/activity.ts` |
| `funis_automations` | `services/automations.ts` |
| `funis_notifications` | `services/notifications.ts` |
| `funis_recurring` | `services/recurring.ts` |

---

## 11. Notas

- O trigger `trg_funis_colunas_padrao` (que criava 4 colunas padrão ao inserir um funil) foi removido na migration `20260624090000`. Atualmente as colunas são criadas pelo service `criarFunil` com fallback para `["Backlog", "Em andamento", "Revisão", "Concluído"]`.
- O módulo usa o engine de webhooks (`dispararEventoModulo`) para disparar 12 eventos distintos.
- O `automation-engine.ts` suporta 6 tipos de triggers (`tarefa_criada`, `tarefa_movida`, `tarefa_concluida`, `tarefa_atrasada`, `label_adicionado`, `comentario_adicionado`) e 7 tipos de ações (`mover_para_coluna`, `atribuir_usuario`, `alterar_prioridade`, `adicionar_label`, `remover_label`, `enviar_notificacao`, `criar_tarefa`).
- O `recurring-scheduler.ts` processa tarefas recorrentes (diária, semanal, mensal, personalizada) e verifica tarefas atrasadas para disparar notificações.
- A exportação suporta CSV, JSON e PDF (via janela do navegador).
- Permissões granulares por funil são controladas pela tabela `funis_permissoes` (nível view/edit), independente das permissões de módulo.
- Todas as tabelas possuem RLS habilitado com policies para `authenticated`.
- O design do módulo é configurável via `/empresa/funis/design` usando o `ModuloDesignPage`.
