# Design System - Módulo Rotas

> Módulo: `rotas` | Versão: 1.0.0

## Sumário

1. [Visão Geral](#visão-geral)
2. [Permissões](#permissões)
3. [Rotas](#rotas-1)
4. [Eventos](#eventos)
5. [Abas](#abas)
6. [Nav Items](#nav-items)
7. [Design System Específico](#design-system-específico)

---

## Visão Geral

O módulo **Rotas** é responsável pelo planejamento e execução de rotas de visitas a clientes.

**Chave:** `rotas`
**Ícone:** `Route`
**Descrição:** Planejamento e execução de rotas de visitas a clientes

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `rotas_planejar` | Planejar rotas | rotas |
| `rotas_executar` | Executar rotas | rotas |
| `rotas_configurar` | Configurar rotas | rotas |
| `rotas_upload_base` | Upload de base | rotas |
| `rotas_ver_relatorios` | Ver relatórios | rotas |
| `rotas_form_config` | Configurar formulário | rotas |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | Todas as permissões: true |
| `consultor` | planejar, executar, ver_relatorios: true |
| `tecnologia` | Todas as permissões: true |
| `suporte` | Todas as permissões: false |

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/rotas` | Lista de rotas |
| `/rotas/$id` | Detalhe da rota |
| `/rotas/design` | Design da rota |

---

## Eventos

### Status Change

| Evento | Descrição |
|--------|-----------|
| `rota.criada` | Quando uma nova rota é planejada |
| `rota.finalizada` | Quando a rota é concluída |

### Button Action

| Evento | Descrição |
|--------|-----------|
| `rota.iniciada` | Quando o consultor inicia a execução da rota |
| `visita.registrada` | Quando uma visita é finalizada |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configurações gerais do módulo |
| `permissoes` | Gerenciar permissões do módulo |
| `eventos` | Eventos e webhooks do módulo |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `rotas` | Rotas | Route | `/rotas` | 30 |

---

## Design System Específico

### Estilos Customizados

O módulo Rotas não possui estilos CSS próprios. Utiliza o design system global do ERP Odonto.

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de informações
- `Table` - Tabelas de rotas
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações
- `Badge` - Status de rotas
- `Button` - Ações

### Padrões de UI

#### Status de Rota

| Status | Badge | Cor |
|--------|-------|-----|
| Planejada | `badge-secondary` | Cinza |
| Em andamento | `badge-default` | Gold |
| Concluída | `badge-success` | Verde |
| Cancelada | `badge-destructive` | Vermelho |

#### Status de Visita

| Status | Badge | Cor |
|--------|-------|-----|
| Pendente | `badge-warning` | Amarelo |
| Realizada | `badge-success` | Verde |
| Cancelada | `badge-destructive` | Vermelho |

#### Ações Comuns

```tsx
// Iniciar rota
<Button variant="default" onClick={handleIniciar}>
  <Play size={14} /> Iniciar Rota
</Button>

// Registrar visita
<Button variant="ghost-edit" onClick={handleVisita}>
  <MapPin size={14} /> Registrar Visita
</Button>

// Finalizar rota
<Button variant="default" onClick={handleFinalizar}>
  <Check size={14} /> Finalizar Rota
</Button>
```

---

## Referências

- **Module:** `src/features/rotas/module.ts`
- **Permissions:** `src/features/rotas/permissions.ts`
- **Routes:** `src/routes/rotas/`
