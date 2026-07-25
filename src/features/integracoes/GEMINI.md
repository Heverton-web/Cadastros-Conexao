# GEMINI.md — Módulo Integrações

## Context

External integration utility services (CEP lookup, Evolution API). Pure service library.

## Key Files

- `index.ts` — Utility functions

## Database

- `config_integracoes` — External integration settings

## Functions

- `listarIntegracoes()` / `salvarIntegracao()` — CRUD
- `buscarCepResiliente()` — CEP via BrasilAPI + ViaCEP fallback
- `testarConexaoEvolution()` — WhatsApp Evolution API connection test

## Notes

- No formal module.ts, permissions, routes, or events
- Pure utility library
