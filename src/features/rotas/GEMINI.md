# GEMINI.md — Módulo Rotas de Visitas

## Context

Visit route planning and execution. Client base upload, post-visit forms, and reports.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (3 routes, 4 events, 6 permissions) |
| `permissions.ts` | Route-specific permissions |
| `services/*.service.ts` | Supabase data access |
| `hooks/` | React Query hooks |
| `components/` | UI components |

## Database

- `rotas_config` — Route configuration
- `rotas_clientes_base` — Client base
- `rotas` — Planned routes
- `rotas_clientes` — Route clients
- `rotas_trajetos` — Routes/trajectories
- `rotas_visitas` — Completed visits
- `rotas_form_perguntas` — Post-visit form questions

## Routes

- `/rotas` — Route list
- `/rotas/$id` — Route detail
- `/rotas/design` — Page design

## Events

`rota.criada`, `rota.iniciada`, `rota.finalizada`, `visita.registrada`

## Environments

cadastro, consultor, tecnologia

## Features

- hasDiagnostico: true
- hasDesignConfig: true (`/empresa/rotas/design`)
