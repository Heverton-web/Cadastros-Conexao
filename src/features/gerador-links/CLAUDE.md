# CLAUDE.md — Módulo Gerador de Links

## Visão Geral

Geração de links personalizados: WhatsApp, UTMs, Google Review, Maps, Waze e QR Code.

## Estrutura

```
src/features/gerador-links/
├── module.ts              # Registro do módulo
├── permissions.ts         # 6 permissões
├── types.ts               # Tipos
├── services/              # 4 services
├── hooks/                 # 3 hooks
├── components/            # 4 componentes
│   └── sections/          # 6 seções
└── utils/                 # 2 utilitários
```

## Rotas

| Rota | Descrição |
|---|---|
| `/ferramentas/links` | Dashboard links |
| `/ferramentas/links/historico` | Histórico |
| `/ferramentas/links/templates` | Templates |
| `/ferramentas/links/whatsapp` | WhatsApp |
| `/ferramentas/links/utm` | UTMs |
| `/ferramentas/links/google-review` | Google Review |
| `/ferramentas/links/maps` | Maps |
| `/ferramentas/links/waze` | Waze |
| `/ferramentas/links/qrcode` | QR Code |

## Permissões

- `lk_ver`, `lk_gerar`, `lk_salvar`, `lk_editar`, `lk_excluir`, `lk_gerenciar_templates`

## Eventos

- `link.gerado_whatsapp`, `link.gerado_qrcode`, `link.clicado`

## Tabelas

- `config_integracoes` — Configurações de integrações
- `gerador_links` — Links gerados
- `gerador_link_cliques` — Cliques nos links
- `gerador_templates` — Templates de links
