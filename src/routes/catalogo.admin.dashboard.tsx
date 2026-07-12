import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useImplantesAtivos, useKitsAtivos, useAbutments, useCupons, useWorkflows } from "~/features/catalogo/hooks/useCatalogo"
import { Package, Layers, ShoppingBag, Percent, GitBranch, EyeOff } from "lucide-react"

export const catalogoAdminDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/catalogo/admin/dashboard",
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const { data: implantes } = useImplantesAtivos()
  const { data: kits } = useKitsAtivos()
  const { data: abutments } = useAbutments()
  const { data: cupons } = useCupons()
  const { data: workflows } = useWorkflows()

  const inactiveKits = (kits ?? []).filter((k) => !k.ativo)

  const cards = [
    { label: "Implantes Ativos", value: implantes?.length ?? 0, icon: Package, color: "#c9a655" },
    { label: "Kits Comercializados", value: kits?.length ?? 0, icon: ShoppingBag, color: "#e8d48b" },
    { label: "Abutments/Pilares", value: abutments?.length ?? 0, icon: Layers, color: "#c9a655" },
    { label: "Workflows", value: workflows?.length ?? 0, icon: GitBranch, color: "#e8d48b" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Dashboard do Catálogo</h1>
            <p className="text-sm font-mono mt-1 text-[var(--color-text-muted)] tracking-widest">VISÃO GERAL DO INVENTÁRIO PROTÉTICO</p>
          </div>
        </div>

        {/* KPIs Premium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, i) => (
            <div key={card.label} className="relative group rounded-2xl bg-[var(--color-surface)] border border-transparent hover:border-white/10 p-6 transition-all shadow-lg overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500" style={{ color: card.color }}>
                <card.icon className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <card.icon className="h-6 w-6 mb-4" style={{ color: card.color }} />
                <p className="text-4xl font-black text-white mb-1">{card.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Inativos */}
        {inactiveKits.length > 0 && (
          <div className="rounded-2xl p-6 bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border-subtle)] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <EyeOff className="w-5 h-5 text-red-400" />
               Atenção: SKUs Inativos ({inactiveKits.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {inactiveKits.map((k) => (
                <div key={k.sku} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-background)] border border-red-500/20 transition-colors hover:bg-red-500/10">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate">{k.nome}</p>
                    <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--color-text-muted)] mt-0.5">SKU: {k.sku}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
