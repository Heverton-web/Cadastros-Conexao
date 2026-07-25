# AGENTS.md — Módulo Mapas Interativos

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Mapas interativos de presença comercial. Distribuidores, consultores, insights.

## Estrutura

```
src/features/mapas/
├── module.ts              # 7 rotas, 8 eventos, 5 permissões
├── permissions.ts         # Permissões de mapas
├── types.ts               # Tipos
├── services/              # Services
├── hooks/                 # Hooks
└── components/            # Componentes
```

## Rotas

`/mapas`, `/mapas/distribuidores`, `/mapas/consultores`, `/mapas/gestao`, `/mapas/insights`

## Permissões

`mapas_ver_mapa_publico`, `mapas_gerir_distribuidores`, `mapas_gerir_consultores`, `mapas_ver_insights`, `mapas_gerir_webhooks`

## Eventos

`distribuidor.criado`, `distribuidor.atualizado`, `distribuidor.excluido`, `consultor.criado`, `consultor.atualizado`, `consultor.excluido`, `estado.clicado`, `pin.clicado`

## Tabelas

`mapas_distributors`, `mapas_consultants`
