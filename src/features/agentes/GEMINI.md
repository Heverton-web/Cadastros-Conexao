# GEMINI.md — Módulo Agentes IA

## Context

AI agents management for ERP modules. Create, configure, and test intelligent agents with configurable AI providers.

## Tech Stack

React, TanStack Query, Supabase, Zod validation

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (routes, events, permissions) |
| `permissions.ts` | 6 permission keys |
| `services/*.service.ts` | Supabase data access |
| `components/ProvedoresTab.tsx` | AI provider configuration |
| `components/CriarAgenteWizard.tsx` | Agent creation wizard |
| `components/Playground.tsx` | Agent testing playground |

## Database

- `agentes_ia` — AI agents
- `agentes_conversas` — Agent conversations
- `agentes_knowledge_docs` — Knowledge documents
- `agentes_knowledge_tabelas` — Knowledge tables
- `modelos_ia` — Available AI models
- `modelos_ia_versoes` — Model versions

## Routes

- `/empresa/agentes` — Company agents
- `/global/agentes` — Global agents (super admin)

## Events

`agente.criado`, `agente.editado`, `agente.testado`, `agente.ativado`, `provedor.criado`, `provedor.editado`, `provedor.excluido`
