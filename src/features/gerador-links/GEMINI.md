# GEMINI.md — Módulo Gerador de Links

## Context

Personalized link generation: WhatsApp, UTMs, Google Review, Maps, Waze, and QR Codes.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (9 routes, 3 events, 6 permissions) |
| `permissions.ts` | Link-specific permissions |
| `services/*.service.ts` | 4 service modules |
| `components/sections/` | 6 link type sections |

## Database

- `config_integracoes` — Integration settings
- `gerador_links` — Generated links
- `gerador_link_cliques` — Link clicks
- `gerador_templates` — Link templates

## Routes

- `/ferramentas/links` — Link dashboard
- `/ferramentas/links/historico` — History
- `/ferramentas/links/templates` — Templates
- `/ferramentas/links/whatsapp` — WhatsApp links
- `/ferramentas/links/utm` — UTM links
- `/ferramentas/links/google-review` — Google Review
- `/ferramentas/links/maps` — Maps links
- `/ferramentas/links/waze` — Waze links
- `/ferramentas/links/qrcode` — QR Code generation

## Events

`link.gerado_whatsapp`, `link.gerado_qrcode`, `link.clicado`

## Environments

cadastro, tecnologia
