# AGENTS.md — Módulo Gerador de Links

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Geração de links personalizados: WhatsApp, UTMs, Google Review, Maps, Waze e QR Code.

## Estrutura

```
src/features/gerador-links/
├── module.ts              # 9 rotas, 3 eventos, 6 permissões
├── permissions.ts         # Permissões de links
├── types.ts               # Tipos
├── services/              # 4 services
├── hooks/                 # 3 hooks
├── components/sections/   # 6 seções
└── utils/                 # 2 utilitários
```

## Rotas

`/ferramentas/links`, `/ferramentas/links/historico`, `/ferramentas/links/templates`, `/ferramentas/links/whatsapp`, `/ferramentas/links/utm`, `/ferramentas/links/google-review`, `/ferramentas/links/maps`, `/ferramentas/links/waze`, `/ferramentas/links/qrcode`

## Permissões

`lk_ver`, `lk_gerar`, `lk_salvar`, `lk_editar`, `lk_excluir`, `lk_gerenciar_templates`

## Eventos

`link.gerado_whatsapp`, `link.gerado_qrcode`, `link.clicado`

## Tabelas

`config_integracoes`, `gerador_links`, `gerador_link_cliques`, `gerador_templates`
