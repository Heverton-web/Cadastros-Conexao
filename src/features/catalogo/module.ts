import {
  Package, LayoutDashboard, Tag, Truck, Percent, ShoppingBag, Layers, Share2, Settings,
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
    "/catalogo",
    "/catalogo/implantes",
    "/catalogo/componentes",
    "/catalogo/kits",
    "/catalogo/promocionais",
    "/catalogo/produto/$tipo/$sku",
    "/catalogo/carrinho",
    "/catalogo/checkout",
    "/catalogo/admin/produtos",
    "/catalogo/admin/cadastros",
    "/catalogo/admin/cupons",
    "/catalogo/admin/frete",
    "/catalogo/admin/promocionais",
    "/catalogo/admin/dashboard",
    "/catalogo/admin/social",
    "/catalogo/admin/configuracoes",
  ],
  permissions: CATALOGO_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "tecnologia"],
  abas: [
    { key: "geral", label: "Geral", descricao: "Configurações gerais do catálogo" },
    { key: "permissoes", label: "Permissões", descricao: "Gerenciar permissões do módulo" },
    { key: "eventos", label: "Eventos", descricao: "Eventos e webhooks do catálogo" },
  ],
  events: [
    { key: "produto.criado", label: "Produto Criado", descricao: "Quando um novo produto é adicionado ao catálogo", type: "status_change" },
    { key: "produto.atualizado", label: "Produto Atualizado", descricao: "Quando um produto do catálogo é atualizado", type: "status_change" },
    { key: "produto.removido", label: "Produto Removido", descricao: "Quando um produto é removido do catálogo", type: "status_change" },
    { key: "promocional.criado", label: "Promoção Criada", descricao: "Quando um pacote promocional é criado", type: "status_change" },
    { key: "cupom.utilizado", label: "Cupom Utilizado", descricao: "Quando um cupom de desconto é aplicado", type: "button_action" },
  ],
  hasDesignConfig: false,
  setup: () => {
    for (const p of CATALOGO_PERMISSIONS) {
      registerPermission({
        key: p.key,
        label: p.label,
        description: p.description,
        group: p.group,
      })
    }

    registerNavItem({
      id: "catalogo-implantes",
      label: "Implantes",
      icon: Package,
      to: "/catalogo/implantes",
      permissionCheck: (perms) => perms?.catalogo_ver_catalogo === true,
      order: 95,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-componentes",
      label: "Componentes",
      icon: Layers,
      to: "/catalogo/componentes",
      permissionCheck: (perms) => perms?.catalogo_ver_catalogo === true,
      order: 96,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-kits",
      label: "Kits",
      icon: ShoppingBag,
      to: "/catalogo/kits",
      permissionCheck: (perms) => perms?.catalogo_ver_catalogo === true,
      order: 97,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-promocionais",
      label: "Promoções",
      icon: Tag,
      to: "/catalogo/promocionais",
      permissionCheck: (perms) => perms?.catalogo_ver_catalogo === true,
      order: 98,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-dashboard",
      label: "Dashboard Catálogo",
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
      label: "Promoções Admin",
      icon: Tag,
      to: "/catalogo/admin/promocionais",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_promocionais === true,
      order: 104,
      moduloKey: "catalogo",
    })
    registerNavItem({
      id: "catalogo-admin-social",
      label: "Redes Sociais",
      icon: Share2,
      to: "/catalogo/admin/social",
      permissionCheck: (perms) => perms?.catalogo_gerenciar_promocionais === true,
      order: 105,
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
