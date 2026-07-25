# CLAUDE.md — Módulo Marketing

## Visão Geral

Módulo agregador de Marketing Digital. Dashboard principal com 10 sub-módulos.

## Estrutura

```
src/features/marketing/
├── module.ts              # Registro do módulo (agregador)
├── permissions.ts         # Sem permissões (delega aos sub-módulos)
├── types.ts               # Tipos compartilhados
├── dashboard/             # Dashboard principal
├── landing-pages/         # Landing Pages
├── meta/                  # Meta Business Manager
├── criativos/             # Criativos
├── email-marketing/       # Email Marketing
├── seo/                   # SEO
├── calendario/            # Calendário Editorial
├── leads/                 # Leads
├── pixels/                # Pixels
├── whatsapp/              # WhatsApp Marketing
└── utms/                  # UTMs
```

## Sub-módulos

| Sub-módulo | Key | Descrição |
|---|---|---|
| Dashboard | `dashboardModule` | Visão geral |
| Landing Pages | `landingPagesModule` | Criação de LPs |
| Meta Business Manager | `metaBmModule` | Integração Meta |
| UTMs | `utmsModule` | Gerenciamento UTMs |
| Criativos | `criativosModule` | Criação de criativos |
| Email Marketing | `emailMarketingModule` | Campanhas de email |
| SEO | `seoModule` | Auditoria SEO |
| Calendário Editorial | `calendarioModule` | Planejamento |
| Leads | `leadsModule` | Gestão de leads |
| Pixels | `pixelsModule` | Tracking pixels |
| WhatsApp Marketing | `whatsappMarketingModule` | WhatsApp |

## Rotas

- `/marketing/dashboard` — Dashboard principal

## Tabelas

- `mktg_campanhas_email`, `mktg_disparos_email` — Email marketing
- `mktg_leads` — Leads
- `mktg_landing_pages`, `mktg_landing_pages_versoes` — Landing pages
- `mktg_meta_campanhas`, `mktg_meta_contas`, `mktg_meta_insights`, `mktg_meta_posts` — Meta
- `mktg_criativos` — Criativos
- `mktg_pixels` — Pixels
- `mktg_calendario` — Calendário
- `mktg_utms` — UTMs
- `mktg_whatsapp_campanhas` — WhatsApp
- `mktg_eventos` — Eventos
