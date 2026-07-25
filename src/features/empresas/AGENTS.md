# AGENTS.md — Módulo Empresas

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Gerenciamento de empresas. Módulo admin sem permissões granulares.

## Estrutura

```
src/features/empresas/
├── module.ts              # 22 rotas, 0 eventos, 0 permissões
├── permissions.ts         # Array vazio
├── index.ts               # Barrel exports
├── hooks/                 # React Query
├── components/            # UI
└── contexts/              # React contexts
```

## Rotas

`/global/empresas`, `/empresa`, `/empresa/design`, `/empresa/despesas-config`, `/empresa/clientes-import`, `/empresa/rotas/config`, `/empresa/nps/tema`, `/empresa/linktree/tema`, `/empresa/hub/chatbot`, `/empresa/mapas/design`, `/empresa/funis/design`, `/empresa/crm/design`, `/empresa/cadastros/design`, `/empresa/onboarding`, `/empresa/agentes`

## Permissões

Nenhuma — acesso liberado para todos.

## Eventos

Nenhum.

## Tabelas

`empresas`, `empresas_config`, `empresa_design_system`, `empresa_modulos`, `empresa_modulo_limits`, `empresa_role_limits`
