# Análise das Funções — Módulo Mapas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **Mapas** exibe mapas interativos de presença comercial — distribuidores e consultores geolocalizados no mapa do Brasil (SVG).

| Aspecto | Detalhe |
|---|---|
| **Key** | `mapas-interativos` |
| **Descrição** | Mapas interativos de presença comercial |
| **Ambientes** | cadastro, consultor |
| **Permissões** | 5 funções granulares |
| **Eventos** | 8 webhooks |
| **Rotas** | 7 páginas |
| **Design Config** | ✅ `/empresa/mapas/design` |

---

## 2. Funções do Módulo

### 2.1 Função: Mapa Público (Distribuidores)

**Rota**: `/mapas/distribuidores`
**Permissão**: `mapas_ver_mapa_publico`

Mapa SVG do Brasil com pins de distribuidores por estado. KPI cards (total, estados, regiões). Accordion de estados com lista de distribuidores.

---

### 2.2 Função: Mapa Público (Consultores)

**Rota**: `/mapas/consultores`
**Permissão**: `mapas_ver_mapa_publico`

Mesma estrutura do mapa de distribuidores, mas exibe consultores.

---

### 2.3 Função: Gestão de Distribuidores

**Rota**: `/mapas/gestao/distribuidores`
**Permissão**: `mapas_gerir_distribuidores`

CRUD de distribuidores no mapa. Adicionar, editar, remover com geolocalização.

---

### 2.4 Função: Gestão de Consultores

**Rota**: `/mapas/gestao/consultores`
**Permissão**: `mapas_gerir_consultores`

CRUD de consultores no mapa.

---

### 2.5 Função: Insights

**Rota**: `/mapas/insights`
**Permissão**: `mapas_ver_insights`

Painel de métricas: cobertura por estado, heatmap de concentração, comparativo distribuidores vs consultores.

---

### 2.6 Funções Granulares (5)

| Key | Grupo | Descrição |
|---|---|---|
| `mapas_ver_mapa_publico` | Mapas | Visualizar mapa interativo |
| `mapas_gerir_distribuidores` | Mapas | Adicionar/editar/remover distribuidores |
| `mapas_gerir_consultores` | Mapas | Adicionar/editar/remover consultores |
| `mapas_ver_insights` | Mapas | Acessar painel de métricas |
| `mapas_gerir_webhooks` | Mapas | Configurar webhooks do módulo |

---

### 2.7 Eventos (8)

`mapas.distribuidor.criado`, `.atualizado`, `.excluido`, `mapas.consultor.criado`, `.atualizado`, `.excluido`, `mapas.estado.clicado`, `mapas.pin.clicado`

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/mapas/module.ts` | Definição do módulo |
| `src/features/mapas/permissions.ts` | 5 permissões |
| `src/features/mapas/components/PublicMapShell.tsx` | Shell do mapa |
| `src/features/mapas/components/EntityDetailDialog.tsx` | Dialog de detalhes |
| `supabase/migrations/00035_mapas_module.sql` | Tabelas `mapas_*` |
