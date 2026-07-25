# GEMINI.md — Módulo Marketing

## Context

Digital marketing aggregator module. Main dashboard with 10 sub-modules.

## Key Files

| File | Purpose |
|---|---|
| `module.ts` | Module registration (aggregator) |
| `types.ts` | Shared types (MktgEnvioEmail, MktgLead, Utm) |

## Sub-modules

| Module | Key | Description |
|---|---|---|
| Dashboard | `dashboardModule` | Overview |
| Landing Pages | `landingPagesModule` | LP creation |
| Meta Business Manager | `metaBmModule` | Meta integration |
| UTMs | `utmsModule` | UTM management |
| Criativos | `criativosModule` | Creative assets |
| Email Marketing | `emailMarketingModule` | Email campaigns |
| SEO | `seoModule` | SEO audit |
| Calendário Editorial | `calendarioModule` | Editorial planning |
| Leads | `leadsModule` | Lead management |
| Pixels | `pixelsModule` | Tracking pixels |
| WhatsApp Marketing | `whatsappMarketingModule` | WhatsApp |

## Database

- `mktg_campanhas_email`, `mktg_disparos_email` — Email marketing
- `mktg_leads` — Leads
- `mktg_landing_pages`, `mktg_landing_pages_versoes` — Landing pages
- `mktg_meta_campanhas`, `mktg_meta_contas`, `mktg_meta_insights`, `mktg_meta_posts` — Meta
- `mktg_criativos` — Creatives
- `mktg_pixels` — Pixels
- `mktg_calendario` — Calendar
- `mktg_utms` — UTMs
- `mktg_whatsapp_campanhas` — WhatsApp
- `mktg_eventos` — Events

## Routes

- `/marketing/dashboard` — Main dashboard

## Notes

- Root module has empty permissions and events — delegated to sub-modules
- 71 total files across all sub-modules
