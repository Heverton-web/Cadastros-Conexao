# CLAUDE.md — Módulo Agentes IA

## Visão Geral

Criar e gerenciar agentes inteligentes para módulos do ERP. Inclui provedores IA configuráveis globalmente.

## Estrutura

```
src/features/agentes/
├── module.ts              # Registro do módulo
├── permissions.ts         # Permissões
├── types.ts               # Tipos
├── services/              # Supabase data access
├── hooks/                 # React Query hooks
└── components/            # UI (ProvedoresTab, CriarAgenteWizard, Playground)
```

## Rotas

| Rota | Descrição |
|---|---|
| `/empresa/agentes` | Agentes da empresa |
| `/global/agentes` | Agentes globais (super admin) |

## Permissões

- `agentes_ver` — Visualizar agentes
- `agentes_criar` — Criar agentes
- `agentes_editar` — Editar agentes
- `agentes_excluir` — Excluir agentes
- `agentes_testar` — Testar agentes
- `agentes_provedores_gerenciar` — Gerenciar provedores IA

## Eventos

- `agente.criado`, `agente.editado`, `agente.testado`, `agente.ativado`
- `provedor.criado`, `provedor.editado`, `provedor.excluido`

## Tabelas

- `agentes_ia` — Agentes inteligentes
- `agentes_conversas` — Conversas dos agentes
- `agentes_knowledge_docs` — Documentos de conhecimento
- `agentes_knowledge_tabelas` — Tabelas de conhecimento
- `modelos_ia` — Modelos de IA disponíveis
- `modelos_ia_versoes` — Versões dos modelos
