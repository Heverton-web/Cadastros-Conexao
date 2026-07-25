# AGENTS.md — Módulo Clientes

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Gestão de clientes do sistema. Biblioteca de service functions.

## Estrutura

```
src/features/clientes/
└── index.ts    # Service functions e tipos
```

## Tabelas

- `clientes` — Clientes aprovados
- `cadastros` — Cadastros vinculados

## Regras

- Sem permissões, rotas ou eventos
- Biblioteca consumida por cadastros, CRM, catálogo
