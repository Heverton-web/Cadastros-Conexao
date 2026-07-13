# Módulo: Mapas Interativos

## Visão Geral

Módulo de **mapas interativos de presença comercial**. Permite visualizar distribuidores e consultores geolocalizados em um mapa do Brasil, com gestión CRUD e dashboard de insights.

**Key do módulo:** `mapas-interativos`

## Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/mapas` | Redirect → `/mapas/distribuidores` | Rota raiz (redireciona) |
| `/mapas/distribuidores` | `PublicMapShell` | Mapa público de distribuidores |
| `/mapas/consultores` | `PublicMapShell` | Mapa público de consultores |
| `/mapas/gestao` | Redirect → `/mapas/insights` | Rota de gestão (redireciona) |
| `/mapas/gestao/distribuidores` | `MapasAdminDistribuidoresPage` | CRUD de distribuidores |
| `/mapas/gestao/consultores` | `MapasAdminConsultoresPage` | CRUD de consultores |
| `/mapas/insights` | `MapasInsightsPage` | Dashboard de métricas |
| `/mapas/design` | Redirect → `/empresa/mapas/design` | Config de design (redireciona) |

## Permissões

| Permissão | Descrição |
|-----------|-----------|
| `mapas_ver_mapa_publico` | Visualizar o mapa interativo de presença comercial |
| `mapas_gerir_distribuidores` | Adicionar, editar e remover distribuidores no mapa |
| `mapas_gerir_consultores` | Adicionar, editar e remover consultores no mapa |
| `mapas_ver_insights` | Acessar o painel de métricas e insights do mapa |
| `mapas_gerir_webhooks` | Configurar webhooks disparados por eventos do módulo |

## Ambientes

- **cadastro** — Usuários com permissão de gestão
- **consultor** — Consultores com acesso ao mapa público

## Nav Items

| ID | Label | Ícone | Rota | Permissão |
|----|-------|-------|------|-----------|
| `mapas-publico` | Mapa de Presença | `Map` | `/mapas` | `mapas_ver_mapa_publico` |
| `mapas-admin-distribuidores` | Distribuidores | `Building2` | `/mapas/gestao/distribuidores` | `mapas_gerir_distribuidores` |
| `mapas-admin-consultores` | Consultores | `UserCircle` | `/mapas/gestao/consultores` | `mapas_gerir_consultores` |
| `mapas-admin-insights` | Insights | `BarChart3` | `/mapas/insights` | `mapas_ver_insights` |

## Eventos (Webhooks)

| Evento | Label | Descrição |
|--------|-------|-----------|
| `mapas.distribuidor.criado` | Distribuidor Criado | Dispara quando um novo distribuidor é adicionado |
| `mapas.distribuidor.atualizado` | Distribuidor Atualizado | Dispara quando um distribuidor é editado |
| `mapas.distribuidor.excluido` | Distribuidor Excluído | Dispara quando um distribuidor é removido |
| `mapas.consultor.criado` | Consultor Criado | Dispara quando um novo consultor é adicionado |
| `mapas.consultor.atualizado` | Consultor Atualizado | Dispara quando um consultor é editado |
| `mapas.consultor.excluido` | Consultor Excluído | Dispara quando um consultor é removido |
| `mapas.estado.clicado` | Estado Clicado | Dispara quando um estado é clicado no mapa |
| `mapas.pin.clicado` | Pin Clicado | Dispara quando um pin é clicado no mapa |

## Tipos de Dados

### MapasDistributor

```typescript
type MapasDistributor = {
  id: string;
  empresa_id: string;
  code: string | null;
  name: string;
  category: "EXCLUSIVE" | "NON_EXCLUSIVE";
  city: string | null;
  state: string;
  pin_color: string | null;
  pin_image_url: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
};
```

### MapasConsultant

```typescript
type MapasConsultant = {
  id: string;
  empresa_id: string;
  registration: string | null;
  name: string;
  region: string | null;
  state: string;
  supervisor: string | null;
  pin_color: string | null;
  pin_image_url: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
};
```

## Tabelas Supabase

- `mapas_distributors` — Distribuidores geolocalizados
- `mapas_consultants` — Consultores geolocalizados

## Hooks (useMapasData)

| Hook | Tipo | Descrição |
|------|------|-----------|
| `useMapasDistributors()` | Query | Lista todos os distribuidores |
| `useMapasConsultants()` | Query | Lista todos os consultores |
| `useUpsertDistributor()` | Mutation | Insert/update de distribuidor |
| `useDeleteDistributor()` | Mutation | Exclui distribuidor por ID |
| `useUpsertConsultant()` | Mutation | Insert/update de consultor |
| `useDeleteConsultant()` | Mutation | Exclui consultor por ID |

## Componentes

### PublicMapShell

Componente principal das rotas públicas do mapa. Renderiza:
- Header sticky com toggle Distribuidores/Consultores
- Título + stats (total, estados cobertos, regiões)
- Mapa SVG do Brasil (`BrazilMap`)
- Legenda contextual
- Accordion de estados cobertos com filtros por região

**Props:** `{ variant: "distribuidores" | "consultores" }`

### BrazilMap

Mapa SVG interativo do Brasil usando D3-geo (geoMercator). Funcionalidades:
- Renderização de estados via GeoJSON
- Modos: `presence-distributors`, `presence-consultants`, `presence-both`, `heatmap`
- Pins geolocalizados com glow animado
- Clusterização de pins sem coordenadas (agrupa por estado)
- Tooltip flutuante com glassmorphism
- Filtro por região
- Animação de entrada staggered

### StateDetailSheet

Dialog lateral ao clicar em um estado. Mostra:
- Abas com badges (distribuidores/consultores)
- Campo de busca
- Lista de entidades do estado com indicadores de cor

### EntityDetailDialog

Dialog de detalhes ao clicar em um pin. Mostra:
- Avatar circular com glow da cor do pin
- Badge do tipo (Distribuidor/Consultor)
- Grid de informações (código/matrícula, categoria/supervisor, localização)
- Botões "Ver no Mapa" e "Abrir Rota" (Google Maps)

## Fluxo de Dados

```
Supabase (mapas_distributors, mapas_consultants)
  ↓ useMapasDistributors / useMapasConsultants
PublicMapShell
  ↓ presence (PresenceByState)
BrazilMap (SVG rendering)
  ↓ onStateClick / onPinClick
StateDetailSheet / EntityDetailDialog
```

## Design System

- **hasDesignConfig:** true
- **designRoute:** `/empresa/mapas/design`
- Tokens CSS: `--grad-exclusive-*`, `--grad-partial-*`, `--state-empty`, `--heat-*`, `--map-stroke*`
- Estilo: glassmorphism no tooltip, gradientes dourados nos estados, glow animado nos pins
