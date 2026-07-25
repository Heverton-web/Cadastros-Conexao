# GEMINI.md — Módulo Documentos

## Context

Document upload, approval, and management for registration workflow. Pure service library.

## Key Files

- `index.ts` — Service functions and types

## Database

- `documentos` — Registration documents

## Types

- `DocumentoStatus`: pendente | ok | reprovado | em_correcao
- `DocStatus`: inclusa | incompleta | nao_enviada | pendente | em_analise

## Notes

- No formal module.ts, permissions, routes, or events
- Pure service library consumed by cadastros module
