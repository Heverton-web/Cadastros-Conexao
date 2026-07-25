# CLAUDE.md — Módulo API Connectors

## Visão Geral

CRUD e execução de conectores API/webhook. Sem module.ts formal — biblioteca utilitária.

## Estrutura

```
src/features/api-connectors/
└── index.ts    # Service functions e tipos
```

## Tabelas

- `api_connectors` (antes `conectores_api`) — Conectores API/webhook

## Notas

- Sem permissões, rotas ou eventos registrados
- Consumido pelo módulo de Central de Ações
