# CLAUDE.md — Módulo CRM

## Visão Geral

Gestão de relacionamento com clientes e equipe comercial. Pipeline Kanban, carteira de clientes, tarefas, transferência de consultores e BI.

## Estrutura

```
src/features/crm/
├── module.ts              # Registro do módulo
├── permissions.ts         # 10 permissões
├── types.ts               # Tipos
├── services/              # Supabase data access
├── hooks/                 # React Query hooks
├── components/            # UI
│   ├── admin/             # CRUD admin
│   ├── consultor/         # Visão consultor
│   └── diretoria/         # Visão diretoria
└── lib/                   # Utilitários
```

## Rotas

| Rota | Descrição |
|---|---|
| `/crm/dashboard` | Dashboard CRM |
| `/crm/carteira` | Carteira de clientes |
| `/crm/pipeline` | Pipeline Kanban |
| `/crm/tarefas` | Tarefas |
| `/crm/metricas` | Métricas |
| `/crm/cliente/$id` | Detalhe do cliente |
| `/crm/equipe` | Equipe comercial |
| `/crm/bi` | Business Intelligence |
| `/crm/transferencia` | Transferência de consultores |
| `/crm/diretoria` | Visão da diretoria |

## Permissões

- `crm_dashboard`, `crm_carteira`, `crm_pipeline`, `crm_tarefas`
- `crm_cliente_detalhe`, `crm_equipe`, `crm_metricas`
- `crm_bi`, `crm_transferencia`, `crm_diretoria`

## Eventos

- `cliente.criado`, `cliente.transferido`
- `visita.realizada`, `tarefa.excluida`
- `consultor.transferido`

## Tabelas

- `clientes` — Clientes do CRM
- `visitas` — Visitas realizadas
- `tarefas` — Tarefas do pipeline
- `pipeline_estagios` — Estágios do pipeline
- `logs_transferencia` — Logs de transferência
- `logs_transferencia_consultor` — Logs de transferência por consultor
