# CLAUDE.md — Módulo Funis

## Visão Geral

Gerenciamento de funis Kanban para fluxos de trabalho. Colunas, tarefas, automações, templates e gamificação.

## Estrutura

```
src/features/funis/
├── module.ts              # Registro do módulo
├── permissions.ts         # 8 permissões (18 com defaults)
├── types.ts               # Tipos
├── services/              # 12 services
├── hooks/                 # 12 hooks
├── components/            # 16 componentes
├── utils/                 # 3 utilitários
└── lib/                   # Utilitários
```

## Rotas

| Rota | Descrição |
|---|---|
| `/funis/dashboard` | Dashboard de funis |
| `/funis/funil/$funilId` | Detalhe do funil |
| `/funis/templates` | Templates de funis |
| `/funis/funil/$funilId/automations` | Automações do funil |

## Permissões

- `funis_ver_dashboard`, `funis_criar_funil`, `funis_editar_funil`, `funis_excluir_funil`
- `funis_gerir_colunas`, `funis_gerir_tarefas`, `funis_compartilhar`, `funis_ver_relatorios`
- + 10 extras: ver_comentarios, adicionar_comentario, ver_anexos, adicionar_anexo, gerir_labels, ver_atividade, criar_template, gerir_automacoes, exportar_dados, acoes_massa

## Eventos

- `funil.criado`, `funil.atualizado`, `funil.excluido`
- `tarefa.criada`, `tarefa.concluida`, `tarefa.movida`
- `tarefa.comentario_adicionado`, `tarefa.anexo_adicionado`, `tarefa.label_adicionado`
- `tarefa.atrasada`, `funil.criado_template`, `automacao.executada`

## Tabelas

- `funis`, `funis_colunas`, `funis_tarefas`, `funis_permissoes`
- `funis_templates`, `funis_template_cols`, `funis_template_tasks`
