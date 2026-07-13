# Design System - Módulo Cadastros

> Módulo: `cadastros` | Versão: 1.0.0

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

O módulo **Cadastros** é responsável pela gestão de cadastro de clientes PF/PJ. É o módulo principal do ERP Odonto.

**Chave:** `cadastros`
**Ícone:** `Users`
**Descrição:** Gestao de cadastro de clientes PF/PJ

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `ver_todos_cadastros` | Ver todos os cadastros | cadastro |
| `aprovar_cadastro` | Aprovar cadastro | cadastro |
| `reprovar_cadastro` | Reprovar cadastro | cadastro |
| `solicitar_correcao_cadastro` | Solicitar correção de cadastro | cadastro |
| `aprovar_documento` | Aprovar documento | cadastro |
| `reprovar_documento` | Reprovar documento | cadastro |
| `solicitar_correcao_documento` | Solicitar correção de documento | cadastro |
| `aprovar_campo` | Aprovar campo | cadastro |
| `reprovar_campo` | Reprovar campo | cadastro |
| `solicitar_correcao_campo` | Solicitar correção de campo | cadastro |
| `visualizar_documento` | Visualizar documento | cadastro |
| `excluir_cadastro` | Excluir cadastro | cadastro |
| `gerenciar_credenciais` | Gerenciar credenciais | cadastro |
| `gerenciar_credenciais_admin` | Gerenciar credenciais (admin) | cadastro |
| `gerenciar_config` | Gerenciar configurações | cadastro |
| `gerar_links` | Gerar links | cadastro |
| `ver_relatorios` | Ver relatórios | cadastro |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | ver_todos_cadastros: true, aprovar_cadastro: true, reprovar_cadastro: true, gerar_links: false |
| `consultor` | ver_todos_cadastros: false, gerar_links: true |
| `tecnologia` | gerenciar_credenciais: true, gerenciar_credenciais_admin: true |
| `suporte` | gerenciar_credenciais: true |

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/cadastros/dashboard` | Dashboard do módulo |
| `/cadastros/solicitacoes` | Lista de solicitações |
| `/cadastros/clientes` | Lista de clientes |
| `/cadastros/consultor` | Área do consultor |
| `/cadastros/relatorios` | Relatórios |
| `/cadastros/previsualizacao` | Pré-visualização |

---

## Eventos

### Status Change

| Evento | Descrição |
|--------|-----------|
| `cadastro.criado` | Dispara quando um novo cadastro é criado |
| `cadastro.aprovado` | Dispara quando um cadastro é aprovado |
| `cadastro.reprovado` | Dispara quando um cadastro é reprovado |
| `link_gerado` | Dispara quando o status do pipeline muda para Link Gerado |
| `dados_enviados` | Dispara quando os dados do pré-cadastro são enviados |
| `em_analise` | Dispara quando o cadastro entra em análise |
| `em_correcao` | Dispara quando uma correção é solicitada |
| `aprovado` | Dispara quando o cadastro é aprovado no pipeline |
| `reprovado` | Dispara quando o cadastro é reprovado no pipeline |

### Button Action

| Evento | Descrição |
|--------|-----------|
| `documento.aprovado` | Dispara quando um documento é aprovado |
| `documento.reprovado` | Dispara quando um documento é reprovado |
| `link.gerado` | Dispara quando um link de cadastro é gerado |
| `botao_compartilhar_link` | Dispara quando o botão de compartilhar link é clicado |
| `botao_aprovar` | Dispara quando o botão de aprovar é clicado |
| `botao_reprovar` | Dispara quando o botão de reprovar é clicado |
| `botao_corrigir` | Dispara quando o botão de corrigir é clicado |
| `criacao_credencial` | Dispara quando uma credencial é criada |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configurações gerais do módulo |
| `permissoes` | Gerenciar permissões do módulo |
| `credenciais` | Credenciais com escopo no módulo |
| `eventos` | Eventos e webhooks do módulo |
| `laboratorio` | Testes e experimentos |
| `acoes` | Ações customizadas |
| `formularios` | Campos e formulários dinâmicos |
| `apis` | Conectores de API |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `dashboard` | Dashboard | LayoutDashboard | `/cadastros/dashboard` | 1 |
| `solicitacoes` | Solicitações | Users | `/cadastros/solicitacoes` | 2 |
| `clientes` | Clientes | Users | `/cadastros/clientes` | 3 |
| `consultor` | Consultor | UserCircle | `/cadastros/consultor` | 4 |
| `relatorios` | Relatórios | BarChart3 | `/cadastros/relatorios` | 5 |
| `previsualizacao` | Pré-visualização | Eye | `/cadastros/previsualizacao` | 6 |

---

## Design System Específico

### Estilos Customizados

O módulo Cadastros não possui estilos CSS próprios. Utiliza o design system global do ERP Odonto.

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página com breadcrumbs
- `Card` - Cards para informações
- `Table` - Tabelas de dados
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações de exclusão
- `Badge` - Status de cadastros
- `Button` - Ações
- `Input` - Campos de formulário
- `Select` - Seleções

### Padrões de UI

#### Status de Cadastro

| Status | Badge | Cor |
|--------|-------|-----|
| Criado | `badge-default` | Gold |
| Em Análise | `badge-warning` | Amarelo |
| Em Correção | `badge-destructive` | Vermelho |
| Aprovado | `badge-success` | Verde |
| Reprovado | `badge-destructive` | Vermelho |

#### Ações Comuns

```tsx
// Aprovar cadastro
<Button variant="default" onClick={handleAprovar}>
  <Check size={14} /> Aprovar
</Button>

// Reprovar cadastro
<Button variant="ghost-destructive" onClick={handleReprovar}>
  <X size={14} /> Reprovar
</Button>

// Solicitar correção
<Button variant="ghost-edit" onClick={handleCorrigir}>
  <AlertCircle size={14} /> Corrigir
</Button>
```

#### Padrão de Exclusão

```tsx
const [cadastroParaExcluir, setCadastroParaExcluir] = useState(null);

<Button variant="ghost-destructive" onClick={() => setCadastroParaExcluir(cadastro)}>
  <Trash2 size={14} />
</Button>

<AlertDialog open={!!cadastroParaExcluir} onOpenChange={(o) => !o && setCadastroParaExcluir(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Excluir cadastro?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleExcluir} className="bg-destructive">
        Excluir
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Referências

- **Module:** `src/features/cadastros/module.ts`
- **Permissions:** `src/features/cadastros/permissions.ts`
- **Routes:** `src/routes/cadastros/`
