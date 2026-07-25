# GEMINI.md — Módulo LinkTree

## Context

Digital business cards and QR codes for employees. Public profiles with analytics.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (2 routes, 3 events, 13 permissions) |
| `permissions.ts` | LinkTree-specific permissions |
| `services/linktree.service.ts` | Supabase data access |
| `hooks/` | 2 React Query hooks |
| `components/` | 18 UI components |

## Database

- `linktree_colaboradores` — Employees
- `linktree_empresa_config` — Company configuration
- `linktree_empresa_links` — LinkTree links
- `linktree_empresa_sections` — Sections
- `linktree_empresa_clicks` — Clicks/analytics
- `linktree_tema_config` — Visual theme

## Routes

- `/linktree/dashboard` — LinkTree dashboard
- `/linktree/empresa` — Company LinkTree

## Events

`colaborador.criado`, `colaborador.ativado`, `colaborador.inativado`

## Environments

cadastro, consultor, tecnologia

## Features

- hasDiagnostico: true
- hasCredentialScopes: true
- hasDesignConfig: true (`/empresa/linktree/design`)
