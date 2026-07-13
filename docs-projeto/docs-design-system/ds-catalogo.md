# Design System - Módulo Catálogo

> Módulo: `catalogo` | Versão: 1.0.0

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

O módulo **Catálogo** é responsável pelo catálogo de implantes, componentes, kits e pacotes promocionais.

**Chave:** `catalogo`
**Ícone:** `Package`
**Descrição:** Catálogo de implantes, componentes, kits e pacotes promocionais

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `catalogo_ver_catalogo` | Ver catálogo | catalogo |
| `catalogo_dashboard` | Acessar dashboard | catalogo |
| `catalogo_gerenciar_produtos` | Gerenciar produtos | catalogo |
| `catalogo_gerenciar_cadastros` | Gerenciar cadastros | catalogo |
| `catalogo_gerenciar_cupons` | Gerenciar cupons | catalogo |
| `catalogo_gerenciar_frete` | Gerenciar frete | catalogo |
| `catalogo_gerenciar_promocionais` | Gerenciar promoções | catalogo |
| `catalogo_gerenciar_design` | Gerenciar design | catalogo |
| `catalogo_gerenciar_clientes` | Gerenciar clientes | catalogo |
| `catalogo_gerenciar_grupos` | Gerenciar grupos | catalogo |
| `catalogo_gerenciar_orcamentos` | Gerenciar orçamentos | catalogo |
| `catalogo_gerenciar_pedidos` | Gerenciar pedidos | catalogo |
| `catalogo_gerenciar_solicitacoes` | Gerenciar solicitações | catalogo |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | Todas as permissões: true |
| `tecnologia` | Todas as permissões: true |
| `consultor` | ver_catalogo: true |
| `suporte` | Todas as permissões: false |

---

## Rotas

### Loja Pública

| Rota | Descrição |
|------|-----------|
| `/catalogo` | Página inicial do catálogo |
| `/catalogo/produto/$tipo/$sku` | Detalhe do produto |
| `/catalogo/carrinho` | Carrinho de compras |
| `/catalogo/checkout` | Checkout |

### Admin

| Rota | Descrição |
|------|-----------|
| `/catalogo/admin/produtos` | Gerenciar produtos |
| `/catalogo/admin/cadastros` | Gerenciar cadastros |
| `/catalogo/admin/cupons` | Gerenciar cupons |
| `/catalogo/admin/frete` | Gerenciar frete |
| `/catalogo/admin/promocionais` | Promoções |
| `/catalogo/admin/dashboard` | Dashboard |
| `/catalogo/admin/social` | Redes sociais |
| `/catalogo/admin/configuracoes` | Configurações |
| `/catalogo/admin/design` | Design da loja |
| `/catalogo/admin/clientes` | Clientes |
| `/catalogo/admin/grupos` | Grupos |
| `/catalogo/admin/orcamentos` | Orçamentos |
| `/catalogo/admin/pedidos` | Pedidos |
| `/catalogo/admin/solicitacoes` | Solicitações |

### Loja Externa

| Rota | Descrição |
|------|-----------|
| `/loja/$slug` | Loja do cliente |
| `/loja/$slug/login` | Login da loja |
| `/loja/$slug/pedidos` | Pedidos do cliente |
| `/loja/$slug/favoritos` | Favoritos |
| `/loja/$slug/orcamento/$token` | Orçamento |

---

## Eventos

### Status Change

| Evento | Descrição |
|--------|-----------|
| `produto.criado` | Quando um novo produto é adicionado ao catálogo |
| `produto.atualizado` | Quando um produto do catálogo é atualizado |
| `produto.removido` | Quando um produto é removido do catálogo |
| `promocional.criado` | Quando um pacote promocional é criado |
| `orcamento.criado` | Quando um colaborador cria um novo orçamento |
| `orcamento.enviado` | Quando um orçamento é enviado ao cliente |
| `orcamento.aprovado` | Quando um cliente aprova o orçamento |
| `orcamento.reprovado` | Quando um cliente reprova o orçamento |
| `pedido.criado` | Quando um novo pedido é criado |
| `pedido.pago` | Quando o pagamento do pedido é confirmado |
| `pedido.confirmado` | Quando a empresa confirma o pedido |
| `pedido.enviado` | Quando o pedido é enviado ao cliente |
| `pedido.entregue` | Quando o pedido é entregue ao cliente |
| `pedido.cancelado` | Quando um pedido é cancelado |
| `solicitacao_acesso.criada` | Quando um visitante solicita acesso ao catálogo |

### Button Action

