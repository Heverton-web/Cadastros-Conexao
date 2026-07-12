import { createRoute, Link } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { useKitsAtivos } from "~/features/catalogo/hooks/useCatalogo"
import { formatBRL, mockPreco } from "~/features/catalogo/services/carrinho.service"
import { ShoppingBag, ArrowLeft, Box } from "lucide-react"

export const catalogoKitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/kits",
  component: CatalogoKitsPage,
})

function CatalogoKitsPage() {
  const { data: kits, isLoading } = useKitsAtivos()

  return (
    <StoreLayout>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-6">
          <Link to="/catalogo" className="group flex items-center justify-center w-12 h-12 rounded-full border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all">
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white tracking-tighter">Kits & Maletas</h1>
            <p className="text-lg mt-2 text-[var(--color-text-muted)]">Cada kit lista peças de reposição avulsas.</p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-[var(--color-surface)]/50 border border-[var(--color-border-subtle)] animate-pulse" />
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(kits ?? []).map((kit) => {
            const preco = mockPreco("kit", kit.sku)
            const qtdPecas = kit.composicao?.length ?? 0
            return (
              <Link
                key={kit.sku}
                to="/catalogo/produto/$tipo/$sku"
                params={{ tipo: "kit", sku: kit.sku }}
                className="group rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50 overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-[0_8px_30px_rgba(201,166,85,0.08)]"
              >
                <div className="p-6 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--color-accent)]/10 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/20 transition-colors">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)]">
                        <Box className="h-3 w-3 text-[var(--color-text-muted)]" />
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)]">{qtdPecas} peças</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-white leading-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                      {kit.nome}
                    </h3>
                    {kit.descricao && (
                      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{kit.descricao}</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border-subtle)] mt-4">
                    <span className="text-2xl font-black text-gradient-gold">{formatBRL(preco)}</span>
                  </div>
                </div>
              </Link>
            )
          })}

          {kits?.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-16 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-[var(--color-text-muted)] opacity-40" />
              <p className="text-lg text-[var(--color-text-muted)] font-semibold">Nenhum kit ativo no momento.</p>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  )
}
