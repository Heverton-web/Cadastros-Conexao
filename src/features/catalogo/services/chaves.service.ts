import { supabase } from "~/core/supabase"
import type { CatalogoChave, CatalogoTipoChave } from "../types"

// ============================================================
// Tipos de Chaves
// ============================================================

export async function listarTiposChaves(empresaId: string): Promise<CatalogoTipoChave[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_chaves")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoChave[]
}

export async function criarTipoChave(empresaId: string, input: { nome: string; sigla?: string }): Promise<CatalogoTipoChave> {
  const { data, error } = await supabase
    .from("catalogo_tipos_chaves")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoTipoChave
}

export async function toggleTipoChaveAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_chaves").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoChave(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_chaves").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Chaves
// ============================================================

export async function listarChaves(empresaId: string): Promise<CatalogoChave[]> {
  const { data, error } = await supabase
    .from("catalogo_chaves")
    .select("*, tipo_chave:catalogo_tipos_chaves(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoChave[]
}

export async function criarChave(empresaId: string, input: {
  sku: string; nome: string; tipo_chave_id?: string
  sigla?: string; descricao?: string; tipo?: string
  comprimento?: string; diametro_mm?: number; material?: string; preco?: number
}): Promise<CatalogoChave> {
  const { data, error } = await supabase
    .from("catalogo_chaves")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoChave
}

export async function atualizarChave(empresaId: string, sku: string, input: Partial<{
  nome: string; tipo_chave_id: string; sigla: string; descricao: string
  tipo: string; comprimento: string; diametro_mm: number; material: string
  preco: number; ativo: boolean
}>): Promise<CatalogoChave> {
  const { data, error } = await supabase
    .from("catalogo_chaves")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoChave
}

export async function toggleChaveAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_chaves").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerChave(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_chaves").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
