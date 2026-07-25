# CLAUDE.md — Módulo Manutenção

## Visão Geral

Painel de manutenção de módulos e rotas. Controle de modo manutenção por módulo.

## Estrutura

```
src/features/manutencao/
├── module.ts              # Registro do módulo
├── types.ts               # Tipos
├── hooks.ts               # Hooks
├── onboarding.tsx         # Onboarding
├── services/              # 1 service
├── components/            # 2 componentes
│   └── ManutencaoPanel.tsx
│   └── ManutencaoContext.tsx
└── index.ts               # Barrel exports
```

## Rotas

| Rota | Descrição |
|---|---|
| `/global/manutencao` | Painel global |
| `/empresa/manutencao` | Painel da empresa |

## Permissões

Nenhuma.

## Eventos

- `manutencao.ativada`, `manutencao.desativada`

## Tabelas

- `modulos_manutencao` — Status de manutenção por módulo
