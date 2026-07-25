# AGENTS.md — Módulo CRM

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Gestão de relacionamento com clientes e equipe comercial. Pipeline Kanban, carteira, tarefas, transferência e BI.

## Estrutura

```
src/features/crm/
├── module.ts              # 13 rotas, 5 eventos, 10 permissões
├── permissions.ts         # Permissões CRM
├── types.ts               # Tipos
├── services/              # Supabase
├── hooks/                 # React Query
├── components/            # UI (admin, consultor, diretoria)
└── lib/                   # Utilitários
```

## Rotas

`/crm/dashboard`, `/crm/carteira`, `/crm/pipeline`, `/crm/tarefas`, `/crm/metricas`, `/crm/cliente/$id`, `/crm/equipe`, `/crm/bi`, `/crm/transferencia`, `/crm/diretoria`

## Permissões

`crm_dashboard`, `crm_carteira`, `crm_pipeline`, `crm_tarefas`, `crm_cliente_detalhe`, `crm_equipe`, `crm_metricas`, `crm_bi`, `crm_transferencia`, `crm_diretoria`

## Eventos

`cliente.criado`, `cliente.transferido`, `visita.realizada`, `tarefa.excluida`, `consultor.transferido`

## Tabelas

`clientes`, `visitas`, `tarefas`, `pipeline_estagios`, `logs_transferencia`, `logs_transferencia_consultor`
