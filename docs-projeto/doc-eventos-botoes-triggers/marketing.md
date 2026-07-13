# Análise de Eventos, Botões e Triggers — Módulo Marketing

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **Marketing** é o módulo mais complexo em termos de submódulos (13 submódulos), porém **nenhum deles possui eventos registrados**. Todos os submódulos têm `events: []`.

---

## 2. Eventos

### Submódulos sem eventos:

| Submódulo | Chave | Permissões |
|---|---|---|
| Dashboard | `mktg-dashboard` | 3 |
| UTMs | `mktg-utms` | 3 |
| Calendário Editorial | `mktg-calendario` | 3 |
| SEO | `mktg-seo` | 3 |
| Landing Pages | `mktg-landing-pages` | 3 |
| Email Marketing | `mktg-email` | 3 |
| Pixels | `mktg-pixels` | 3 |
| Meta BM | `mktg-meta-bm` | 6 |
| Leads | `mktg-leads` | 3 |
| Criativos | `mktg-criativos` | 3 |
| WhatsApp | `mktg-whatsapp` | 4 |
| LinkTree (Marketing) | `mktg-linktree` | 5 |

**Total de eventos: 0 em todos os submódulos.**

---

## 3. Oportunidades de Eventos

### Sugestões de eventos por submódulo:

| Submódulo | Eventos Sugeridos |
|---|---|
| Leads | `lead.capturado`, `lead.convertido` |
| Email Marketing | `email.enviado`, `email.aberto`, `email.clicado` |
| Landing Pages | `pagina.publicada`, `pagina.visitante` |
| Pixels | `evento.registrado`, `conversao.registrada` |
| WhatsApp | `mensagem.enviada`, `template.cadastrado` |

---

## 4. Quem Pode Configurar

| Perfil | Acesso |
|---|---|
| Super Admin | Total |
| Admin de Empresa | `/empresa/acoes` |
| Consultor | Sem acesso |
| TI | Sem acesso direto |

---

## 5. Onde Configurar

- **Rota**: `/empresa/acoes` ou `/global/acoes`
- **Seletor de Módulo**: "Marketing"

---

## 6. Observações

- Apesar de ser o módulo com mais submódulos (13), é o que **menos aproveita** o sistema de eventos
- Potencial para integração com ferramentas de marketing automation
- Permissões são registradas individualmente por submódulo, mas eventos não
