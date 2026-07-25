# GEMINI.md — Módulo Pré-Cadastro

## Context

Pre-registration flow with onboarding walkthrough (2FA, PF/PJ, documents). Standalone flow.

## Key Files

- `onboarding.tsx` — Onboarding walkthrough
- `PreCadastroComOnboarding.tsx` — Wrapper with onboarding
- `PrevisualizacaoPage.tsx` — Preview page

## Database

- `cadastros` — Linked to pre-registration flow

## Notes

- No formal module.ts, permissions, routes, or events
- Standalone flow: 2FA → PF/PJ → Documents
