# GEMINI.md — Módulo CRM

## Context

Customer relationship management and sales team management. Kanban pipeline, customer portfolio, tasks, consultant transfers, and BI.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (13 routes, 5 events, 10 permissions) |
| `permissions.ts` | CRM-specific permissions |
| `services/*.service.ts` | Supabase data access |
| `components/admin/` | Admin CRUD components |
| `components/consultor/` | Consultant view |
| `components/diretoria/` | Management view |

## Database

- `clientes` — CRM customers
- `visitas` — Visits performed
- `tarefas` — Pipeline tasks
- `pipeline_estagios` — Pipeline stages
- `logs_transferencia` — Transfer logs
- `logs_transferencia_consultor` — Consultant transfer logs

## Routes

- `/crm/dashboard` — CRM dashboard
- `/crm/carteira` — Customer portfolio
- `/crm/pipeline` — Kanban pipeline
- `/crm/tarefas` — Tasks
- `/crm/metricas` — Metrics
- `/crm/bi` — Business Intelligence
- `/crm/transferencia` — Consultant transfers
- `/crm/diretoria` — Management view

## Events

`cliente.criado`, `cliente.transferido`, `visita.realizada`, `tarefa.excluida`, `consultor.transferido`

## Environments

cadastro, consultor, tecnologia
