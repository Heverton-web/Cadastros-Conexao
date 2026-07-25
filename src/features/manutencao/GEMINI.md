# GEMINI.md — Módulo Manutenção

## Context

Module and route maintenance panel. Controls maintenance mode per module.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (2 routes, 2 events, 0 permissions) |
| `types.ts` | TypeScript types |
| `services/manutencao.service.ts` | Supabase data access |
| `components/ManutencaoPanel.tsx` | Maintenance panel UI |
| `components/ManutencaoContext.tsx` | React context |

## Database

- `modulos_manutencao` — Maintenance status per module

## Routes

- `/global/manutencao` — Global panel
- `/empresa/manutencao` — Company panel

## Events

`manutencao.ativada`, `manutencao.desativada`

## Notes

- Minimal module — no permissions, no nav items
