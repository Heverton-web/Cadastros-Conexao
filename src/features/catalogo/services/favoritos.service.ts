import { supabase } from "~/lib/supabase"
import type { CatalogoFavorito } from "../types/pedidos"

export async function listarFavoritos(
  empresaId: string,
  clienteId: string,
): Promise<CatalogoFavorito[]> {
  const { data, error } = await supabase
    .from("catalogo_favoritos")
    .select("*")
    .eq("empresa_id", empresaId)
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as CatalogoFavorito[]
}

export async function adicionarFavorito(
  empresaId: string,
  clienteId: string,
  produtoSku: string,
  produtoTipo: string,
): Promise<CatalogoFavorito> {
  const { data, error } = await supabase
    .from("catalogo_favoritos")
    .insert({
      empresa_id: empresaId,
      cliente_id: clienteId,
      produto_sku: produtoSku,
      produto_tipo: produtoTipo,
    })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoFavorito
}

export async function removerFavorito(
  empresaId: string,
  clienteId: string,
  produtoSku: string,
): Promise<void> {
  const { error } = await supabase
    .from("catalogo_favoritos")
    .delete()
    .eq("empresa_id", empresaId)
    .eq("cliente_id", clienteId)
    .eq("produto_sku", produtoSku)
  if (error) throw error
}

export async function isFavorito(
  empresaId: string,
  clienteId: string,
  produtoSku: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("catalogo_favoritos")
    .select("id")
    .eq("empresa_id", empresaId)
    .eq("cliente_id", clienteId)
    .eq("produto_sku", produtoSku)
    .maybeSingle()
  if (error) return false
  return !!data
}

export async function toggleFavorito(
  empresaId: string,
  clienteId: string,
  produtoSku: string,
  produtoTipo: string,
): Promise<boolean> {
  const exists = await isFavorito(empresaId, clienteId, produtoSku)
  if (exists) {
    await removerFavorito(empresaId, clienteId, produtoSku)
    return false
  }
  await adicionarFavorito(empresaId, clienteId, produtoSku, produtoTipo)
  return true
}