| Evento | Descrição |
|--------|-----------|
| `cupom.utilizado` | Quando um cupom de desconto é aplicado |
| `orcamento.pedido_criado` | Quando um orçamento é convertido em pedido |
| `cliente.credencial_criada` | Quando uma credencial de acesso é criada para um cliente |
| `solicitacao_acesso.aprovada` | Quando uma solicitação de acesso é aprovada |
| `solicitacao_acesso.rejeitada` | Quando uma solicitação de acesso é rejeitada |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configurações gerais do catálogo |
| `permissoes` | Gerenciar permissões do módulo |
| `eventos` | Eventos e webhooks do catálogo |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `catalogo-preview` | Preview | Eye | `/catalogo` | 95 |
| `catalogo-admin-dashboard` | Dashboard | LayoutDashboard | `/catalogo/admin/dashboard` | 99 |
| `catalogo-admin-produtos` | Produtos | Package | `/catalogo/admin/produtos` | 100 |
| `catalogo-admin-cadastros` | Cadastros | Layers | `/catalogo/admin/cadastros` | 101 |
| `catalogo-admin-cupons` | Cupons | Percent | `/catalogo/admin/cupons` | 102 |
| `catalogo-admin-frete` | Frete | Truck | `/catalogo/admin/frete` | 103 |
| `catalogo-admin-promocionais` | Promoções | Tag | `/catalogo/admin/promocionais` | 104 |
| `catalogo-admin-social` | Redes Sociais | Share2 | `/catalogo/admin/social` | 105 |
| `catalogo-admin-configuracoes` | Configurações | Settings | `/catalogo/admin/configuracoes` | 106 |
| `catalogo-admin-design` | Design da Loja | Palette | `/catalogo/admin/design` | 107 |
| `catalogo-admin-clientes` | Clientes | Users | `/catalogo/admin/clientes` | 108 |
| `catalogo-admin-grupos` | Grupos | UserPlus | `/catalogo/admin/grupos` | 109 |
| `catalogo-admin-orcamentos` | Orçamentos | FileText | `/catalogo/admin/orcamentos` | 110 |
| `catalogo-admin-pedidos` | Pedidos | ShoppingCart | `/catalogo/admin/pedidos` | 111 |
| `catalogo-admin-solicitacoes` | Solicitações | AlertCircle | `/catalogo/admin/solicitacoes` | 112 |

---

## Design System Específico

### Estilos Customizados

O módulo Catálogo possui estilos CSS próprios em `src/features/catalogo/styles/theme.css`.

### CSS Variables (Catálogo Theme)

```css
.catalogo-theme {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-surface-hover: #334155;
  --color-card: #1e293b;
  --color-text-main: #f8fafc;
  --color-text-muted: #94a3b8;
  --color-border: transparent;
  --color-accent: #c9a655;
  --color-accent-hover: #d4b366;
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-input-bg: #0f172a;
  --color-input-border: #334155;
  --color-input-focus: #c9a655;
}
```

### Gradientes

```css
.catalogo-theme .bg-gradient-gold {
  background: linear-gradient(135deg, #c9a655 0%, #e8d48b 40%, #a8873a 70%, #c9a655 100%);
}

.catalogo-theme .text-gradient-gold {
  background: linear-gradient(135deg, #c9a655 0%, #e8d48b 40%, #a8873a 70%, #c9a655 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de produtos
- `Table` - Tabelas de dados
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações
- `Badge` - Status de pedidos
- `Button` - Ações
- `Input` - Campos de formulário
- `Select` - Seleções

### Padrões de UI

#### Card de Produto

```tsx
<Card className="card-catalogo hover:border-accent transition-all">
  <CardHeader>
    <img src={produto.imagem} alt={produto.nome} />
    <CardTitle>{produto.nome}</CardTitle>
    <CardDescription>{produto.descricao}</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-lg font-bold text-accent">R$ {produto.preco}</p>
  </CardContent>
  <CardFooter>
    <Button variant="default" className="w-full">
      Adicionar ao Carrinho
    </Button>
  </CardFooter>
</Card>
```

#### Status de Pedido

| Status | Badge | Cor |
|--------|-------|-----|
| Pendente | `badge-warning` | Amarelo |
| Confirmado | `badge-default` | Gold |
| Enviado | `badge-success` | Verde |
| Entregue | `badge-success` | Verde |
| Cancelado | `badge-destructive` | Vermelho |

#### Status de Orçamento

| Status | Badge | Cor |
|--------|-------|-----|
| Rascunho | `badge-secondary` | Cinza |
| Enviado | `badge-default` | Gold |
| Aprovado | `badge-success` | Verde |
| Reprovado | `badge-destructive` | Vermelho |

---

## Referências

- **Module:** `src/features/catalogo/module.ts`
- **Permissions:** `src/features/catalogo/permissions.ts`
- **Routes:** `src/routes/catalogo/`
- **Theme CSS:** `src/features/catalogo/styles/theme.css`
