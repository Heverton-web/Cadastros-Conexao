# CLAUDE.md — Módulo Mapas Interativos

## Visão Geral

Mapas interativos de presença comercial. Distribuidores, consultores, insights e gestão.

## Estrutura

```
src/features/mapas/
├── module.ts              # Registro do módulo
├── permissions.ts         # 5 permissões
├── types.ts               # Tipos
├── services/              # Services
├── hooks/                 # Hooks
└── components/            # Componentes
```

## Rotas

| Rota | Descrição |
|---|---|
| `/mapas` | Mapa principal |
| `/mapas/distribuidores` | Distribuidores |
| `/mapas/consultores` | Consultores |
| `/mapas/gestao` | Gestão |
| `/mapas/insights` | Insights |
| `/mapas/gestao/distribuidores` | Gestão distribuidores |
| `/mapas/gestao/consultores` | Gestão consultores |

## Permissões

- `mapas_ver_mapa_publico`, `mapas_gerir_distribuidores`, `mapas_gerir_consultores`
- `mapas_ver_insights`, `mapas_gerir_webhooks`

## Eventos

- `distribuidor.criado`, `distribuidor.atualizado`, `distribuidor.excluido`
- `consultor.criado`, `consultor.atualizado`, `consultor.excluido`
- `estado.clicado`, `pin.clicado`

## Tabelas

- `mapas_distributors` — Distribuidores
- `mapas_consultants` — Consultores
