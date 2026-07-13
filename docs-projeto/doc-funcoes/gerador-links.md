# Análise das Funções — Módulo Gerador de Links

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **Gerador de Links** (exibido como "Links" no frontend) permite gerar links personalizados de 6 tipos: WhatsApp, UTM, Google Review, Google Maps, Waze e QR Code.

| Aspecto | Detalhe |
|---|---|
| **Key** | `gerador-links` |
| **Descrição** | Geração de links personalizados |
| **Ambientes** | cadastro, tecnologia |
| **Permissões** | 6 funções granulares |
| **Eventos** | Nenhum |
| **Rotas** | 9 páginas |
| **Design Config** | ❌ `hasDesignConfig: false` |

---

## 2. Funções do Módulo

### 2.1 Função: Dashboard

**Rota**: `/ferramentas/links`
**Permissão**: `lk_ver`

Dashboard com métricas de links criados, cliques registrados, templates salvos.

---

### 2.2 Função: Gerador WhatsApp

**Rota**: `/ferramentas/links/whatsapp`
**Permissão**: `lk_gerar`

Gera link `wa.me` com mensagem predefinida. Suporte a templates salvos.

---

### 2.3 Função: Gerador UTM

**Rota**: `/ferramentas/links/utm`
**Permissão**: `lk_gerar`

Gera links com parâmetros UTM (source, medium, campaign, term, content).

---

### 2.4 Função: Gerador Google Review

**Rota**: `/ferramentas/links/google-review`
**Permissão**: `lk_gerar`

Gera link direto para avaliação no Google Meu Negócio.

---

### 2.5 Função: Gerador Google Maps

**Rota**: `/ferramentas/links/maps`
**Permissão**: `lk_gerar`

Gera link para localização no Google Maps.

---

### 2.6 Função: Gerador Waze

**Rota**: `/ferramentas/links/waze`
**Permissão**: `lk_gerar`

Gera link para navegação no Waze.

---

### 2.7 Função: Gerador QR Code

**Rota**: `/ferramentas/links/qrcode`
**Permissão**: `lk_gerar`

Gera QR Code para qualquer link. Download em PNG.

---

### 2.8 Função: Templates

**Rota**: `/ferramentas/links/templates`
**Permissão**: `lk_gerenciar_templates`

CRUD de templates de mensagem/UTM para reutilização.

---

### 2.9 Função: Histórico

**Rota**: `/ferramentas/links/historico`
**Permissão**: `lk_ver`

Histórico de links gerados com tracking de cliques.

---

### 2.10 Funções Granulares (6)

| Key | Grupo | Descrição |
|---|---|---|
| `lk_ver` | Links | Visualizar o módulo |
| `lk_gerar` | Links | Gerar qualquer tipo de link |
| `lk_salvar` | Links | Salvar links no histórico |
| `lk_editar` | Links | Editar links salvos |
| `lk_excluir` | Links | Excluir links do histórico |
| `lk_gerenciar_templates` | Links | CRUD de templates |

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/gerador-links/module.ts` | Definição do módulo |
| `src/features/gerador-links/permissions.ts` | 6 permissões |
| `supabase/migrations/20260701000000_gerador_links_module.sql` | Tabelas `gerador_*` |
| `supabase/migrations/20260701000001_gerador_links_tracking.sql` | Tracking de cliques |
