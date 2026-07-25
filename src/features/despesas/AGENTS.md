# AGENTS.md — Módulo Despesas em Rota

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Gestão de despesas em rota, aprovação e reembolso. Fluxo: lançamento → envio → aprovação → pagamento.

## Estrutura

```
src/features/despesas/
├── module.ts              # 4 rotas, 7 eventos, 8 permissões
├── permissions.ts         # Permissões de despesas
├── types.ts               # Tipos
├── services/              # 6 services
├── hooks/                 # 8 hooks
├── components/            # admin, colaborador, responsavel, shared
└── lib/                   # Utilitários
```

## Rotas

`/despesas`, `/despesas/aprovacao`, `/despesas/meus-relatorios`, `/despesas/relatorios`

## Permissões

`despesas_lancar`, `despesas_enviar`, `despesas_aprovar`, `despesas_reprovar`, `despesas_definir_pagamento`, `despesas_configurar`, `despesas_ver_relatorios`, `despesas_ver_todas`

## Eventos

`despesa.criada`, `despesa.enviada`, `despesa.aprovada`, `despesa.reprovada`, `pagamento.agendado`, `periodo.aberto`, `periodo.fechando`

## Tabelas

`despesas`, `despesas_tipos`, `despesas_periodos`, `despesas_envios`, `despesas_pagamentos`, `despesas_config`
