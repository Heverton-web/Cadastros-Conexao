import { createRoute, useParams, redirect } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { useCatalogoCliente } from "~/features/catalogo/hooks/useCatalogoCliente"
import { useState, useEffect } from "react"
import { supabase } from "~/lib/supabase"
import type { CatalogoPedido } from "~/features/catalogo/types/pedidos"
import { STATUS_PEDIDO_LABEL, STATUS_PEDIDO_COLOR } from "~/features/catalogo/types/pedidos"
import { Badge } from "~/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "~/components/ui/table"

export const catalogoLojaPedidosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/loja/$slug/pedidos",
  component: LojaPedidosPage,
})

function LojaPedidosPage() {
  const { slug } = useParams({ from: "/loja/$slug/pedidos" })
  const empresaId = useCatalogoEmpresaId()
  const { cliente, isLogado, loading: authLoading } = useCatalogoCliente()
  const [pedidos, setPedidos] = useState<CatalogoPedido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLogado || !cliente) return
    async function load() {
      const { data } = await supabase
        .from("catalogo_pedidos")
        .select("*, itens:catalogo_pedido_itens(*)")
        .eq("empresa_id", empresaId)
        .eq("cliente_id", cliente!.id)
        .order("created_at", { ascending: false })
      setPedidos((data as CatalogoPedido[]) ?? [])
      setLoading(false)
    }
    load()
  }, [isLogado, cliente, empresaId])

  if (authLoading || loading) {
    return (
      <StoreLayout>
        <div className="p-8 text-center text-[var(--color-text-muted)]">Carregando...</div>
      </StoreLayout>
    )
  }

  if (!isLogado) {
    return (
      <StoreLayout>
        <div className="p-8 text-center">
          <p className="text-[var(--color-text-muted)]">Faça login para ver seus pedidos.</p>
          <a href={`/loja/${slug}/login`} className="text-[var(--color-accent)] hover:underline mt-2 inline-block">
            Entrar
          </a>
        </div>
      </StoreLayout>
    )
  }

  function formatBRL(v: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
  }

  return (
    <StoreLayout>
      <div className="p-4 lg:p-8 space-y-4">
        <h1 className="text-2xl font-bold text-white">Meus Pedidos</h1>

        {pedidos.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">Nenhum pedido encontrado.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id.slice(0, 8)}</TableCell>
                  <TableCell>{p.itens?.length ?? 0} itens</TableCell>
                  <TableCell>{formatBRL(p.valor_total)}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_PEDIDO_COLOR[p.status]}>
                      {STATUS_PEDIDO_LABEL[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--color-text-muted)]">
                    {new Date(p.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </StoreLayout>
  )
}
