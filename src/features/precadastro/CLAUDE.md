# CLAUDE.md — Módulo Pré-Cadastro

## Visão Geral

Fluxo de pré-cadastro com onboarding walkthrough (2FA, PF/PJ, documentos). Fluxo standalone sem module.ts formal.

## Estrutura

```
src/features/precadastro/
├── onboarding.tsx              # Walkthrough de onboarding
├── PreCadastroComOnboarding.tsx # Wrapper com onboarding
└── PrevisualizacaoPage.tsx     # Pré-visualização
```

## Notas

- Fluxo standalone conectado à tabela `cadastros`
- Sem permissões, rotas ou eventos registrados
- Walkthrough: 2FA → PF/PJ → Documentos
