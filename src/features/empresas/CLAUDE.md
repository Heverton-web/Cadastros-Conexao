# CLAUDE.md — Módulo Empresas

## Visão Geral

Gerenciamento de empresas. Módulo admin sem permissões granulares — acesso liberado para todos.

## Estrutura

```
src/features/empresas/
├── module.ts              # Registro do módulo (22 rotas)
├── permissions.ts         # Sem permissões (array vazio)
├── index.ts               # Barrel exports
├── hooks/                 # React Query hooks
├── components/            # UI
└── contexts/              # React contexts
```

## Rotas

| Rota | Descrição |
|---|---|
| `/global/empresas` | Lista de empresas |
| `/empresa` | Configurações da empresa |
| `/empresa/design` | Design system |
| `/empresa/despesas-config` | Config despesas |
| `/empresa/clientes-import` | Importação de clientes |
| `/empresa/rotas/config` | Config rotas |
| `/empresa/nps/tema` | Tema NPS |
| `/empresa/linktree/tema` | Tema LinkTree |
| `/empresa/hub/chatbot` | Chatbot Hub |
| `/empresa/mapas/design` | Design Mapas |
| `/empresa/funis/design` | Design Funis |
| `/empresa/crm/design` | Design CRM |
| `/empresa/cadastros/design` | Design Cadastros |
| `/empresa/onboarding` | Onboarding |
| `/empresa/agentes` | Agentes IA |

## Permissões

Nenhuma — acesso sem filtro por permissão.

## Eventos

Nenhum.

## Tabelas

- `empresas` — Empresas do sistema
- `empresas_config` — Configurações por empresa
- `empresa_design_system` — Design system por empresa
- `empresa_modulos` — Módulos habilitados
- `empresa_modulo_limits` — Limites por módulo
- `empresa_role_limits` — Limites por perfil
