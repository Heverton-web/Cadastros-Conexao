import { supabase } from "~/core/supabase"
import type { CatalogoTipoFresa } from "../types"

// ============================================================
// Tipos de Fresas
// ============================================================

export async function listarTiposFresas(empresaId: string): Promise<CatalogoTipoFresa[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_fresas")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoFresa[]
}

export async function criarTipoFresa(empresaId: string, input: { nome: string; sigla?: string }): Promise<CatalogoTipoFresa> {
  const { data, error } = await supabase
    .from("catalogo_tipos_fresas")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoTipoFresa
}

export async function toggleTipoFresaAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_fresas").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoFresa(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_fresas").delete().eq("id", id)
  if (error) throw error
}
