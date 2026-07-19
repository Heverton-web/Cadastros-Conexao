import { supabase } from "~/core/supabase"
import { EMPRESA_ID } from "~/config/empresa"
import type { CatalogoTipoFresa } from "../types"

// ============================================================
// Tipos de Fresas
// ============================================================

export async function listarTiposFresas(): Promise<CatalogoTipoFresa[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_fresas")
    .select("*")
    .eq("empresa_id", EMPRESA_ID)
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoFresa[]
}

export async function criarTipoFresa(input: { nome: string; sigla?: string }): Promise<CatalogoTipoFresa> {
  const { data, error } = await supabase
    .from("catalogo_tipos_fresas")
    .insert({ empresa_id: EMPRESA_ID, ...input })
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
