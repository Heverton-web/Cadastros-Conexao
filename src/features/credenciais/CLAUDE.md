# CLAUDE.md — Módulo Credenciais

## Visão Geral

Gestão de credenciais de acesso ao sistema. Sem module.ts formal — biblioteca utilitária.

## Estrutura

```
src/features/credenciais/
└── index.ts    # Service functions e tipos
```

## Tabelas

- `credenciais` — Credenciais de acesso (login, permissões, 2FA)

## Notas

- Sem permissões, rotas ou eventos registrados
- Consumido por módulos de cadastros, catálogo e admin
