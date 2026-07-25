# GEMINI.md — Módulo Cadastros

## Context

Customer registration management (PF/PJ) with approval workflow, document review, and credential creation.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (8 routes, 17 events, 16 permissions) |
| `permissions.ts` | Granular permissions for approval workflow |
| `services/*.service.ts` | Supabase data access |
| `components/` | UI components for admin and workflow |

## Database

- `cadastros` — Main registrations
- `cadastros_pf` — Personal data (PF)
- `cadastros_pj` — Company data (PJ)
- `cadastros_enderecos` — Addresses
- `clientes` — Approved customers
- `documentos` — Registration documents
- `convites_acesso` — Access invites

## Routes

- `/cadastros/dashboard` — Registration dashboard
- `/cadastros/solicitacoes` — Pending requests
- `/cadastros/clientes` — Customer list
- `/cadastros/consultor` — Consultant view
- `/cadastros/relatorios` — Reports
- `/cadastros/previsualizacao` — Preview

## Events

17 events covering: registration CRUD, document approval/rejection, link generation, credential creation, and workflow actions.
