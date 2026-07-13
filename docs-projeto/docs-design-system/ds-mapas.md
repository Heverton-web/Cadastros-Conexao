# Design System - Módulo Mapas

> Módulo: `mapas-interativos` | Versão: 1.0.0

## Sumário

1. [Visão Geral](#visão-geral)
2. [Permissões](#permissões)
3. [Rotas](#rotas)
4. [Eventos](#eventos)
5. [Abas](#abas)
6. [Nav Items](#nav-items)
7. [Design System Específico](#design-system-específico)

---

## Visão Geral

O módulo **Mapas** é responsável por mapas interativos de presença comercial.

**Chave:** `mapas-interativos`
**Ícone:** `Map`
**Descrição:** Mapas interativos de presença comercial

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `mapas_ver_mapa_publico` | Ver mapa público | mapas |
| `mapas_gerir_distribuidores` | Gerir distribuidores | mapas |
| `mapas_gerir_consultores` | Gerir consultores | mapas |
| `mapas_ver_insights` | Ver insights | mapas |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | Todas as permissões: true |
| `consultor` | ver_mapa_publico: true |
| `tecnologia` | Todas as permissões: true |
| `suporte` | Todas as permissões: false |

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/mapas` | Mapa de presença |
| `/mapas/distribuidores` | Lista de distribuidores |
| `/mapas/consultores` | Lista de consultores |
| `/mapas/gestao` | Gestão |
| `/mapas/insights` | Insights |
| `/mapas/gestao/distribuidores` | Gestão de distribuidores |
| `/mapas/gestao/consultores` | Gestão de consultores |

---

## Eventos

### Status Change

| Evento | Descrição |
|--------|-----------|
| `mapas.distribuidor.criado` | Quando um novo distribuidor é adicionado |
| `mapas.distribuidor.atualizado` | Quando um distribuidor é editado |
| `mapas.distribuidor.excluido` | Quando um distribuidor é removido |
| `mapas.consultor.criado` | Quando um novo consultor é adicionado |
| `mapas.consultor.atualizado` | Quando um consultor é editado |
| `mapas.consultor.excluido` | Quando um consultor é removido |

### Button Action

| Evento | Descrição |
|--------|-----------|
| `mapas.estado.clicado` | Quando um estado é clicado no mapa |
| `mapas.pin.clicado` | Quando um pin é clicado no mapa |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configurações gerais |
| `permissoes` | Gerenciar permissões |
| `eventos` | Eventos e webhooks do módulo |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `mapas-publico` | Mapa de Presença | Map | `/mapas` | 10 |
| `mapas-admin-distribuidores` | Distribuidores | Building2 | `/mapas/gestao/distribuidores` | 20 |
| `mapas-admin-consultores` | Consultores | UserCircle | `/mapas/gestao/consultores` | 30 |
| `mapas-admin-insights` | Insights | BarChart3 | `/mapas/insights` | 40 |

---

## Design System Específico

### Estilos Customizados

O módulo Mapas possui estilos CSS próprios para o mapa interativo.

### CSS Variables (Mapas)

```css
:root {
  --state-exclusive: #d4a843;
  --state-nonexclusive: #b8944a;
  --state-empty: #0f1724;
  --state-empty-fg: #3b5998;
  --map-stroke: #1e2d45;
  --map-stroke-selected: #f0d080;
  --state-glow: drop-shadow(0 0 8px rgba(212, 168, 67, 0.5));
  --heat-1: #0f1724;
  --heat-2: #1a3a6a;
  --heat-3: #2563a0;
  --heat-4: #3b82f6;
  --heat-5: #60a5fa;
}
```

### Classes de Mapa

```css
.state-faded {
  opacity: 0.35;
}

.state-glow {
  filter: var(--state-glow);
}
```

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de informações
- `Table` - Tabelas de dados
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações
- `Badge` - Status
- `Button` - Ações

### Padrões de UI

#### Legenda do Mapa

```tsx
<div className="flex items-center gap-4 text-sm">
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d4a843' }} />
    <span>Exclusivo</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#b8944a' }} />
    <span>Não Exclusivo</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0f1724' }} />
    <span>Sem presença</span>
  </div>
</div>
```

#### Heatmap de Presença

```tsx
<div className="grid grid-cols-5 gap-1">
  {Object.entries(heatColors).map(([level, color]) => (
    <div key={level} className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
      <span className="text-xs">Nível {level}</span>
    </div>
  ))}
</div>
```

---

## Referências

- **Module:** `src/features/mapas/module.ts`
- **Permissions:** `src/features/mapas/permissions.ts`
- **Routes:** `src/routes/mapas/`
