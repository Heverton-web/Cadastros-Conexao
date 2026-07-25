# AGENTS.md — Módulo Agentes IA

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Criar e gerenciar agentes inteligentes para módulos do ERP. Provedores IA configuráveis globalmente.

## Estrutura

```
src/features/agentes/
├── module.ts              # Registro
├── permissions.ts         # 6 permissões
├── types.ts               # Tipos
├── services/              # Supabase
├── hooks/                 # React Query
└── components/            # UI (ProvedoresTab, Wizard, Playground)
```

## Rotas

- `/empresa/agentes` — Agentes empresa
- `/global/agentes` — Agentes globais

## Permissões

`agentes_ver`, `agentes_criar`, `agentes_editar`, `agentes_excluir`, `agentes_testar`, `agentes_provedores_gerenciar`

## Eventos

`agente.criado`, `agente.editado`, `agente.testado`, `agente.ativado`, `provedor.criado`, `provedor.editado`, `provedor.excluido`

## Tabelas

`agentes_ia`, `agentes_conversas`, `agentes_knowledge_docs`, `agentes_knowledge_tabelas`, `modelos_ia`, `modelos_ia_versoes`
