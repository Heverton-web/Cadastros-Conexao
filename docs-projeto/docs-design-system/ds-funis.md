# Design System - Módulo Funis

> Módulo: `funis` | Versão: 1.0.0

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

O módulo **Funis** é responsável pelo gerenciamento de funis Kanban para fluxos de trabalho.

**Chave:** `funis`
**Ícone:** `GitBranch`
**Descrição:** Gerenciamento de funis Kanban para fluxos de trabalho

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `funis_ver_dashboard` | Ver dashboard | funis |
| `funis_criar_funil` | Criar funil | funis |
| `funis_editar_funil` | Editar funil | funis |
| `funis_excluir_funil` | Excluir funil | funis |
| `funis_gerir_colunas` | Gerir colunas | funis |
| `funis_gerir_tarefas` | Gerir tarefas | funis |
| `funis_compartilhar` | Compartilhar funil | funis |
| `funis_ver_relatorios` | Ver relatórios | funis |
| `funis_ver_comentarios` | Ver comentários | funis |
| `funis_adicionar_comentario` | Adicionar comentário | funis |
| `funis_ver_anexos` | Ver anexos | funis |
| `funis_adicionar_anexo` | Adicionar anexo | funis |
| `funis_gerir_labels` | Gerir labels | funis |
| `funis_ver_atividade` | Ver atividade | funis |
| `funis_criar_template` | Criar template | funis |
| `funis_gerir_automacoes` | Gerir automações | funis |
| `funis_exportar_dados` | Exportar dados | funis |
| `funis_acoes_massa` | Ações em massa | funis |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | Todas exceto excluir: true |
| `consultor` | ver_dashboard, gerir_tarefas, ver_comentarios, adicionar_comentario, ver_anexos, ver_atividade: true |
| `tecnologia` | Todas as permissões: true |
| `suporte` | Todas as permissões: false |

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/funis/dashboard` | Dashboard de funis |
| `/funis/funil/$funilId` | Detalhe do funil |
| `/funis/templates` | Templates de funis |
| `/funis/funil/$funilId/automations` | Automações do funil |

---

## Eventos

### Status Change

| Evento | Descrição |
|--------|-----------|
| `funil.criado` | Quando um novo funil é criado |
| `funil.atualizado` | Quando um funil é editado |
| `funil.excluido` | Quando um funil é removido |
| `tarefa.criada` | Quando uma nova tarefa é adicionada |
| `tarefa.comentario_adicionado` | Quando um comentário é adicionado |
| `tarefa.anexo_adicionado` | Quando um anexo é adicionado |
| `tarefa.label_adicionado` | Quando um label é adicionado |
| `tarefa.atrasada` | Quando uma tarefa ultrapassa a data fim |
| `funil.criado_template` | Quando um funil é criado a partir de template |

### Button Action

| Evento | Descrição |
|--------|-----------|
| `tarefa.concluida` | Quando uma tarefa é marcada como concluída |
| `tarefa.movida` | Quando uma tarefa é movida entre colunas |
| `automacao.executada` | Quando uma regra de automação é executada |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configurações gerais do Funis |
| `permissoes` | Gerenciar permissões do módulo |
| `credenciais` | Credenciais com escopo no Funis |
| `eventos` | Eventos e webhooks do Funis |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `funis-dashboard` | Dashboard Funis | LayoutDashboard | `/funis/dashboard` | 20 |
| `funis-templates` | Templates | FileText | `/funis/templates` | 25 |

---

## Design System Específico

### Estilos Customizados

O módulo Funis não possui estilos CSS próprios. Utiliza o design system global do ERP Odonto.

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de informações
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações
- `Badge` - Status e labels
- `Button` - Ações

### Padrões de UI

#### Kanban Board

O módulo Funis utiliza um layout tipo Kanban com colunas e cards arrastáveis.

**Estrutura do Kanban:**
```
┌─────────────────────────────────────────────────────────┐
│  Coluna 1    │  Coluna 2    │  Coluna 3    │  Coluna 4  │
├──────────────┼──────────────┼──────────────┼────────────┤
│  ┌────────┐  │  ┌────────┐  │  ┌────────┐  │            │
│  │ Card 1 │  │  │ Card 3 │  │  │ Card 5 │  │            │
│  └────────┘  │  └────────┘  │  └────────┘  │            │
│  ┌────────┐  │  ┌────────┐  │              │            │
│  │ Card 2 │  │  │ Card 4 │  │              │            │
│  └────────┘  │  └────────┘  │              │            │
└──────────────┴──────────────┴──────────────┴────────────┘
```

#### Status de Tarefa

| Status | Badge | Cor |
|--------|-------|-----|
| A fazer | `badge-secondary` | Cinza |
| Em andamento | `badge-default` | Gold |
| Concluída | `badge-success` | Verde |
| Atrasada | `badge-destructive` | Vermelho |

#### Labels de Tarefa

```tsx
<Badge variant="outline" className="bg-blue-500/15 text-blue-400 border-blue-500/20">
  Urgente
</Badge>
<Badge variant="outline" className="bg-purple-500/15 text-purple-400 border-purple-500/20">
  Design
</Badge>
```

---

## Referências

- **Module:** `src/features/funis/module.ts`
- **Permissions:** `src/features/funis/permissions.ts`
- **Routes:** `src/routes/funis/`
