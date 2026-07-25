# AGENTS.md — Módulo Marketing

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Módulo agregador de Marketing Digital. Dashboard com 10 sub-módulos.

## Estrutura

```
src/features/marketing/
├── module.ts              # Agregador
├── permissions.ts         # Delega aos sub-módulos
├── types.ts               # Tipos compartilhados
├── dashboard/             # Dashboard
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

`dashboard`, `landing-pages`, `meta`, `criativos`, `email-marketing`, `seo`, `calendario`, `leads`, `pixels`, `whatsapp`, `utms`

## Rotas

`/marketing/dashboard`

## Tabelas

`mktg_campanhas_email`, `mktg_disparos_email`, `mktg_leads`, `mktg_landing_pages`, `mktg_meta_campanhas`, `mktg_criativos`, `mktg_pixels`, `mktg_calendario`, `mktg_utms`, `mktg_whatsapp_campanhas`, `mktg_eventos`
