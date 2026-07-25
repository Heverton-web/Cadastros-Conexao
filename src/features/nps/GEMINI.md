# GEMINI.md — Módulo NPS

## Context

Customer satisfaction surveys and Net Promoter Score. Questions, answers, reports, and detractor alerts.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (6 routes, 3 events, 7 permissions) |
| `permissions.ts` | NPS-specific permissions |
| `services/*.service.ts` | Supabase data access |
| `components/` | Admin, survey, and shared components |
| `pages/` | Page components |

## Database

- `nps_perguntas` — Survey questions
- `nps_respostas` — Responses
- `nps_webhook_config` — Webhooks
- `nps_relatorios_envio` — Report sends

## Routes

- `/nps` — NPS dashboard
- `/nps/survey` — NPS survey
- `/nps/dashboard` — Detailed dashboard
- `/nps/pesquisas` — Manage surveys
- `/nps/preview` — Preview
- `/nps/relatorios` — Reports

## Events

`resposta_recebida`, `detrator_detectado` (score <= 6), `pesquisa_enviada`

## Environments

cadastro, consultor, tecnologia

## Features

- hasDiagnostico: true
- hasCredentialScopes: true
- hasDesignConfig: true (`/empresa/nps/design`)
