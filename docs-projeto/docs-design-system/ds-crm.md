# Design System - Módulo CRM

> Módulo: `crm` | Versão: 1.0.0

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

O módulo **CRM** é responsável pela gestão de relacionamento com clientes e equipe comercial.

**Chave:** `crm`
**Ícone:** `Users`
**Descrição:** Gestão de relacionamento com clientes e equipe comercial

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `crm_dashboard` | Acessar dashboard CRM | crm |
| `crm_carteira` | Ver carteira de clientes | crm |
| `crm_pipeline` | Acessar pipeline | crm |
| `crm_tarefas` | Gerenciar tarefas | crm |
| `crm_metricas` | Ver métricas | crm |
| `crm_cliente_detalhe` | Ver detalhes do cliente | crm |
| `crm_equipe` | Gerenciar equipe | crm |
| `crm_bi` | Acessar BI | crm |
| `crm_transferencia` | Transferir clientes | crm |
| `crm_diretoria` | Acessar diretoria | crm |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | Todas as permissões: true |
| `consultor` | dashboard, carteira, pipeline, tarefas, cliente_detalhe, equipe: true |
| `tecnologia` | Todas as permissões: true |
| `suporte` | Todas as permissões: false |

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/crm/dashboard` | Dashboard do CRM |
| `/crm/carteira` | Carteira de clientes |
| `/crm/pipeline` | Pipeline de vendas |
| `/crm/tarefas` | Tarefas |
| `/crm/metricas` | Métricas |
| `/crm/cliente/$id` | Detalhe do cliente |
| `/crm/equipe` | Gestão de equipe |
| `/crm/bi` | Business Intelligence |
| `/crm/transferencia` | Transferência de clientes |
| `/crm/transferencia/consultores` | Transferência entre consultores |
| `/crm/diretoria` | Painel da diretoria |
| `/crm/diretoria/gestor/$id` | Detalhe do gestor |
| `/crm/aceitar-convite/$token` | Aceitar convite |

---

## Eventos

### Status Change

| Evento | Descrição |
|--------|-----------|
| `cliente.criado` | Quando um novo cliente é adicionado |
| `cliente.transferido` | Quando um cliente é transferido |

### Button Action

| Evento | Descrição |
|--------|-----------|
| `visita.realizada` | Quando uma visita é registrada |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configurações gerais do CRM |
| `permissoes` | Gerenciar permissões do módulo |
| `eventos` | Eventos e webhooks do CRM |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `crm-dashboard` | Dashboard CRM | LayoutDashboard | `/crm/dashboard` | 50 |
| `crm-carteira` | Carteira | Users | `/crm/carteira` | 51 |
| `crm-pipeline` | Pipeline | Kanban | `/crm/pipeline` | 52 |
| `crm-tarefas` | Tarefas | ListTodo | `/crm/tarefas` | 53 |
| `crm-equipe` | Equipe | UserCheck | `/crm/equipe` | 54 |
| `crm-metricas` | Métricas | BarChart3 | `/crm/metricas` | 55 |
| `crm-bi` | BI | BarChart3 | `/crm/bi` | 56 |
| `crm-transferencia` | Transferência | ArrowLeftRight | `/crm/transferencia` | 54 |
| `crm-diretoria` | Diretoria | Crown | `/crm/diretoria` | 55 |

---

## Design System Específico

### Estilos Customizados

O módulo CRM não possui estilos CSS próprios. Utiliza o design system global do ERP Odonto.

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página com breadcrumbs
- `Card` - Cards para informações
- `Table` - Tabelas de dados
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações de exclusão
- `Badge` - Status de clientes
- `Button` - Ações
- `Input` - Campos de formulário
- `Select` - Seleções
- `Kanban` - Pipeline visual

### Padrões de UI

#### Pipeline Visual

O módulo CRM utiliza um pipeline visual tipo Kanban para gerenciar o funil de vendas.

**Estágios do Pipeline:**
1. Lead
2. Contato
3. Proposta
4. Negociação
5. Fechamento

#### Status de Cliente

| Status | Badge | Cor |
|--------|-------|-----|
| Ativo | `badge-success` | Verde |
| Inativo | `badge-secondary` | Cinza |
| Em contato | `badge-warning` | Amarelo |
| Proposta enviada | `badge-default` | Gold |

#### Ações Comuns

```tsx
// Transferir cliente
<Button variant="ghost-edit" onClick={handleTransferir}>
  <ArrowLeftRight size={14} /> Transferir
</Button>

// Registrar visita
<Button variant="default" onClick={handleVisita}>
  <MapPin size={14} /> Registrar Visita
</Button>
```

---

## Referências

- **Module:** `src/features/crm/module.ts`
- **Permissions:** `src/features/crm/permissions.ts`
- **Routes:** `src/routes/crm/`
