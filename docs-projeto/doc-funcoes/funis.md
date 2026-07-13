# Análise das Funções — Módulo Funis

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **Funis** é o maior módulo do sistema (46 componentes, 18 permissões). Gerencia funis Kanban para fluxos de trabalho, com suporte a templates, automações, labels, comentários e anexos.

| Aspecto | Detalhe |
|---|---|
| **Key** | `funis` |
| **Descrição** | Gerenciamento de funis Kanban |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 18 funções granulares (maior conjunto) |
| **Eventos** | 12 webhooks |
| **Rotas** | 4 páginas |
| **Design Config** | ✅ `/empresa/funis/design` |
| **Credential Scopes** | ✅ |

---

## 2. Funções do Módulo

### 2.1 Função: Dashboard Funis

**Rota**: `/funis/dashboard`
**Permissão**: `funis_ver_dashboard`

Lista de funis com cards, métricas de tarefas por status. Atalhos para criar novo funil.

---

### 2.2 Função: Kanban Board

**Rota**: `/funis/funil/$funilId`
**Permissão**: `funis_gerir_tarefas`

Board Kanban completo com drag & drop entre colunas. Labels, comentários, anexos, prazos, automações. Sub-rotas: `/funis/funil/$funilId/automations`.

---

### 2.3 Função: Templates

**Rota**: `/funis/templates`
**Permissão**: `funis_criar_template`

Criação e gerenciamento de templates de funil. Criar funil a partir de template pré-definido.

---

### 2.4 Funções Granulares (18)

| Key | Grupo | Descrição |
|---|---|---|
| `funis_ver_dashboard` | Funis | Ver lista de funis |
| `funis_criar_funil` | Funis | Criar novos funis |
| `funis_editar_funil` | Funis | Editar título/descrição |
| `funis_excluir_funil` | Funis | Excluir funis |
| `funis_gerir_colunas` | Funis | Adicionar/remover/reordenar colunas |
| `funis_gerir_tarefas` | Funis | Criar/editar/mover/excluir tarefas |
| `funis_compartilhar` | Funis | Conceder/revogar acesso |
| `funis_ver_relatorios` | Funis | Ver métricas e relatórios |
| `funis_ver_comentarios` | Funis | Ver comentários |
| `funis_adicionar_comentario` | Funis | Adicionar comentários |
| `funis_ver_anexos` | Funis | Ver anexos |
| `funis_adicionar_anexo` | Funis | Adicionar anexos |
| `funis_gerir_labels` | Funis | Gerenciar labels |
| `funis_ver_atividade` | Funis | Ver histórico de atividade |
| `funis_criar_template` | Funis | Criar templates |
| `funis_gerir_automacoes` | Funis | Gerenciar regras de automação |
| `funis_exportar_dados` | Funis | Exportar dados |
| `funis_acoes_massa` | Funis | Realizar ações em massa |

---

### 2.5 Eventos (12)

`funil.criado`, `.atualizado`, `.excluido`, `tarefa.criada`, `.concluida`, `.movida`, `.comentario_adicionado`, `.anexo_adicionado`, `.label_adicionado`, `.atrasada`, `funil.criado_template`, `automacao.executada`

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/funis/module.ts` | Definição do módulo |
| `src/features/funis/permissions.ts` | 18 permissões |
| `supabase/migrations/00037_funis_module.sql` | Tabelas `funis_*` |
| `supabase/migrations/20260630000001_create_funis_templates.sql` | Tabelas `funis_template_*` |
