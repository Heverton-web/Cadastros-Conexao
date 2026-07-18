import { supabase } from "~/core/supabase"
import type { CatalogoParafuso, CatalogoCpsTipoParafuso } from "../types"

// ============================================================
// Tipos de Parafusos
// ============================================================

export async function listarTiposParafusos(empresaId: string): Promise<CatalogoCpsTipoParafuso[]> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_parafusos")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoCpsTipoParafuso[]
}

export async function criarTipoParafuso(empresaId: string, input: { nome: string; sigla?: string }): Promise<CatalogoCpsTipoParafuso> {
  const { data, error } = await supabase
    .from("catalogo_cps_tipos_parafusos")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoCpsTipoParafuso
}

export async function toggleTipoParafusoAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_parafusos").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoParafuso(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_cps_tipos_parafusos").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Parafusos
// ============================================================

export async function listarParafusos(empresaId: string): Promise<CatalogoParafuso[]> {
  const { data, error } = await supabase
    .from("catalogo_parafusos")
    .select("*, tipo_parafuso:catalogo_cps_tipos_parafusos(*), chave:catalogo_chaves(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoParafuso[]
}

export async function criarParafuso(empresaId: string, input: {
  sku: string; nome: string; tipo_parafuso_id?: string; chave_id?: string
  sigla?: string; descricao?: string; torque_ncm?: number; material?: string; preco?: number
}): Promise<CatalogoParafuso> {
  const { data, error } = await supabase
    .from("catalogo_parafusos")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoParafuso
}

export async function atualizarParafuso(empresaId: string, sku: string, input: Partial<{
  nome: string; tipo_parafuso_id: string; chave_id: string
  sigla: string; descricao: string; torque_ncm: number; material: string
  preco: number; ativo: boolean
}>): Promise<CatalogoParafuso> {
  const { data, error } = await supabase
    .from("catalogo_parafusos")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoParafuso
}

export async function toggleParafusoAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_parafusos").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerParafuso(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_parafusos").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
