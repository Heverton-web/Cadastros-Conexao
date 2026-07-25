# CLAUDE.md — Módulo NPS

## Visão Geral

Pesquisas de satisfação e Net Promoter Score. Perguntas, respostas, relatórios e alertas de detratores.

## Estrutura

```
src/features/nps/
├── module.ts              # Registro do módulo
├── permissions.ts         # 7 permissões
├── types.ts               # Tipos
├── services/              # Services
├── hooks/                 # Hooks
├── components/            # Componentes
│   ├── admin/             # Admin
│   ├── survey/            # Pesquisa
│   └── shared/            # Compartilhados
└── pages/                 # Páginas
```

## Rotas

| Rota | Descrição |
|---|---|
| `/nps` | Dashboard NPS |
| `/nps/survey` | Pesquisa NPS |
| `/nps/dashboard` | Dashboard detalhado |
| `/nps/pesquisas` | Gerenciar pesquisas |
| `/nps/preview` | Pré-visualização |
| `/nps/relatorios` | Relatórios |

## Permissões

- `nps_ver_dashboard`, `nps_ver_respostas`, `nps_gerenciar_perguntas`
- `nps_gerenciar_webhooks`, `nps_excluir_respostas`
- `nps_ver_relatorios`, `nps_exportar_dados`

## Eventos

- `resposta_recebida`, `detrator_detectado` (score <= 6), `pesquisa_enviada`

## Tabelas

- `nps_perguntas` — Perguntas da pesquisa
- `nps_respostas` — Respostas
- `nps_webhook_config` — Webhooks
- `nps_relatorios_envio` — Envio de relatórios
