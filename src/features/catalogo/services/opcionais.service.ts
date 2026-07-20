import { supabase } from "~/core/supabase"
import type { CatalogoOpcional, CatalogoTipoOpcional } from "../types"

// ============================================================
// Tipos de Opcionais
// ============================================================

export async function listarTiposOpcionais(): Promise<CatalogoTipoOpcional[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_opcionais")
    .select("*")
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoOpcional[]
}

export async function criarTipoOpcional(input: { nome: string; sigla?: string }): Promise<CatalogoTipoOpcional> {
  const { data, error } = await supabase
    .from("catalogo_tipos_opcionais")
    .insert({ ...input })
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

export async function listarOpcionais(): Promise<CatalogoOpcional[]> {
  const { data, error } = await supabase
    .from("catalogo_opcionais")
    .select("*, tipo_opcional:catalogo_tipos_opcionais(*)")
    .order("nome")
  if (error) throw error
  return data as CatalogoOpcional[]
}

export async function criarOpcional(input: {
  sku: string; nome: string; tipo_opcional_id?: string
  sigla?: string; descricao?: string; tipo?: string
  comprimento?: string; diametro_mm?: number; material?: string; preco?: number
}): Promise<CatalogoOpcional> {
  const { data, error } = await supabase
    .from("catalogo_opcionais")
    .insert({ ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoOpcional
}

export async function atualizarOpcional(sku: string, input: Partial<{
  nome: string; tipo_opcional_id: string; sigla: string; descricao: string
  tipo: string; comprimento: string; diametro_mm: number; material: string
  preco: number; ativo: boolean
}>): Promise<CatalogoOpcional> {
  const { data, error } = await supabase
    .from("catalogo_opcionais")
    .update(input)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoOpcional
}

export async function toggleOpcionalAtivo(sku: string, ativo: boolean): Promise<void> {
  if (error) throw error
}

export async function removerOpcional(sku: string): Promise<void> {
  if (error) throw error
}
