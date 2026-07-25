# AGENTS.md — Módulo Hub

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Plataforma de treinamento e gamificação. Materiais, trilhas, rankings, conquistas e chatbot.

## Estrutura

```
src/features/hub/
├── module.ts              # 18 rotas, 8 eventos, 27 permissões
├── permissions.ts         # 27 permissões (5 grupos)
├── types.ts               # Tipos
├── services/              # 8 services
├── hooks/                 # 1 hook
├── components/            # 11 componentes
└── pages/                 # 8 páginas
```

## Rotas

`/global/hub`, `/hub/admin/dashboard`, `/hub/admin/materiais`, `/hub/admin/trilhas`, `/hub/admin/analytics`, `/hub/admin/badges`, `/hub/gestor/dashboard`, `/hub/gestor/ranking`, `/hub/gestor/conquistas`, `/hub/consultor/dashboard`, `/hub/distribuidor/dashboard`

## Permissões

27 permissões: materiais (8), trilhas (6), gamificação (4), usuários (4), admin (5)

## Eventos

`material.acessado`, `material.concluido`, `trilha.concluida`, `gamification.level_up`, `badge.conquistado`, `convite.gerado`, `usuario.registrado`, `usuario.status_alterado`

## Tabelas

`hub_materiais`, `hub_collections`, `hub_user_progress`, `hub_badges`, `hub_gamification_levels`, `hub_invite_tokens`, `hub_chatbot_config`
