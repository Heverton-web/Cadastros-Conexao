import { supabase } from "~/core/supabase"
import type { CatalogoComplementar, CatalogoTipoComplementar } from "../types"

// ============================================================
// Tipos de Complementares
// ============================================================

export async function listarTiposComplementares(empresaId: string): Promise<CatalogoTipoComplementar[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_complementares")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoComplementar[]
}

export async function criarTipoComplementar(empresaId: string, input: { nome: string; sigla?: string }): Promise<CatalogoTipoComplementar> {
  const { data, error } = await supabase
    .from("catalogo_tipos_complementares")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoTipoComplementar
}

export async function toggleTipoComplementarAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_complementares").update({ ativo }).eq("id", id)
  if (error) throw error
}

export async function removerTipoComplementar(id: string): Promise<void> {
  const { error } = await supabase.from("catalogo_tipos_complementares").delete().eq("id", id)
  if (error) throw error
}

// ============================================================
// Complementares
// ============================================================

export async function listarComplementares(empresaId: string): Promise<CatalogoComplementar[]> {
  const { data, error } = await supabase
    .from("catalogo_complementares")
    .select("*, tipo_complementar:catalogo_tipos_complementares(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoComplementar[]
}

export async function criarComplementar(empresaId: string, input: {
  sku: string; nome: string; tipo_complementar_id?: string
  sigla?: string; descricao?: string; tipo?: string
  comprimento?: string; diametro_mm?: number; material?: string; preco?: number
}): Promise<CatalogoComplementar> {
  const { data, error } = await supabase
    .from("catalogo_complementares")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoComplementar
}

export async function atualizarComplementar(empresaId: string, sku: string, input: Partial<{
  nome: string; tipo_complementar_id: string; sigla: string; descricao: string
  tipo: string; comprimento: string; diametro_mm: number; material: string
  preco: number; ativo: boolean
}>): Promise<CatalogoComplementar> {
  const { data, error } = await supabase
    .from("catalogo_complementares")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoComplementar
}

export async function toggleComplementarAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_complementares").update({ ativo }).eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}

export async function removerComplementar(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_complementares").delete().eq("empresa_id", empresaId).eq("sku", sku)
  if (error) throw error
}
