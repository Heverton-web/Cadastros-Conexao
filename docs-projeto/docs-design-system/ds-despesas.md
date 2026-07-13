# Design System - Módulo Despesas

> Módulo: `despesas` | Versão: 1.0.0

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

O módulo **Despesas** é responsável pela gestão de despesas em rota, aprovação e reembolso.

**Chave:** `despesas`
**Ícone:** `Receipt`
**Descrição:** Gestão de despesas em rota, aprovação e reembolso

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `despesas_lancar` | Lançar despesas | despesas |
| `despesas_enviar` | Enviar despesas | despesas |
| `despesas_aprovar` | Aprovar despesas | despesas |
| `despesas_reprovar` | Reprovar despesas | despesas |
| `despesas_definir_pagamento` | Definir pagamento | despesas |
| `despesas_configurar` | Configurar despesas | despesas |
| `despesas_ver_relatorios` | Ver relatórios | despesas |
| `despesas_ver_todas` | Ver todas as despesas | despesas |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | lancar: true, enviar: true, aprovar: false |
| `consultor` | lancar: true, enviar: true |
| `tecnologia` | Todas as permissões: true |
| `suporte` | ver_relatorios: true |

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/despesas` | Lista de despesas |
| `/despesas/aprovacao` | Aprovação de despesas |
| `/despesas/meus-relatorios` | Meus relatórios |
| `/despesas/relatorios` | Relatórios gerais |

---

## Eventos

### Button Action

| Evento | Descrição |
|--------|-----------|
| `despesa.criada` | Dispara quando uma nova despesa é lançada |
| `despesa.enviada` | Dispara quando despesas são enviadas para aprovação |

### Status Change

| Evento | Descrição |
|--------|-----------|
| `despesa.aprovada` | Dispara quando despesas são aprovadas |
| `despesa.reprovada` | Dispara quando despesas são reprovadas |
| `pagamento.agendado` | Dispara quando pagamento é agendado |
| `periodo.aberto` | Dispara quando um período é aberto |
| `periodo.fechando` | Dispara quando período está prestes a fechar |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configurações gerais do módulo |
| `permissoes` | Gerenciar permissões do módulo |
| `credenciais` | Credenciais com escopo no módulo |
| `eventos` | Eventos e webhooks do módulo |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `despesas` | Despesas | Receipt | `/despesas` | 20 |
| `despesas-aprovacao` | Aprovação | FileText | `/despesas/aprovacao` | 23 |
| `despesas-meus-relatorios` | Meus Relatórios | BarChart3 | `/despesas/meus-relatorios` | 24 |
| `despesas-relatorios` | Relatórios | BarChart3 | `/despesas/relatorios` | 25 |

---

## Design System Específico

### Estilos Customizados

O módulo Despesas não possui estilos CSS próprios. Utiliza o design system global do ERP Odonto.

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de informações
- `Table` - Tabelas de despesas
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações
- `Badge` - Status de despesas
- `Button` - Ações
- `Input` - Campos de formulário
- `Select` - Seleções

### Padrões de UI

#### Status de Despesa

| Status | Badge | Cor |
|--------|-------|-----|
| Rascunho | `badge-secondary` | Cinza |
| Enviada | `badge-default` | Gold |
| Aprovada | `badge-success` | Verde |
| Reprovada | `badge-destructive` | Vermelho |
| Paga | `badge-success` | Verde |

#### Ações Comuns

```tsx
// Enviar para aprovação
<Button variant="default" onClick={handleEnviar}>
  <Send size={14} /> Enviar
</Button>

// Aprovar despesa
<Button variant="default" onClick={handleAprovar}>
  <Check size={14} /> Aprovar
</Button>

// Reprovar despesa
<Button variant="ghost-destructive" onClick={handleReprovar}>
  <X size={14} /> Reprovar
</Button>
```

---

## Referências

- **Module:** `src/features/despesas/module.ts`
- **Permissions:** `src/features/despesas/permissions.ts`
- **Routes:** `src/routes/despesas/`
