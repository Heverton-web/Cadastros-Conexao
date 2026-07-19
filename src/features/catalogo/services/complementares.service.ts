import { supabase } from "~/core/supabase"
import { EMPRESA_ID } from "~/config/empresa"
import type { CatalogoComplementar, CatalogoTipoComplementar } from "../types"

// ============================================================
// Tipos de Complementares
// ============================================================

export async function listarTiposComplementares(): Promise<CatalogoTipoComplementar[]> {
  const { data, error } = await supabase
    .from("catalogo_tipos_complementares")
    .select("*")
    .eq("empresa_id", EMPRESA_ID)
    .order("nome")
  if (error) throw error
  return data as CatalogoTipoComplementar[]
}

export async function criarTipoComplementar(input: { nome: string; sigla?: string }): Promise<CatalogoTipoComplementar> {
  const { data, error } = await supabase
    .from("catalogo_tipos_complementares")
    .insert({ empresa_id: EMPRESA_ID, ...input })
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

export async function listarComplementares(): Promise<CatalogoComplementar[]> {
  const { data, error } = await supabase
    .from("catalogo_complementares")
    .select("*, tipo_complementar:catalogo_tipos_complementares(*)")
    .eq("empresa_id", EMPRESA_ID)
    .order("nome")
  if (error) throw error
  return data as CatalogoComplementar[]
}

export async function criarComplementar(input: {
  sku: string; nome: string; tipo_complementar_id?: string
  sigla?: string; descricao?: string; tipo?: string
  comprimento?: string; diametro_mm?: number; material?: string; preco?: number
}): Promise<CatalogoComplementar> {
  const { data, error } = await supabase
    .from("catalogo_complementares")
    .insert({ empresa_id: EMPRESA_ID, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoComplementar
}

export async function atualizarComplementar(sku: string, input: Partial<{
  nome: string; tipo_complementar_id: string; sigla: string; descricao: string
  tipo: string; comprimento: string; diametro_mm: number; material: string
  preco: number; ativo: boolean
}>): Promise<CatalogoComplementar> {
  const { data, error } = await supabase
    .from("catalogo_complementares")
    .update(input)
    .eq("empresa_id", EMPRESA_ID)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoComplementar
}

export async function toggleComplementarAtivo(sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("catalogo_complementares").update({ ativo }).eq("empresa_id", EMPRESA_ID).eq("sku", sku)
  if (error) throw error
}

export async function removerComplementar(sku: string): Promise<void> {
  const { error } = await supabase.from("catalogo_complementares").delete().eq("empresa_id", EMPRESA_ID).eq("sku", sku)
  if (error) throw error
}
