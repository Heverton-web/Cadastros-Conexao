# CLAUDE.md — Módulo Hub

## Visão Geral

Plataforma de treinamento e gamificação. Materiais, trilhas de aprendizado, rankings, conquistas e chatbot.

## Estrutura

```
src/features/hub/
├── module.ts              # Registro do módulo
├── permissions.ts         # 27 permissões
├── types.ts               # Tipos
├── services/              # 8 services
├── hooks/                 # 1 hook
├── components/            # 11 componentes
│   ├── admin/             # Admin
│   ├── gamification/      # Gamificação
│   ├── collections/       # Trilhas
│   ├── materials/         # Materiais
│   └── chat/              # Chatbot
└── pages/                 # 8 páginas
```

## Rotas

| Rota | Descrição |
|---|---|
| `/global/hub` | Hub global |
| `/hub/admin/dashboard` | Dashboard admin |
| `/hub/admin/materiais` | Materiais |
| `/hub/admin/trilhas` | Trilhas |
| `/hub/admin/analytics` | Analytics |
| `/hub/admin/badges` | Badges |
| `/hub/gestor/dashboard` | Dashboard gestor |
| `/hub/gestor/ranking` | Ranking |
| `/hub/gestor/conquistas` | Conquistas |
| `/hub/consultor/dashboard` | Dashboard consultor |
| `/hub/consultor/ranking` | Ranking consultor |
| `/hub/distribuidor/dashboard` | Dashboard distribuidor |

## Permissões (27)

- **Materiais (8):** `hub_ver_materiais`, `hub_criar_material`, `hub_editar_material`, `hub_excluir_material`, `hub_gerenciar_assets`, `hub_publicar_material`, `hub_ver_acessos_material`, `hub_exportar_materiais`
- **Trilhas (6):** `hub_ver_trilhas`, `hub_criar_trilha`, `hub_editar_trilha`, `hub_excluir_trilha`, `hub_gerenciar_itens_trilha`, `hub_compartilhar_trilha`
- **Gamificação (4):** `hub_ver_ranking`, `hub_gerenciar_badges`, `hub_gerenciar_niveis`, `hub_ver_conquistas`
- **Usuários (4):** `hub_ver_usuarios`, `hub_editar_usuario`, `hub_aprovar_usuario`, `hub_gerenciar_convites`
- **Admin (5):** `hub_ver_analytics`, `hub_gerenciar_config`, `hub_gerenciar_integracoes`, `hub_gerenciar_chatbot`, `hub_gerenciar_webhooks_hub`

## Eventos

- `material.acessado`, `material.concluido`, `trilha.concluida`
- `gamification.level_up`, `badge.conquistado`
- `convite.gerado`, `usuario.registrado`, `usuario.status_alterado`

## Tabelas

- `hub_materiais`, `hub_material_assets`, `hub_collections`, `hub_collection_items`, `hub_collection_progress`
- `hub_user_progress`, `hub_user_badges`, `hub_user_roles`, `hub_gamification_levels`
- `hub_badges`, `hub_invite_tokens`, `hub_access_logs`
- `hub_chatbot_config`, `hub_system_config`, `hub_system_integrations`
