# GEMINI.md — Módulo Despesas em Rota

## Context

Route expense management, approval, and reimbursement. Complete flow: entry → submission → approval → payment.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (4 routes, 7 events, 8 permissions) |
| `permissions.ts` | Expense-specific permissions |
| `services/*.service.ts` | 6 service modules |
| `hooks/` | 8 React Query hooks |
| `components/admin/` | Admin configuration |
| `components/colaborador/` | Employee expense entry |
| `components/responsavel/` | Manager approval |

## Database

- `despesas` — Expenses
- `despesas_tipos` — Expense types
- `despesas_periodos` — Billing periods
- `despesas_envios` — Submissions
- `despesas_pagamentos` — Payments/reimbursements
- `despesas_config` — Configuration

## Routes

- `/despesas` — My expenses
- `/despesas/aprovacao` — Approval queue
- `/despesas/meus-relatorios` — My reports
- `/despesas/relatorios` — General reports

## Events

`despesa.criada`, `despesa.enviada`, `despesa.aprovada`, `despesa.reprovada`, `pagamento.agendado`, `periodo.aberto`, `periodo.fechando`

## Environments

cadastro, consultor, tecnologia, suporte
