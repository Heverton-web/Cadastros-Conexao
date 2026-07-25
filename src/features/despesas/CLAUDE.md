# CLAUDE.md — Módulo Despesas em Rota

## Visão Geral

Gestão de despesas em rota, aprovação e reembolso. Fluxo completo: lançamento → envio → aprovação → pagamento.

## Estrutura

```
src/features/despesas/
├── module.ts              # Registro do módulo
├── permissions.ts         # 8 permissões
├── types.ts               # Tipos
├── services/              # 6 services
├── hooks/                 # 8 hooks
├── components/
│   ├── admin/             # Config admin
│   ├── colaborador/       # Lançamento colaborador
│   ├── responsavel/       # Aprovação
│   └── shared/            # Componentes compartilhados
└── lib/                   # Utilitários
```

## Rotas

| Rota | Descrição |
|---|---|
| `/despesas` | Minhas despesas |
| `/despesas/aprovacao` | Aprovação de despesas |
| `/despesas/meus-relatorios` | Meus relatórios |
| `/despesas/relatorios` | Relatórios gerais |

## Permissões

- `despesas_lancar`, `despesas_enviar`, `despesas_aprovar`, `despesas_reprovar`
- `despesas_definir_pagamento`, `despesas_configurar`
- `despesas_ver_relatorios`, `despesas_ver_todas`

## Eventos

- `despesa.criada`, `despesa.enviada`, `despesa.aprovada`, `despesa.reprovada`
- `pagamento.agendado`, `periodo.aberto`, `periodo.fechando`

## Tabelas

- `despesas` — Despesas lançadas
- `despesas_tipos` — Tipos de despesa
- `despesas_periodos` — Períodos de apuração
- `despesas_envios` — Envios para aprovação
- `despesas_pagamentos` — Pagamentos/reembolsos
- `despesas_config` — Configurações
