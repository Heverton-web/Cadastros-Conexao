import { supabase } from "~/core/supabase"
import type { CatalogoOpcional, CatalogoTipoOpcional } from "../types"

// ============================================================
// Tipos de Opcionais
// ============================================================

export async function listarTiposOpcionais(empresaId: string): Promise<CatalogoTipoOpcional[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_opcionais")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoOpcional[]
}

export async function criarTipoOpcional(empresaId: string, input: { nome: string; sigla?: string }): Promise<CatalogoTipoOpcional> {
  const { data, error } = await supabase
    .from("catalogo_tipos_opcionais")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoTipoOpcional
}

export async function toggleTipoOpcionalAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_opcionais").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoOpcional(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_opcionais").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Opcionais
// ============================================================

export async function listarOpcionais(empresaId: string): Promise<CatalogoOpcional[]> {
  const { data, error } = await supabase
    .from("catalogo_opcionais")
    .select("*, tipo_opcional:catalogo_tipos_opcionais(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoOpcional[]
}

export async function criarOpcional(empresaId: string, input: {
  sku: string; nome: string; tipo_opcional_id?: string
  sigla?: string; descricao?: string; tipo?: string
  comprimento?: string; diametro_mm?: number; material?: string; preco?: number
}): Promise<CatalogoOpcional> {
  const { data, error } = await supabase
    .from("catalogo_opcionais")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoOpcional
}

export async function atualizarOpcional(empresaId: string, sku: string, input: Partial<{
  nome: string; tipo_opcional_id: string; sigla: string; descricao: string
  tipo: string; comprimento: string; diametro_mm: number; material: string
  preco: number; ativo: boolean
}>): Promise<CatalogoOpcional> {
  const { data, error } = await supabase
    .from("catalogo_opcionais")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoOpcional
}

export async function toggleOpcionalAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_opcionais").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerOpcional(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_opcionais").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
