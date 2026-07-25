# CLAUDE.md — Módulo Integrações

## Visão Geral

Serviços utilitários de integrações externas (CEP, Evolution API). Sem module.ts formal.

## Estrutura

```
src/features/integracoes/
└── index.ts    # Funções utilitárias
```

## Funções

- `listarIntegracoes()` / `salvarIntegracao()` — CRUD em `config_integracoes`
- `buscarCepResiliente()` — CEP via BrasilAPI + ViaCEP fallback
- `testarConexaoEvolution()` — Teste de conexão WhatsApp Evolution API

## Tabelas

- `config_integracoes` — Configurações de integrações externas
