import { supabase } from "~/core/supabase"
import type { CatalogoParafusoRetencao } from "../types"

export async function listarParafusosRetensao(empresaId: string): Promise<CatalogoParafusoRetencao[]> {
  const { data, error } = await supabase
    .from("catalogo_parafusos_retensao")
    .select("*, chave:catalogo_chaves_ferramental(*)")
    .eq("empresa_id", empresaId)
    .order("nome")
  if (error) throw error
  return data as CatalogoParafusoRetencao[]
}

export async function criarParafusoRetencao(empresaId: string, input: {
  sku: string
  nome: string
  torque_ncm?: number
  vinculo_tipo: "abutment" | "componente"
  vinculo_sku: string
  chave_sku?: string
  preco?: number
}): Promise<CatalogoParafusoRetencao> {
  const { data, error } = await supabase
    .from("catalogo_parafusos_retensao")
    .insert({ empresa_id: empresaId, ...input })
    .select()
    .single()
  if (error) throw error
  return data as CatalogoParafusoRetencao
}

export async function atualizarParafusoRetencao(empresaId: string, sku: string, input: Partial<{
  nome: string
  torque_ncm: number
  vinculo_tipo: "abutment" | "componente"
  vinculo_sku: string
  chave_sku: string
  preco: number
}>): Promise<CatalogoParafusoRetencao> {
  const { data, error } = await supabase
    .from("catalogo_parafusos_retensao")
    .update(input)
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
    .select()
    .single()
  if (error) throw error
  return data as CatalogoParafusoRetencao
}

export async function toggleParafusoRetencaoAtivo(empresaId: string, sku: string, ativo: boolean): Promise<void> {
  const { error } = await supabase
    .from("catalogo_parafusos_retensao")
    .update({ ativo })
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
  if (error) throw error
}

export async function removerParafusoRetencao(empresaId: string, sku: string): Promise<void> {
  const { error } = await supabase
    .from("catalogo_parafusos_retensao")
    .delete()
    .eq("empresa_id", empresaId)
    .eq("sku", sku)
  if (error) throw error
}
