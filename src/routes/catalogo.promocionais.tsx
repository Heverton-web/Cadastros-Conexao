import { createRoute, Link, useSearch } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { usePromocionaisAtivos } from "~/features/catalogo/hooks/useCatalogo"
import { formatBRL } from "~/features/catalogo/services/carrinho.service"
import { Tag, Clock, ArrowLeft, Zap } from "lucide-react"

export const catalogoPromocionaisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/promocionais",
  component: CatalogoPromocionaisPage,
})

function CatalogoPromocionaisPage() {
  const { data: promos, isLoading } = usePromocionaisAtivos()
  const search = useSearch({ strict: false }) as Record<string, string | undefined>
  const empresa = search.empresa

  return (
    <StoreLayout>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-6">
          <Link to="/catalogo" search={{ empresa }} className="group flex items-center justify-center w-12 h-12 rounded-full border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all">
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white tracking-tighter">Promocionais</h1>
            <p className="text-lg mt-2 text-[var(--color-text-muted)]">Pacotes fechados com preços especiais.</p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-[var(--color-surface)]/50 border border-[var(--color-border-subtle)] overflow-hidden animate-pulse">
                <div className="h-32 bg-[var(--color-surface-hover)]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-20 rounded bg-[var(--color-surface-hover)]" />
                  <div className="h-5 w-40 rounded bg-[var(--color-surface-hover)]" />
                  <div className="h-4 w-full rounded bg-[var(--color-surface-hover)]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(promos ?? []).map((promo) => (
            <Link
              key={promo.id}
              to="/catalogo/produto/$tipo/$sku"
              params={{ tipo: "promocional", sku: promo.id }}
              search={{ empresa }}
              className="group rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50 overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-[0_8px_30px_rgba(201,166,85,0.08)]"
            >
              {/* Imagem — 30% */}
              <div className="relative h-32 bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] overflow-hidden">
                <div className="absolute inset-0 opacity-10 group-hover:opacity-25 mix-blend-screen transition-opacity duration-500" style={{ background: "radial-gradient(circle at 30% 30%, #c9a655 0%, transparent 60%)" }} />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: "#c9a655" }} />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0f172a]/60 backdrop-blur-md border border-[var(--color-border-subtle)]">
                  <Tag className="h-3 w-3 text-[var(--color-accent)]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">Pacote</span>
                </div>
              </div>

              {/* Info — 70% */}
              <div className="p-5 flex flex-col justify-between min-h-[180px] group-hover:bg-[var(--color-surface)]/30 transition-colors">
                <div>
                  <h3 className="font-bold text-lg text-white leading-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                    {promo.nome}
                  </h3>
                  {promo.descricao && (
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{promo.descricao}</p>
                  )}
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-[var(--color-border-subtle)] mt-4">
                  <span className="text-xl font-black text-gradient-gold">{formatBRL(promo.preco)}</span>
                  {promo.expira_em && (
                    <span className="text-xs flex items-center gap-1 text-[var(--color-text-muted)]">
                      <Clock className="h-3 w-3" />
                      {new Date(promo.expira_em).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {promos?.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-16 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/30">
              <Tag className="h-12 w-12 mx-auto mb-4 text-[var(--color-text-muted)] opacity-40" />
              <p className="text-lg text-[var(--color-text-muted)] font-semibold">Nenhuma promoção ativa.</p>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  )
}
