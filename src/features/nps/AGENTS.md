# AGENTS.md — Módulo NPS

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Pesquisas de satisfação e Net Promoter Score. Perguntas, respostas, relatórios.

## Estrutura

```
src/features/nps/
├── module.ts              # 6 rotas, 3 eventos, 7 permissões
├── permissions.ts         # Permissões NPS
├── types.ts               # Tipos
├── services/              # Services
├── hooks/                 # Hooks
├── components/            # admin, survey, shared
└── pages/                 # Páginas
```

## Rotas

`/nps`, `/nps/survey`, `/nps/dashboard`, `/nps/pesquisas`, `/nps/preview`, `/nps/relatorios`

## Permissões

`nps_ver_dashboard`, `nps_ver_respostas`, `nps_gerenciar_perguntas`, `nps_gerenciar_webhooks`, `nps_excluir_respostas`, `nps_ver_relatorios`, `nps_exportar_dados`

## Eventos

`resposta_recebida`, `detrator_detectado`, `pesquisa_enviada`

## Tabelas

`nps_perguntas`, `nps_respostas`, `nps_webhook_config`, `nps_relatorios_envio`
