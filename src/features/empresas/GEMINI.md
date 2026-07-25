# GEMINI.md — Módulo Empresas

## Context

Company management module. Admin module without granular permissions — access allowed for all authenticated users.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (22 routes, 0 events, 0 permissions) |
| `permissions.ts` | Empty array — no permission check |
| `hooks/` | React Query hooks |
| `components/` | UI components |

## Database

- `empresas` — System companies
- `empresas_config` — Company configurations
- `empresa_design_system` — Company design system
- `empresa_modulos` — Enabled modules
- `empresa_modulo_limits` — Module limits
- `empresa_role_limits` — Role limits

## Routes

22 routes covering: company list, settings, design system, expense config, client import, route config, NPS theme, LinkTree theme, Hub chatbot, Maps design, Funis design, CRM design, Cadastros design, onboarding, AI agents.

## Events

None.

## Notes

- permissionCheck returns true for all users
- Acts as hub for all module-specific design/config routes
