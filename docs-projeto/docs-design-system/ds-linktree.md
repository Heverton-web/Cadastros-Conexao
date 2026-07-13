# Design System - Módulo LinkTree

> Módulo: `linktree` | Versão: 1.0.0

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

O módulo **LinkTree** é responsável por cartões digitais e QR Codes dos colaboradores.

**Chave:** `linktree`
**Ícone:** `Link2`
**Descrição:** Cartoes digitais e QR Codes dos colaboradores

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `lt_ver_dashboard` | Ver dashboard | linktree |
| `lt_criar_colaborador` | Criar colaborador | linktree |
| `lt_editar_colaborador` | Editar colaborador | linktree |
| `lt_excluir_colaborador` | Excluir colaborador | linktree |
| `lt_toggle_status` | Alterar status | linktree |
| `lt_ver_link` | Ver link | linktree |
| `lt_ver_qr` | Ver QR Code | linktree |
| `lt_baixar_qr` | Baixar QR Code | linktree |
| `lt_gerenciar_tema` | Gerenciar tema | linktree |
| `lt_empresa_ver` | Ver empresa | linktree |
| `lt_empresa_editar` | Editar empresa | linktree |
| `lt_empresa_ver_analytics` | Ver analytics | linktree |
| `lt_empresa_gerar_qr` | Gerar QR Code | linktree |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | Todas as permissões: true |
| `consultor` | ver_dashboard, ver_link, ver_qr, baixar_qr, empresa_ver, empresa_gerar_qr: true |
| `tecnologia` | Todas as permissões: true |
| `suporte` | Todas as permissões: false |

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/linktree/dashboard` | Dashboard |
| `/linktree/empresa` | Linktree da empresa |
| `/linktree/empresa/editor` | Editor do LinkTree |

---

## Eventos

### Status Change

| Evento | Descrição |
|--------|-----------|
| `colaborador.criado` | Quando um novo colaborador é cadastrado |
| `colaborador.ativado` | Quando um colaborador é ativado |
| `colaborador.inativado` | Quando um colaborador é inativado |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configuracoes gerais do LinkTree |
| `permissoes` | Gerenciar permissoes do modulo |
| `credenciais` | Credenciais com escopo no LinkTree |
| `eventos` | Eventos e webhooks do LinkTree |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `linktree-dashboard` | LinkTree Dashboard | Link2 | `/linktree/dashboard` | 120 |
| `linktree-empresa` | Linktree Empresa | Link | `/linktree/empresa` | 121 |
| `linktree-empresa-editor` | LinkTree Editor | BarChart3 | `/linktree/empresa/editor` | 122 |

---

## Design System Específico

### Estilos Customizados

O módulo LinkTree não possui estilos CSS próprios. Utiliza o design system global do ERP Odonto.

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de informações
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações
- `Badge` - Status de colaboradores
- `Button` - Ações
- `Input` - Campos de formulário

### Padrões de UI

#### Card de Colaborador

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={colaborador.foto} />
        <AvatarFallback>{colaborador.nome[0]}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>{colaborador.nome}</CardTitle>
        <CardDescription>{colaborador.cargo}</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <Badge variant={colaborador.ativo ? "success" : "secondary"}>
      {colaborador.ativo ? "Ativo" : "Inativo"}
    </Badge>
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button variant="outline" size="icon">
      <Link size={14} />
    </Button>
    <Button variant="outline" size="icon">
      <QrCode size={14} />
    </Button>
  </CardFooter>
</Card>
```

#### Status de Colaborador

| Status | Badge | Cor |
|--------|-------|-----|
| Ativo | `badge-success` | Verde |
| Inativo | `badge-secondary` | Cinza |

---

## Referências

- **Module:** `src/features/linktree/module.ts`
- **Permissions:** `src/features/linktree/permissions.ts`
- **Routes:** `src/routes/linktree/`
