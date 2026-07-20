import { createRoute, useParams } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { BannerSolicitarAcesso } from "~/features/catalogo/components/BannerSolicitarAcesso"
import { useCatalogoVisitante } from "~/features/catalogo/hooks/useCatalogoVisitante"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"

export const catalogoLojaIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/loja/$slug",
  component: LojaIndexPage,
})

function LojaIndexPage() {
  const { slug } = useParams({ from: "/loja/$slug" })
  const empresaId = useCatalogoEmpresaId()
  const { isVisitante } = useCatalogoVisitante()

  return (
    <StoreLayout>
      <div className="space-y-6 p-4 lg:p-8">
        {/* Banner para visitantes */}
        {isVisitante && (
          <BannerSolicitarAcesso
            empresaId={empresaId}
            tipo="formulario"
          />
        )}

        {/* Lista de produtos — a renderização dos produtos já existe no catálogo */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Produtos</h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            {isVisitante
              ? "Faça login para ver preços e realizar pedidos."
              : "Navegue pelo catálogo e adicione itens ao carrinho."}
          </p>
        </div>
      </div>
    </StoreLayout>
  )
}
