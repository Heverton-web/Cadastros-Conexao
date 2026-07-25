# AGENTS.md — Módulo Funis

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Gerenciamento de funis Kanban para fluxos de trabalho. Colunas, tarefas, automações, templates.

## Estrutura

```
src/features/funis/
├── module.ts              # 4 rotas, 12 eventos, 18 permissões
├── permissions.ts         # Permissões de funis
├── types.ts               # Tipos
├── services/              # 12 services
├── hooks/                 # 12 hooks
├── components/            # 16 componentes
└── utils/                 # 3 utilitários
```

## Rotas

`/funis/dashboard`, `/funis/funil/$funilId`, `/funis/templates`, `/funis/funil/$funilId/automations`

## Permissões

`funis_ver_dashboard`, `funis_criar_funil`, `funis_editar_funil`, `funis_excluir_funil`, `funis_gerir_colunas`, `funis_gerir_tarefas`, `funis_compartilhar`, `funis_ver_relatorios`

## Eventos

`funil.criado`, `funil.atualizado`, `funil.excluido`, `tarefa.criada`, `tarefa.concluida`, `tarefa.movida`, `tarefa.comentario_adicionado`, `tarefa.anexo_adicionado`, `tarefa.label_adicionado`, `tarefa.atrasada`, `funil.criado_template`, `automacao.executada`

## Tabelas

`funis`, `funis_colunas`, `funis_tarefas`, `funis_permissoes`, `funis_templates`, `funis_template_cols`, `funis_template_tasks`
