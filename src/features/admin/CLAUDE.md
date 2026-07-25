# CLAUDE.md — Módulo Admin

## Visão Geral

Módulo utilitário de configurações globais do app. Sem module.ts formal — funções exportadas diretamente.

## Estrutura

```
src/features/admin/
└── index.ts    # Funções utilitárias
```

## Tabelas

- `config_app` — Configurações gerais da aplicação
- `credenciais_mock` — Credenciais de teste/demo

## Notas

- Sem permissões, rotas ou eventos registrados
- Biblioteca pura de service functions
