# GEMINI.md — Módulo Funis

## Context

Kanban funnel management for workflows. Columns, tasks, automations, templates, and gamification.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (4 routes, 12 events, 8+10 permissions) |
| `permissions.ts` | Funnel-specific permissions |
| `services/*.service.ts` | 12 service modules |
| `hooks/` | 12 React Query hooks |
| `components/` | 16 UI components |
| `utils/` | 3 utility modules |

## Database

- `funis`, `funis_colunas`, `funis_tarefas`, `funis_permissoes`
- `funis_templates`, `funis_template_cols`, `funis_template_tasks`

## Routes

- `/funis/dashboard` — Funnel dashboard
- `/funis/funil/$funilId` — Funnel detail
- `/funis/templates` — Funnel templates
- `/funis/funil/$funilId/automations` — Funnel automations

## Events

12 events covering: funnel CRUD, task lifecycle, comments, attachments, labels, overdue, templates, automations.

## Environments

cadastro, consultor, tecnologia

## Features

- hasDiagnostico: true
- hasCredentialScopes: true
- hasDesignConfig: true (`/empresa/funis/design`)
