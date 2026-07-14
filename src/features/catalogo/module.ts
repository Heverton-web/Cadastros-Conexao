import {
  Package, LayoutDashboard, Tag, Truck, Percent, ShoppingBag, Layers, Settings, Eye, Palette,
  Users, UserPlus, FileText, ShoppingCart, ClipboardList, AlertCircle,
} from "lucide-react"
import {
  registerModule, registerNavItem, registerPermission, registerPermissionDefaults,
} from "~/registry"
import type { ModuleDefinition } from "~/registry"
import { CATALOGO_PERMISSIONS } from "./permissions"

export const catalogoModule: ModuleDefinition = {
  key: "catalogo",
  nome: "Catálogo",
  descricao: "Catálogo de implantes, componentes, kits e pacotes promocionais",
  icon: Package,
  routes: [
    // Loja pública
    "/catalogo",
    "/catalogo/produto/$tipo/$sku",
    "/catalogo/carrinho",
    "/catalogo/checkout",
    // Admin
    "/catalogo/admin/produtos",
    "/catalogo/admin/cadastros",
    "/catalogo/admin/cupons",
    "/catalogo/admin/frete",
    "/catalogo/admin/promocionais",
    "/catalogo/admin/dashboard",
    "/catalogo/admin/configuracoes",
    "/catalogo/admin/design",
    // Novas rotas admin
    "/catalogo/admin/clientes",
    "/catalogo/admin/grupos",
    "/catalogo/admin/orcamentos",
    "/catalogo/admin/pedidos",
    "/catalogo/admin/solicitacoes",
    // Loja pública (acesso externo)
    "/loja/$slug",
    "/loja/$slug/login",
    "/loja/$slug/pedidos",
    "/loja/$slug/favoritos",
    "/loja/$slug/orcamento/$token",
  ],
  permissions: CATALOGO_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "tecnologia"],
  abas: [
    { key: "geral", label: "Geral", descricao: "Configurações gerais do catálogo" },
    { key: "permissoes", label: "Permissões", descricao: "Gerenciar permissões do módulo" },
    { key: "eventos", label: "Eventos", descricao: "Eventos e webhooks do catálogo" },
  ],
  events: [
    // Existentes
    { key: "produto.criado", label: "Produto Criado", descricao: "Quando um novo produto é adicionado ao catálogo", type: "status_change" },
    { key: "produto.atualizado", label: "Produto Atualizado", descricao: "Quando um produto do catálogo é atualizado", type: "status_change" },
    { key: "produto.removido", label: "Produto Removido", descricao: "Quando um produto é removido do catálogo", type: "status_change" },
    { key: "promocional.criado", label: "Promoção Criada", descricao: "Quando um pacote promocional é criado", type: "status_change" },
    { key: "cupom.utilizado", label: "Cupom Utilizado", descricao: "Quando um cupom de desconto é aplicado", type: "button_action" },
    // Novos — Colaborador
    { key: "orcamento.criado", label: "Orçamento Criado", descricao: "Quando um colaborador cria um novo orçamento", type: "status_change" },
    { key: "orcamento.enviado", label: "Orçamento Enviado", descricao: "Quando um orçamento é enviado ao cliente", type: "status_change" },
    { key: "orcamento.aprovado", label: "Orçamento Aprovado", descricao: "Quando um cliente aprova o orçamento", type: "status_change" },
    { key: "orcamento.reprovado", label: "Orçamento Reprovado", descricao: "Quando um cliente reprova o orçamento", type: "status_change" },
    { key: "orcamento.pedido_criado", label: "Convertido em Pedido", descricao: "Quando um orçamento é convertido em pedido", type: "button_action" },
    // Novos — Pedido
    { key: "pedido.criado", label: "Pedido Criado", descricao: "Quando um novo pedido é criado", type: "status_change" },
    { key: "pedido.pago", label: "Pedido Pago", descricao: "Quando o pagamento do pedido é confirmado", type: "status_change" },
    { key: "pedido.confirmado", label: "Pedido Confirmado", descricao: "Quando a empresa confirma o pedido", type: "status_change" },
    { key: "pedido.enviado", label: "Pedido Enviado", descricao: "Quando o pedido é enviado ao cliente", type: "status_change" },
    { key: "pedido.entregue", label: "Pedido Entregue", descricao: "Quando o pedido é entregue ao cliente", type: "status_change" },
    { key: "pedido.cancelado", label: "Pedido Cancelado", descricao: "Quando um pedido é cancelado", type: "status_change" },
    // Novos — Cliente
    { key: "cliente.credencial_criada", label: "Credencial Criada", descricao: "Quando uma credencial de acesso é criada para um cliente", type: "button_action" },
    // Novos — Solicitação de Acesso
    { key: "solicitacao_acesso.criada", label: "Solicitação de Acesso Recebida", descricao: "Quando um visitante solicita acesso ao catálogo", type: "status_change" },
    { key: "solicitacao_acesso.aprovada", label: "Solicitação Aprovada", descricao: "Quando uma solicitação de acesso é aprovada", type: "button_action" },
    { key: "solicitacao_acesso.rejeitada", label: "Solicitação Rejeitada", descricao: "Quando uma solicitação de acesso é rejeitada", type: "button_action" },
  ],
  hasDesignConfig: true,
  setup: () => {
    for (const p of CATALOGO_PERMISSIONS) {
      registerPermission({
        key: p.key,
        label: p.label,
        description: p.description,
        group: p.group,
      })
    }

    // Nav items existentes
    registerNavItem({
      id: "catalogo-preview",
      label: "Preview",
      icon: Eye,
      to: "/catalogo",
      permissionCheck: (perms) => perms?.catalogo_ver_catalogo === true,
      order: 95,
      moduloKey: "catalogo",
      noChildMatch: true,
      external: true,
    })
    registerNavItem({
      id: "catalogo-admin-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/catalogo/admin/dashboard",
      permissionCheck: (perms) => perms?.catalogo_dashboard === true,
      order: 99,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-produtos",
      label: "Produtos",
      icon: Package,
      to: "/catalogo/admin/produtos",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_produtos === true,
      order: 100,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-cadastros",
      label: "Cadastros",
      icon: Layers,
      to: "/catalogo/admin/cadastros",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_cadastros === true,
      order: 101,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-cupons",
      label: "Cupons",
      icon: Percent,
      to: "/catalogo/admin/cupons",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_cupons === true,
      order: 102,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-frete",
      label: "Frete",
      icon: Truck,
      to: "/catalogo/admin/frete",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_frete === true,
      order: 103,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-promocionais",
      label: "Promoções",
      icon: Tag,
      to: "/catalogo/admin/promocionais",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_promocionais === true,
      order: 104,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-configuracoes",
      label: "Configurações",
      icon: Settings,
      to: "/catalogo/admin/configuracoes",
      permissionCheck: (perms) => perms?.catalogo_dashboard === true,
      order: 106,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-design",
      label: "Design da Loja",
      icon: Palette,
      to: "/catalogo/admin/design",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_design === true,
      order: 107,
      moduloKey: "catalogo",
    })

    // Novos nav items
    registerNavItem({
      id: "catalogo-admin-clientes",
      label: "Clientes",
      icon: Users,
      to: "/catalogo/admin/clientes",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_clientes === true,
      order: 108,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-grupos",
      label: "Grupos",
      icon: UserPlus,
      to: "/catalogo/admin/grupos",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_grupos === true,
      order: 109,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-orcamentos",
      label: "Orçamentos",
      icon: FileText,
      to: "/catalogo/admin/orcamentos",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_orcamentos === true,
      order: 110,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-pedidos",
      label: "Pedidos",
      icon: ShoppingCart,
      to: "/catalogo/admin/pedidos",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_pedidos === true,
      order: 111,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-solicitacoes",
      label: "Solicitações",
      icon: AlertCircle,
      to: "/catalogo/admin/solicitacoes",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_solicitacoes === true,
      order: 112,
      moduloKey: "catalogo",
    })

    const allTrue = Object.fromEntries(CATALOGO_PERMISSIONS.map((p) => [p.key, true]))
    const allFalse = Object.fromEntries(CATALOGO_PERMISSIONS.map((p) => [p.key, false]))

    registerPermissionDefaults("catalogo", {
      cadastro: allTrue,
      tecnologia: allTrue,
      consultor: { ...allFalse, catalogo_ver_catalogo: true },
      suporte: allFalse,
    })
  },
}
