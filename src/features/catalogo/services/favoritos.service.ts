import { supabase } from "~/lib/supabase"
import { EMPRESA_ID } from "~/config/empresa"
import type { CatalogoFavorito } from "../types/pedidos"

export async function listarFavoritos(
  EMPRESA_ID: string,
  clienteId: string,
): Promise<CatalogoFavorito[]> {
  const { data, error } = await supabase
    .from("catalogo_favoritos")
    .select("*")
    .eq("empresa_id", EMPRESA_ID)
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as CatalogoFavorito[]
}

export async function adicionarFavorito(
  EMPRESA_ID: string,
  clienteId: string,
  produtoSku: string,
  produtoTipo: string,
): Promise<CatalogoFavorito> {
  const { data, error } = await supabase
    .from("catalogo_favoritos")
    .insert({
      empresa_id: EMPRESA_ID,
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
  EMPRESA_ID: string,
  clienteId: string,
  produtoSku: string,
): Promise<void> {
  const { error } = await supabase
    .from("catalogo_favoritos")
    .delete()
    .eq("empresa_id", EMPRESA_ID)
    .eq("cliente_id", clienteId)
    .eq("produto_sku", produtoSku)
  if (error) throw error
}

export async function isFavorito(
  EMPRESA_ID: string,
  clienteId: string,
  produtoSku: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("catalogo_favoritos")
    .select("id")
    .eq("empresa_id", EMPRESA_ID)
    .eq("cliente_id", clienteId)
    .eq("produto_sku", produtoSku)
    .maybeSingle()
  if (error) return false
  return !!data
}

export async function toggleFavorito(
  EMPRESA_ID: string,
  clienteId: string,
  produtoSku: string,
  produtoTipo: string,
): Promise<boolean> {
  const exists = await isFavorito(EMPRESA_ID, clienteId, produtoSku)
  if (exists) {
    await removerFavorito(EMPRESA_ID, clienteId, produtoSku)
    return false
  }
  await adicionarFavorito(EMPRESA_ID, clienteId, produtoSku, produtoTipo)
  return true
}
