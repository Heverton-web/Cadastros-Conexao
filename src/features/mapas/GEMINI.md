# GEMINI.md — Módulo Mapas Interativos

## Context

Interactive commercial presence maps. Distributors, consultants, insights, and management.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (7 routes, 8 events, 5 permissions) |
| `permissions.ts` | Map-specific permissions |
| `types.ts` | TypeScript types (MapasDistributor, MapasConsultant) |
| `services/` | Supabase data access |
| `hooks/` | React Query hooks |

## Database

- `mapas_distributors` — Distributors
- `mapas_consultants` — Consultants

## Routes

- `/mapas` — Main map
- `/mapas/distribuidores` — Distributors
- `/mapas/consultores` — Consultants
- `/mapas/gestao` — Management
- `/mapas/insights` — Insights

## Events

`distribuidor.criado`, `distribuidor.atualizado`, `distribuidor.excluido`, `consultor.criado`, `consultor.atualizado`, `consultor.excluido`, `estado.clicado`, `pin.clicado`

## Environments

cadastro, consultor

## Features

- hasDiagnostico: true
- hasDesignConfig: true (`/empresa/mapas/design`)
