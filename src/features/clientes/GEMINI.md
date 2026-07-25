# GEMINI.md — Módulo Clientes

## Context

Customer management utility library. No formal module.ts — exports service functions consumed by other modules.

## Key Files

- `index.ts` — Service functions and types

## Database

- `clientes` — Approved customers
- `cadastros` — Linked registrations

## Notes

- No permissions, routes, or events
- Pure service library consumed by cadastros, CRM, catalogo modules
