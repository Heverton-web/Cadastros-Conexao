# Análise de Eventos, Botões e Triggers — Módulo Gerador de Links

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **Gerador de Links** é uma ferramenta utilitária para geração de links personalizados: WhatsApp, UTMs, Google Review, Google Maps, Waze e QR Code. **Não possui eventos registrados** (`events: []`).

---

## 2. Eventos

**Nenhum evento registrado** no módulo. O módulo é puramente utilitário e não dispara eventos de domínio.

Possui registros de **ações de clique** na tabela `gerador_link_cliques` (tracking de cliques em links gerados), mas sem integração com o sistema de webhooks.

---

## 3. Quem Pode Configurar

| Perfil | Acesso |
|---|---|
| Super Admin | Total |
| Admin de Empresa | `/empresa/acoes` |
| Consultor | Sem acesso |
| TI | Sem acesso direto |

---

## 4. Onde Configurar

- **Rota**: `/empresa/acoes` ou `/global/acoes`
- **Seletor de Módulo**: "Links"

---

## 5. Recomendação

Para webhooks, seria interessante adicionar eventos como:
- `link.gerado_whatsapp` — quando um link do WhatsApp é gerado
- `link.gerado_qrcode` — quando um QR Code é gerado
- `link.clicado` — quando um link gerado é clicado (tracking)

Atualmente, os cliques são registrados apenas na tabela `gerador_link_cliques`, sem disparo de eventos.
