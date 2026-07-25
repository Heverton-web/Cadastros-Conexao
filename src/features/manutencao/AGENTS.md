# AGENTS.md — Módulo Manutenção

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Painel de manutenção de módulos e rotas.

## Estrutura

```
src/features/manutencao/
├── module.ts              # 2 rotas, 2 eventos, 0 permissões
├── types.ts               # Tipos
├── hooks.ts               # Hooks
├── services/              # 1 service
└── components/            # ManutencaoPanel, ManutencaoContext
```

## Rotas

`/global/manutencao`, `/empresa/manutencao`

## Eventos

`manutencao.ativada`, `manutencao.desativada`

## Tabelas

`modulos_manutencao`
