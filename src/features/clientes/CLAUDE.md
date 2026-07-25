# CLAUDE.md — Módulo Clientes

## Visão Geral

Gestão de clientes do sistema. Sem module.ts formal — biblioteca de service functions.

## Estrutura

```
src/features/clientes/
└── index.ts    # Service functions e tipos
```

## Tabelas

- `clientes` — Clientes aprovados do sistema
- `cadastros` — Cadastros vinculados

## Notas

- Sem permissões, rotas ou eventos registrados
- Biblioteca pura exportada por outros módulos (cadastros, CRM, catálogo)
