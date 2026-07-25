# AGENTS.md — Módulo Pré-Cadastro

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Fluxo de pré-cadastro com onboarding walkthrough. Standalone.

## Estrutura

```
src/features/precadastro/
├── onboarding.tsx              # Walkthrough
├── PreCadastroComOnboarding.tsx # Wrapper
└── PrevisualizacaoPage.tsx     # Pré-visualização
```

## Regras

- Sem permissões, rotas ou eventos
- Fluxo standalone conectado a `cadastros`
