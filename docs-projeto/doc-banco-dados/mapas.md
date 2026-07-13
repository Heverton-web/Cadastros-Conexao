# Análise do Banco de Dados — Módulo Mapas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [ENUMs](#2-enums)
3. [Tabelas do Módulo](#3-tabelas-do-módulo)
4. [Integração com Google Maps](#4-integração-com-google-maps)
5. [RLS Policies](#5-rls-policies)
6. [Permissões do Módulo](#6-permissões-do-módulo)
7. [Rotas do Frontend](#7-rotas-do-frontend)
8. [Migrações Relacionadas](#8-migrações-relacionadas)
9. [Diagrama de Relacionamentos](#9-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Mapas** oferece mapas interativos de **presença comercial** no ERP Conexão. Ele permite visualizar distribuidores e consultores georreferenciados em um mapa do Brasil, com pins coloridos, agrupamento por estado, e informações detalhadas de cada entidade.

**Características da Arquitetura:**

- **2 tabelas principais**: `mapas_distributors` e `mapas_consultants`
- **Dados georreferenciados**: latitude/longitude para posicionamento no mapa
- **Mapa público**: SELECT liberado para anônimos — mapa pode ser embedado/visualizado sem login
- **Multi-tenant**: ambas as tabelas possuem `empresa_id`
- **Categoria de distribuidor**: `EXCLUSIVE` ou `NON_EXCLUSIVE` (ENUM)
- **Pins customizáveis**: cor e imagem do pin configuráveis por registro
- **Google Maps API key**: configuração por empresa em `rotas_config.google_maps_api_key`
- **Dashboard de insights**: métricas de cobertura, análise por estado/região

---

## 2. ENUMs

Criado na migração `00035`:

| Enum | Valores | Descrição |
|---|---|---|
| `mapas_dist_category` | `'EXCLUSIVE'`, `'NON_EXCLUSIVE'` | Categoria do distribuidor |

---

## 3. Tabelas do Módulo

### 3.1 `mapas_distributors` — Distribuidores

Armazena os distribuidores georreferenciados para exibição no mapa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa proprietária |
| `code` | `text` | Código do distribuidor |
| `name` | `text NOT NULL` | Nome do distribuidor |
| `category` | `mapas_dist_category NOT NULL` | Categoria: `EXCLUSIVE` ou `NON_EXCLUSIVE` |
| `city` | `text` | Cidade |
| `state` | `text NOT NULL` | Estado (UF) |
| `pin_color` | `text` | Cor do pin no mapa (ex: `'#4169e1'`) |
| `pin_image_url` | `text` | URL da imagem customizada do pin |
| `lat` | `decimal` | Latitude (georreferenciamento) |
| `lng` | `decimal` | Longitude (georreferenciamento) |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:**
- `mapas_distributors_empresa_idx` ON `mapas_distributors(empresa_id)` — filtro por empresa
- `mapas_distributors_state_idx` ON `mapas_distributors(state)` — agrupamento por estado

**Trigger:** `mapas_distributors_set_updated_at` — atualiza `updated_at` automaticamente

---

### 3.2 `mapas_consultants` — Consultores

Armazena os consultores georreferenciados para exibição no mapa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE NOT NULL` | Empresa proprietária |
| `registration` | `text` | Matrícula/registro do consultor |
| `name` | `text NOT NULL` | Nome do consultor |
| `region` | `text` | Região de atuação |
| `state` | `text NOT NULL` | Estado (UF) |
| `supervisor` | `text` | Nome do supervisor |
| `pin_color` | `text` | Cor do pin no mapa |
| `pin_image_url` | `text` | URL da imagem customizada do pin |
| `lat` | `decimal` | Latitude (georreferenciamento) |
| `lng` | `decimal` | Longitude (georreferenciamento) |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:**
- `mapas_consultants_empresa_idx` ON `mapas_consultants(empresa_id)` — filtro por empresa
- `mapas_consultants_state_idx` ON `mapas_consultants(state)` — agrupamento por estado

**Trigger:** `mapas_consultants_set_updated_at` — atualiza `updated_at` automaticamente

---

## 4. Integração com Google Maps

A chave de API do Google Maps é armazenada na tabela `rotas_config` (módulo Rotas), coluna `google_maps_api_key` — adicionada na migração `20260630000002_rotas_google_maps.sql`.

```sql
ALTER TABLE rotas_config
  ADD COLUMN IF NOT EXISTS google_maps_api_key TEXT NOT NULL DEFAULT '';
```

Isso permite que **cada empresa** configure sua própria chave Google Maps para o mapa interativo.

---

## 5. RLS Policies

### 5.1 `mapas_distributors`

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `mapas_distributors_select_public` | **Público** (`USING (true)`) — mapa pode ser visto sem login |
| `INSERT` | `mapas_distributors_insert_authenticated` | Autenticados |
| `UPDATE` | `mapas_distributors_update_authenticated` | Autenticados |
| `DELETE` | `mapas_distributors_delete_authenticated` | Autenticados |

### 5.2 `mapas_consultants`

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `mapas_consultants_select_public` | **Público** (`USING (true)`) |
| `INSERT` | `mapas_consultants_insert_authenticated` | Autenticados |
| `UPDATE` | `mapas_consultants_update_authenticated` | Autenticados |
| `DELETE` | `mapas_consultants_delete_authenticated` | Autenticados |

### Resumo de Acessos por Role

| Tabela | anon | authenticated | service_role |
|---|---|---|---|
| `mapas_distributors` | SELECT | ALL | ALL |
| `mapas_consultants` | SELECT | ALL | ALL |

> **Observação:** Assim como o NPS, as policies do Mapas são permissivas — SELECT público e operações CRUD liberadas para qualquer autenticado. O controle é delegado às permissões do frontend. Não há filtro por `empresa_id` via RLS.

---

## 6. Permissões do Módulo

Definidas em `src/features/mapas/permissions.ts`.

### Lista de Permissões

| Chave | Label | Descrição |
|---|---|---|
| `mapas_ver_mapa_publico` | Ver mapa público | Visualizar o mapa interativo de presença comercial |
| `mapas_gerir_distribuidores` | Gerenciar distribuidores | Adicionar, editar e remover distribuidores no mapa |
| `mapas_gerir_consultores` | Gerenciar consultores | Adicionar, editar e remover consultores no mapa |
| `mapas_ver_insights` | Ver insights/dashboard | Acessar o painel de métricas e insights do mapa |
| `mapas_gerir_webhooks` | Gerenciar webhooks | Configurar webhooks disparados por eventos do módulo Mapas |

---

## 7. Rotas do Frontend

### Páginas do Módulo (9 rotas)

| Rota | Arquivo | Descrição |
|---|---|---|
| `/mapas` | `src/routes/mapas.tsx` | Página principal do módulo |
| `/mapas/distribuidores` | `src/routes/mapas.distribuidores.tsx` | Mapa público de distribuidores |
| `/mapas/consultores` | `src/routes/mapas.consultores.tsx` | Mapa público de consultores |
| `/mapas/gestao` | `src/routes/mapas.gestao.tsx` | Gestão central do mapa |
| `/mapas/gestao/distribuidores` | `src/routes/mapas.gestao.distribuidores.tsx` | CRUD de distribuidores |
| `/mapas/gestao/consultores` | `src/routes/mapas.gestao.consultores.tsx` | CRUD de consultores |
| `/mapas/insights` | `src/routes/mapas.insights.tsx` | Dashboard de métricas e insights |
| `/mapas/design` | `src/routes/mapas.design.tsx` | Configuração de design do mapa |
| `/empresa/mapas-design` | `src/routes/empresa.mapas-design.tsx` | Design por empresa |

### Estrutura de Componentes

```
src/features/mapas/
├── components/
│   ├── BrazilMap.tsx              — Mapa SVG do Brasil interativo
│   ├── EntityDetailDialog.tsx     — Dialog de detalhes da entidade
│   ├── PublicMapShell.tsx         — Shell do mapa público
│   └── StateDetailSheet.tsx       — Sheet de detalhes do estado
├── constants/
│   └── brazil-states.ts           — Constantes dos 27 estados + regiões
├── hooks/
│   └── useMapasData.ts            — Hook de dados do mapa
├── module.ts
├── permissions.ts
└── types.ts
```

### Navegação (Nav Items)

| ID | Label | Rota | Permissão |
|---|---|---|---|
| `mapas-publico` | Mapa de Presença | `/mapas` | `mapas_ver_mapa_publico` |
| `mapas-admin-distribuidores` | Distribuidores | `/mapas/gestao/distribuidores` | `mapas_gerir_distribuidores` |
| `mapas-admin-consultores` | Consultores | `/mapas/gestao/consultores` | `mapas_gerir_consultores` |
| `mapas-admin-insights` | Insights | `/mapas/insights` | `mapas_ver_insights` |

### Eventos do Módulo

| Evento | Descrição | Tipo |
|---|---|---|
| `mapas.distribuidor.criado` | Novo distribuidor adicionado | — |
| `mapas.distribuidor.atualizado` | Distribuidor editado | — |
| `mapas.distribuidor.excluido` | Distribuidor removido | — |
| `mapas.consultor.criado` | Novo consultor adicionado | — |
| `mapas.consultor.atualizado` | Consultor editado | — |
| `mapas.consultor.excluido` | Consultor removido | — |
| `mapas.estado.clicado` | Estado clicado no mapa | — |
| `mapas.pin.clicado` | Pin clicado no mapa | — |

---

## 8. Migrações Relacionadas

| Migration | Data | Descrição |
|---|---|---|
| `00035_mapas_module.sql` | — | **CORE**: 2 tabelas (`mapas_distributors`, `mapas_consultants`), ENUM `mapas_dist_category`, RLS público, índices |
| `20260630000002_rotas_google_maps.sql` | 30/06/2026 | Adiciona `google_maps_api_key` à tabela `rotas_config` para configurar chave Google Maps por empresa |

---

## 9. Diagrama de Relacionamentos

```
┌─────────────────────────────────────────────────────────────────────┐
│                              empresas                                │
└──┬──────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────┐
│                      mapas_distributors                               │
│  id (PK) │ empresa_id                                                │
│  code │ name NOT NULL                                                │
│  category (ENUM: EXCLUSIVE / NON_EXCLUSIVE)                          │
│  city │ state NOT NULL │ pin_color │ pin_image_url                   │
│  lat │ lng (georreferenciamento)                                     │
│  created_at │ updated_at                                             │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      mapas_consultants                                │
│  id (PK) │ empresa_id                                                │
│  registration │ name NOT NULL                                        │
│  region │ state NOT NULL │ supervisor                                 │
│  pin_color │ pin_image_url                                           │
│  lat │ lng (georreferenciamento)                                     │
│  created_at │ updated_at                                             │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          rotas_config                                 │
│  (módulo Rotas - compartilhada)                                      │
│  google_maps_api_key TEXT  ← chave Google Maps por empresa           │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────────┐    ┌─────────────────────────┐
│  BrazilMap   │    │ EntityDetail    │    │   StateDetailSheet       │
│  (SVG +      │───▶│ Dialog           │    │   (Sheet lateral)       │
│   pins)      │    │ (detalhes item)  │    │   (resumo do estado)    │
└──────────────┘    └──────────────────┘    └─────────────────────────┘
```

---

## Notas Finais

1. **Módulo Enxuto**: O Mapas é o módulo mais simples do ERP — apenas 2 tabelas com estrutura quase idêntica, diferenciando distribuidores de consultores.

2. **Mapa Público**: O SELECT é liberado para anônimos, permitindo que o mapa de presença seja embedado em sites externos ou acessado sem login. As demais operações (CRUD) exigem autenticação.

3. **Georreferenciamento**: As colunas `lat`/`lng` são opcionais (nullable). O mapa pode funcionar apenas com `state` (UF), agrupando pins por geometria do estado no SVG.

4. **Pins Customizáveis**: Cada registro pode ter cor e imagem de pin personalizados, permitindo diferenciação visual (ex: distribuidores exclusivos em destaque).

5. **Google Maps Key por Empresa**: A chave de API fica em `rotas_config` (não em uma tabela do módulo Mapas), indicando compartilhamento de configuração entre módulo de Rotas e Mapas.

6. **Controle de Acesso via Frontend**: Apesar de qualquer autenticado poder CRUD via RLS, o frontend restringe as ações com base nas permissões (`mapas_gerir_distribuidores`, `mapas_gerir_consultores`, etc.).

7. **Estados Brasileiros**: O módulo usa o arquivo `public/brazil-states.geojson` com as geometrias dos 27 estados (26 estados + DF) para renderizar o mapa SVG interativo.

8. **Ambientes Suportados**: Apenas `cadastro` e `consultor` — diferentemente de outros módulos que incluem `tecnologia` e `suporte`.
