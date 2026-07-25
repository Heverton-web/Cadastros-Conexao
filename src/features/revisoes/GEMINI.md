# GEMINI.md — Módulo Revisões

## Context

Registration review management. Pure utility library.

## Key Files

- `index.ts` — Service functions and types

## Database

- `cadastros` (JSON field `revisoes`)

## Types

- `RevisaoStatus`: pendente | ok | reprovado | em_correcao
- `CampoRevisao`: Field with review status
- `Revisoes`: Map of reviewed fields

## Notes

- No formal module.ts, permissions, routes, or events
- Pure utility library
