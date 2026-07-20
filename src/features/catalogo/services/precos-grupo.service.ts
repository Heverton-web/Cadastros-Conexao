import { supabase } from "~/lib/supabase"

/**
 * Resolve o preço de um produto considerando o contexto:
 * - visitante: retorna null (preço oculto)
 * - colaborador: retorna preço base do produto
 * - cliente: busca preço do grupo (override > fixo > percentual > base)
 */
export async function resolvePreco(
  contexto: "visitante" | "colaborador" | "cliente",
  produtoSku: string,
  produtoTipo: string,
  precoBase: number,
  clienteId?: string | null,
): Promise<number | null> {
  if (contexto === "visitante") return null
  if (contexto === "colaborador") return precoBase
  if (contexto === "cliente" && clienteId) {
    return resolverPrecoCliente(clienteId, produtoSku, produtoTipo, precoBase)
  }
  return precoBase
}

async function resolverPrecoCliente(
  clienteId: string,
  produtoSku: string,
  produtoTipo: string,
  precoBase: number,
): Promise<number> {
  // 1. Busca grupo do cliente
  const { data: cliente } = await supabase
    .from("catalogo_clientes")
    .select("grupo_id")
    .eq("id", clienteId)
    .single()

  if (!cliente?.grupo_id) return precoBase

  // 2. Busca override por produto no grupo
  const { data: override } = await supabase
    .from("catalogo_grupo_precos")
    .select("preco")
    .eq("grupo_id", cliente.grupo_id)
    .eq("produto_sku", produtoSku)
    .eq("produto_tipo", produtoTipo)
    .maybeSingle()

  if (override) return override.preco

  // 3. Busca config do grupo
  const { data: grupo } = await supabase
    .from("catalogo_grupos_clientes")
    .select("preco_tipo, desconto_percentual")
    .eq("id", cliente.grupo_id)
    .single()

  if (!grupo) return precoBase

  // 4. Aplica regra do grupo
  if (grupo.preco_tipo === "fixo") {
    return grupo.desconto_percentual // valor fixo
  }
  // percentual
  return Math.round(precoBase * (1 - grupo.desconto_percentual / 100) * 100) / 100
}

/**
 * Batch: resolve preços para múltiplos produtos de uma vez
 */
export async function resolvePrecoBatch(
  contexto: "visitante" | "colaborador" | "cliente",
  produtos: Array<{ sku: string; tipo: string; preco_base: number }>,
  clienteId?: string | null,
): Promise<Map<string, number | null>> {
  const result = new Map<string, number | null>()

  if (contexto === "visitante") {
    for (const p of produtos) result.set(`${p.tipo}:${p.sku}`, null)
    return result
  }

  if (contexto === "colaborador") {
    for (const p of produtos) result.set(`${p.tipo}:${p.sku}`, p.preco_base)
    return result
  }

  // Para cliente: busca grupo e overrides de uma vez
  if (!clienteId) {
    for (const p of produtos) result.set(`${p.tipo}:${p.sku}`, p.preco_base)
    return result
  }

  const { data: cliente } = await supabase
    .from("catalogo_clientes")
    .select("grupo_id")
    .eq("id", clienteId)
    .single()

  if (!cliente?.grupo_id) {
    for (const p of produtos) result.set(`${p.tipo}:${p.sku}`, p.preco_base)
    return result
  }

  const { data: grupo } = await supabase
    .from("catalogo_grupos_clientes")
    .select("preco_tipo, desconto_percentual")
    .eq("id", cliente.grupo_id)
    .single()

  const { data: overrides } = await supabase
    .from("catalogo_grupo_precos")
    .select("produto_sku, produto_tipo, preco")
    .eq("grupo_id", cliente.grupo_id)

  const overrideMap = new Map(
    (overrides ?? []).map((o) => [`${o.produto_tipo}:${o.produto_sku}`, o.preco]),
  )

  for (const p of produtos) {
    const key = `${p.tipo}:${p.sku}`
    const override = overrideMap.get(key)
    if (override !== undefined) {
      result.set(key, override)
      continue
    }
    if (grupo) {
      if (grupo.preco_tipo === "fixo") {
        result.set(key, grupo.desconto_percentual)
      } else {
        result.set(
          key,
          Math.round(p.preco_base * (1 - grupo.desconto_percentual / 100) * 100) / 100,
        )
      }
    } else {
      result.set(key, p.preco_base)
    }
  }

  return result
}
