# GEMINI.md — Módulo Hub

## Context

Training and gamification platform. Materials, learning trails, rankings, achievements, and chatbot.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (18 routes, 8 events, 27 permissions) |
| `permissions.ts` | 27 permissions across 5 groups |
| `services/*.service.ts` | 8 service modules |
| `components/` | 11 components (admin, gamification, collections, materials, chat) |
| `pages/` | 8 page components |

## Database

- `hub_materiais`, `hub_material_assets` — Training materials
- `hub_collections`, `hub_collection_items`, `hub_collection_progress` — Learning trails
- `hub_user_progress`, `hub_user_badges`, `hub_user_roles` — User data
- `hub_badges`, `hub_gamification_levels` — Gamification
- `hub_invite_tokens`, `hub_access_logs` — Access control
- `hub_chatbot_config`, `hub_system_config` — Configuration

## Routes

18 routes across admin, manager, consultant, and distributor dashboards.

## Events

`material.acessado`, `material.concluido`, `trilha.concluida`, `gamification.level_up`, `badge.conquistado`, `convite.gerado`, `usuario.registrado`, `usuario.status_alterado`

## Environments

cadastro, consultor, tecnologia

## Features

- hasDiagnostico: true
- hasCredentialScopes: true
- hasDesignConfig: true (`/empresa/hub/design`)
